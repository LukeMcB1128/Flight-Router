export default function FlightPlannerModal({
  aircraft,
  fuelGallons,
  payloadLbs,
  maxPayloadLbs,
  fuelWeightLbs,
  totalWeightLbs,
  weightStatus,
  effectiveRange,
  onFuelChange,
  onPayloadChange,
  onClose,
}) {
  const isOverMTOW = weightStatus === 'over-mtow'

  return (
    // Backdrop
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
      
      {/* Modal card */}
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-[420px] p-6 text-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold tracking-wide">Flight Planner</h2>
            <p className="text-xs text-white/40 mt-0.5">{aircraft?.type ?? 'No aircraft selected'}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Fuel Section */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-white/50 mb-2">
            <span className="uppercase tracking-widest">Fuel Load</span>
            <span>{fuelGallons} gal · {fuelWeightLbs} lbs</span>
          </div>
          <input
            type="range"
            min={0}
            max={aircraft?.fuel_full ?? 100}
            step={1}
            value={fuelGallons}
            onChange={(e) => onFuelChange(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>0 gal</span>
            <span>{aircraft?.fuel_full ?? '—'} gal (full)</span>
          </div>
        </div>

        {/* Payload Section */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-white/50 mb-2">
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
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>0 lbs</span>
            <span>{maxPayloadLbs} lbs (max)</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-4" />

        {/* Weight Summary */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between text-white/50">
            <span>Empty Weight (OEW)</span>
            <span>{aircraft?.OEW?.toLocaleString()} lbs</span>
          </div>
          <div className="flex justify-between text-white/50">
            <span>Fuel</span>
            <span>{fuelWeightLbs?.toLocaleString()} lbs</span>
          </div>
          <div className="flex justify-between text-white/50">
            <span>Payload</span>
            <span>{payloadLbs?.toLocaleString()} lbs</span>
          </div>
          <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span className={isOverMTOW ? 'text-red-400' : 'text-white'}>
              {totalWeightLbs?.toLocaleString()} lbs
            </span>
          </div>
          <div className="flex justify-between text-white/30 text-xs">
            <span>MTOW limit</span>
            <span>{aircraft?.MTOW?.toLocaleString()} lbs</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className={`rounded-lg px-4 py-2 text-sm text-center font-medium ${
          isOverMTOW
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          {isOverMTOW
            ? `⚠ Over MTOW by ${(totalWeightLbs - aircraft?.MTOW).toLocaleString()} lbs`
            : `✓ Within limits — ${effectiveRange} nm range`
          }
        </div>

      </div>
    </div>
  )
}