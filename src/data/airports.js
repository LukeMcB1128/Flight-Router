/**
 * US airport dataset — hardcoded fallback.
 * Used immediately on load and as a safety net if the NTAD API is unavailable.
 * fetchAirports() replaces this with live USDA NTAD data at runtime.
 */
export const AIRPORTS = {
  KLAX: { icao: 'KLAX', name: 'Los Angeles Intl', city: 'Los Angeles', lat: 33.9425, lng: -118.4081, runway_length: 12923, runway_count: 4 },
  KJFK: { icao: 'KJFK', name: 'John F. Kennedy Intl', city: 'New York', lat: 40.6413, lng: -73.7781, runway_length: 14511, runway_count: 4 },
  KSFO: { icao: 'KSFO', name: 'San Francisco Intl', city: 'San Francisco', lat: 37.6213, lng: -122.379, runway_length: 11870, runway_count: 4 },
  KATL: { icao: 'KATL', name: 'Hartsfield-Jackson Atlanta Intl', city: 'Atlanta', lat: 33.6323715028806, lng: -84.43355603362959, runway_length: 12390, runway_count: 5 },
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
  KT82: { icao: 'KT82', name: 'Gillespie County', city: 'Fredericksburg', lat: 30.2436, lng: -98.9094, runway_length: 5002, runway_count: 1 },
  KRBD: { icao: 'KRBD', name: 'Dallas Executive', city: 'Dallas', lat: 32.6792, lng: -96.8886, runway_length: 5000, runway_count: 1 },
  KORD: { icao: 'KORD', name: 'Chicago O\'Hare Intl', city: 'Chicago', lat: 41.9742, lng: -87.9073, runway_length: 13000, runway_count: 8 },
  KDEN: { icao: 'KDEN', name: 'Denver Intl', city: 'Denver', lat: 39.8561, lng: -104.6737, runway_length: 16000, runway_count: 6 },
  KMCO: { icao: 'KMCO', name: 'Orlando Intl', city: 'Orlando', lat: 28.4312, lng: -81.3081, runway_length: 12004, runway_count: 4 },
  KSEA: { icao: 'KSEA', name: 'Seattle-Tacoma Intl', city: 'Seattle', lat: 47.4502, lng: -122.3088, runway_length: 11901, runway_count: 3 },
  KBOS: { icao: 'KBOS', name: 'General Edward Lawrence Logan Intl', city: 'Boston', lat: 42.3656, lng: -71.0096, runway_length: 10083, runway_count: 6 },
  KMIA: { icao: 'KMIA', name: 'Miami Intl', city: 'Miami', lat: 25.7959, lng: -80.2870, runway_length: 13016, runway_count: 4 },
  KPHX: { icao: 'KPHX', name: 'Phoenix Sky Harbor Intl', city: 'Phoenix', lat: 33.4342, lng: -112.0116, runway_length: 11489, runway_count: 3 },
  KLAS: { icao: 'KLAS', name: 'Harry Reid Intl', city: 'Las Vegas', lat: 36.0840, lng: -115.1537, runway_length: 14510, runway_count: 4 },
  KCLT: { icao: 'KCLT', name: 'Charlotte Douglas Intl', city: 'Charlotte', lat: 35.2140, lng: -80.9431, runway_length: 10000, runway_count: 4 },
  KDCA: { icao: 'KDCA', name: 'Ronald Reagan Washington National', city: 'Washington D.C.', lat: 38.8512, lng: -77.0402, runway_length: 7169, runway_count: 3 },
  KASE: { icao: 'KASE', name: 'Aspen-Pitkin County', city: 'Aspen', lat: 39.2232, lng: -106.8690, runway_length: 8006, runway_count: 1 },
  KEYW: { icao: 'KEYW', name: 'Key West Intl', city: 'Key West', lat: 24.5561, lng: -81.7596, runway_length: 5076, runway_count: 1 },
  KACK: { icao: 'KACK', name: 'Nantucket Memorial', city: 'Nantucket', lat: 41.2531, lng: -70.0602, runway_length: 6303, runway_count: 3 },
  KTVL: { icao: 'KTVL', name: 'Lake Tahoe', city: 'South Lake Tahoe', lat: 38.8939, lng: -119.9953, runway_length: 8544, runway_count: 1 },
  KSDL: { icao: 'KSDL', name: 'Scottsdale', city: 'Scottsdale', lat: 33.6229, lng: -111.9105, runway_length: 8249, runway_count: 1 },
  KTEB: { icao: 'KTEB', name: 'Teterboro', city: 'Teterboro', lat: 40.8501, lng: -74.0608, runway_length: 7000, runway_count: 2 },
  KSNA: { icao: 'KSNA', name: 'John Wayne', city: 'Santa Ana', lat: 33.6757, lng: -117.8680, runway_length: 5700, runway_count: 2 },
  KBUR: { icao: 'KBUR', name: 'Hollywood Burbank', city: 'Burbank', lat: 34.2007, lng: -118.3587, runway_length: 6886, runway_count: 2 },
  KMDW: { icao: 'KMDW', name: 'Chicago Midway Intl', city: 'Chicago', lat: 41.7868, lng: -87.7522, runway_length: 6522, runway_count: 5 },
  KMYR: { icao: 'KMYR', name: 'Myrtle Beach Intl', city: 'Myrtle Beach', lat: 33.6797, lng: -78.9283, runway_length: 9503, runway_count: 1 },
}

// ─────────────────────────────────────────────────────────────────────────────
// Live lookup index — starts as the hardcoded fallback and is replaced by the
// NTAD API data once fetchAirports() resolves.
// ─────────────────────────────────────────────────────────────────────────────
let _airportIndex = { ...AIRPORTS }

/**
 * Look up an airport by ICAO code (case-insensitive).
 * After fetchAirports() resolves this searches the full NTAD dataset.
 * Falls back to the hardcoded AIRPORTS object if the API has not loaded yet.
 */
export function findAirport(icao) {
  if (!icao) return null
  return _airportIndex[icao.toUpperCase()] ?? null
}

// ─────────────────────────────────────────────────────────────────────────────
// USDA NTAD Aviation Facilities API
// ─────────────────────────────────────────────────────────────────────────────
const NTAD_BASE =
  'https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/' +
  'NTAD_Aviation_Facilities/FeatureServer/0/query'

// Only the fields we actually use — keeps each page response small.
const NTAD_FIELDS = [
  'ICAO_ID',
  'ARPT_ID',
  'ARPT_NAME',
  'CITY',
  'STATE_NAME',
  'LAT_DECIMAL',
  'LONG_DECIMAL',
  'ELEV',
  'ARPT_STATUS',
].join(',')

/**
 * Transform a single GeoJSON Feature from the NTAD API into our airport shape.
 * Handles missing or null fields gracefully with safe defaults.
 *
 * NTAD field → our field:
 *   ICAO_ID    → icao  (falls back to ARPT_ID when blank)
 *   ARPT_NAME  → name
 *   CITY       → city
 *   LAT_DECIMAL → lat  (falls back to geometry coordinates)
 *   LONG_DECIMAL → lng
 *   ELEV       → elevation (ft MSL)
 *   STATE_NAME → state
 *
 * Note: The NTAD dataset does not include runway_length or runway_count.
 * Those fields remain null so the Sidebar shows "N/A" rather than a bad value.
 */
function transformFeature(feature) {
  const p = feature.properties ?? {}
  // Geometry coordinates are [lng, lat] in GeoJSON
  const [geoLng = null, geoLat = null] = feature.geometry?.coordinates ?? []

  // Prefer the 4-char ICAO identifier; fall back to the FAA ARPT_ID.
  const icao = ((p.ICAO_ID || p.ARPT_ID) ?? '').trim().toUpperCase()

  return {
    icao,
    name:      (p.ARPT_NAME  ?? 'Unknown Airport').trim(),
    city:      (p.CITY       ?? '').trim(),
    state:     (p.STATE_NAME ?? '').trim(),
    lat:       p.LAT_DECIMAL  ?? geoLat  ?? 0,
    lng:       p.LONG_DECIMAL ?? geoLng  ?? 0,
    elevation: p.ELEV ?? null,
    // Runway data is not present in the NTAD Aviation Facilities layer.
    runway_length: null,
    runway_count:  null,
  }
}

const WHERE   = "ARPT_STATUS='O'"   // open airports only
const PAGE_SIZE = 1000

/**
 * Step 1 — ask the API how many records match our filter.
 * Returns a plain count (number). Uses the lightweight JSON format, not GeoJSON.
 */
async function fetchTotalCount() {
  const params = new URLSearchParams({
    where:           WHERE,
    returnCountOnly: 'true',
    f:               'json',
  })
  const res = await fetch(`${NTAD_BASE}?${params}`)
  if (!res.ok) throw new Error(`NTAD count query failed: HTTP ${res.status}`)
  const json = await res.json()
  return json.count ?? 0
}

/**
 * Step 2 — fetch one page of GeoJSON features.
 */
async function fetchPage(offset) {
  const params = new URLSearchParams({
    outFields:         NTAD_FIELDS,
    where:             WHERE,
    f:                 'geojson',
    resultRecordCount: PAGE_SIZE,
    resultOffset:      offset,
    orderByFields:     'OBJECTID ASC',   // stable, reproducible pages
  })
  const res = await fetch(`${NTAD_BASE}?${params}`)
  if (!res.ok) throw new Error(`NTAD page fetch failed: HTTP ${res.status}`)
  const geojson = await res.json()
  return geojson.features ?? []
}

/**
 * Fetch the full USDA NTAD Aviation Facilities dataset, transform it, update
 * the live _airportIndex, and return the resulting array.
 *
 * Strategy — count-then-parallel:
 *   1. One cheap count query tells us exactly how many pages exist.
 *   2. All pages are fetched in parallel via Promise.allSettled, so the full
 *      dataset arrives in roughly the time of a single round-trip rather than
 *      N sequential ones.
 *   3. An optional onProgress(loaded, total) callback is called as each page
 *      resolves so the UI can show a live progress indicator.
 *   4. Pages that fail are silently skipped — we'd rather show a partial list
 *      than blow up entirely if one page 503s.
 *
 * On a total failure (count query throws) the function rejects and App.jsx
 * leaves _airportIndex pointing at the hardcoded AIRPORTS fallback.
 *
 * @param {{ onProgress?: (loaded: number, total: number) => void }} [opts]
 */
export async function fetchAirports({ onProgress } = {}) {
  // ── 1. How many records are there? ────────────────────────────────────────
  const total     = await fetchTotalCount()
  const pageCount = Math.ceil(total / PAGE_SIZE)

  // ── 2. Fetch all pages in parallel ────────────────────────────────────────
  let loaded = 0

  const pagePromises = Array.from({ length: pageCount }, (_, i) =>
    fetchPage(i * PAGE_SIZE).then((features) => {
      loaded += features.length
      onProgress?.(loaded, total)
      return features
    })
  )

  // allSettled means one bad page doesn't abort everything
  const results    = await Promise.allSettled(pagePromises)
  const allFeatures = results.flatMap((r) =>
    r.status === 'fulfilled' ? r.value : []
  )

  // Log any page-level failures so they're visible in DevTools
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.warn(`NTAD page ${i} failed:`, r.reason)
    }
  })

  // ── 3. Transform + filter ─────────────────────────────────────────────────
  const airports = allFeatures
    .map(transformFeature)
    .filter((a) => a.icao && (a.lat !== 0 || a.lng !== 0))

  // ── 4. Rebuild the live index ─────────────────────────────────────────────
  const newIndex = {}
  for (const ap of airports) {
    newIndex[ap.icao] = ap
  }
  // Keep any hardcoded airport not returned by the API
  for (const [key, ap] of Object.entries(AIRPORTS)) {
    if (!newIndex[key]) newIndex[key] = ap
  }

  _airportIndex = newIndex
  return airports
}
