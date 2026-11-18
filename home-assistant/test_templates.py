#!/usr/bin/env python3
"""Run shopping_planner.yaml's intent scripts step by step, outside Home Assistant.

Use it to try a change to the YAML before copying it into Home Assistant.

* The Jinja templates are rendered by your real Home Assistant (POST /api/template,
  which only renders text and changes nothing).
* The two rest_command calls are made from here, against the test list you name with
  --list, whatever list id the YAML contains. Use a throwaway list, not your real one:
  any new list id works, e.g. make one up.

Needs Python 3 with PyYAML, and a Home Assistant long-lived access token:

    export HA_URL=http://homeassistant.local:8123
    export HA_TOKEN=...            # Profile -> Security -> Long-lived access tokens
    python3 home-assistant/test_templates.py --list YOUR_TEST_LIST_ID "apples" "2 eggs"
    python3 home-assistant/test_templates.py --list YOUR_TEST_LIST_ID --complete "apples"

Then look at https://shoppingplanner.web.app/list/YOUR_TEST_LIST_ID.
"""
import argparse
import ast
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

import yaml

HA_URL = os.environ.get("HA_URL", "").rstrip("/")
HA_TOKEN = os.environ.get("HA_TOKEN", "")


def render(template: str, variables: dict, native=True):
    """Render a template on Home Assistant. native=True parses the result into Python
    values, as Home Assistant does for script variables and action data."""
    req = urllib.request.Request(
        f"{HA_URL}/api/template", method="POST",
        data=json.dumps({"template": template, "variables": variables}).encode(),
        headers={"Authorization": f"Bearer {HA_TOKEN}", "Content-Type": "application/json"})
    try:
        text = urllib.request.urlopen(req, timeout=15).read().decode()
    except urllib.error.HTTPError as exc:
        sys.exit(f"template error: {exc.read().decode()}\n--- template ---\n{template}")
    if not native:
        return text
    try:
        return ast.literal_eval(text.strip())
    except (ValueError, SyntaxError):
        return text


def rest(command: dict, data: dict) -> dict:
    """What rest_command does: render url/payload, send, return {status, content}."""
    url = render(command["url"], data, native=False)
    payload = render(command["payload"], data, native=False)
    req = urllib.request.Request(url, data=payload.encode(), method=command["method"].upper(),
                                 headers={"Content-Type": command.get("content_type", "application/json")})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            return {"status": response.status, "content": json.loads(response.read() or b"null")}
    except urllib.error.HTTPError as exc:
        return {"status": exc.code, "content": exc.read().decode()}


def run(conf: dict, intent: str, item: str, test_list: str) -> str:
    variables = {"item": item}
    for step in conf["intent_script"][intent]["action"]:
        if "variables" in step:
            for key, value in step["variables"].items():
                if key == "list_doc":  # always the test list, never the configured one
                    value = re.sub(r"/lists/[^/\"]+$", f"/lists/{test_list}", value)
                variables[key] = render(value, variables) if "{" in value else value
        elif "action" in step:
            name = step["action"].split(".", 1)[1]
            data = {k: render(v, variables) for k, v in step["data"].items()}
            variables[step["response_variable"]] = rest(conf["rest_command"][name], data)
        elif "stop" in step:
            response = variables[step["response_variable"]]
            speech = conf["intent_script"][intent]["speech"]["text"]
            return render(speech, {**variables, "action_response": response}, native=False)
    return "(no reply)"


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("items", nargs="+", help="items as spoken, e.g. \"2 eggs\"")
    p.add_argument("--complete", action="store_true", help="tick off instead of add")
    p.add_argument("--list", required=True, metavar="YOUR_TEST_LIST_ID",
                   help="throwaway list id to write to (not your real list)")
    p.add_argument("--file", default=Path(__file__).with_name("shopping_planner.yaml"))
    args = p.parse_args()
    if not (HA_URL and HA_TOKEN):
        sys.exit("Set HA_URL and HA_TOKEN first (see the top of this file).")
    conf = yaml.safe_load(open(args.file, encoding="utf-8"))
    intent = "HassShoppingListCompleteItem" if args.complete else "HassShoppingListAddItem"
    for item in args.items:
        print(f"{item!r:30} -> {run(conf, intent, item, args.list)}")


if __name__ == "__main__":
    main()
