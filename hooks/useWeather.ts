import { useState, useCallback } from "react";
import * as Location from "expo-location";
import axios from "axios";
import Constants from "expo-constants";
import {
  WeatherData,
  LocationData,
  WeatherEvaluation,
  ErrorState,
} from "@/models/Weather";
import { WEATHER_THRESHOLDS } from "@/constants/WeatherThresholds";

const OPEN_WEATHER_API_KEY = Constants.expoConfig?.extra?.openWeatherApiKey;

export const useWeather = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const evaluateWeatherForPets = useCallback(
    (weatherData: WeatherData): WeatherEvaluation => {
      const conditions = {
        temperature: {
          isSafe:
            weatherData.main.temp >= WEATHER_THRESHOLDS.TEMPERATURE.MIN &&
            weatherData.main.temp <= WEATHER_THRESHOLDS.TEMPERATURE.MAX,
          message:
            weatherData.main.temp < WEATHER_THRESHOLDS.TEMPERATURE.MIN
              ? "Temperatura muy baja para tu mascota"
              : weatherData.main.temp > WEATHER_THRESHOLDS.TEMPERATURE.MAX
              ? "Temperatura muy alta para tu mascota"
              : "Temperatura agradable para pasear",
          icon: "🌡",
        },
        wind: {
          isSafe: weatherData.wind.speed < WEATHER_THRESHOLDS.WIND.MAX,
          message:
            weatherData.wind.speed >= WEATHER_THRESHOLDS.WIND.MAX
              ? "Viento muy fuerte, mejor esperar"
              : "Velocidad del viento adecuada",
          icon: "💨",
        },
        rain: {
          isSafe: !weatherData.weather[0].description.includes("lluvia"),
          message: weatherData.weather[0].description.includes("lluvia")
            ? "Está lloviendo, mejor esperar"
            : "No hay lluvia, buen momento para salir",
          icon: "☔️",
        },
        humidity: {
          isSafe: weatherData.main.humidity < WEATHER_THRESHOLDS.HUMIDITY.MAX,
          message:
            weatherData.main.humidity >= WEATHER_THRESHOLDS.HUMIDITY.MAX
              ? "Humedad alta, cuidado con el sobrecalentamiento"
              : "Nivel de humedad adecuado",
          icon: "💧",
        },
      };

      const isOverallSafe = Object.values(conditions).every((c) => c.isSafe);

      return {
        conditions,
        isOverallSafe,
        recommendation: isOverallSafe
          ? "¡Es un buen momento para pasear a tu mascota! 🐾"
          : "No es el mejor momento para pasear a tu mascota 🐾",
      };
    },
    []
  );

  const checkLocationServices = async () => {
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      throw new Error("LOCATION_SERVICE_DISABLED");
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("LOCATION_PERMISSION_DENIED");
    }
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      await checkLocationServices();
      await requestLocationPermission();

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(locationData);

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${locationData.coords.latitude}&lon=${locationData.coords.longitude}&units=metric&lang=es&appid=${OPEN_WEATHER_API_KEY}`
      );
      setWeather(response.data);
    } catch (error: any) {
      console.error("Error al obtener clima:", error);

      let errorState: ErrorState;

      if (error.message === "LOCATION_SERVICE_DISABLED") {
        errorState = {
          type: "LOCATION_SERVICE",
          message: "Los servicios de ubicación están desactivados",
          resolution:
            "Por favor, active los servicios de ubicación en la configuración de su dispositivo",
        };
      } else if (error.message === "LOCATION_PERMISSION_DENIED") {
        errorState = {
          type: "LOCATION_PERMISSION",
          message: "Permiso de ubicación denegado",
          resolution:
            "Esta aplicación necesita acceso a su ubicación para mostrar el clima local. Por favor, conceda el permiso en la configuración de su dispositivo",
        };
      } else if (axios.isAxiosError(error)) {
        errorState = {
          type: "NETWORK",
          message: "Error al conectar con el servicio meteorológico",
          resolution: "Verifique su conexión a Internet e intente nuevamente",
        };
      } else {
        errorState = {
          type: "UNKNOWN",
          message: "Ha ocurrido un error inesperado",
          resolution: "Por favor, intente nuevamente más tarde",
        };
      }

      setError(errorState);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWeather();
  }, []);

  return {
    weather,
    loading,
    error,
    refreshing,
    evaluateWeatherForPets,
    fetchWeather,
    onRefresh,
  };
};
