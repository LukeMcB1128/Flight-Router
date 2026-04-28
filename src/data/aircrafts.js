// Database of aircraft types and their properties
// mostly small craft as no private pilot is flying a 737 etc
// range in nautical miles, speed in knots

export const AIRCRAFTS = {
    SR22: { type: 'Cirrus SR22', range: 1200, speed: 183, fuel_full: 92, fuel_burn_perhr: 14, fuel_unit: 'gallons', model: "G3-G7", MTOW: 3600, MLW: 3600, OEW: 2400, weight_measurement: 'lbs', takeoff_distance_dry: 1082, max_operating_altitude: 17500, landing_ground_roll: 1178, takeoff_landing_max_measurement: 'ft'},
    C172: { type: 'Cessna 172', range: 545, speed: 140, fuel_full: 53, fuel_burn_perhr: 8, fuel_unit: 'gallons', model: "R", MTOW: 2550, MLW: 2550, OEW: 1600, weight_measurement: 'lbs', takeoff_distance_dry: 800, max_operating_altitude: 14000, landing_ground_roll: 600, takeoff_landing_max_measurement: 'ft'},
    PA28: { type: 'Piper PA-28', range: 700, speed: 130, fuel_full: 50, fuel_burn_perhr: 8, fuel_unit: 'gallons', model: "Cherokee", MTOW: 2550, MLW: 2550, OEW: 1600, weight_measurement: 'lbs', takeoff_distance_dry: 800, max_operating_altitude: 14000, landing_ground_roll: 600, takeoff_landing_max_measurement: 'ft'},
}

export function findAircraft(type) {
    if (!type) return null
    return AIRCRAFTS[type.toUpperCase()] ?? null
}