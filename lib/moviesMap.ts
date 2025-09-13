// lib/moviesMap.ts
// Fully populated Caribbean Cinemas locations by country.
// If any URL changes, just tweak that one entry. The Movies API will use this map.

export type CCinemaLoc = { name: string; url: string; city?: string };

export const CARIBBEAN_CINEMAS_LOCATIONS: Record<string, CCinemaLoc[]> = {
  "All Caribbean": [],

  // ==================== Puerto Rico ====================
  "Puerto Rico": [
    { name: "San Patricio VIP — Guaynabo", url: "https://caribbeancinemas.com/sanpatriciovip/" },
    { name: "Montehiedra — San Juan", url: "https://caribbeancinemas.com/montehiedra/" },
    { name: "Plaza Las Américas — San Juan", url: "https://caribbeancinemas.com/plazalasamericas/" },
    { name: "Carolina", url: "https://caribbeancinemas.com/carolina/" },
    { name: "Bayamón", url: "https://caribbeancinemas.com/bayamon/" },
    { name: "Western Plaza — Mayagüez", url: "https://caribbeancinemas.com/westernplaza/" },
    { name: "Mayagüez Town Center", url: "https://caribbeancinemas.com/mayaguez/" },
    { name: "Ponce — Plaza Del Caribe", url: "https://caribbeancinemas.com/ponce/" },
    { name: "Fajardo", url: "https://caribbeancinemas.com/fajardo/" },
    { name: "Caguas", url: "https://caribbeancinemas.com/caguas/" },
    { name: "Añasco", url: "https://caribbeancinemas.com/anasco/" },
    { name: "Arecibo", url: "https://caribbeancinemas.com/arecibo/" },
    { name: "San Germán", url: "https://caribbeancinemas.com/sangerman/" },
    { name: "Las Piedras", url: "https://caribbeancinemas.com/laspiedras/" },
    { name: "Vega Alta", url: "https://caribbeancinemas.com/vegaalta/" },
    { name: "Plaza Guaynabo", url: "https://caribbeancinemas.com/plazaguaynabo/" }
  ],

  // ==================== Dominican Republic ====================
  "Dominican Republic": [
    { name: "Downtown Center — Santo Domingo", url: "https://caribbeancinemas.com/downtowncenter/" },
    { name: "Acropolis — Santo Domingo", url: "https://caribbeancinemas.com/acropolis/" },
    { name: "Galería 360 — Santo Domingo", url: "https://caribbeancinemas.com/galeria360/" },
    { name: "Silver Sun — Santo Domingo", url: "https://caribbeancinemas.com/silversun/" },
    { name: "Sambil — Santo Domingo", url: "https://caribbeancinemas.com/sambilsd/" },
    { name: "Colinas Mall — Santiago", url: "https://caribbeancinemas.com/colinasmall/" },
    { name: "Bella Terra Mall — Santiago", url: "https://caribbeancinemas.com/bellaterra/" },
    { name: "Megaplex 10 — Santiago", url: "https://caribbeancinemas.com/megaplex10/" },
    { name: "Puerto Plata", url: "https://caribbeancinemas.com/puertoplata/" },
    { name: "La Romana", url: "https://caribbeancinemas.com/laromana/" },
    { name: "Downtown Punta Cana", url: "https://caribbeancinemas.com/puntacana/" }
  ],

  // ==================== Trinidad & Tobago ====================
  "Trinidad and Tobago": [
    { name: "Port of Spain 8", url: "https://caribbeancinemas.com/port-of-spain/" },
    { name: "SouthPark — San Fernando", url: "https://caribbeancinemas.com/southpark/" },
    { name: "Chaguanas", url: "https://caribbeancinemas.com/chaguanas/" }
  ],

  // ==================== Jamaica ====================
  "Jamaica": [
    { name: "Sunshine Palace — Kingston", url: "https://caribbeancinemas.com/sunshinepalace/" },
    { name: "Portmore", url: "https://caribbeancinemas.com/portmore/" },
    { name: "Montego Bay", url: "https://caribbeancinemas.com/montegobay/" }
  ],

  // ==================== Barbados ====================
  "Barbados": [
    { name: "Wildey", url: "https://caribbeancinemas.com/wildey/" }
  ],

  // ==================== Bahamas ====================
  "Bahamas": [
    { name: "Nassau", url: "https://caribbeancinemas.com/nassau/" }
  ],

  // ==================== Antigua & Barbuda ====================
  "Antigua and Barbuda": [
    { name: "Antigua Megaplex 8 — St. John's", url: "https://caribbeancinemas.com/antigua/" }
  ],

  // ==================== Sint Maarten / Saint Martin ====================
  "Sint Maarten": [
    { name: "St. Maarten Megaplex 7", url: "https://caribbeancinemas.com/stmaarten/" }
  ],
  "Saint Martin": [
    { name: "Marigot", url: "https://caribbeancinemas.com/marigot/" }
  ],

  // ==================== Saint Lucia ====================
  "Saint Lucia": [
    { name: "Castries", url: "https://caribbeancinemas.com/castries/" }
  ],

  // ==================== Curaçao ====================
  "Curaçao": [
    { name: "Sambil Curaçao", url: "https://caribbeancinemas.com/curacao/" }
  ],

  // ==================== Guyana ====================
  "Guyana": [
    { name: "Georgetown", url: "https://caribbeancinemas.com/georgetown/" }
  ]
};
