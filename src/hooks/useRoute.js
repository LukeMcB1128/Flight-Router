import { useState, useMemo, useEffect } from 'react'
import { findAirport } from '../data/airports'
import { findAircraft } from '../data/aircrafts'

// Earth's mean radius in nautical miles
const EARTH_RADIUS_NM = 3440.065

// Avgas density in lbs per gallon
const AVGAS_LBS_PER_GAL = 6

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
 */
export function useRoute() {
  const [originIcao, setOriginIcaoRaw] = useState('')
  const [destIcao, setDestIcaoRaw]     = useState('')
  const [aircraftType, setAircraftType] = useState('')
  const [fuelGallons, setFuelGallons]  = useState(null)  // null = full tank default
  const [payloadLbs, setPayloadLbs]    = useState(0)

  // Normalise to upper-case on the way in
  const setOriginIcao = (v) => setOriginIcaoRaw(v.toUpperCase())
  const setDestIcao   = (v) => setDestIcaoRaw(v.toUpperCase())

  // Resolve airport and aircraft objects
  const origin      = useMemo(() => findAirport(originIcao), [originIcao])
  const destination = useMemo(() => findAirport(destIcao),   [destIcao])
  const aircraft    = useMemo(() => findAircraft(aircraftType), [aircraftType])

  // Reset fuel and payload when aircraft changes
  useEffect(() => {
    setFuelGallons(null)
    setPayloadLbs(0)
  }, [aircraftType])

  // Calculate distance only when both airports are known
  const distanceNm = useMemo(() => {
    if (!origin || !destination) return null
    if (origin.icao === destination.icao) return 0
    return Math.round(haversineNm(origin.lat, origin.lng, destination.lat, destination.lng))
  }, [origin, destination])

  // Fuel and weight derived values
  const resolvedFuelGallons = fuelGallons ?? (aircraft?.fuel_full ?? 0)
  const fuelWeightLbs       = resolvedFuelGallons * AVGAS_LBS_PER_GAL
  const maxPayloadLbs       = aircraft
    ? Math.max(0, aircraft.MTOW - aircraft.OEW - fuelWeightLbs)
    : null
  const totalWeightLbs      = aircraft
    ? aircraft.OEW + fuelWeightLbs + payloadLbs
    : null
  const weightStatus        = totalWeightLbs !== null
    ? (totalWeightLbs <= aircraft.MTOW ? 'within-limits' : 'over-mtow')
    : null
  const effectiveRange      = aircraft
    ? Math.round((resolvedFuelGallons / aircraft.fuel_burn_perhr) * aircraft.speed)
    : null

  const rangeStatus = useMemo(() => {
    if (!distanceNm || !aircraft || effectiveRange === null) return null
    return distanceNm <= effectiveRange ? 'within-range' : 'exceeds-range'
  }, [distanceNm, aircraft, effectiveRange])

  return {
    originIcao,    setOriginIcao,
    destIcao,      setDestIcao,
    origin,        destination,
    distanceNm,
    aircraftType,  setAircraftType,
    aircraft,
    rangeStatus,
    fuelGallons,   setFuelGallons,
    payloadLbs,    setPayloadLbs,
    resolvedFuelGallons,
    fuelWeightLbs,
    maxPayloadLbs,
    totalWeightLbs,
    weightStatus,
    effectiveRange,
  }
}
