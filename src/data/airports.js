/**
 * Sample dataset of major airports.
 * Each entry: ICAO code, display name, latitude, longitude.
 * Expand this list when connecting to a real data source.
 */
export const AIRPORTS = {
  KLAX: { icao: 'KLAX', name: 'Los Angeles Intl', city: 'Los Angeles', lat: 33.9425, lng: -118.4081, runway_length: 12923, runway_count: 4 },
  KJFK: { icao: 'KJFK', name: 'John F. Kennedy Intl', city: 'New York', lat: 40.6413, lng: -73.7781, runway_length: 14511, runway_count: 4 },
  EGLL: { icao: 'EGLL', name: 'Heathrow Airport', city: 'London', lat: 51.4775, lng: -0.4614, runway_length: 12802, runway_count: 2 },
  EDDF: { icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', lat: 50.0379, lng: 8.5622, runway_length: 13123, runway_count: 4 },
  RJTT: { icao: 'RJTT', name: 'Haneda Airport', city: 'Tokyo', lat: 35.5494, lng: 139.7798, runway_length: 11024, runway_count: 4 },
  ZBAA: { icao: 'ZBAA', name: 'Beijing Capital Intl', city: 'Beijing', lat: 40.0801, lng: 116.5846, runway_length: 12467, runway_count: 3 },
  YSSY: { icao: 'YSSY', name: 'Sydney Airport', city: 'Sydney', lat: -33.9461, lng: 151.1772, runway_length: 12999, runway_count: 3 },
  OMDB: { icao: 'OMDB', name: 'Dubai Intl Airport', city: 'Dubai', lat: 25.2532, lng: 55.3657, runway_length: 14590, runway_count: 2 },
  KSFO: { icao: 'KSFO', name: 'San Francisco Intl', city: 'San Francisco', lat: 37.6213, lng: -122.379, runway_length: 11870, runway_count: 4 },
  CYYZ: { icao: 'CYYZ', name: 'Toronto Pearson Intl', city: 'Toronto', lat: 43.6777, lng: -79.6248, runway_length: 11120, runway_count: 5 },
  LEMD: { icao: 'LEMD', name: 'Adolfo Suárez Madrid', city: 'Madrid', lat: 40.4936, lng: -3.5668, runway_length: 14272, runway_count: 4 },
  FACT: { icao: 'FACT', name: 'Cape Town Intl', city: 'Cape Town', lat: -33.9649, lng: 18.6017, runway_length: 10502, runway_count: 2 },
  SBGR: { icao: 'SBGR', name: 'São Paulo Guarulhos', city: 'São Paulo', lat: -23.4356, lng: -46.4731, runway_length: 12139, runway_count: 2 },
  WSSS: { icao: 'WSSS', name: 'Singapore Changi', city: 'Singapore', lat: 1.3644, lng: 103.9915, runway_length: 13123, runway_count: 3 },
  VIDP: { icao: 'VIDP', name: 'Indira Gandhi Intl', city: 'New Delhi', lat: 28.5562, lng: 77.1000, runway_length: 14534, runway_count: 4 },
  KATL: { icao: 'KATL', name: 'Hartsfield-Jackson Atlanta Intl', city: 'Atlanta', lat: 33.6407, lng: -84.4279, runway_length: 12390, runway_count: 5 },
  KDFW: { icao: 'KDFW', name: 'Dallas/Fort Worth Intl', city: 'Dallas-Fort Worth', lat: 32.8959, lng: -97.0372, runway_length: 13401, runway_count: 7 },
  KIAH: { icao: 'KIAH', name: 'George Bush Intercontinental', city: 'Houston', lat: 29.9844, lng: -95.3414, runway_length: 12002, runway_count: 5 },
  KAUS: { icao: 'KAUS', name: 'Austin-Bergstrom Intl', city: 'Austin', lat: 30.1945, lng: -97.6699, runway_length: 12250, runway_count: 2 },
  KSAT: { icao: 'KSAT', name: 'San Antonio Intl', city: 'San Antonio', lat: 29.5339, lng: -98.4691, runway_length: 8505, runway_count: 3 },
  KDAL: { icao: 'KDAL', name: 'Dallas Love Field', city: 'Dallas', lat: 32.8481, lng: -96.8512, runway_length: 8800, runway_count: 2 },
  KHOU: { icao: 'KHOU', name: 'William P. Hobby', city: 'Houston', lat: 29.6454, lng: -95.2789, runway_length: 7602, runway_count: 4 },
  KELP: { icao: 'KELP', name: 'El Paso Intl', city: 'El Paso', lat: 31.8066, lng: -106.3778, runway_length: 12020, runway_count: 3 },
  KLBB: { icao: 'KLBB', name: 'Lubbock Preston Smith Intl', city: 'Lubbock', lat: 33.6637, lng: -101.8206, runway_length: 11500, runway_count: 3 },
  KTYR: { icao: 'KTYR', name: 'Tyler Pounds Regional', city: 'Tyler', lat: 32.3535, lng: -95.4030, runway_length: 8334, runway_count: 3 },
  KEDC: { icao: 'KEDC', name: 'Austin Executive Airport', city: 'Austin', lat: 30.4001, lng: -97.5738, runway_length: 6007, runway_count: 1 },
  KADS: { icao: 'KADS', name: 'Addison Airport', city: 'Dallas/Addison', lat: 32.9681, lng: -96.8364, runway_length: 7203, runway_count: 1 },
  KTKI: { icao: 'KTKI', name: 'McKinney National', city: 'McKinney', lat: 33.1771, lng: -96.5888, runway_length: 7002, runway_count: 1 },
  KAFW: { icao: 'KAFW', name: 'Fort Worth Alliance', city: 'Fort Worth', lat: 32.9875, lng: -97.3188, runway_length: 11000, runway_count: 2 },
  KFTW: { icao: 'KFTW', name: 'Fort Worth Meacham Intl', city: 'Fort Worth', lat: 32.8208, lng: -97.3620, runway_length: 7502, runway_count: 2 },
  KSGR: { icao: 'KSGR', name: 'Sugar Land Regional', city: 'Houston/Sugar Land', lat: 29.6222, lng: -95.6565, runway_length: 8000, runway_count: 1 },
  KCXO: { icao: 'KCXO', name: 'Conroe/North Houston Regional', city: 'Conroe', lat: 30.3585, lng: -95.4143, runway_length: 7501, runway_count: 2 },
  KGTU: { icao: 'KGTU', name: 'Georgetown Executive', city: 'Georgetown', lat: 30.6787, lng: -97.6793, runway_length: 5004, runway_count: 2 },
  KHYI: { icao: 'KHYI', name: 'San Marcos Regional', city: 'San Marcos', lat: 29.8928, lng: -97.8630, runway_length: 6327, runway_count: 3 },
  KT82: { icao: 'KT82', name: 'Gillespie County', city: 'Fredericksburg', lat: 30.2436, lng: -98.9094, runway_length: 5002, runway_count: 1 }
}

/**
 * Look up an airport by ICAO code (case-insensitive).
 * Returns the airport object or null if not found.
 */
export function findAirport(icao) {
  if (!icao) return null
  return AIRPORTS[icao.toUpperCase()] ?? null
}
