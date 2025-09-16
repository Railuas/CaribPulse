// lib/newsSources.ts
export type Feed = { name: string; url: string; country: string };

export const FEEDS: Feed[] = [
  // Regional
  { name: 'CARICOM Today', url: 'https://today.caricom.org/feed/', country: 'All Caribbean' },
  { name: 'Caribbean News Global', url: 'https://www.caribbeannewsglobal.com/feed/', country: 'All Caribbean' },

  // Jamaica
  { name: 'The Gleaner', url: 'https://jamaica-gleaner.com/feed', country: 'Jamaica' },
  { name: 'Jamaica Observer', url: 'https://www.jamaicaobserver.com/feed/', country: 'Jamaica' },

  // Trinidad & Tobago
  { name: 'Newsday (TT)', url: 'https://newsday.co.tt/feed/', country: 'Trinidad and Tobago' },
  { name: 'Guardian TT', url: 'https://guardian.co.tt/rss/news', country: 'Trinidad and Tobago' },

  // Barbados
  { name: 'Nation News', url: 'https://www.nationnews.com/feed/', country: 'Barbados' },
  { name: 'Barbados Today', url: 'https://barbadostoday.bb/feed/', country: 'Barbados' },

  // Bahamas
  { name: 'The Tribune 242', url: 'https://www.tribune242.com/rss/news/', country: 'Bahamas' },
  { name: 'The Nassau Guardian', url: 'https://thenassauguardian.com/feed/', country: 'Bahamas' },

  // Guyana
  { name: 'Stabroek News', url: 'https://www.stabroeknews.com/feed/', country: 'Guyana' },
  { name: 'Kaieteur News', url: 'https://www.kaieteurnewsonline.com/feed/', country: 'Guyana' },

  // St. Kitts & Nevis
  { name: 'St. Kitts & Nevis Observer', url: 'https://www.stkittsnevisobserver.com/feed/', country: 'St. Kitts and Nevis' },
  { name: 'SKN Newsline', url: 'https://sknnewsline.com/feed/', country: 'St. Kitts and Nevis' },

  // Antigua & Barbuda
  { name: 'Antigua Observer', url: 'https://antiguaobserver.com/feed/', country: 'Antigua and Barbuda' },

  // Dominica
  { name: 'Dominica News Online', url: 'https://dominicanewsonline.com/news/feed/', country: 'Dominica' },

  // Saint Lucia
  { name: 'St. Lucia Times', url: 'https://stluciatimes.com/feed/', country: 'Saint Lucia' },

  // Grenada
  { name: 'NOW Grenada', url: 'https://www.nowgrenada.com/feed/', country: 'Grenada' },

  // Saint Vincent and the Grenadines
  { name: 'iWitness News', url: 'https://www.iwnsvg.com/feed/', country: 'Saint Vincent and the Grenadines' },

  // Belize
  { name: 'Breaking Belize News', url: 'https://www.breakingbelizenews.com/feed/', country: 'Belize' },

  // Cayman Islands
  { name: 'Cayman Compass', url: 'https://www.caymancompass.com/feed/', country: 'Cayman Islands' },

  // U.S. Virgin Islands
  { name: 'VI Consortium', url: 'https://viconsortium.com/feed', country: 'U.S. Virgin Islands' },

  // Dominican Republic (English)
  { name: 'Dominican Today', url: 'https://dominicantoday.com/feed/', country: 'Dominican Republic' }
];