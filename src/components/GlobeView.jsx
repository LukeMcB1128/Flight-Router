import { useEffect, useRef } from 'react'
import Globe from 'globe.gl'

/**
 * GlobeView — wraps Globe.gl in a React component.
 * Centered on the continental US with state polygon outlines.
 * Auto-rotation is disabled (US-focused app, spinning away makes no sense).
 *
 * Props:
 *   origin      — airport object { lat, lng, icao, name } | null
 *   destination — airport object { lat, lng, icao, name } | null
 *   onGlobeClick(lat, lng) — fired when the user clicks the globe
 */
export default function GlobeView({ origin, destination, onGlobeClick }) {
  const containerRef = useRef(null)
  const globeRef     = useRef(null)

  // ── Initialise globe once on mount ──────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el || globeRef.current) return

    const globe = Globe()(el)

    globe
      // Earth textures
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')

      // Atmosphere glow
      .showAtmosphere(true)
      .atmosphereColor('#1e40af')
      .atmosphereAltitude(0.15)

      // Pointer interaction
      .enablePointerInteraction(true)

    // Lock initial view to the continental US
    globe.pointOfView({ lat: 38.5, lng: -97.0, altitude: 2.2 }, 0)

    // Camera controls — no auto-rotation, constrained zoom
    const controls = globe.controls()
    controls.autoRotate   = false
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.minDistance   = 150   // prevent zooming inside the globe
    controls.maxDistance   = 400   // ~altitude 2.5 — full CONUS visible

    globeRef.current = globe

    // Fetch US state boundaries and render as faint polygon outlines
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(r => r.json())
      .then(({ features }) => {
        if (!globeRef.current) return   // guard: component may have unmounted during fetch
        globeRef.current
          .polygonsData(features)
          .polygonGeoJsonGeometry('geometry')
          .polygonCapColor(() => 'rgba(0, 0, 0, 0)')      // transparent fill
          .polygonSideColor(() => 'rgb(0, 0, 0)')
          .polygonStrokeColor(() => '#334155')          // slate-700 border
          .polygonAltitude(0.005)                       // nearly flush with the surface
      })
      .catch(err => console.error('Failed to load US states GeoJSON:', err))

    // Fit to container
    const resize = () => {
      globe.width(el.clientWidth)
      globe.height(el.clientHeight)
    }
    resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      el.innerHTML = ''
      globeRef.current = null
    }
  }, [])

  // ── Click handler — forward lat/lng up to parent ─────────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe || !onGlobeClick) return
    globe.onGlobeClick(({ lat, lng }) => onGlobeClick(lat, lng))
  }, [onGlobeClick])

  // ── Markers (points) ─────────────────────────────────────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    const points = []

    if (origin) {
      points.push({
        lat:      origin.lat,
        lng:      origin.lng,
        label:    `${origin.icao} — ${origin.name}`,
        color:    '#3b82f6',   // blue-500
        radius:   0.3,
        altitude: 0.015,
      })
    }

    if (destination) {
      points.push({
        lat:      destination.lat,
        lng:      destination.lng,
        label:    `${destination.icao} — ${destination.name}`,
        color:    '#ef4444',   // red-500
        radius:   0.3,
        altitude: 0.015,
      })
    }

    globe
      .pointsData(points)
      .pointLat('lat')
      .pointLng('lng')
      .pointColor('color')
      .pointRadius('radius')
      .pointAltitude('altitude')
      .pointLabel('label')
  }, [origin, destination])

  // ── Arc (great-circle path) ───────────────────────────────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    const arcs = (origin && destination)
      ? [{
          startLat: origin.lat,
          startLng: origin.lng,
          endLat:   destination.lat,
          endLng:   destination.lng,
          color:    ['#60a5fa', '#f87171'],   // blue → red gradient
        }]
      : []

    globe
      .arcsData(arcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor('color')
      .arcAltitudeAutoScale(0.35)
      .arcStroke(0.5)
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(2000)
  }, [origin, destination])

  // ── Auto-pan to fit both airports when route is set ──────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe || !origin || !destination) return

    const midLat = (origin.lat + destination.lat) / 2
    const midLng = (origin.lng + destination.lng) / 2
    globe.pointOfView({ lat: midLat, lng: midLng, altitude: 2.2 }, 1200)
  }, [origin, destination])

  // ── Auto-pan to a single airport when entered ─────────────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe || (origin && destination)) return

    const target = origin || destination
    if (!target) return
    globe.pointOfView({ lat: target.lat, lng: target.lng, altitude: 2.2 }, 1200)
  }, [origin, destination])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: '#030712' }}
    />
  )
}
