import { useEffect, useRef, useState, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, GeoJSON, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { greatCirclePoints } from '../utils/geo'

/**
 * LeafletMap — flat 2D map for US Map and Region view modes.
 *
 * Props:
 *   origin      — airport object { lat, lng, icao, name } | null
 *   destination — airport object { lat, lng, icao, name } | null
 *   viewMode    — 'us-map' | 'region'
 *
 * Tile provider: CartoDB Dark Matter (free, no API key, matches dark theme)
 * State boundaries: US states GeoJSON fetched from GitHub CDN on first mount
 *
 * Region mode auto-fits the viewport to encompass the selected airports.
 * US Map mode resets to the full CONUS overview.
 */

// Continental US center and zoom for the default overview
const US_CENTER = [39.5, -98.35]
const US_ZOOM   = 4

export default function LeafletMap({ origin, destination, viewMode }) {
  const mapRef          = useRef(null)
  const [statesGeoJson, setStatesGeoJson] = useState(null)

  // ── Fetch US state boundaries once on mount ─────────────────────────────
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(r => r.json())
      .then(setStatesGeoJson)
      .catch(err => console.error('Failed to load US states GeoJSON:', err))
  }, [])

  // ── Great-circle arc points (memoised on ICAO codes, not object refs) ───
  const arcPoints = useMemo(() => {
    if (!origin || !destination) return []
    return greatCirclePoints(origin.lat, origin.lng, destination.lat, destination.lng, 80)
  }, [origin?.icao, destination?.icao]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-fit / reset view when mode or airports change ──────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (viewMode === 'region') {
      if (origin && destination) {
        // Fit bounds to encompass both airports
        const bounds = L.latLngBounds(
          [origin.lat,      origin.lng],
          [destination.lat, destination.lng],
        )
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10, animate: true })
      } else if (origin || destination) {
        // Zoom into the single selected airport
        const ap = origin ?? destination
        map.setView([ap.lat, ap.lng], 9, { animate: true })
      } else {
        // No airports selected yet — fall back to US overview
        map.setView(US_CENTER, US_ZOOM, { animate: true })
      }
    } else {
      // us-map mode always resets to the full CONUS view
      map.setView(US_CENTER, US_ZOOM, { animate: true })
    }
  }, [viewMode, origin?.icao, destination?.icao]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MapContainer
      ref={mapRef}
      center={US_CENTER}
      zoom={US_ZOOM}
      className="w-full h-full"
      zoomControl={false}   // we float our own ViewModeSwitcher in the same corner
    >
      {/* CartoDB Dark Matter tiles — free, no API key */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/" target="_blank">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* US state boundary outlines */}
      {statesGeoJson && (
        <GeoJSON
          key="us-states"
          data={statesGeoJson}
          style={{
            color:       '#334155',   // slate-700 — subtle borders
            weight:      1,
            fillOpacity: 0,           // transparent fill, outlines only
          }}
        />
      )}

      {/* Great-circle route arc */}
      {arcPoints.length > 0 && (
        <Polyline
          positions={arcPoints}
          pathOptions={{
            color:     '#60a5fa',   // blue-400 — matches globe arc
            weight:    2,
            opacity:   0.85,
            dashArray: '6 4',
          }}
        />
      )}

      {/* Origin airport marker (blue) */}
      {origin && (
        <CircleMarker
          center={[origin.lat, origin.lng]}
          radius={7}
          pathOptions={{
            color:       '#3b82f6',   // blue-500
            fillColor:   '#3b82f6',
            fillOpacity: 0.85,
          }}
        >
          <Tooltip permanent direction="top" offset={[0, -10]}>
            {origin.icao} — {origin.name}
          </Tooltip>
        </CircleMarker>
      )}

      {/* Destination airport marker (red) */}
      {destination && (
        <CircleMarker
          center={[destination.lat, destination.lng]}
          radius={7}
          pathOptions={{
            color:       '#ef4444',   // red-500
            fillColor:   '#ef4444',
            fillOpacity: 0.85,
          }}
        >
          <Tooltip permanent direction="top" offset={[0, -10]}>
            {destination.icao} — {destination.name}
          </Tooltip>
        </CircleMarker>
      )}
    </MapContainer>
  )
}
