import { useState, useEffect } from 'react';
import { getAirportWeather } from '../utils/weather';

// use this for multiple airports

export function useRouteWeather(icaoCodes) {
    const [weatherMap, setWeatherMap] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const key = icaoCodes.join(',');

    useEffect(() => {
        if (!icaoCodes.length) return;

        let isMounted = true;

        const fetchAll = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const results = await Promise.all(
                    icaoCodes.map(icao => getAirportWeather(icao))
                );

                if (isMounted) {
                    const map = {};
                    icaoCodes.forEach((icao, i) => {
                        map[icao] = results[i];
                    });
                    setWeatherMap(map);
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchAll();

        return () => {
            isMounted = false;
        };
    }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

    return { weatherMap, isLoading, error };
}
