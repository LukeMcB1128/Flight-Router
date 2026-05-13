// Database of aircraft types and their properties
// mostly small craft as no private pilot is flying a 737 etc
// range in nautical miles, speed in knots

export const AIRCRAFTS = {
    SR22: { type: 'Cirrus SR22', range: 1200, speed: 183, fuel_full: 92, fuel_burn_perhr: 14, fuel_unit: 'gallons', model: "G3-G7", MTOW: 3600, MLW: 3600, OEW: 2400, weight_measurement: 'gallons', takeoff_distance_dry: 1082, max_operating_altitude: 17500, landing_ground_roll: 1178, takeoff_landing_max_measurement: 'ft'},
    C172: { type: 'Cessna 172', range: 545, speed: 140, fuel_full: 53, fuel_burn_perhr: 8, fuel_unit: 'gallons', model: "R", MTOW: 2550, MLW: 2550, OEW: 1600, weight_measurement: 'gallons', takeoff_distance_dry: 800, max_operating_altitude: 14000, landing_ground_roll: 600, takeoff_landing_max_measurement: 'ft'},
    PA28: { type: 'Piper PA-28', range: 700, speed: 130, fuel_full: 50, fuel_burn_perhr: 8, fuel_unit: 'gallons', model: "Cherokee", MTOW: 2550, MLW: 2550, OEW: 1600, weight_measurement: 'gallons', takeoff_distance_dry: 800, max_operating_altitude: 14000, landing_ground_roll: 600, takeoff_landing_max_measurement: 'ft'},
    C182: { type: 'Cessna 182', range: 930, speed: 145, fuel_full: 87, fuel_burn_perhr: 13, fuel_unit: 'gallons', model: "Skylane", MTOW: 3100, MLW: 2950, OEW: 2000, weight_measurement: 'gallons', takeoff_distance_dry: 795, max_operating_altitude: 18100, landing_ground_roll: 590, takeoff_landing_max_measurement: 'ft'},
    DA40: { type: 'Diamond DA40', range: 830, speed: 154, fuel_full: 39, fuel_burn_perhr: 8, fuel_unit: 'gallons', model: "NG", MTOW: 2888, MLW: 2822, OEW: 1984, weight_measurement: 'gallons', takeoff_distance_dry: 1574, max_operating_altitude: 16400, landing_ground_roll: 1066, takeoff_landing_max_measurement: 'ft'},
    PC12: { type: 'Pilatus PC-12', range: 1800, speed: 290, fuel_full: 402, fuel_burn_perhr: 66, fuel_unit: 'gallons', model: "NGX", MTOW: 10450, MLW: 9921, OEW: 6803, weight_measurement: 'gallons', takeoff_distance_dry: 2485, max_operating_altitude: 30000, landing_ground_roll: 2170, takeoff_landing_max_measurement: 'ft'},
    B350: { type: 'Beechcraft King Air', range: 1806, speed: 312, fuel_full: 539, fuel_burn_perhr: 100, fuel_unit: 'gallons', model: "350i", MTOW: 15000, MLW: 15000, OEW: 9955, weight_measurement: 'gallons', takeoff_distance_dry: 3300, max_operating_altitude: 35000, landing_ground_roll: 2692, takeoff_landing_max_measurement: 'ft'},
    C560: { type: 'Cessna Citation Excel', range: 1850, speed: 430, fuel_full: 1006, fuel_burn_perhr: 215, fuel_unit: 'gallons', model: "XLS+", MTOW: 20200, MLW: 18700, OEW: 12500, weight_measurement: 'gallons', takeoff_distance_dry: 3560, max_operating_altitude: 45000, landing_ground_roll: 3180, takeoff_landing_max_measurement: 'ft'},
    G650: { type: 'Gulfstream G650', range: 7500, speed: 516, fuel_full: 6597, fuel_burn_perhr: 475, fuel_unit: 'gallons', model: "ER", MTOW: 103600, MLW: 83500, OEW: 54000, weight_measurement: 'gallons', takeoff_distance_dry: 6299, max_operating_altitude: 51000, landing_ground_roll: 3000, takeoff_landing_max_measurement: 'ft'},
    GL75: { type: 'Bombardier Global 7500', range: 7700, speed: 516, fuel_full: 7687, fuel_burn_perhr: 500, fuel_unit: 'gallons', model: "7500", MTOW: 114850, MLW: 85800, OEW: 61400, weight_measurement: 'gallons', takeoff_distance_dry: 5800, max_operating_altitude: 51000, landing_ground_roll: 2520, takeoff_landing_max_measurement: 'ft'},
}

export function findAircraft(type) {
    if (!type) return null
    return AIRCRAFTS[type.toUpperCase()] ?? null
}