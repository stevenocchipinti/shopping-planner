/*
 * WARNING: Don't forget to add attribution here and in the about page
 *
 * Icons sourced from:
 *  - https://icons8.com/icon/pack/food/color
 */

/**
 * Type for custom emoji as used by emoji-picker-react
 */
interface CustomEmojiForPicker {
  id: string
  names: string[]
  imgUrl: string
}

/**
 * Type for custom emoji metadata (for display)
 */
interface CustomEmojiMetadata {
  name: string
  imgUrl: string
}

// Original emoji-mart format (kept for backward compatibility with legacy code)
const customEmojisRaw = [
  {
    id: "custom-foods",
    name: "Custom Foods",
    emojis: [
      {
        id: "custom-almond-butter",
        name: "Almond butter",
        keywords: ["almond butter"],
        skins: [{ src: "/emoji/almond-butter.png" }],
      },
      {
        id: "custom-artichoke",
        name: "Artichoke",
        keywords: ["artichoke"],
        skins: [{ src: "/emoji/artichoke.png" }],
      },
      {
        id: "custom-asparagus",
        name: "Asparagus",
        keywords: ["asparagus"],
        skins: [{ src: "/emoji/asparagus.png" }],
      },
      {
        id: "custom-bacon",
        name: "Bacon",
        keywords: ["bacon"],
        skins: [{ src: "/emoji/bacon.png" }],
      },
      {
        id: "custom-beef",
        name: "Beef",
        keywords: ["beef"],
        skins: [{ src: "/emoji/beef.png" }],
      },
      {
        id: "custom-beet",
        name: "Beet",
        keywords: ["beet"],
        skins: [{ src: "/emoji/beet.png" }],
      },
      {
        id: "custom-black-pepper",
        name: "Black pepper",
        keywords: ["black pepper"],
        skins: [{ src: "/emoji/black-pepper.png" }],
      },
      {
        id: "custom-blueberry",
        name: "Blueberry",
        keywords: ["blueberry"],
        skins: [{ src: "/emoji/blueberry.png" }],
      },
      {
        id: "custom-bok-choy",
        name: "Bok choy",
        keywords: ["bok choy"],
        skins: [{ src: "/emoji/bok-choy.png" }],
      },
      {
        id: "custom-brazil-nut",
        name: "Brazil nut",
        keywords: ["brazil nut"],
        skins: [{ src: "/emoji/brazil-nut.png" }],
      },
      {
        id: "custom-broccoli",
        name: "Broccoli",
        keywords: ["broccoli"],
        skins: [{ src: "/emoji/broccoli.png" }],
      },
      {
        id: "custom-broccolini",
        name: "Broccolini",
        keywords: ["broccolini"],
        skins: [{ src: "/emoji/broccolini.png" }],
      },
      {
        id: "custom-butter",
        name: "Butter",
        keywords: ["butter"],
        skins: [{ src: "/emoji/butter.png" }],
      },
      {
        id: "custom-cabbage",
        name: "Cabbage",
        keywords: ["cabbage"],
        skins: [{ src: "/emoji/cabbage.png" }],
      },
      {
        id: "custom-carrot",
        name: "Carrot",
        keywords: ["carrot"],
        skins: [{ src: "/emoji/carrot.png" }],
      },
      {
        id: "custom-cauliflower",
        name: "Cauliflower",
        keywords: ["cauliflower"],
        skins: [{ src: "/emoji/cauliflower.png" }],
      },
      {
        id: "custom-celery",
        name: "Celery",
        keywords: ["celery"],
        skins: [{ src: "/emoji/celery.png" }],
      },
      {
        id: "custom-cashew",
        name: "Cashew",
        keywords: ["cashew"],
        skins: [{ src: "/emoji/cashew.png" }],
      },
      {
        id: "custom-chard",
        name: "Chard",
        keywords: ["chard"],
        skins: [{ src: "/emoji/chard.png" }],
      },
      {
        id: "custom-cherry",
        name: "Cherry",
        keywords: ["cherry"],
        skins: [{ src: "/emoji/cherry.png" }],
      },
      {
        id: "custom-chia-seeds",
        name: "Chia seeds",
        keywords: ["chia seeds"],
        skins: [{ src: "/emoji/chia-seeds.png" }],
      },
      {
        id: "custom-chili-pepper",
        name: "Chili pepper",
        keywords: ["chili pepper"],
        skins: [{ src: "/emoji/chili-pepper.png" }],
      },
      {
        id: "custom-coffee-capsule",
        name: "Coffee capsule",
        keywords: ["coffee capsule"],
        skins: [{ src: "/emoji/coffee-capsule.png" }],
      },
      {
        id: "custom-collard-greens",
        name: "Collard greens",
        keywords: ["collard greens"],
        skins: [{ src: "/emoji/collard-greens.png" }],
      },
      {
        id: "custom-corn",
        name: "Corn",
        keywords: ["corn"],
        skins: [{ src: "/emoji/corn.png" }],
      },
      {
        id: "custom-cucumber",
        name: "Cucumber",
        keywords: ["cucumber"],
        skins: [{ src: "/emoji/cucumber.png" }],
      },
      {
        id: "custom-cuts-of-beef",
        name: "Cuts of beef",
        keywords: ["cuts of beef"],
        skins: [{ src: "/emoji/cuts-of-beef.png" }],
      },
      {
        id: "custom-cuts-of-pork",
        name: "Cuts of pork",
        keywords: ["cuts of pork"],
        skins: [{ src: "/emoji/cuts-of-pork.png" }],
      },
      {
        id: "custom-dim-sum",
        name: "Dim sum",
        keywords: ["dim sum"],
        skins: [{ src: "/emoji/dim-sum.png" }],
      },
      {
        id: "custom-dragon-fruit",
        name: "Dragon fruit",
        keywords: ["dragon fruit"],
        skins: [{ src: "/emoji/dragon-fruit.png" }],
      },
      {
        id: "custom-durian",
        name: "Durian",
        keywords: ["durian"],
        skins: [{ src: "/emoji/durian.png" }],
      },
      {
        id: "custom-egg-carton",
        name: "Egg carton",
        keywords: ["egg carton", "eggs"],
        skins: [{ src: "/emoji/egg-carton.png" }],
      },
      {
        id: "custom-eggplant",
        name: "Eggplant",
        keywords: ["eggplant"],
        skins: [{ src: "/emoji/eggplant.png" }],
      },
      {
        id: "custom-finocchio",
        name: "Finocchio",
        keywords: ["finocchio", "fennel"],
        skins: [{ src: "/emoji/finocchio.png" }],
      },
      {
        id: "custom-firm-tofu",
        name: "Firm tofu",
        keywords: ["firm tofu", "tofu"],
        skins: [{ src: "/emoji/firm-tofu.png" }],
      },
      {
        id: "custom-flax-seeds",
        name: "Flax seeds",
        keywords: ["flax seeds"],
        skins: [{ src: "/emoji/flax-seeds.png" }],
      },
      {
        id: "custom-flour",
        name: "Flour",
        keywords: ["flour"],
        skins: [{ src: "/emoji/flour.png" }],
      },
      {
        id: "custom-food-and-wine",
        name: "Food and wine",
        keywords: ["food and wine"],
        skins: [{ src: "/emoji/food-and-wine.png" }],
      },
      {
        id: "custom-fry",
        name: "Fry",
        keywords: ["fry"],
        skins: [{ src: "/emoji/fry.png" }],
      },
      {
        id: "custom-gailan",
        name: "Gailan",
        keywords: ["gailan"],
        skins: [{ src: "/emoji/gailan.png" }],
      },
      {
        id: "custom-garlic",
        name: "Garlic",
        keywords: ["garlic"],
        skins: [{ src: "/emoji/garlic.png" }],
      },
      {
        id: "custom-ginger",
        name: "Ginger",
        keywords: ["ginger"],
        skins: [{ src: "/emoji/ginger.png" }],
      },
      {
        id: "custom-grapes",
        name: "Grapes",
        keywords: ["grapes"],
        skins: [{ src: "/emoji/grapes.png" }],
      },
      {
        id: "custom-greek-salad",
        name: "Greek salad",
        keywords: ["greek salad"],
        skins: [{ src: "/emoji/greek-salad.png" }],
      },
      {
        id: "custom-group-of-fruits",
        name: "Group of fruits",
        keywords: ["group of fruits"],
        skins: [{ src: "/emoji/group-of-fruits.png" }],
      },
      {
        id: "custom-group-of-vegetables",
        name: "Group of vegetables",
        keywords: ["group of vegetables", "veggies"],
        skins: [{ src: "/emoji/group-of-vegetables.png" }],
      },
      {
        id: "custom-hazelnut",
        name: "Hazelnut",
        keywords: ["hazelnut"],
        skins: [{ src: "/emoji/hazelnut.png" }],
      },
      {
        id: "custom-honey",
        name: "Honey",
        keywords: ["honey"],
        skins: [{ src: "/emoji/honey.png" }],
      },
      {
        id: "custom-jackfruit",
        name: "Jackfruit",
        keywords: ["jackfruit"],
        skins: [{ src: "/emoji/jackfruit.png" }],
      },
      {
        id: "custom-jamon",
        name: "Jamon",
        keywords: ["jamon"],
        skins: [{ src: "/emoji/jamon.png" }],
      },
      {
        id: "custom-kebab",
        name: "Kebab",
        keywords: ["kebab"],
        skins: [{ src: "/emoji/kebab.png" }],
      },
      {
        id: "custom-kiwi",
        name: "Kiwi",
        keywords: ["kiwi"],
        skins: [{ src: "/emoji/kiwi.png" }],
      },
      {
        id: "custom-kohlrabi",
        name: "Kohlrabi",
        keywords: ["kohlrabi"],
        skins: [{ src: "/emoji/kohlrabi.png" }],
      },
      {
        id: "custom-leek",
        name: "Leek",
        keywords: ["leek"],
        skins: [{ src: "/emoji/leek.png" }],
      },
      {
        id: "custom-lettuce",
        name: "Lettuce",
        keywords: ["lettuce"],
        skins: [{ src: "/emoji/lettuce.png" }],
      },
      {
        id: "custom-lime",
        name: "Lime",
        keywords: ["lime"],
        skins: [{ src: "/emoji/lime.png" }],
      },
      {
        id: "custom-mango",
        name: "Mango",
        keywords: ["mango"],
        skins: [{ src: "/emoji/mango.png" }],
      },
      {
        id: "custom-mangosteen",
        name: "Mangosteen",
        keywords: ["mangosteen"],
        skins: [{ src: "/emoji/mangosteen.png" }],
      },
      {
        id: "custom-milk-bottle",
        name: "Milk bottle",
        keywords: ["milk bottle", "milk"],
        skins: [{ src: "/emoji/milk-bottle.png" }],
      },
      {
        id: "custom-milk-carton",
        name: "Milk carton",
        keywords: ["milk carton", "milk"],
        skins: [{ src: "/emoji/milk-carton.png" }],
      },
      {
        id: "custom-mushroom",
        name: "Mushroom",
        keywords: ["mushroom"],
        skins: [{ src: "/emoji/mushroom.png" }],
      },
      {
        id: "custom-nachos",
        name: "Nachos",
        keywords: ["nachos"],
        skins: [{ src: "/emoji/nachos.png" }],
      },
      {
        id: "custom-nut",
        name: "Nut",
        keywords: ["nut"],
        skins: [{ src: "/emoji/nut.png" }],
      },
      {
        id: "custom-olive-oil",
        name: "Olive oil",
        keywords: ["olive oil"],
        skins: [{ src: "/emoji/olive-oil.png" }],
      },
      {
        id: "custom-olive",
        name: "Olive",
        keywords: ["olive"],
        skins: [{ src: "/emoji/olive.png" }],
      },
      {
        id: "custom-onion",
        name: "Onion",
        keywords: ["onion"],
        skins: [{ src: "/emoji/onion.png" }],
      },
      {
        id: "custom-papaya",
        name: "Papaya",
        keywords: ["papaya"],
        skins: [{ src: "/emoji/papaya.png" }],
      },
      {
        id: "custom-paprika",
        name: "Paprika",
        keywords: ["paprika"],
        skins: [{ src: "/emoji/paprika.png" }],
      },
      {
        id: "custom-peach",
        name: "Peach",
        keywords: ["peach"],
        skins: [{ src: "/emoji/peach.png" }],
      },
      {
        id: "custom-peanut-butter",
        name: "Peanut butter",
        keywords: ["peanut butter"],
        skins: [{ src: "/emoji/peanut-butter.png" }],
      },
      {
        id: "custom-peanuts",
        name: "Peanuts",
        keywords: ["peanuts"],
        skins: [{ src: "/emoji/peanuts.png" }],
      },
      {
        id: "custom-pear",
        name: "Pear",
        keywords: ["pear"],
        skins: [{ src: "/emoji/pear.png" }],
      },
      {
        id: "custom-peas",
        name: "Peas",
        keywords: ["peas"],
        skins: [{ src: "/emoji/peas.png" }],
      },
      {
        id: "custom-pecan",
        name: "Pecan",
        keywords: ["pecan"],
        skins: [{ src: "/emoji/pecan.png" }],
      },
      {
        id: "custom-pineapple",
        name: "Pineapple",
        keywords: ["pineapple"],
        skins: [{ src: "/emoji/pineapple.png" }],
      },
      {
        id: "custom-plum",
        name: "Plum",
        keywords: ["plum"],
        skins: [{ src: "/emoji/plum.png" }],
      },
      {
        id: "custom-potato",
        name: "Potato",
        keywords: ["potato"],
        skins: [{ src: "/emoji/potato.png" }],
      },
      {
        id: "custom-pumpkin",
        name: "Pumpkin",
        keywords: ["pumpkin"],
        skins: [{ src: "/emoji/pumpkin.png" }],
      },
      {
        id: "custom-rack-of-lamb",
        name: "Rack of lamb",
        keywords: ["rack of lamb"],
        skins: [{ src: "/emoji/rack-of-lamb.png" }],
      },
      {
        id: "custom-radish",
        name: "Radish",
        keywords: ["radish"],
        skins: [{ src: "/emoji/radish.png" }],
      },
      {
        id: "custom-raspberry",
        name: "Raspberry",
        keywords: ["raspberry"],
        skins: [{ src: "/emoji/raspberry.png" }],
      },
      {
        id: "custom-real-food-for-meals",
        name: "Real food for meals",
        keywords: ["real food for meals"],
        skins: [{ src: "/emoji/real-food-for-meals.png" }],
      },
      {
        id: "custom-rice-bowl",
        name: "Rice bowl",
        keywords: ["rice bowl", "rice"],
        skins: [{ src: "/emoji/rice-bowl.png" }],
      },
      {
        id: "custom-vinegar",
        name: "vinegar",
        keywords: ["vinegar", "apple cider vinegar"],
        skins: [{ src: "/emoji/rice-vinegar.png" }],
      },
      {
        id: "custom-roast",
        name: "Roast",
        keywords: ["roast"],
        skins: [{ src: "/emoji/roast.png" }],
      },
      {
        id: "custom-salad",
        name: "Salad",
        keywords: ["salad"],
        skins: [{ src: "/emoji/salad.png" }],
      },
      {
        id: "custom-salami",
        name: "Salami",
        keywords: ["salami"],
        skins: [{ src: "/emoji/salami.png" }],
      },
      {
        id: "custom-sashimi",
        name: "Salmon Sashimi",
        keywords: ["sashimi", "salmon"],
        skins: [{ src: "/emoji/sashimi.png" }],
      },
      {
        id: "custom-sausages",
        name: "Sausages",
        keywords: ["sausages"],
        skins: [{ src: "/emoji/sausages.png" }],
      },
      {
        id: "custom-silken-tofu",
        name: "Silken tofu",
        keywords: ["silken tofu", "tofu"],
        skins: [{ src: "/emoji/silken-tofu.png" }],
      },
      {
        id: "custom-smoked-paprika",
        name: "Smoked paprika",
        keywords: ["smoked paprika"],
        skins: [{ src: "/emoji/smoked-paprika.png" }],
      },
      {
        id: "custom-soup-plate",
        name: "Soup plate",
        keywords: ["soup plate", "soup"],
        skins: [{ src: "/emoji/soup-plate.png" }],
      },
      {
        id: "custom-souvla",
        name: "Souvla",
        keywords: ["souvla"],
        skins: [{ src: "/emoji/souvla.png" }],
      },
      {
        id: "custom-soy-sauce",
        name: "Soy sauce",
        keywords: ["soy sauce"],
        skins: [{ src: "/emoji/soy-sauce.png" }],
      },
      {
        id: "custom-soy",
        name: "Soy",
        keywords: ["soy"],
        skins: [{ src: "/emoji/soy.png" }],
      },
      {
        id: "custom-spice",
        name: "Spice",
        keywords: ["spice"],
        skins: [{ src: "/emoji/spice.png" }],
      },
      {
        id: "custom-spinach",
        name: "Spinach",
        keywords: ["spinach"],
        skins: [{ src: "/emoji/spinach.png" }],
      },
      {
        id: "custom-steak",
        name: "Steak",
        keywords: ["steak"],
        skins: [{ src: "/emoji/steak.png" }],
      },
      {
        id: "custom-strawberry",
        name: "Strawberry",
        keywords: ["strawberry"],
        skins: [{ src: "/emoji/strawberry.png" }],
      },
      {
        id: "custom-sunny-side-up-eggs",
        name: "Sunny side up eggs",
        keywords: ["sunny side up eggs", "eggs"],
        skins: [{ src: "/emoji/sunny-side-up-eggs.png" }],
      },
      {
        id: "custom-sweet-potato",
        name: "Sweet potato",
        keywords: ["sweet potato"],
        skins: [{ src: "/emoji/sweet-potato.png" }],
      },
      {
        id: "custom-sweetener",
        name: "Sweetener",
        keywords: ["sweetener"],
        skins: [{ src: "/emoji/sweetener.png" }],
      },
      {
        id: "custom-thanksgiving",
        name: "Thanksgiving",
        keywords: ["thanksgiving"],
        skins: [{ src: "/emoji/thanksgiving.png" }],
      },
      {
        id: "custom-thyme",
        name: "Thyme",
        keywords: ["thyme"],
        skins: [{ src: "/emoji/thyme.png" }],
      },
      {
        id: "custom-tin-can",
        name: "Tin can",
        keywords: ["tin can"],
        skins: [{ src: "/emoji/tin-can.png" }],
      },
      {
        id: "custom-tomato",
        name: "Tomato",
        keywords: ["tomato"],
        skins: [{ src: "/emoji/tomato.png" }],
      },
      {
        id: "custom-tumeric",
        name: "Tumeric",
        keywords: ["tumeric", "turmeric"],
        skins: [{ src: "/emoji/tumeric.png" }],
      },
      {
        id: "custom-vegetables-bag",
        name: "Vegetables bag",
        keywords: ["vegetables bag"],
        skins: [{ src: "/emoji/vegetables-bag.png" }],
      },
      {
        id: "custom-yogurt",
        name: "Yogurt",
        keywords: ["yogurt"],
        skins: [{ src: "/emoji/yogurt.png" }],
      },
      {
        id: "custom-you-choy",
        name: "You choy",
        keywords: ["you choy"],
        skins: [{ src: "/emoji/you-choy.png" }],
      },
      {
        id: "custom-zucchini",
        name: "Zucchini",
        keywords: ["zucchini"],
        skins: [{ src: "/emoji/zucchini.png" }],
      },
    ],
  },
]

/**
 * Transform custom emojis to emoji-picker-react format
 * Creates a flat array with id, names (name + keywords), and imgUrl
 */
function createEmojisForPicker(): CustomEmojiForPicker[] {
  const result: CustomEmojiForPicker[] = []

  for (const category of customEmojisRaw) {
    for (const emoji of category.emojis) {
      // Combine name and keywords into names array for better searchability
      const names = [emoji.name, ...emoji.keywords]

      result.push({
        id: emoji.id,
        names,
        imgUrl: emoji.skins[0].src,
      })
    }
  }

  return result
}

/**
 * Transform custom emojis to a lookup map for quick display access
 * Maps emoji ID to its metadata (name, imgUrl)
 */
function createEmojiMap(): Record<string, CustomEmojiMetadata> {
  const map: Record<string, CustomEmojiMetadata> = {}

  for (const category of customEmojisRaw) {
    for (const emoji of category.emojis) {
      map[emoji.id] = {
        name: emoji.name,
        imgUrl: emoji.skins[0].src,
      }
    }
  }

  return map
}

/**
 * Flat array of custom emojis for emoji-picker-react
 * Format: { id, names, imgUrl }
 */
export const customEmojis: CustomEmojiForPicker[] = createEmojisForPicker()

/**
 * Map of custom emoji IDs to metadata for quick lookup during display
 * Format: { id -> { name, imgUrl } }
 */
export const customEmojiMap: Record<string, CustomEmojiMetadata> =
  createEmojiMap()

/**
 * Original emoji-mart format structure (for backward compatibility with legacy code)
 * Not used by emoji-picker-react, but kept in case other code references it
 */
export const customEmojisLegacy = customEmojisRaw
