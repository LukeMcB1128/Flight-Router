import { useState, useMemo, use } from 'react'
import { findAirport } from '../data/airports'
import { findAircraft } from '../data/aircrafts'

// Earth's mean radius in nautical miles
const EARTH_RADIUS_NM = 3440.065

/**
 * Haversine formula — great-circle distance between two lat/lng points.
 * Returns distance in nautical miles.
 */
function haversineNm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_NM * c
}

/**
 * useRoute — manages origin/destination state and route calculations.
 *
 * Returns:
 *   originIcao, destIcao       — current ICAO strings
 *   setOriginIcao, setDestIcao — setters
 *   origin, destination        — resolved airport objects (or null)
 *   distanceNm                 — great-circle distance (null if incomplete)
 *   aircraftType               — free-text aircraft type string
 *   setAircraftType
 */
export function useRoute() {
  const [originIcao, setOriginIcaoRaw] = useState('')
  const [destIcao, setDestIcaoRaw] = useState('')
  const [aircraftType, setAircraftType] = useState('')

  // Normalise to upper-case on the way in
  const setOriginIcao = (v) => setOriginIcaoRaw(v.toUpperCase())
  const setDestIcao   = (v) => setDestIcaoRaw(v.toUpperCase())

  // Resolve airport objects from the dataset
  const origin      = useMemo(() => findAirport(originIcao), [originIcao])
  const destination = useMemo(() => findAirport(destIcao),   [destIcao])
  const aircraft    = useMemo(() => findAircraft(aircraftType), [aircraftType])

  // Calculate distance only when both airports are known
  const distanceNm = useMemo(() => {
    if (!origin || !destination) return null
    if (origin.icao === destination.icao) return 0
    return Math.round(haversineNm(origin.lat, origin.lng, destination.lat, destination.lng))
  }, [origin, destination])

  const rangeStatus = useMemo(() => {
    if (!distanceNm || !aircraft) return null
    return distanceNm <= aircraft.range ? 'within-range' : 'exceeds-range'
  }, [distanceNm, aircraft])

  return {
    originIcao,
    setOriginIcao,
    destIcao,
    setDestIcao,
    origin,
    destination,
    distanceNm,
    aircraftType,
    setAircraftType,
  }
}
