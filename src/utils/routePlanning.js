/**
 * Route planning utilities — refueling stop calculation.
 */

const EARTH_RADIUS_NM = 3440.065

/** Great-circle distance between two lat/lng points (nautical miles). */
function haversineNm(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return EARTH_RADIUS_NM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Find the minimum set of intermediate refueling stops for a route using a
 * greedy algorithm:
 *
 *   From the current position, look at every airport that is:
 *     a) within `usableRange` (effectiveRange × reserveFraction), AND
 *     b) closer to the destination than we currently are (forward progress).
 *   Pick the one that minimises remaining distance to destination.
 *   Repeat until the destination itself is within `usableRange`.
 *
 * Bounding-box pre-filter:  before running haversine on the whole dataset we
 * discard airports outside a lat/lng rectangle that wraps the full route with
 * `usableRange` of padding.  This cuts the inner-loop candidates from ~15 000
 * down to a few hundred for typical domestic routes.
 *
 * @param {object}   origin           - airport object { icao, lat, lng, name, city }
 * @param {object}   destination      - airport object
 * @param {number}   effectiveRangeNm - aircraft range at the current fuel load (nm)
 * @param {object[]} airports         - full airport list (NTAD or fallback)
 * @param {number}   [reserveFraction=0.9] - fraction of range to use; keeps a
 *                                     10 % fuel reserve at each stop
 *
 * @returns {{
 *   status:  'within-range' | 'possible' | 'impossible' | 'no-data',
 *   stops:   object[],   // intermediate airports (empty for within-range)
 *   legs:    { from: object, to: object, distanceNm: number }[]
 * }}
 */
export function findRefuelStops(
  origin,
  destination,
  effectiveRangeNm,
  airports,
  reserveFraction = 0.9,
) {
  // ── Guard: need all inputs ──────────────────────────────────────────────────
  if (!origin || !destination || !effectiveRangeNm || airports.length === 0) {
    return { status: 'no-data', stops: [], legs: [] }
  }

  const usableRange = effectiveRangeNm * reserveFraction
  const MAX_STOPS   = 20   // safety cap — prevents infinite loops on bad data

  const totalDist = haversineNm(
    origin.lat, origin.lng,
    destination.lat, destination.lng,
  )

  // ── Already in range — no stops needed ─────────────────────────────────────
  if (totalDist <= usableRange) {
    return {
      status: 'within-range',
      stops: [],
      legs: [{ from: origin, to: destination, distanceNm: Math.round(totalDist) }],
    }
  }

  // ── Build a bounding box around the whole route ────────────────────────────
  // 1° lat ≈ 60 nm; 1° lng ≈ 60 nm × cos(midLat).
  // We expand by usableRange on each side so we never miss a valid stop that
  // lies off the straight-line corridor.
  const midLat = (origin.lat + destination.lat) / 2
  const latPad = usableRange / 60
  const lngPad = usableRange / (60 * Math.cos((midLat * Math.PI) / 180))

  const bboxMinLat = Math.min(origin.lat, destination.lat) - latPad
  const bboxMaxLat = Math.max(origin.lat, destination.lat) + latPad
  const bboxMinLng = Math.min(origin.lng, destination.lng) - lngPad
  const bboxMaxLng = Math.max(origin.lng, destination.lng) + lngPad

  // Pre-filtered candidate pool (excludes origin & destination)
  const candidatePool = airports.filter(
    (ap) =>
      ap.icao !== origin.icao &&
      ap.icao !== destination.icao &&
      ap.lat >= bboxMinLat && ap.lat <= bboxMaxLat &&
      ap.lng >= bboxMinLng && ap.lng <= bboxMaxLng,
  )

  // ── Greedy stop selection ──────────────────────────────────────────────────
  const stops      = []
  const visitedSet = new Set([origin.icao])
  let   current    = origin

  for (let iteration = 0; iteration < MAX_STOPS; iteration++) {
    const distToDest = haversineNm(
      current.lat, current.lng,
      destination.lat, destination.lng,
    )

    // Can we reach the destination from here?
    if (distToDest <= usableRange) {
      const waypoints = [origin, ...stops, destination]
      const legs = waypoints.slice(0, -1).map((wp, i) => ({
        from:       wp,
        to:         waypoints[i + 1],
        distanceNm: Math.round(
          haversineNm(wp.lat, wp.lng, waypoints[i + 1].lat, waypoints[i + 1].lng),
        ),
      }))
      return { status: 'possible', stops, legs }
    }

    // Find the best next stop: reachable AND making forward progress
    let best            = null
    let bestDistToDest  = distToDest   // must be strictly less (progress check)

    for (const ap of candidatePool) {
      if (visitedSet.has(ap.icao)) continue

      const distToAp = haversineNm(current.lat, current.lng, ap.lat, ap.lng)
      if (distToAp > usableRange) continue                // out of range

      const apToDest = haversineNm(ap.lat, ap.lng, destination.lat, destination.lng)
      if (apToDest >= bestDistToDest) continue            // no improvement

      bestDistToDest = apToDest
      best           = ap
    }

    if (!best) {
      // No airport within range makes forward progress — route is impossible
      return { status: 'impossible', stops, legs: [] }
    }

    visitedSet.add(best.icao)
    stops.push(best)
    current = best
  }

  // Fell through MAX_STOPS — should not happen on realistic routes
  return { status: 'impossible', stops, legs: [] }
}
