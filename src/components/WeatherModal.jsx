import { useEffect } from 'react';
import { useRouteWeather } from '../hooks/useRouteWeather';

export default function WeatherModal({ icao, onClose }) {
    const { weatherMap, isLoading } = useRouteWeather(icao ? [icao] : [])
    const wx = weatherMap?.[icao]

    // close this on escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler);
    }, [onClose])

    return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
            <div
              className="relative w-full max-w-sm mx-4 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">Weather</h2>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{icao} - METAR</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-color p-1 rounded-lg hover:bg-slate-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="border-t border-slate-800" />

                {/* body */}
                {isLoading ? (
                    <p className="text-xs font-mono text-slate-500 animate-pulse">Fetching METAR…</p>
                ) : !wx ? (
                    <p className="text-xs font-mono text-slate-500">No weather data available for {icao}.</p>
                ) : (
                    <div className="space-y-2"> 
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Conditions</p>
                        {[
                            {
                                label: 'Wind',
                                value: `${wx.windDirection !== null ? Math.round(wx.windDirection) : 'VRB'}° @ ${wx.windSpeedKts !== null ? Math.round(wx.windSpeedKts) : 0} kt`,
                            },
                            {
                                label: 'Temperature',
                                value: `${wx.temp}°C`,
                            },
                            {
                                label: 'Visibility',
                                value: wx.visibilityMiles != null ? `${wx.visibilityMiles.toFixed(1)} SM` : 'N/A',
                            },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                className="flex justify-betwen items-center bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2"
                            >
                                <span className="text-xs text-slate-400">{label}</span>
                                <span className="text-xs font-mono text-white">{value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* bottom */}
                <div className="flex justify-end pt-1">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}