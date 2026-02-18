import { useState, useEffect } from 'react';

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeatherData = async (latitude, longitude) => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=af9ab0eda35ad9ffda94525001bd3eab&units=metric`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setWeatherData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching weather data, using fallback location:", error);
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=42.6977&lon=23.3219&appid=af9ab0eda35ad9ffda94525001bd3eab&units=metric`);
                if (response.ok) {
                    const data = await response.json();
                    setWeatherData(data);
                }
                setLoading(false);
            }
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherData(latitude, longitude);
                    },
                    () => {
                        // Sofia
                        fetchWeatherData(42.6977, 23.3219);
                    }
                );
            } else {
                // Sofia
                fetchWeatherData(42.6977, 23.3219);
            }
        };

        getLocation();
    }, []);

    const getFormattedDate = () => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center">
            <div className="flex flex-col bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl">
                <div className="font-bold text-xl">{weatherData.name}</div>
                <div className="text-sm text-gray-500">{getFormattedDate()}</div>
                <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
                    <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                </div>
                <div className="flex flex-row items-center justify-center mt-6">
                    <div className="font-medium text-6xl">{Math.round(weatherData.main.temp)}°</div>
                    <div className="flex flex-col items-center ml-6">
                        <div>{weatherData.weather[0].description}</div>
                        <div className="mt-1">
                            <span className="text-sm"><i className="far fa-long-arrow-up"></i></span>
                            <span className="text-sm font-light text-gray-500">{Math.round(weatherData.main.temp_max)}°C</span>
                        </div>
                        <div>
                            <span className="text-sm"><i className="far fa-long-arrow-down"></i></span>
                            <span className="text-sm font-light text-gray-500">{Math.round(weatherData.main.temp_min)}°C</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between mt-6">
                    <div className="flex flex-col items-center">
                        <div className="font-medium text-sm">Wind</div>
                        <div className="text-sm text-gray-500">{weatherData.wind.speed} k/h</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="font-medium text-sm">Humidity</div>
                        <div className="text-sm text-gray-500">{weatherData.main.humidity}%</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="font-medium text-sm">Visibility</div>
                        <div className="text-sm text-gray-500">{weatherData.visibility / 1000} km</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherComponent;
