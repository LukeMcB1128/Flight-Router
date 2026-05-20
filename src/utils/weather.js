/** 
 * all api data from https://api.weather.gov/
 * get latest metar code for airports
 * @param {string} icaoCode
 */

export async function getAirportWeather(icaoCode) {
    const url = `https://api.weather.gov/stations/${icaoCode}/observations/latest`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': '(FlightRouter, luke.brittain@gmail.com)',
                'Accept': 'application/geo+json'
            }
        });

        if (!response.ok) {
            throw new Error(`Weather API Error: ${response.status}`);
        }

        const data = await response.json();
        const props = data.properties;

        // convert speeds from km/h to knots and visibility from meters to miles
        return {
            rawMetar: props.rawMessage,
            windSpeedKts: props.windSpeed.value ? props.windSpeed.value * 0.539957 : null,
            windDirection: props.windDirection.value,
            visibilityMiles: props.visibility.value ? props.visibility.value * 0.000621371 : null,
        };
    } catch (error) {
        console.error("Failed to fetch METAR: ", error);
        return null;
    }
}