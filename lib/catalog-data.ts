export type Category =
  | 'all'
  | 'featured'
  | 'clothing'
  | 'accessories'
  | 'heads'
  | 'bundles'
  | 'gear'

export type CatalogItem = {
  id: number
  name: string
  creator: string
  verified: boolean
  price: number | null
  image: string
  category: Exclude<Category, 'all' | 'featured'>
  subcategory: string
  featured: boolean
  limited?: 'Limited' | 'Limited U'
  favorites: number
  createdAt: number
  description: string
}

export const categories: { id: Category; label: string; subs?: string[] }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'featured', label: 'Featured' },
  { id: 'clothing', label: 'Clothing', subs: ['Shirts', 'Pants', 'Jackets'] },
  {
    id: 'accessories',
    label: 'Accessories',
    subs: ['Hats', 'Hair', 'Face', 'Neck', 'Back'],
  },
  { id: 'heads', label: 'Heads & Faces', subs: ['Faces', 'Heads'] },
  { id: 'bundles', label: 'Bundles', subs: ['Characters', 'Animations'] },
  { id: 'gear', label: 'Gear', subs: ['Melee', 'Ranged'] },
]

export const catalogItems: CatalogItem[] = [
  {
    id: 14,
    name: "8-Bit Royal Crown",
    creator: "Roblox",
    verified: true,
    price: 27849,
    image: "https://tr.rbxcdn.com/180DAY-033fcdc594f17b089eaf2bcd57be171a/420/420/Hat/Webp/noFilter",
    category: "accessories",
    subcategory: "Hats",
    featured: true,
    limited: "Limited",
    favorites: 449914,
    createdAt: 16,
    description: "Perfect for sending adventurers out to save the princess.",
  },
  {
    id: 10,
    name: "Korblox Deathspeaker",
    creator: "Roblox",
    verified: true,
    price: 17000,
    image: "/items/korblox.png",
    category: "bundles",
    subcategory: "Characters",
    featured: true,
    favorites: 321440,
    createdAt: 8,
    description: "Lord of the Korblox legions. Includes the famous Korblox leg.",
  },
  {
    id: 13,
    name: "Headless Horseman",
    creator: "Roblox",
    verified: true,
    price: 31000,
    image: "/items/headless.png",
    category: "bundles",
    subcategory: "Characters",
    featured: true,
    favorites: 1520331,
    createdAt: 9,
    description: "Fear the Headless Horseman! Includes the legendary Headless Head.",
  },
  {
    id: 1,
    name: "Valkyrie Helm",
    creator: "Roblox",
    verified: true,
    price: null,
    image: "/items/valkyrie.png",
    category: "accessories",
    subcategory: "Hats",
    featured: true,
    limited: "Limited",
    favorites: 1284302,
    createdAt: 1,
    description: "The legendary winged helm of the Valkyries. One of the most iconic Roblox collectibles.",
  },
  {
    id: 2,
    name: "Dominus Aureus",
    creator: "Roblox",
    verified: true,
    price: null,
    image: "/items/dominus.png",
    category: "accessories",
    subcategory: "Hats",
    featured: true,
    limited: "Limited",
    favorites: 982114,
    createdAt: 2,
    description: "The golden hooded crown of the ancient Dominus order.",
  },
  {
    id: 4,
    name: "Denim Jacket with White Hoodie",
    creator: "Roblox",
    verified: true,
    price: 0,
    image: "/items/denim-jacket.png",
    category: "clothing",
    subcategory: "Jackets",
    featured: false,
    favorites: 230991,
    createdAt: 12,
    description: "A classic denim jacket layered over a comfy white hoodie.",
  },
  {
    id: 5,
    name: "Linked Sword",
    creator: "Roblox",
    verified: true,
    price: null,
    image: "/items/linked-sword.png",
    category: "gear",
    subcategory: "Melee",
    featured: true,
    limited: "Limited U",
    favorites: 88213,
    createdAt: 4,
    description: "The classic Roblox sword. Click to slash, double click to lunge.",
  },
  {
    id: 6,
    name: "Pal Hair",
    creator: "Roblox",
    verified: true,
    price: 0,
    image: "/items/pal-hair.png",
    category: "accessories",
    subcategory: "Hair",
    featured: false,
    favorites: 652110,
    createdAt: 15,
    description: "Classic brown hair worn by Roblox pals everywhere.",
  },
  {
    id: 7,
    name: "Clockwork's Shades",
    creator: "Roblox",
    verified: true,
    price: null,
    image: "/items/clockwork-shades.png",
    category: "accessories",
    subcategory: "Face",
    featured: true,
    limited: "Limited",
    favorites: 174552,
    createdAt: 14,
    description: "The legendary shades of Clockwork. Too cool for school.",
  },
  {
    id: 8,
    name: "Super Super Happy Face",
    creator: "Roblox",
    verified: true,
    price: null,
    image: "/items/happy-face.png",
    category: "heads",
    subcategory: "Faces",
    featured: false,
    limited: "Limited",
    favorites: 1043992,
    createdAt: 3,
    description: "The happiest face on Roblox.",
  },
  {
    id: 9,
    name: "Sparkle Time Fedora",
    creator: "Roblox",
    verified: true,
    price: null,
    image: "/items/sparkle-fedora.png",
    category: "accessories",
    subcategory: "Hats",
    featured: true,
    limited: "Limited",
    favorites: 512007,
    createdAt: 0,
    description: "A classic fedora surrounded by the sparkles of time itself.",
  },
  {
    id: 11,
    name: "Ripped Skater Pants",
    creator: "Roblox",
    verified: true,
    price: 0,
    image: "/items/skater-pants.png",
    category: "clothing",
    subcategory: "Pants",
    featured: false,
    favorites: 199823,
    createdAt: 13,
    description: "Ripped skater pants for the street-style look.",
  },
  {
    id: 12,
    name: "The Classic ROBLOX Fedora",
    creator: "Roblox",
    verified: true,
    price: null,
    image: "/items/classic-fedora.png",
    category: "accessories",
    subcategory: "Hats",
    featured: false,
    limited: "Limited",
    favorites: 283112,
    createdAt: 11,
    description: "The original ROBLOX fedora. A true classic.",
  },
]

export const resellers: Record<number, number> = {
  1: 145000,
  2: 4200000,
  5: 47324,
  7: 19358,
  8: 1250,
  9: 52000,
  12: 900,
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}M+`
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K+`
  return String(n)
}
