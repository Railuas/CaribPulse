// lib/cinemas.ts
export type Cinema = { key: string; island: string; name: string; url: string };

export const CINEMAS: Cinema[] = [
  // Antigua & Barbuda
  { key: "ag-stjohns", island: "Antigua and Barbuda", name: "Antigua", url: "https://caribbeancinemas.com/antigua_en/now-showing/" },
  // Bahamas
  { key: "bs-nassau", island: "Bahamas", name: "Nassau", url: "https://caribbeancinemas.com/bahamas_en/now-showing/" },
  // Barbados
  { key: "bb-warrens", island: "Barbados", name: "Barbados", url: "https://caribbeancinemas.com/barbados_en/now-showing/" },
  // Cayman
  { key: "ky-camana", island: "Cayman Islands", name: "Camana Bay", url: "https://caribbeancinemas.com/cayman_en/now-showing/" },
  // Dominica
  { key: "dm-roseau", island: "Dominica", name: "Dominica", url: "https://caribbeancinemas.com/dominica_en/now-showing/" },
  // DR (English)
  { key: "do-sdq", island: "Dominican Republic", name: "Dominican Republic", url: "https://caribbeancinemas.com/dr_en/now-showing/" },
  // Grenada
  { key: "gd-stgeorge", island: "Grenada", name: "Grenada", url: "https://caribbeancinemas.com/grenada_en/now-showing/" },
  // Guyana (if enabled by CC later; keep placeholder URL pattern)
  // { key: "gy-georgetown", island: "Guyana", name: "Guyana", url: "https://caribbeancinemas.com/guyana_en/now-showing/" },
  // Jamaica
  { key: "jm-kingston", island: "Jamaica", name: "Jamaica", url: "https://caribbeancinemas.com/jamaica_en/now-showing/" },
  // Puerto Rico (English landing)
  { key: "pr-san-juan", island: "Puerto Rico", name: "Puerto Rico", url: "https://caribbeancinemas.com/puertorico_en/now-showing/" },
  // Saint Lucia
  { key: "lc-megaplex", island: "Saint Lucia", name: "Saint Lucia", url: "https://caribbeancinemas.com/stlucia_en/now-showing/" },
  // St. Kitts & Nevis
  { key: "kn-megaplex", island: "St. Kitts and Nevis", name: "St. Kitts & Nevis", url: "https://caribbeancinemas.com/stkitts_en/now-showing/" },
  // Saint Vincent
  { key: "vc-kingstown", island: "Saint Vincent and the Grenadines", name: "Saint Vincent", url: "https://caribbeancinemas.com/saintvincent_en/now-showing/" },
  // Trinidad & Tobago
  { key: "tt-trincity", island: "Trinidad and Tobago", name: "Trinidad & Tobago", url: "https://caribbeancinemas.com/trinidad_en/now-showing/" },
  // USVI
  { key: "vi-stthomas", island: "U.S. Virgin Islands", name: "U.S. Virgin Islands", url: "https://caribbeancinemas.com/usvi_en/now-showing/" }
];