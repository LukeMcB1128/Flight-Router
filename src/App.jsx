import { useCallback } from 'react'
import GlobeView from './components/GlobeView'
import Sidebar from './components/Sidebar'
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
  } = useRoute()

  /**
   * Globe click handler.
   * First click sets origin, second sets destination.
   * A third click resets and starts over.
   */
  const handleGlobeClick = useCallback((lat, lng) => {
    // We don't auto-place from click in this foundation build —
    // airports must match the hardcoded dataset. The globe click
    // is wired but finding the nearest airport is a future feature.
    // For now, clicking the globe is a no-op (inputs drive state).
  }, [])

  const handleCalculate = useCallback(() => {
    // Calculation is reactive via useRoute — pressing the button
    // currently has no extra side-effect. This handler is the hook
    // for future async work (API calls, range checks, etc.).
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
        onCalculate={handleCalculate}
      />

      {/* Globe fills remaining space */}
      <div className="flex-1 relative">
        <GlobeView
          origin={origin}
          destination={destination}
          onGlobeClick={handleGlobeClick}
        />
      </div>
    </div>
  )
}
