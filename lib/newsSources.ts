// lib/newsSources.ts
// Curated RSS feeds per country/region. Edit freely.
// NOTE: We only pull title/link/summary + poster (og:image) when available.

export type Feed = { name: string; url: string; country: string };

export const FEEDS: Feed[] = [
  // Regional
  { name: 'Caribbean Loop News', url: 'https://www.loopnewscaribbean.com/rss.xml', country: 'All Caribbean' },
  { name: 'CARICOM Today', url: 'https://today.caricom.org/feed/', country: 'All Caribbean' },

  // Jamaica
  { name: 'The Gleaner', url: 'https://jamaica-gleaner.com/feed', country: 'Jamaica' },
  { name: 'Loop News Jamaica', url: 'https://jamaica.loopnews.com/rss.xml', country: 'Jamaica' },

  // Trinidad & Tobago
  { name: 'Loop News Trinidad & Tobago', url: 'https://tt.loopnews.com/rss.xml', country: 'Trinidad and Tobago' },
  { name: 'Newsday (TT)', url: 'https://newsday.co.tt/feed/', country: 'Trinidad and Tobago' },

  // Barbados
  { name: 'Nation News (Barbados)', url: 'https://www.nationnews.com/feed/', country: 'Barbados' },
  { name: 'Loop News Barbados', url: 'https://barbados.loopnews.com/rss.xml', country: 'Barbados' },

  // Bahamas
  { name: 'The Tribune (Bahamas)', url: 'https://www.tribune242.com/rss/news/', country: 'Bahamas' },
  { name: 'Loop News Bahamas', url: 'https://bahamas.loopnews.com/rss.xml', country: 'Bahamas' },

  // Dominican Republic (English sources vary)
  { name: 'Dominican Today', url: 'https://dominicantoday.com/feed/', country: 'Dominican Republic' },

  // Puerto Rico (English: News Is My Business)
  { name: 'News is my Business (PR)', url: 'https://newsismybusiness.com/feed/', country: 'Puerto Rico' },

  // Saint Lucia
  { name: 'Loop News Saint Lucia', url: 'https://stlucia.loopnews.com/rss.xml', country: 'Saint Lucia' },

  // Guyana
  { name: 'Stabroek News', url: 'https://www.stabroeknews.com/feed/', country: 'Guyana' },

  // Grenada
  { name: 'NOW Grenada', url: 'https://www.nowgrenada.com/feed/', country: 'Grenada' },

  // Antigua
  { name: 'Antigua Observer', url: 'https://antiguaobserver.com/feed/', country: 'Antigua and Barbuda' },

  // St. Kitts & Nevis
  { name: 'SKN Newsline', url: 'https://www.sknnewsline.com/feed/', country: 'St. Kitts and Nevis' },

  // USVI
  { name: 'The Virgin Islands Consortium', url: 'https://viconsortium.com/feed', country: 'U.S. Virgin Islands' },
];
