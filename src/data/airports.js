/**
 * Sample dataset of major airports.
 * Each entry: ICAO code, display name, latitude, longitude.
 * Expand this list when connecting to a real data source.
 */
export const AIRPORTS = {
  KLAX: { icao: 'KLAX', name: 'Los Angeles Intl', city: 'Los Angeles', lat: 33.9425,  lng: -118.4081 },
  KJFK: { icao: 'KJFK', name: 'John F. Kennedy Intl', city: 'New York',    lat: 40.6413,  lng: -73.7781  },
  EGLL: { icao: 'EGLL', name: 'Heathrow Airport',     city: 'London',      lat: 51.4775,  lng: -0.4614   },
  EDDF: { icao: 'EDDF', name: 'Frankfurt Airport',    city: 'Frankfurt',   lat: 50.0379,  lng: 8.5622    },
  RJTT: { icao: 'RJTT', name: 'Haneda Airport',       city: 'Tokyo',       lat: 35.5494,  lng: 139.7798  },
  ZBAA: { icao: 'ZBAA', name: 'Beijing Capital Intl', city: 'Beijing',     lat: 40.0801,  lng: 116.5846  },
  YSSY: { icao: 'YSSY', name: 'Sydney Airport',       city: 'Sydney',      lat: -33.9461, lng: 151.1772  },
  OMDB: { icao: 'OMDB', name: 'Dubai Intl Airport',   city: 'Dubai',       lat: 25.2532,  lng: 55.3657   },
  KSFO: { icao: 'KSFO', name: 'San Francisco Intl',   city: 'San Francisco', lat: 37.6213, lng: -122.379 },
  CYYZ: { icao: 'CYYZ', name: 'Toronto Pearson Intl', city: 'Toronto',     lat: 43.6777,  lng: -79.6248  },
  LEMD: { icao: 'LEMD', name: 'Adolfo Suárez Madrid', city: 'Madrid',      lat: 40.4936,  lng: -3.5668   },
  FACT: { icao: 'FACT', name: 'Cape Town Intl',       city: 'Cape Town',   lat: -33.9649, lng: 18.6017   },
  SBGR: { icao: 'SBGR', name: 'São Paulo Guarulhos',  city: 'São Paulo',   lat: -23.4356, lng: -46.4731  },
  WSSS: { icao: 'WSSS', name: 'Singapore Changi',     city: 'Singapore',   lat: 1.3644,   lng: 103.9915  },
  VIDP: { icao: 'VIDP', name: 'Indira Gandhi Intl',   city: 'New Delhi',   lat: 28.5562,  lng: 77.1000   },
}

/**
 * Look up an airport by ICAO code (case-insensitive).
 * Returns the airport object or null if not found.
 */
export function findAirport(icao) {
  if (!icao) return null
  return AIRPORTS[icao.toUpperCase()] ?? null
}
