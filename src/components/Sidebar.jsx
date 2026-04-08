import { useState } from 'react'
import { AIRPORTS } from '../data/airports'
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
  const isValid   = resolvedAirport !== null
  const hasInput  = value.trim().length > 0

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

/**
 * Sidebar — collapsible left panel with route inputs and results.
 *
 * Props:
 *   originIcao, setOriginIcao
 *   destIcao,   setDestIcao
 *   aircraftType, setAircraftType
 *   origin, destination   — resolved airport objects
 *   distanceNm            — great-circle distance or null
 *   onCalculate           — called when Calculate Route is pressed
 */
export default function Sidebar({
  originIcao, setOriginIcao,
  destIcao,   setDestIcao,
  aircraftType, setAircraftType,
  origin, destination,
  distanceNm,
  onCalculate,
}) {
  const [open, setOpen] = useState(true)

  {aircraftType && (
    <p className="text-xs text-slate-400">
      Max range {aircraftType.range.toLocaleString()} nm · {aircraftType.speed} kts
    </p>
  )}

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
      {/* Collapse toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="
          absolute -right-3 top-6 z-20
          w-6 h-6 rounded-full
          bg-slate-800 border border-slate-700
          flex items-center justify-center
          text-slate-400 hover:text-white
          hover:bg-slate-700 transition-colors
        "
        title={open ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <ChevronIcon open={open} />
      </button>

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
            <select value={aircraftType} onChange={e => setAircraftType(e.target.value)}>
              <option value="">Select aircraft</option>
              {Object.entries(AIRCRAFTS).map(([key, ac]) => (
              <option key={key} value={key}>{ac.type}</option>
              ))}
            </select>
          </section>

          {/* ── Calculate button ───────────────────────────── */}
          <button
            onClick={onCalculate}
            disabled={!origin || !destination}
            className="
              w-full py-2.5 rounded-lg text-sm font-semibold
              bg-blue-600 hover:bg-blue-500 active:bg-blue-700
              disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed
              text-white transition-colors
            "
          >
            Calculate Route
          </button>

          {/* ── Results ────────────────────────────────────── */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Results
            </h2>

            {/* Distance */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Great-circle distance
              </p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {distanceNm !== null
                  ? <>{distanceNm.toLocaleString()}<span className="text-sm font-normal text-slate-400 ml-1">nm</span></>
                  : <span className="text-slate-600 text-base font-normal">—</span>
                }
              </p>
            </div>

            {/* Range status */}
            <div className={`
              rounded-lg px-3 py-2 border text-sm font-medium
              ${rangeStatus
                ? rangeColor[rangeStatus]
                : 'text-slate-600 bg-slate-800/30 border-slate-700/30'}
            `}>
              {rangeStatus ? rangeLabel[rangeStatus] : 'Set a route to check range'}
            </div>

            {/* Refuel stops placeholder */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Refuel stops
              </p>
              <div className="bg-slate-800/30 border border-dashed border-slate-700/50 rounded-lg px-3 py-4 text-center">
                <p className="text-xs text-slate-600">
                  {distanceNm !== null
                    ? 'Refuel stop calculation coming soon'
                    : 'Set origin & destination first'}
                </p>
              </div>
            </div>
          </section>

          {/* ── Known airports hint ────────────────────────── */}
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Sample airports
            </h2>
            <div className="space-y-1">
              {Object.values(AIRPORTS).map((ap) => (
                <button
                  key={ap.icao}
                  onClick={() => {
                    if (!origin) setOriginIcao(ap.icao)
                    else setDestIcao(ap.icao)
                  }}
                  className="
                    w-full text-left px-2 py-1 rounded
                    text-xs text-slate-500 hover:text-slate-200
                    hover:bg-slate-800/60 transition-colors
                    font-mono
                  "
                >
                  <span className="text-slate-300">{ap.icao}</span>
                  <span className="ml-2 font-sans not-italic">{ap.city}</span>
                </button>
              ))}
            </div>
          </section>

        </div>
      )}
    </div>
  )
}
