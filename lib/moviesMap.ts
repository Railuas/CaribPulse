// Edit these to add more locations or fix URLs if they change.
// Keys are country names used in your dropdown.
export const CARIBBEAN_CINEMAS_LOCATIONS: Record<string, { name: string; url: string; city?: string }[]> = {
  'All Caribbean': [],
  'Trinidad and Tobago': [
    { name: 'Caribbean Cinemas 8 - Port of Spain', url: 'https://caribbeancinemas.com/port-of-spain/' },
    { name: 'Caribbean Cinemas SouthPark - San Fernando', url: 'https://caribbeancinemas.com/southpark/' },
  ],
  'Jamaica': [
    { name: 'Caribbean Cinemas - Sunshine Palace, Kingston', url: 'https://caribbeancinemas.com/sunshinepalace/' },
  ],
  'Barbados': [
    { name: 'Caribbean Cinemas - Wildey', url: 'https://caribbeancinemas.com/wildey/' },
  ],
  'Bahamas': [
    { name: 'Caribbean Cinemas - Nassau', url: 'https://caribbeancinemas.com/nassau/' },
  ],
  'Dominican Republic': [
    { name: 'Caribbean Cinemas - Downtown Center', url: 'https://caribbeancinemas.com/downtowncenter/' },
  ],
  'Puerto Rico': [
    { name: 'Caribbean Cinemas - San Juan', url: 'https://caribbeancinemas.com/sanjuan/' },
  ],
};
