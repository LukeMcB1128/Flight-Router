/**
 * ViewModeSwitcher — floating pill buttons overlaid on the map pane.
 * Lets the user switch between Globe, US Map, and Region views.
 */

const MODES = [
  { key: 'us-map', label: 'Map',    icon: '🗺️'  },
  { key: 'region', label: 'Region', icon: '🔍'  },
]

export default function ViewModeSwitcher({ viewMode, setViewMode }) {
  return (
    <div className="absolute top-4 right-4 z-[9999] flex rounded-lg overflow-hidden border border-slate-700 shadow-lg">
      {MODES.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => setViewMode(key)}
          title={label}
          className={[
            'flex items-center gap-1.5 px-3 py-2 text-xs font-medium',
            'backdrop-blur-md transition-colors duration-150 select-none',
            viewMode === key
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800',
          ].join(' ')}
        >
          <span aria-hidden="true">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
