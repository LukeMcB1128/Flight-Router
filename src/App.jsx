import { useCallback, useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import ViewModeSwitcher from './components/ViewModeSwitcher'
import { useRoute } from './hooks/useRoute'
import { fetchAirports, AIRPORTS } from './data/airports'
import { findRefuelStops } from './utils/routePlanning'

/**
 * App — root component.
 * Holds all shared state via useRoute and wires the globe + sidebar together.
 *
 * On mount we kick off a paginated fetch of the USDA NTAD Aviation Facilities
 * dataset. While the fetch is in progress the app works normally against the
 * hardcoded AIRPORTS fallback. Once the fetch resolves:
 *   - `airports`      replaces the sidebar list with the full live dataset
 *   - `airportsReady` flips to true, causing useRoute to re-resolve any
 *     already-typed ICAO codes against the newly populated index
 */
export default function App() {
  const [airports,      setAirports]      = useState(Object.values(AIRPORTS))
  const [airportsReady, setAirportsReady] = useState(false)
  const [airportsError, setAirportsError] = useState(false)
  // { loaded: number, total: number } — drives the progress badge in the Sidebar
  const [fetchProgress, setFetchProgress] = useState({ loaded: 0, total: 0 })

  useEffect(() => {
    let cancelled = false
    fetchAirports({
      onProgress: (loaded, total) => {
        if (!cancelled) setFetchProgress({ loaded, total })
      },
    })
      .then((data) => {
        if (cancelled) return
        setAirports(data)
        setAirportsReady(true)
      })
      .catch((err) => {
        if (cancelled) return
        console.warn('NTAD airport fetch failed — using hardcoded fallback.', err)
        setAirportsError(true)
      })
    return () => { cancelled = true }
  }, [])

  const {
    originIcao, setOriginIcao,
    destIcao,   setDestIcao,
    origin, destination,
    distanceNm,
    aircraftType, setAircraftType,
    aircraft,
    fuelGallons,   setFuelGallons,
    payloadLbs,    setPayloadLbs,
    resolvedFuelGallons,
    fuelWeightLbs,
    maxPayloadLbs,
    totalWeightLbs,
    weightStatus,
    effectiveRange,
  } = useRoute({ airportsReady })

  // Clamp payload down when max drops due to higher fuel load
  const handleFuelChange = useCallback((gallons) => {
    setFuelGallons(gallons)
    const newMax = Math.max(0, aircraft.MTOW - aircraft.OEW - gallons * 6)
    if (payloadLbs > newMax) setPayloadLbs(newMax)
  }, [aircraft, payloadLbs, setFuelGallons, setPayloadLbs])

  // Refueling stop calculation — re-runs whenever route, fuel load, or the
  // airport dataset changes. Runs synchronously on the main thread; the
  // bounding-box pre-filter keeps it well under a millisecond for CONUS routes.
  const refuelResult = useMemo(
    () => findRefuelStops(origin, destination, effectiveRange, airports),
    [origin, destination, effectiveRange, airports], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const [viewMode, setViewMode] = useState('us-map')

  const handleGlobeClick = useCallback(() => {
    // Future: nearest-airport snap from click
  }, [])

  return (
    <div className="flex w-full h-full overflow-hidden bg-[#030712]">
      {/* Left sidebar */}
      <Sidebar
        originIcao={originIcao}   setOriginIcao={setOriginIcao}
        destIcao={destIcao}       setDestIcao={setDestIcao}
        aircraftType={aircraftType} setAircraftType={setAircraftType}
        origin={origin}
        destination={destination}
        distanceNm={distanceNm}
        fuelGallons={resolvedFuelGallons}
        payloadLbs={payloadLbs}
        maxPayloadLbs={maxPayloadLbs}
        fuelWeightLbs={fuelWeightLbs}
        totalWeightLbs={totalWeightLbs}
        weightStatus={weightStatus}
        effectiveRange={effectiveRange}
        onFuelChange={handleFuelChange}
        onPayloadChange={setPayloadLbs}
        airports={airports}
        airportsReady={airportsReady}
        airportsError={airportsError}
        fetchProgress={fetchProgress}
        refuelResult={refuelResult}
      />

      {/* Map fills remaining space — switcher is a sibling of MapView so it
           sits above the WebGL canvas in the pointer-event hit-test order */}
      <div className="flex-1 relative">
        <MapView
          origin={origin}
          destination={destination}
          refuelStops={refuelResult?.stops ?? []}
          viewMode={viewMode}
          onGlobeClick={handleGlobeClick}
        />
        <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  )
}
