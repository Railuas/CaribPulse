export const COUNTRIES = [
  'All Caribbean',
  'Jamaica',
  'Trinidad and Tobago',
  'Barbados',
  'Grenada',
  'Guyana',
  'Saint Lucia',
  'Dominican Republic',
  'Haiti',
  'Bahamas',
  'St. Kitts and Nevis',
  'Curaçao',
  'Antigua and Barbuda',
  'Dominica',
  'Saint Vincent and the Grenadines'
] as const;

export type Country = typeof COUNTRIES[number];

export const COUNTRY_TO_SLUG: Record<string,string> = Object.fromEntries(
  COUNTRIES.map(name => [name, name.toLowerCase()
    .replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')])
);

export const SLUG_TO_COUNTRY: Record<string,string> = Object.fromEntries(
  Object.entries(COUNTRY_TO_SLUG).map(([k,v]) => [v,k])
);
