import { useState, useEffect} from 'react';
import { getAirportWeather } from '../utils/weather';

export function useWeather(icaoCode) {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!icaoCode) return;

        let isMounted = true;

        const fetchWeather = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getAirportWeather(icaoCode);
                if (isMounted) setWeatherData(data);
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchWeather();

        return () => {
            isMounted = false;
        };
    }, [icaoCode]);

    return { weatherData, isLoading, error };
}