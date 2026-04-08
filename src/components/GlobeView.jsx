import { useEffect, useRef, useCallback } from 'react'
import Globe from 'globe.gl'

/**
 * GlobeView — wraps Globe.gl in a React component.
 *
 * Props:
 *   origin      — airport object { lat, lng, icao, name } | null
 *   destination — airport object { lat, lng, icao, name } | null
 *   onGlobeClick(lat, lng) — fired when the user clicks the globe
 */
export default function GlobeView({ origin, destination, onGlobeClick }) {
  const containerRef = useRef(null)
  const globeRef     = useRef(null)    // holds the Globe.gl instance
  const idleTimerRef = useRef(null)    // auto-rotate idle timer

  // ── Initialise globe once on mount ──────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el || globeRef.current) return

    const globe = Globe()(el)

    globe
      // Earth textures — use Globe.gl bundled assets
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')

      // Atmosphere glow
      .showAtmosphere(true)
      .atmosphereColor('#1e40af')
      .atmosphereAltitude(0.15)

      // Camera controls
      .enablePointerInteraction(true)

    // Start slow auto-rotation
    globe.controls().autoRotate      = true
    globe.controls().autoRotateSpeed = 0.4
    globe.controls().enableDamping   = true
    globe.controls().dampingFactor   = 0.1

    globeRef.current = globe

    // Fit to container
    const resize = () => {
      globe.width(el.clientWidth)
      globe.height(el.clientHeight)
    }
    resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      // Globe.gl doesn't expose a destroy() — clearing the container is enough
      el.innerHTML = ''
      globeRef.current = null
    }
  }, [])

  // ── Idle auto-rotate management ─────────────────────────────────────────
  const resetIdleTimer = useCallback(() => {
    const globe = globeRef.current
    if (!globe) return

    globe.controls().autoRotate = false

    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      if (globeRef.current) globeRef.current.controls().autoRotate = true
    }, 10000) // resume rotation after 3 s of inactivity
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('pointerdown', resetIdleTimer)
    return () => el.removeEventListener('pointerdown', resetIdleTimer)
  }, [resetIdleTimer])

  // ── Click handler — forward lat/lng up to parent ─────────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe || !onGlobeClick) return
    globe.onGlobeClick(({ lat, lng }) => {
      resetIdleTimer()
      onGlobeClick(lat, lng)
    })
  }, [onGlobeClick, resetIdleTimer])

  // ── Markers (points) ─────────────────────────────────────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    const points = []

    if (origin) {
      points.push({
        lat:   origin.lat,
        lng:   origin.lng,
        label: `${origin.icao} — ${origin.name}`,
        color: '#3b82f6',   // blue-500
        radius: 0.6,
        altitude: 0.015,
      })
    }

    if (destination) {
      points.push({
        lat:   destination.lat,
        lng:   destination.lng,
        label: `${destination.icao} — ${destination.name}`,
        color: '#ef4444',   // red-500
        radius: 0.6,
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
          startLat:  origin.lat,
          startLng:  origin.lng,
          endLat:    destination.lat,
          endLng:    destination.lng,
          color:     ['#60a5fa', '#f87171'],  // blue → red gradient
        }]
      : []

    globe
      .arcsData(arcs)
      .arcStartLat('startLat')
      .arcStartLng('startLng')
      .arcEndLat('endLat')
      .arcEndLng('endLng')
      .arcColor('color')
      .arcAltitudeAutoScale(0.35)   // arc height proportional to distance
      .arcStroke(0.5)
      .arcDashLength(0.4)           // animated dash
      .arcDashGap(0.2)
      .arcDashAnimateTime(2000)     // ms per full cycle → pulsing effect
  }, [origin, destination])

  // ── Auto-pan to fit both airports when route is set ──────────────────────
  useEffect(() => {
    const globe = globeRef.current
    if (!globe || !origin || !destination) return

    // Midpoint
    const midLat = (origin.lat + destination.lat) / 2
    const midLng = (origin.lng + destination.lng) / 2

    globe.pointOfView({ lat: midLat, lng: midLng, altitude: 2.2 }, 1200)
  }, [origin, destination])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: '#030712' }}
    />
  )
}
