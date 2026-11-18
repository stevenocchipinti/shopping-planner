Home Assistant integration
==========================

Lets Home Assistant's voice assistant (Assist) add items to a Shopping Planner list and
tick them off:

- "add apples to my shopping list", "put 2 eggs on the list"
- "check off apples from my shopping list", "remove milk from the list"

It uses the shopping list sentences already built into Home Assistant. Normally the
built-in Shopping list integration handles them; here `intent_script` handles them and
writes to the app's Firestore database the same way the app does:

- an item added before goes back into its old section, with its emoji;
- "egg" finds "Eggs" (singular/plural);
- "2 eggs", "a dozen eggs", "two packets of chips" set the quantity
  ("2 minute noodles" and "2% milk" are left alone);
- an item already on the list isn't added twice, and a ticked-off one is un-ticked;
- a new item is added with no section, as when it's typed into the app.

`shopping_planner.yaml` is a template: it won't work until you put your own list id in it.

Nothing runs outside Home Assistant: two `rest_command`s call the Firestore REST API with
the app's public web config, and the logic is in Jinja templates.

Install
-------

1. Copy `shopping_planner.yaml` into Home Assistant's config folder (next to
   `configuration.yaml`), e.g. with the File editor app.
2. In that copy, replace `REPLACE_WITH_YOUR_LIST_ID` (it appears twice, once per intent)
   with your list's id: the part of the app URL after `/list/`. For
   `https://shoppingplanner.web.app/list/abc123` the id is `abc123`.
3. Load it as a package by adding this to `configuration.yaml`:

   ```yaml
   homeassistant:
     packages:
       shopping_planner: !include shopping_planner.yaml
   ```

   If you already have a `homeassistant:` section, add `packages:` under it.
4. Check the configuration (Developer tools → YAML → Check configuration), then restart
   Home Assistant. A restart is needed the first time, to load `rest_command` and
   `intent_script`.
5. Type "add apples to the shopping list" in Assist and look at the list in the app.

Don't also add Home Assistant's own Shopping list integration: it handles the same intents.

Keep your real list id out of version control. Anyone with it can read and edit the list.

Changing the list
-----------------

Edit both `list_doc:` lines, save, then run the action `intent_script.reload`
(Developer tools → Actions). No restart needed.

Speaking commands
-----------------

Typed commands work with any pipeline. Spoken ones depend on the speech-to-text engine:

- A full speech-to-text engine (e.g. Whisper) passes any item name through.
- Speech-to-Phrase only recognises sentences it knows in advance, and doesn't know item
  names. It needs a custom sentences file listing them, in
  `/share/speech-to-phrase/custom_sentences/en/`. Not set up yet.

Testing changes
---------------

`test_templates.py` runs the YAML's steps outside Home Assistant. Home Assistant renders
the templates (`/api/template`, which changes nothing) and the Firestore calls go to a
throwaway list you name, whatever list id is in the file. Pick any new id (not your real
list) and replace `YOUR_TEST_LIST_ID` below with it:

```sh
export HA_URL=http://homeassistant.local:8123
export HA_TOKEN=...   # Profile -> Security -> Long-lived access tokens
python3 home-assistant/test_templates.py --list YOUR_TEST_LIST_ID "apples" "2 eggs" "egg"
python3 home-assistant/test_templates.py --list YOUR_TEST_LIST_ID --complete "apples"
```

Needs Python 3 with PyYAML. It doesn't run Home Assistant's script engine itself, so
check a change in Assist too.

Removing it
-----------

Delete the `packages:` lines from `configuration.yaml` and the file, then restart.
