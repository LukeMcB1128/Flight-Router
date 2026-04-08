import { useState, useCallback } from 'react'
import GlobeView from './components/GlobeView'
import Sidebar from './components/Sidebar'
import FlightPlannerModal from './components/FlightPlannerModal'
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
    rangeStatus,
    fuelGallons,   setFuelGallons,
    payloadLbs,    setPayloadLbs,
    resolvedFuelGallons,
    fuelWeightLbs,
    maxPayloadLbs,
    totalWeightLbs,
    weightStatus,
    effectiveRange,
  } = useRoute()

  const [plannerOpen, setPlannerOpen] = useState(false)

  // Clamp payload down when max drops due to higher fuel load
  const handleFuelChange = useCallback((gallons) => {
    setFuelGallons(gallons)
    const newMax = Math.max(0, aircraft.MTOW - aircraft.OEW - gallons * 6)
    if (payloadLbs > newMax) setPayloadLbs(newMax)
  }, [aircraft, payloadLbs, setFuelGallons, setPayloadLbs])

  const handleGlobeClick = useCallback(() => {
    // Future: nearest-airport snap from click
  }, [])

  const handleCalculate = useCallback(() => {
    // Calculation is reactive via useRoute
  }, [])

  return (
    <div className="flex w-full h-full overflow-hidden bg-[#030712]">
      {/* Left sidebar */}
      <Sidebar
        originIcao={originIcao}   setOriginIcao={setOriginIcao}
        destIcao={destIcao}       setDestIcao={setDestIcao}
        aircraftType={aircraftType} setAircraftType={setAircraftType}
        aircraft={aircraft}
        rangeStatus={rangeStatus}
        fuelGallons={fuelGallons}
        effectiveRange={effectiveRange}
        origin={origin}
        destination={destination}
        distanceNm={distanceNm}
        onCalculate={handleCalculate}
        onOpenPlanner={() => setPlannerOpen(true)}
      />

      {/* Globe fills remaining space */}
      <div className="flex-1 relative">
        <GlobeView
          origin={origin}
          destination={destination}
          onGlobeClick={handleGlobeClick}
        />
      </div>

      {/* Flight planner modal */}
      {plannerOpen && (
        <FlightPlannerModal
          aircraft={aircraft}
          fuelGallons={resolvedFuelGallons}
          payloadLbs={payloadLbs}
          maxPayloadLbs={maxPayloadLbs}
          fuelWeightLbs={fuelWeightLbs}
          totalWeightLbs={totalWeightLbs}
          weightStatus={weightStatus}
          effectiveRange={effectiveRange}
          onFuelChange={handleFuelChange}
          onPayloadChange={setPayloadLbs}
          onClose={() => setPlannerOpen(false)}
        />
      )}
    </div>
  )
}
