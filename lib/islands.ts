export type Island = {
  slug: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
  icao?: string; // default airport for schedules
};

export const ISLANDS: Island[] = [
  { slug:'anguilla', name:'Anguilla', country:'UK Overseas Territory', lat:18.22, lon:-63.05, icao:'TQPF' },
  { slug:'antigua', name:'Antigua', country:'Antigua & Barbuda', lat:17.12, lon:-61.85, icao:'TAPA' },
  { slug:'barbuda', name:'Barbuda', country:'Antigua & Barbuda', lat:17.63, lon:-61.82, icao:'TAPH' },
  { slug:'aruba', name:'Aruba', country:'Netherlands', lat:12.52, lon:-70.02, icao:'TNCA' },
  { slug:'bahamas-new-providence', name:'New Providence (Nassau)', country:'Bahamas', lat:25.04, lon:-77.35, icao:'MYNN' },
  { slug:'bahamas-grand-bahama', name:'Grand Bahama', country:'Bahamas', lat:26.53, lon:-78.69, icao:'MYGF' },
  { slug:'barbados', name:'Barbados', country:'Barbados', lat:13.19, lon:-59.54, icao:'TBPB' },
  { slug:'bonaire', name:'Bonaire', country:'Netherlands', lat:12.18, lon:-68.25, icao:'TNCB' },
  { slug:'bvi-tortola', name:'Tortola', country:'British Virgin Islands', lat:18.43, lon:-64.62, icao:'TUPJ' },
  { slug:'cayman-grand', name:'Grand Cayman', country:'Cayman Islands', lat:19.31, lon:-81.37, icao:'MWCR' },
  { slug:'cuba', name:'Cuba', country:'Cuba', lat:23.13, lon:-82.38, icao:'MUHA' },
  { slug:'curacao', name:'Curaçao', country:'Netherlands', lat:12.19, lon:-68.97, icao:'TNCC' },
  { slug:'dominica', name:'Dominica', country:'Dominica', lat:15.41, lon:-61.37, icao:'TDPD' },
  { slug:'dominican-republic', name:'Dominican Republic', country:'Dominican Republic', lat:18.49, lon:-69.97, icao:'MDSD' },
  { slug:'grenada', name:'Grenada', country:'Grenada', lat:12.06, lon:-61.75, icao:'TGPY' },
  { slug:'guadeloupe', name:'Guadeloupe', country:'France', lat:16.26, lon:-61.55, icao:'TFFR' },
  { slug:'haiti', name:'Haiti', country:'Haiti', lat:18.58, lon:-72.29, icao:'MTPP' },
  { slug:'jamaica', name:'Jamaica', country:'Jamaica', lat:18.01, lon:-76.79, icao:'MKJP' },
  { slug:'martinique', name:'Martinique', country:'France', lat:14.64, lon:-61.02, icao:'TFFF' },
  { slug:'montserrat', name:'Montserrat', country:'UK Overseas Territory', lat:16.75, lon:-62.19, icao:'TRPG' },
  { slug:'puerto-rico', name:'Puerto Rico', country:'USA', lat:18.44, lon:-66.00, icao:'TJSJ' },
  { slug:'saba', name:'Saba', country:'Netherlands', lat:17.63, lon:-63.23, icao:'TNCS' },
  { slug:'saint-barthelemy', name:'Saint Barthélemy', country:'France', lat:17.90, lon:-62.85, icao:'TFFJ' },
  { slug:'saint-kitts', name:'Saint Kitts', country:'Saint Kitts & Nevis', lat:17.30, lon:-62.73, icao:'TKPK' },
  { slug:'nevis', name:'Nevis', country:'Saint Kitts & Nevis', lat:17.16, lon:-62.58, icao:'TKPN' },
  { slug:'saint-lucia', name:'Saint Lucia', country:'Saint Lucia', lat:13.91, lon:-60.98, icao:'TLPL' },
  { slug:'saint-martin', name:'Saint Martin (FR)', country:'France', lat:18.07, lon:-63.05, icao:'TFFG' },
  { slug:'sint-maarten', name:'Sint Maarten (NL)', country:'Netherlands', lat:18.04, lon:-63.11, icao:'TNCM' },
  { slug:'saint-vincent', name:'Saint Vincent', country:'Saint Vincent & the Grenadines', lat:13.15, lon:-61.21, icao:'TVSA' },
  { slug:'bequia', name:'Bequia', country:'Saint Vincent & the Grenadines', lat:13.01, lon:-61.24, icao:'TVSB' },
  { slug:'mustique', name:'Mustique', country:'Saint Vincent & the Grenadines', lat:12.88, lon:-61.19, icao:'TVSM' },
  { slug:'canouan', name:'Canouan', country:'Saint Vincent & the Grenadines', lat:12.70, lon:-61.34, icao:'TVSC' },
  { slug:'union-island', name:'Union Island', country:'Saint Vincent & the Grenadines', lat:12.60, lon:-61.43, icao:'TVSU' },
  { slug:'trinidad', name:'Trinidad', country:'Trinidad & Tobago', lat:10.65, lon:-61.51, icao:'TTPP' },
  { slug:'tobago', name:'Tobago', country:'Trinidad & Tobago', lat:11.15, lon:-60.83, icao:'TTCP' },
  { slug:'turks-caicos', name:'Turks & Caicos', country:'UK Overseas Territory', lat:21.77, lon:-72.23, icao:'MBPV' },
  { slug:'usvi-st-thomas', name:'USVI — St. Thomas', country:'USA', lat:18.34, lon:-64.97, icao:'TIST' },
  { slug:'usvi-st-croix', name:'USVI — St. Croix', country:'USA', lat:17.70, lon:-64.80, icao:'TISX' },
  { slug:'usvi-st-john', name:'USVI — St. John', country:'USA', lat:18.33, lon:-64.73 },
];
