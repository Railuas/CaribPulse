export type Cinema = {
  key: string;              // unique key
  island: string;           // e.g., 'Trinidad & Tobago'
  name: string;             // display name
  url: string;              // theater page on caribbeancinemas.com
};

// Seed list (extend anytime). URLs are official Caribbean Cinemas theater pages.
export const CINEMAS: Cinema[] = [
  {
    key: 'tt-trincity',
    island: 'Trinidad & Tobago',
    name: 'Trincity Mall',
    url: 'https://caribbeancinemas.com/theater/trincity-mall/',
  },
  {
    key: 'tt-southpark',
    island: 'Trinidad & Tobago',
    name: 'Southpark, San Fernando',
    url: 'https://caribbeancinemas.com/theater/southpark-san-fernando/',
  },
  {
    key: 'skn-megaplex7',
    island: 'Saint Kitts & Nevis',
    name: 'St. Kitts Megaplex 7',
    url: 'https://caribbeancinemas.com/theater/st-kitts-megaplex-7/',
  },
  {
    key: 'lc-megaplex8',
    island: 'Saint Lucia',
    name: 'St. Lucia Megaplex 8',
    url: 'https://caribbeancinemas.com/theater/st-lucia-megaplex-8/',
  },
];
