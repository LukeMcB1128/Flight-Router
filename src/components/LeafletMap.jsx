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

export default function LeafletMap({ origin, destination, refuelStops = [], viewMode }) {
  const mapRef          = useRef(null)
  const [statesGeoJson, setStatesGeoJson] = useState(null)

  // ── Fetch US state boundaries once on mount ─────────────────────────────
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(r => r.json())
      .then(setStatesGeoJson)
      .catch(err => console.error('Failed to load US states GeoJSON:', err))
  }, [])

  // ── Per-leg great-circle arcs (origin → stops → destination) ────────────
  // Each leg gets its own arc so the path threads through every refuel stop
  // rather than cutting straight from origin to destination.
  const legArcs = useMemo(() => {
    if (!origin || !destination) return []
    const waypoints = [origin, ...refuelStops, destination]
    return waypoints.slice(0, -1).map((wp, i) => ({
      key:    `${wp.icao}-${waypoints[i + 1].icao}`,
      points: greatCirclePoints(wp.lat, wp.lng, waypoints[i + 1].lat, waypoints[i + 1].lng, 80),
    }))
  }, [origin?.icao, destination?.icao, refuelStops.map(s => s.icao).join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-fit / reset view when mode or airports change ──────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (viewMode === 'region') {
      if (origin && destination) {
        // Fit bounds to encompass both airports and any refuel stops
        const allPoints = [origin, destination, ...refuelStops]
        const bounds = L.latLngBounds(allPoints.map((ap) => [ap.lat, ap.lng]))
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
  // refuelStops.length triggers a re-fit when stops are added/removed
  }, [viewMode, origin?.icao, destination?.icao, refuelStops.length]) // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* Great-circle route arcs — one per leg, threading through refuel stops */}
      {legArcs.map(({ key, points }) => (
        <Polyline
          key={key}
          positions={points}
          pathOptions={{
            color:     '#60a5fa',   // blue-400 — matches globe arc
            weight:    2,
            opacity:   0.85,
            dashArray: '6 4',
          }}
        />
      ))}

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

      {/* Refuel stop markers (amber) */}
      {refuelStops.map((stop, i) => (
        <CircleMarker
          key={stop.icao}
          center={[stop.lat, stop.lng]}
          radius={5}
          pathOptions={{
            color:       '#f59e0b',   // amber-400
            fillColor:   '#f59e0b',
            fillOpacity: 0.85,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]}>
            Stop {i + 1}: {stop.icao} — {stop.name}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
