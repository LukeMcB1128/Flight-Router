/**
 * Compute intermediate lat/lng points along the great-circle arc between two
 * coordinates using spherical linear interpolation (Slerp).
 *
 * Returns an array of [lat, lng] pairs suitable for a Leaflet <Polyline>.
 *
 * @param {number} lat1      Start latitude  (degrees)
 * @param {number} lng1      Start longitude (degrees)
 * @param {number} lat2      End latitude    (degrees)
 * @param {number} lng2      End longitude   (degrees)
 * @param {number} numPoints Number of segments (default 80)
 * @returns {[number, number][]}
 */
export function greatCirclePoints(lat1, lng1, lat2, lng2, numPoints = 80) {
  const toRad = d => d * Math.PI / 180
  const toDeg = r => r * 180 / Math.PI

  // Convert to unit-sphere Cartesian vectors
  const phi1 = toRad(lat1), lam1 = toRad(lng1)
  const phi2 = toRad(lat2), lam2 = toRad(lng2)

  const x1 = Math.cos(phi1) * Math.cos(lam1)
  const y1 = Math.cos(phi1) * Math.sin(lam1)
  const z1 = Math.sin(phi1)

  const x2 = Math.cos(phi2) * Math.cos(lam2)
  const y2 = Math.cos(phi2) * Math.sin(lam2)
  const z2 = Math.sin(phi2)

  // Central angle between the two points
  const dot = Math.min(1, Math.max(-1, x1 * x2 + y1 * y2 + z1 * z2))
  const omega = Math.acos(dot)

  // Degenerate case — same point
  if (omega < 1e-10) return [[lat1, lng1]]

  const sinOmega = Math.sin(omega)

  return Array.from({ length: numPoints + 1 }, (_, i) => {
    const t = i / numPoints
    const a = Math.sin((1 - t) * omega) / sinOmega
    const b = Math.sin(t * omega) / sinOmega

    const x = a * x1 + b * x2
    const y = a * y1 + b * y2
    const z = a * z1 + b * z2

    return [
      toDeg(Math.asin(Math.max(-1, Math.min(1, z)))),
      toDeg(Math.atan2(y, x)),
    ]
  })
}
