import GlobeView from './GlobeView'
import LeafletMap from './LeafletMap'

/**
 * MapView — unified map wrapper.
 *
 * Conditionally renders the 3D globe (globe.gl) or the flat 2D Leaflet map
 * depending on `viewMode`.
 *
 * NOTE: ViewModeSwitcher is intentionally NOT rendered here. Globe.gl's WebGL
 * canvas is a GPU-composited layer that swallows pointer events for all
 * elements inside the same DOM subtree, regardless of z-index. The switcher
 * is therefore rendered as a sibling of this component in App.jsx, safely
 * above the canvas in the hit-test order.
 *
 * Globe ↔ Leaflet transitions unmount/remount the outgoing component because:
 *  - globe.gl needs a visible canvas to render frames (hidden = wasted GPU)
 *  - Leaflet computes its dimensions from the DOM and breaks at 0×0
 *
 * us-map ↔ region transitions keep the same <LeafletMap> mounted; the
 * `viewMode` prop drives its zoom/pan behavior instead.
 *
 * Props:
 *   origin       — airport object | null
 *   destination  — airport object | null
 *   viewMode     — 'globe' | 'us-map' | 'region'
 *   onGlobeClick — (lat, lng) => void forwarded to GlobeView
 */
export default function MapView({ origin, destination, refuelStops = [], viewMode, onGlobeClick }) {
  return (
    <div className="w-full h-full">
      {viewMode === 'globe' && (
        <GlobeView
          origin={origin}
          destination={destination}
          onGlobeClick={onGlobeClick}
        />
      )}

      {(viewMode === 'us-map' || viewMode === 'region') && (
        <LeafletMap
          origin={origin}
          destination={destination}
          refuelStops={refuelStops}
          viewMode={viewMode}
        />
      )}
    </div>
  )
}
