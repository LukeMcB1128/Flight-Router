import { useCallback, useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import ViewModeSwitcher from './components/ViewModeSwitcher'
import { useRoute } from './hooks/useRoute'

/**
 * App — root component.
 * Holds all shared state via useRoute and wires the globe + sidebar together.
 */
export default function App() {
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
  } = useRoute()

  // Clamp payload down when max drops due to higher fuel load
  const handleFuelChange = useCallback((gallons) => {
    setFuelGallons(gallons)
    const newMax = Math.max(0, aircraft.MTOW - aircraft.OEW - gallons * 6)
    if (payloadLbs > newMax) setPayloadLbs(newMax)
  }, [aircraft, payloadLbs, setFuelGallons, setPayloadLbs])

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
      />

      {/* Map fills remaining space — switcher is a sibling of MapView so it
           sits above the WebGL canvas in the pointer-event hit-test order */}
      <div className="flex-1 relative">
        <MapView
          origin={origin}
          destination={destination}
          viewMode={viewMode}
          onGlobeClick={handleGlobeClick}
        />
        <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  )
}
