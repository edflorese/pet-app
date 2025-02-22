export interface WeatherData {
  name: string;
  weather: { description: string; icon: string }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: { speed: number; deg: number };
}

export interface LocationData {
  coords: { latitude: number; longitude: number };
}

export interface WeatherCondition {
  isSafe: boolean;
  message: string;
  icon: string;
}

export interface WeatherEvaluation {
  conditions: {
    temperature: WeatherCondition;
    wind: WeatherCondition;
    rain: WeatherCondition;
    humidity: WeatherCondition;
  };
  isOverallSafe: boolean;
  recommendation: string;
}

export interface ErrorState {
  message: string;
  type: 'LOCATION_PERMISSION' | 'LOCATION_SERVICE' | 'NETWORK' | 'UNKNOWN';
  resolution?: string;
}