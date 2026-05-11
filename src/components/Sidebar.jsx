import { useState, useMemo } from 'react'
import { AIRCRAFTS } from '../data/aircrafts'

// Chevron icon for collapse toggle
function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-0' : 'rotate-180'}`}
      fill="none" stroke="currentColor" strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

// Plane icon for the header
function PlaneIcon() {
  return (
    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  )
}

/**
 * AirportInput — a labelled text field with live ICAO validation.
 * Shows a coloured status dot and the resolved airport name below.
 */
function AirportInput({ label, value, onChange, resolvedAirport, accentColor }) {
  const isValid  = resolvedAirport !== null
  const hasInput = value.trim().length > 0

  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={4}
          placeholder="ICAO"
          className="
            w-full bg-slate-800/70 border border-slate-700 rounded-lg
            px-3 py-2 pr-8 text-sm font-mono uppercase tracking-widest
            text-white placeholder-slate-600
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
            transition-colors
          "
        />
        {/* Status dot */}
        {hasInput && (
          <span className={`
            absolute right-3 top-1/2 -translate-y-1/2
            w-2 h-2 rounded-full
            ${isValid ? (accentColor === 'blue' ? 'bg-blue-400' : 'bg-red-400') : 'bg-slate-600'}
          `} />
        )}
      </div>

      {/* Resolved name */}
      <p className="text-xs h-4 text-slate-500 truncate">
        {isValid
          ? `${resolvedAirport.city} — ${resolvedAirport.name}`
          : hasInput
            ? 'Unknown airport code'
            : ''}
      </p>
    </div>
  )
}

// Maximum number of airports shown in the browser list at one time.
const LIST_LIMIT = 30

/**
 * Sidebar — collapsible left panel with route inputs, flight planner, and results.
 */
export default function Sidebar({
  originIcao, setOriginIcao,
  destIcao,   setDestIcao,
  aircraftType, setAircraftType,
  origin, destination,
  distanceNm,
  fuelGallons,
  payloadLbs,
  maxPayloadLbs,
  fuelWeightLbs,
  totalWeightLbs,
  weightStatus,
  effectiveRange,
  onFuelChange,
  onPayloadChange,
  // Live airport dataset from the NTAD API (or fallback)
  airports       = [],
  airportsReady  = false,
  airportsError  = false,
  fetchProgress  = { loaded: 0, total: 0 },
  refuelResult   = null,
}) {
  const [open, setOpen] = useState(true)
  const [airportSearch, setAirportSearch] = useState('')

  // Filter and cap the airport browser list.
  const filteredAirports = useMemo(() => {
    const q = airportSearch.trim().toUpperCase()
    if (!q) return airports.slice(0, LIST_LIMIT)
    return airports
      .filter(
        (ap) =>
          ap.icao.includes(q) ||
          ap.name.toUpperCase().includes(q) ||
          ap.city.toUpperCase().includes(q) ||
          (ap.state ?? '').toUpperCase().includes(q)
      )
      .slice(0, LIST_LIMIT)
  }, [airports, airportSearch])

  // Resolve the full aircraft object from the selected key (e.g. "SR22")
  const aircraft = AIRCRAFTS[aircraftType] ?? null

  const isOverMTOW = weightStatus === 'over-mtow'

  // Range status based on effective range (fuel-adjusted) vs distance
  const rangeStatus = distanceNm !== null && effectiveRange !== null
    ? distanceNm <= effectiveRange ? 'within-range' : 'exceeds-range'
    : null

  // can my plane take off/land at this airport?
  const takeoffStatus = aircraft && origin?.runway_length
    ? aircraft.takeoff_distance_dry * (1 + totalWeightLbs / aircraft.MTOW) <= origin.runway_length
      ? 'can-takeoff' : 'cant-takeoff'
    : null

  const landingStatus = aircraft && destination?.runway_length
    ? aircraft.landing_ground_roll * (1 + totalWeightLbs / aircraft.MTOW) <= destination.runway_length
      ? 'can-land' : 'cant-land'
    : null

  const takeoffLandingStatus = takeoffStatus && landingStatus
    ? `${takeoffStatus}-${landingStatus}`
    : null

  const takeoffLandingLabel = {
    'can-takeoff-can-land': `Both runways are sufficient distance for takeoff and landing`,
    'cant-takeoff-can-land': `Runway too short for takeoff-landing runway is sufficient distance`,
    'can-takeoff-cant-land': `Takeoff runway is sufficient distance-landing runway too short`,
    'cant-takeoff-land': `Both runways are too short for takeoff and landing`,
  }

  const takeoffLandingColor = {
    'can-takeoff-can-land': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    'cant-takeoff-can-land': 'text-red-400 bg-red-400/10 border-red-400/30',
    'can-takeoff-cant-land': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    'cant-takeoff-land': 'text-red-400 bg-red-400/10 border-red-400/30',
  }

  const rangeLabel = {
    'within-range':  'Within range',
    'exceeds-range': 'Exceeds range',
  }

  const rangeColor = {
    'within-range':  'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    'exceeds-range': 'text-red-400 bg-red-400/10 border-red-400/30',
  }

  return (
    <div
      className={`
        relative flex flex-col z-10
        bg-slate-900/80 backdrop-blur-md
        border-r border-slate-800
        transition-all duration-300 ease-in-out
        ${open ? 'w-72' : 'w-12'}
        h-full shrink-0
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-800 shrink-0">
        <PlaneIcon />
        {open && (
          <h1 className="text-sm font-bold tracking-wide text-white whitespace-nowrap">
            Flight Router
          </h1>
        )}
      </div>

      {/* Scrollable content — hidden when collapsed */}
      {open && (
        <div className="flex-1 overflow-y-auto sidebar-scroll px-4 py-5 space-y-6">

          {/* ── Route Inputs ───────────────────────────────── */}
          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Route
            </h2>

            <AirportInput
              label="Origin"
              value={originIcao}
              onChange={setOriginIcao}
              resolvedAirport={origin}
              accentColor="blue"
            />

            {/* Divider arrow */}
            <div className="flex items-center gap-2 text-slate-700 text-xs pl-1">
              <div className="flex-1 border-t border-dashed border-slate-700" />
              <svg className="w-3 h-3 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1 border-t border-dashed border-slate-700" />
            </div>

            <AirportInput
              label="Destination"
              value={destIcao}
              onChange={setDestIcao}
              resolvedAirport={destination}
              accentColor="red"
            />
          </section>

          {/* ── Aircraft ───────────────────────────────────── */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Aircraft
            </h2>
            <select
              value={aircraftType}
              onChange={(e) => setAircraftType(e.target.value)}
              className="
                w-full bg-slate-800/70 border border-slate-700 rounded-lg
                px-3 py-2 text-sm text-white
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
                transition-colors
              "
            >
              <option value="">Select aircraft</option>
              {Object.entries(AIRCRAFTS).map(([key, ac]) => (
                <option key={key} value={key}>{ac.type}</option>
              ))}
            </select>

            {/* Aircraft stats — shown once a type is selected */}
            {aircraft && (
              <p className="text-xs text-slate-400 px-1">
                Max range {aircraft.range.toLocaleString()} nm · {aircraft.speed} kts
              </p>
            )}
          </section>

          {/* ── Flight Planner ─────────────────────────────── */}
          {aircraft && (
            <section className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Flight Planner
              </h2>

              {/* Fuel slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span className="uppercase tracking-widest">Fuel Load</span>
                  <span>{fuelGallons} gal · {fuelWeightLbs} lbs</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={aircraft.fuel_full}
                  step={1}
                  value={fuelGallons}
                  onChange={(e) => onFuelChange(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>0 gal</span>
                  <span>{aircraft.fuel_full} gal (full)</span>
                </div>
              </div>

              {/* Payload slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span className="uppercase tracking-widest">Payload</span>
                  <span>{payloadLbs} lbs</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxPayloadLbs}
                  step={1}
                  value={payloadLbs}
                  onChange={(e) => onPayloadChange(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>0 lbs</span>
                  <span>{maxPayloadLbs} lbs (max)</span>
                </div>
              </div>

              {/* Weight summary */}
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Empty (OEW)</span>
                  <span>{aircraft.OEW?.toLocaleString()} lbs</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Fuel</span>
                  <span>{fuelWeightLbs?.toLocaleString()} lbs</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payload</span>
                  <span>{payloadLbs?.toLocaleString()} lbs</span>
                </div>
                <div className="border-t border-slate-700 pt-1.5 flex justify-between font-semibold text-sm">
                  <span className="text-slate-300">Total</span>
                  <span className={isOverMTOW ? 'text-red-400' : 'text-white'}>
                    {totalWeightLbs?.toLocaleString()} lbs
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>MTOW limit</span>
                  <span>{aircraft.MTOW?.toLocaleString()} lbs</span>
                </div>
              </div>

              {/* Weight / range status */}
              <div className={`rounded-lg px-3 py-2 text-xs text-center font-medium border ${
                isOverMTOW
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {isOverMTOW
                  ? `Over MTOW by ${(totalWeightLbs - aircraft.MTOW).toLocaleString()} lbs`
                  : `Within limits — ${effectiveRange} nm range`
                }
              </div>
            </section>
          )}

          {/* ── Results ────────────────────────────────────── */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Results
            </h2>

            {/* Distance */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Distance (great circle)
              </p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {distanceNm !== null
                  ? <>{distanceNm.toLocaleString()}<span className="text-sm font-normal text-slate-400 ml-1">nm</span></>
                  : <span className="text-slate-600 text-base font-normal">—</span>
                }
              </p>
              <div className="flex justify-end text-xs text-slate-600">
                {distanceNm !== null && aircraft
                  ? `~${((distanceNm / aircraft.speed) * 60).toFixed(0)} min (${(((distanceNm / aircraft.speed) * 60) / 60).toFixed(1)} hrs) at ${aircraft.speed} kts`
                  : distanceNm !== null
                    ? 'Select an aircraft to see flight time'
                    : '—'
                }
              </div>
            </div>

            {/* Range status */}
            <div className={`
              rounded-lg px-3 py-2 border text-sm font-medium
              ${rangeStatus
                ? rangeColor[rangeStatus]
                : 'text-slate-600 bg-slate-800/30 border-slate-700/30'}
            `}>
              {rangeStatus
                ? rangeLabel[rangeStatus]
                : distanceNm !== null
                  ? 'Select an aircraft to check range'
                  : 'Set a route to check range'}
            </div>

            {/*Airport Stats*/}
            {(origin || destination) && (
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Airport Info
                </h2>

                {[origin, destination].filter(Boolean).map((ap) => (
                  <div
                    key={ap.icao}
                    className="bg-slate-800/50 rounded-lg p-3 border-slate-700/50 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm font-bold text-white">{ap.icao}</span>
                      <span className="text-slate-400 truncate ml-2">{ap.city}</span>
                    </div>
                    <p className="text-slate-400 truncate">{ap.name}</p>
                    <div className="border-t border-slate-700 pt-1.5 space-y-1">
                      <div className="flex justify-between text-slate-500">
                        <span>Latitude</span>
                        <span className="font-mono">{ap.lat?.toFixed(4) ?? 'N/A'}°</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Longitude</span>
                        <span className="font-mono">{ap.lng?.toFixed(4) ?? 'N/A'}°</span>
                      </div>
                      {ap.elevation != null && (
                        <div className="flex justify-between text-slate-500">
                          <span>Elevation</span>
                          <span className="font-mono">{ap.elevation.toLocaleString()} ft</span>
                        </div>
                      )}
                      {ap.runway_count != null && (
                        <div className="flex justify-between text-slate-500">
                          <span>Runway Count</span>
                          <span className="font-mono">{ap.runway_count}</span>
                        </div>
                      )}
                      {ap.runway_length != null && (
                        <div className="flex justify-between text-slate-500">
                          <span>Runway Length</span>
                          <span className="font-mono">{ap.runway_length.toLocaleString()} ft</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* ── Refuel stops ───────────────────────────────── */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Refuel stops
                </h2>
                {/* Stop count badge */}
                {refuelResult?.status === 'possible' && (
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    {refuelResult.stops.length} stop{refuelResult.stops.length !== 1 ? 's' : ''}
                  </span>
                )}
                {refuelResult?.status === 'within-range' && (
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                    non-stop
                  </span>
                )}
                {refuelResult?.status === 'impossible' && (
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-red-400/10 text-red-400 border border-red-400/20">
                    not possible
                  </span>
                )}
              </div>

              {/* No route / no aircraft set */}
              {(!refuelResult || refuelResult.status === 'no-data') && (
                <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-lg px-3 py-4 text-center">
                  <p className="text-xs text-slate-600">
                    {!origin || !destination
                      ? 'Set origin & destination first'
                      : !effectiveRange
                        ? 'Select an aircraft to calculate stops'
                        : 'Loading airport data…'}
                  </p>
                </div>
              )}

              {/* Impossible — no airport in range along the route */}
              {refuelResult?.status === 'impossible' && (
                <div className="rounded-lg px-3 py-2.5 bg-red-400/10 border border-red-400/20 text-xs text-red-400 text-center">
                  No viable route found — aircraft range too short to connect
                  available airports along this corridor.
                </div>
              )}

              {/* Within range — direct, no stops needed */}
              {refuelResult?.status === 'within-range' && (
                <div className="rounded-lg px-3 py-2.5 bg-emerald-400/10 border border-emerald-400/20 text-xs text-emerald-400 text-center">
                  Direct flight — destination is within range with a 10 % fuel reserve.
                </div>
              )}

              {/* Possible — render the route timeline */}
              {refuelResult?.status === 'possible' && (
                <div className="bg-slate-800/40 rounded-lg border border-slate-700/50 overflow-hidden">
                  {refuelResult.legs.map((leg, i) => {
                    const isRefuelStop = i > 0   // every "from" except origin is a stop
                    const isLast       = i === refuelResult.legs.length - 1

                    return (
                      <div key={`${leg.from.icao}-${leg.to.icao}`}>
                        {/* Waypoint row */}
                        <div className={`flex items-center gap-2 px-3 py-2 ${
                          isRefuelStop ? 'bg-amber-400/5' : ''
                        }`}>
                          <span className="font-mono text-xs font-bold text-white w-10 shrink-0">
                            {leg.from.icao}
                          </span>
                          <span className="text-xs text-slate-400 truncate flex-1">
                            {leg.from.city || leg.from.name}
                          </span>
                          {isRefuelStop && (
                            <span className="text-xs text-amber-400/80 shrink-0 flex items-center gap-1">
                              {/* Fuel pump icon */}
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.77 7.23l.01-.01-3.72-3.72-1.06 1.06 2.3 2.3c-.91.41-1.5 1.37-1.3 2.43.2 1.15 1.25 1.93 2.41 1.82.35-.03.67-.14.95-.3V17c0 .55-.45 1-1 1s-1-.45-1-1v-3c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v3c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 13.5H6v-5h6v5zm6-.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                              </svg>
                              refuel
                            </span>
                          )}
                        </div>

                        {/* Leg connector — distance + dashed line */}
                        <div className="flex items-center gap-2 pl-3 pr-3 py-1">
                          <div className="flex flex-col items-center gap-0.5 shrink-0 ml-3.5">
                            <div className="w-px h-1.5 bg-slate-700" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <div className="w-px h-1.5 bg-slate-700" />
                          </div>
                          <span className="text-xs text-slate-600 tabular-nums">
                            {leg.distanceNm.toLocaleString()} nm
                          </span>
                        </div>

                        {/* Render destination after the last connector */}
                        {isLast && (
                          <div className="flex items-center gap-2 px-3 py-2">
                            <span className="font-mono text-xs font-bold text-white w-10 shrink-0">
                              {leg.to.icao}
                            </span>
                            <span className="text-xs text-slate-400 truncate flex-1">
                              {leg.to.city || leg.to.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Total distance footer */}
                  <div className="flex justify-between items-center px-3 py-2 border-t border-slate-700/50 bg-slate-800/30">
                    <span className="text-xs text-slate-500">Total distance</span>
                    <span className="text-xs font-mono text-slate-300 tabular-nums">
                      {refuelResult.legs
                        .reduce((sum, l) => sum + l.distanceNm, 0)
                        .toLocaleString()} nm
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── Airport browser ────────────────────────────── */}
          <section className="space-y-2">
            {/* Header row: title + live record count */}
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Airports
              </h2>
              <span className="text-xs text-slate-600 tabular-nums">
                {airportsReady ? (
                  `${airports.length.toLocaleString()} airports`
                ) : airportsError ? (
                  'built-in fallback'
                ) : fetchProgress.total > 0 ? (
                  // Show a mini progress bar once we know the total
                  <span className="flex items-center gap-1.5">
                    <span className="relative w-16 h-1 rounded-full bg-slate-700 overflow-hidden">
                      <span
                        className="absolute inset-y-0 left-0 bg-sky-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round((fetchProgress.loaded / fetchProgress.total) * 100)}%` }}
                      />
                    </span>
                    <span>{fetchProgress.loaded.toLocaleString()}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                    counting…
                  </span>
                )}
              </span>
            </div>

            {/* Error notice */}
            {airportsError && (
              <p className="text-xs text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1.5">
                NTAD API unavailable — using built-in airport list.
              </p>
            )}

            {/* Search input */}
            <input
              type="text"
              value={airportSearch}
              onChange={(e) => setAirportSearch(e.target.value)}
              placeholder="Search ICAO, city, or name…"
              className="
                w-full bg-slate-800/70 border border-slate-700 rounded-lg
                px-3 py-1.5 text-xs text-white placeholder-slate-600
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40
                transition-colors
              "
            />

            {/* Airport list */}
            <div className="space-y-0.5 max-h-64 overflow-y-auto sidebar-scroll">
              {filteredAirports.length === 0 ? (
                <p className="text-xs text-slate-600 px-2 py-3 text-center">
                  {airports.length === 0 ? 'Loading…' : 'No airports match your search.'}
                </p>
              ) : (
                filteredAirports.map((ap) => (
                  <button
                    key={ap.icao}
                    onClick={() => {
                      if (!origin) setOriginIcao(ap.icao)
                      else         setDestIcao(ap.icao)
                    }}
                    className="
                      w-full text-left px-2 py-1 rounded
                      hover:bg-slate-800/60 transition-colors
                      flex items-baseline gap-2 min-w-0
                    "
                  >
                    <span className="text-slate-300 font-mono text-xs shrink-0">{ap.icao}</span>
                    <span className="text-slate-500 text-xs font-sans truncate">
                      {ap.city}{ap.state ? `, ${ap.state}` : ''}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* "Showing X of Y" hint when results are capped */}
            {filteredAirports.length === LIST_LIMIT && (
              <p className="text-xs text-slate-700 text-center">
                Showing first {LIST_LIMIT} — refine your search to narrow results.
              </p>
            )}
          </section>

        </div>
      )}
    </div>
  )
}
