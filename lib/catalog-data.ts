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
    id: 1,
    name: 'Violet Valkyrie',
    creator: 'Roblox',
    verified: true,
    price: null,
    image: '/items/valkyrie.png',
    category: 'accessories',
    subcategory: 'Hats',
    featured: true,
    limited: 'Limited U',
    favorites: 1284302,
    createdAt: 1,
    description:
      'Soar above the clouds with this legendary helm, worn only by the bravest warriors of the sky.',
  },
  {
    id: 2,
    name: 'Dominus Aureus',
    creator: 'Roblox',
    verified: true,
    price: 25000,
    image: '/items/dominus.png',
    category: 'accessories',
    subcategory: 'Hats',
    featured: true,
    limited: 'Limited',
    favorites: 982114,
    createdAt: 2,
    description: 'The hooded crown of the ancient Dominus order. Glows in the dark.',
  },
  {
    id: 3,
    name: 'Kitty Ear Headphones',
    creator: 'StarCreations',
    verified: true,
    price: 75,
    image: '/items/headphones.png',
    category: 'accessories',
    subcategory: 'Hair',
    featured: true,
    favorites: 412093,
    createdAt: 10,
    description: 'Listen to your favorite tunes in style with these adorable headphones.',
  },
  {
    id: 4,
    name: 'Oversized Black Hoodie',
    creator: 'UrbanThreads',
    verified: false,
    price: 5,
    image: '/items/hoodie.png',
    category: 'clothing',
    subcategory: 'Jackets',
    featured: false,
    favorites: 230991,
    createdAt: 12,
    description: 'Cozy oversized hoodie with a small red logo. Pairs with anything.',
  },
  {
    id: 5,
    name: 'Crystal Blade',
    creator: 'Roblox',
    verified: true,
    price: 350,
    image: '/items/sword.png',
    category: 'gear',
    subcategory: 'Melee',
    featured: true,
    favorites: 88213,
    createdAt: 4,
    description: 'A sword forged from pure ice crystal. Usable in supported experiences.',
  },
  {
    id: 6,
    name: 'Fluffy Blonde Hair',
    creator: 'HairStudio',
    verified: true,
    price: 50,
    image: '/items/hair.png',
    category: 'accessories',
    subcategory: 'Hair',
    featured: false,
    favorites: 652110,
    createdAt: 15,
    description: 'Messy, fluffy anime-style hair for the main character in you.',
  },
  {
    id: 7,
    name: 'Baby Dragon Backpack',
    creator: 'PlushPals',
    verified: false,
    price: 120,
    image: '/items/backpack.png',
    category: 'accessories',
    subcategory: 'Back',
    featured: true,
    favorites: 174552,
    createdAt: 14,
    description: 'Your own tiny dragon companion that rides along on your back.',
  },
  {
    id: 8,
    name: 'Smug Face',
    creator: 'Roblox',
    verified: true,
    price: 0,
    image: '/items/face.png',
    category: 'heads',
    subcategory: 'Faces',
    featured: false,
    favorites: 1043992,
    createdAt: 3,
    description: 'For when you know you are right.',
  },
  {
    id: 9,
    name: 'Sparkle Time Top Hat',
    creator: 'Roblox',
    verified: true,
    price: null,
    image: '/items/sparkle.png',
    category: 'accessories',
    subcategory: 'Hats',
    featured: true,
    limited: 'Limited U',
    favorites: 512007,
    createdAt: 0,
    description: 'A classic top hat surrounded by the sparkles of time itself.',
  },
  {
    id: 10,
    name: 'Celestial Knight',
    creator: 'Roblox',
    verified: true,
    price: 400,
    image: '/items/bundle.png',
    category: 'bundles',
    subcategory: 'Characters',
    featured: true,
    favorites: 321440,
    createdAt: 8,
    description: 'A complete body bundle of a futuristic knight in white and gold armor.',
  },
  {
    id: 11,
    name: 'Ripped Baggy Jeans',
    creator: 'UrbanThreads',
    verified: false,
    price: 5,
    image: '/items/pants.png',
    category: 'clothing',
    subcategory: 'Pants',
    featured: false,
    favorites: 199823,
    createdAt: 13,
    description: 'Light blue baggy jeans with white sneakers included.',
  },
  {
    id: 12,
    name: 'Golden Halo',
    creator: 'HeavenlyGoods',
    verified: true,
    price: 200,
    image: '/items/halo.png',
    category: 'accessories',
    subcategory: 'Hats',
    featured: false,
    favorites: 283112,
    createdAt: 11,
    description: 'A radiant floating halo. Angelic behavior not included.',
  },
]

export const resellers: Record<number, number> = {
  1: 145000,
  9: 52000,
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}M+`
  if (n >= 1_000) return `${Math.floor(n / 1_000)}K+`
  return String(n)
}
