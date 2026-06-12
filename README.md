# Flight Router

A comprehensive flight planning tool for private and hobbyist pilots. Plan routes, calculate fuel requirements, find refueling stops, and visualize flights on interactive maps with real-time weather data.

## Features

### Dual Map Views
- **US Map View**: Detailed Leaflet-based map of the continental United States
- **Globe View**: 3D WebGL globe visualization for worldwide flight planning (being fixed, currently removed in current build(1.1.1))

### Route Planning
- Search airports by ICAO code with real-time validation
- Calculate great-circle distances between airports
- Distance displayed in nautical miles (nautical-relevant for pilots)
- Access to ~15,000 US airports from the USDA NTAD Aviation Facilities database

### Intelligent Refueling
- Automatic calculation of optimal refueling stops
- Greedy algorithm minimizes stops while respecting aircraft range
- Considers fuel reserve requirements (default 10%)
- Real-time updates as fuel load changes
- Displays leg distances and stop sequence

### Aircraft Database
- 10 aircraft profiles from Cessna 172 to Bombardier Global 7500
- Per-aircraft specifications:
  - Range and cruise speed
  - Fuel capacity and burn rate
  - Max takeoff weight (MTOW), operating empty weight (OEW)
  - Max landing weight (MLW)
  - Takeoff/landing distances
  - Service ceiling

### Weight & Balance Calculations
- Real-time weight calculations based on fuel load
- Payload/cargo management
- Weight status indicators (within limits, caution, overweight)
- Auto-clamping of payload when fuel load increases

### Weather Integration
- Real-time weather data for origin and destination airports
- Weather modal with detailed METAR information (coming soon)
- Wind and visibility forecasts (future enhancement)

### Effective Range Computation
- Calculates usable range based on:
  - Aircraft specifications
  - Current fuel load
  - Payload weight
  - Reserve fuel requirements
- Dynamic updates as parameters change

## Tech Stack

- **Frontend Framework**: React 18.3
- **Build Tool**: Vite 6.3
- **Styling**: Tailwind CSS 3.4
- **Maps**: Leaflet 1.9.4 + React-Leaflet 4.2.1
- **3D Visualization**: Globe.gl 2.31
- **Language**: JavaScript (ES modules)
- **PostCSS**: Autoprefixer for CSS compatibility

## Project Structure

```
src/
├── components/          # React components
│   ├── MapView.jsx     # Map/Globe container & switcher
│   ├── LeafletMap.jsx  # US map with route overlay
│   ├── Sidebar.jsx     # Route input & flight parameters
│   ├── TopBar.jsx      # Route info & weather display
│   ├── WeatherModal.jsx # Weather details popup
│   └── ViewModeSwitcher.jsx # Map/Globe toggle
├── hooks/              # Custom React hooks
│   ├── useRoute.js     # Route state & calculations
│   ├── useWeather.js   # Weather data fetching
│   └── useRouteWeather.js # Weather for route endpoints
├── utils/              # Utility functions
│   ├── routePlanning.js # Refueling stop algorithm
│   ├── weather.js      # Weather API integration
│   └── geo.js          # Geographic calculations
├── data/               # Static data & fetch logic
│   ├── airports.js     # NTAD airport dataset fetching
│   └── aircrafts.js    # Aircraft specifications database
├── App.jsx             # Root component
├── main.jsx            # React entry point
└── index.css           # Global styles

public/
└── plane.svg           # Favicon

vite.config.js          # Vite configuration
tailwind.config.js      # Tailwind CSS config
postcss.config.js       # PostCSS config
package.json            # Dependencies & scripts
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/LukeMcB1128/Flight-Router.git
cd Flight-Router

# Install dependencies
npm install
```

### Development

```bash
# Start the development server (http://localhost:5173)
npm run dev
```

The app will automatically reload when you make changes.

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

## Usage Guide

### 1. Select Aircraft
- Choose an aircraft from the dropdown in the sidebar
- Aircraft specs (range, fuel capacity, weight limits) update automatically

### 2. Enter Route
- Type origin ICAO code (e.g., "KJFK" for New York)
- Type destination ICAO code
- Route distance displays in nautical miles
- Autocomplete searches ~15,000 US airports (or fallback to ~60 hardcoded airports)

### 3. Configure Fuel & Payload
- **Fuel**: Adjust from empty to full tank capacity
- **Payload**: Set cargo/passenger weight
- **Effective Range**: Updates based on fuel load and weight
- **Weight Status**: Visual indicator for weight limits

### 4. Review Refueling Stops
- Automatic stops calculated if route exceeds range
- Each stop shows distance from previous leg
- Stops displayed on both map and globe views
- Respects 10% fuel reserve at each stop

### 5. Check Weather
- Click weather icon or hover to see conditions
- Displays METAR for origin/destination
- Real-time data from weather API

### 6. Switch Views
- Toggle between US Map (Leaflet) and Globe (WebGL)
- Route, refuel stops, and origin/destination visible on both

## Aircraft Database

### Included Aircraft

| Aircraft | Range | Cruise Speed | Fuel Capacity | MTOW |
|----------|-------|--------------|---------------|------|
| Cessna 172 | 545 nm | 140 kts | 53 gal | 2,550 lbs |
| Piper PA-28 | 700 nm | 130 kts | 50 gal | 2,550 lbs |
| Cessna 182 | 930 nm | 145 kts | 87 gal | 3,100 lbs |
| Cirrus SR22 | 1,200 nm | 183 kts | 92 gal | 3,600 lbs |
| Diamond DA40 | 830 nm | 154 kts | 39 gal | 2,888 lbs |
| Pilatus PC-12 | 1,800 nm | 290 kts | 402 gal | 10,450 lbs |
| Beechcraft King Air | 1,806 nm | 312 kts | 539 gal | 15,000 lbs |
| Cessna Citation Excel | 1,850 nm | 430 kts | 1,006 gal | 20,200 lbs |
| Gulfstream G650 | 7,500 nm | 516 kts | 6,597 gal | 103,600 lbs |
| Bombardier Global 7500 | 7,700 nm | 516 kts | 7,687 gal | 114,850 lbs |

### Extending the Database

Edit `src/data/aircrafts.js` to add new aircraft:

```javascript
export const AIRCRAFTS = {
  // ... existing aircraft
  YOUR_AIRCRAFT: {
    type: 'Aircraft Name',
    range: 1000,           // nautical miles
    speed: 150,            // knots
    fuel_full: 100,        // gallons
    fuel_burn_perhr: 12,   // gallons per hour
    MTOW: 5000,            // max takeoff weight
    OEW: 3000,             // operating empty weight
    MLW: 5000,             // max landing weight
    takeoff_distance_dry: 1500,  // feet
    max_operating_altitude: 20000, // feet
    landing_ground_roll: 1000,  // feet
    model: "Variant"
  }
}
```

## Algorithm Details

### Refueling Stop Calculation

The app uses a **greedy nearest-neighbor algorithm** with bounding-box optimization:

1. **Bounding Box Pre-filter**: Discard airports outside a padded rectangle around the route (reduces ~15,000 airports → ~200-500 candidates)
2. **Greedy Selection**: From current position, find the airport that:
   - Is within usable range (effectiveRange × 0.9)
   - Makes forward progress toward destination
   - Minimizes remaining distance
3. **Repeat**: Continue until destination is reachable

**Result**: Optimal refueling stops in <1ms for typical CONUS routes

### Distance Calculation

Uses the **Haversine formula** for great-circle distance:
- Accounts for Earth's curvature
- Exact for flight planning (pilots use nautical miles)
- Faster than Vincenty formula for typical distances

## Development Tips

### Adding a New Component
1. Create file in `src/components/`
2. Use React hooks (state, effects, callbacks)
3. Import Tailwind classes for styling
4. Export as default export

### Adding a New Hook
1. Create file in `src/hooks/`
2. Follow React Hooks conventions
3. Document with JSDoc comments
4. Export function, not default

### Debugging

- Open browser DevTools (F12 or Cmd+Option+I)
- Check Console for warnings about airports/aircraft
- Use React DevTools extension to inspect component state

### Performance

- Refueling algorithm runs synchronously but completes in <1ms
- Bounding-box pre-filter handles ~15,000 airports efficiently
- Lazy-load airport database on app startup (shows fallback while fetching)

## Future Enhancements

- [ ] Click on globe/map to snap to nearest airport
- [ ] Wind aloft integration for more accurate range
- [ ] Detailed weather sidebar with TAF/SIGMET
- [ ] Flight plan export (GPX, FPL formats)
- [ ] Real-time traffic layer (ADS-B)
- [ ] Airspace visualization (Class B, C, D, MOAs)
- [ ] Runway length filtering for aircraft constraints
- [ ] Customizable aircraft profiles (save presets)
- [ ] Mobile-responsive design improvements
- [ ] International airport support (ICAO database expansion)

## Troubleshooting

### Airport Not Found
- Verify ICAO code (4-character US airport codes)
- Check spelling (codes are case-insensitive)
- If using hardcoded fallback, only ~60 major airports are available

### Refueling Stops Not Showing
- Ensure aircraft selected
- Destination must be beyond aircraft range
- Check browser console for errors

### Weather Not Loading
- Confirm origin/destination are valid
- Weather API may have rate limits
- Check network tab in DevTools

### Map Not Rendering
- Ensure WebGL is enabled in browser
- Try Globe View if Leaflet map hangs
- Clear browser cache and reload

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact & Support

For questions, issues, or suggestions:
- Open an [issue on GitHub](https://github.com/LukeMcB1128/Flight-Router/issues)
- Contact: [luke.brittain@gmail.com]

---

**Happy flying!**
