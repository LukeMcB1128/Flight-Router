// Database of aircraft types and their properties
// mostly small craft as no private pilot is flying a 737 etc
// range in nautical miles, speed in knots

export const AIRCRAFTS = {
    SR22: { type: 'Cirrus SR22', range: 1200, speed: 183, fuel_full: 92, fuel_burn_perhr: 14,fuel_unit: 'gallons', model: "G3-G7", MTOW: 3600, MLW: 3600, OEW: 2400, takeoff_distance: 1082, takeoff_distance_o_50ft: 1868, max_operating_altitude: 17500, landing_groundroll: 1178, takeoff_landing_max_measurement: 'ft'},
}

export function findAircraft(type) {
    if (!type) return null
    return aircrafts[type.toUpperCase()] ?? null
}