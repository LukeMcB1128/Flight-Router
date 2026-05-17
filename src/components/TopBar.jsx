export default function TopBar({ origin, destination, refuelResult }) {
  // Hide entirely until both endpoints are set
  if (!origin || !destination) return null

  const status = refuelResult?.status

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-10 overflow-x-auto">

      {/* ── Route chain ─────────────────────────────────────────────────────── */}
      {/* within-range or possible: render the full leg chain */}
      {(status === 'within-range' || status === 'possible') && refuelResult.legs.length > 0 && (
        <div className="flex items-center gap-0 flex-nowrap min-w-0">
          {refuelResult.legs.map((leg, i) => {
            const isFirst = i === 0
            const isLast  = i === refuelResult.legs.length - 1
            const isStop  = !isFirst  // intermediate stop origin nodes
            return (
              <span key={`${leg.from.icao}-${leg.to.icao}`} className="flex items-center">
                {/* From node */}
                <span
                  className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                    isFirst || isStop
                      ? isFirst
                        ? 'text-white font-semibold'           // origin
                        : 'text-amber-300 font-medium'         // refuel stop
                      : 'text-white font-semibold'
                  }`}
                >
                  {leg.from.icao}
                </span>

                {/* Distance + arrow */}
                <span className="text-slate-600 text-xs px-1.5 whitespace-nowrap">
                  {leg.distanceNm} nm →
                </span>

                {/* Destination node on the last leg */}
                {isLast && (
                  <span className="font-mono text-xs text-white font-semibold px-1.5 py-0.5 rounded">
                    {leg.to.icao}
                  </span>
                )}
              </span>
            )
          })}
        </div>
      )}

      {/* no-data: waiting on aircraft selection */}
      {(status === 'no-data' || !status) && (
        <span className="text-xs text-slate-500 font-mono">
          {origin.icao}
          <span className="text-slate-700 mx-2">→</span>
          {destination.icao}
        </span>
      )}

      {/* impossible: show faded chain + badge */}
      {status === 'impossible' && (
        <span className="text-xs text-slate-600 font-mono">
          {origin.icao}
          <span className="text-slate-700 mx-2">→</span>
          {destination.icao}
        </span>
      )}

      {/* ── Edge-case badges (non-stop / impossible only) ───────────────────── */}
      {status === 'within-range' && (
        <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
          non-stop
        </span>
      )}
      {status === 'impossible' && (
        <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 border border-red-400/20">
          out of range
        </span>
      )}
    </div>
  )
}