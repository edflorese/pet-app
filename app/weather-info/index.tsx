import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Button,
  RefreshControl,
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import { useWeather } from "@/hooks/useWeather";
import { WeatherConditionCard } from "@/components/Weather/WeatherConditionCard";
import { WeatherDetails } from "@/components/Weather/WeatherDetails";
import { useNavigation } from "expo-router";

export default function WeatherInfo() {
  const {
    weather,
    loading,
    error,
    refreshing,
    evaluateWeatherForPets,
    fetchWeather,
    onRefresh,
  } = useWeather();
  const navigation = useNavigation();

  useEffect(() => {
    fetchWeather();
    navigation.setOptions({
      headerTitle: "Time to Walk?",
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>
          Obteniendo información del clima...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{error.message}</Text>
          {error.resolution && (
            <Text style={styles.errorResolution}>{error.resolution}</Text>
          )}
          <Button
            title="Reintentar"
            onPress={fetchWeather}
            color={Colors.PRIMARY}
          />
        </View>
      </View>
    );
  }

  const evaluation = weather ? evaluateWeatherForPets(weather) : null;

  return (
    <ScrollView
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.locationText}>{weather?.name}</Text>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${weather?.weather[0].icon}@4x.png`,
          }}
          style={styles.weatherIcon}
        />
        <Text style={styles.temperatureText}>
          {weather?.main.temp.toFixed(1)}°C
        </Text>
        <Text style={styles.descriptionText}>
          {weather?.weather[0].description}
        </Text>

        {evaluation && (
          <View style={styles.petAdviceContainer}>
            <Text
              style={[
                styles.recommendationText,
                {
                  color: evaluation.isOverallSafe ? Colors.PRIMARY : "#e11d48",
                },
              ]}
            >
              {evaluation.recommendation}
            </Text>

            <View style={styles.conditionsContainer}>
              {Object.values(evaluation.conditions).map((condition, index) => (
                <WeatherConditionCard
                  key={`condition-${index}`}
                  condition={condition}
                />
              ))}
            </View>
          </View>
        )}

        {weather && <WeatherDetails weather={weather} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 40,
  },
  locationText: {
    fontSize: 32,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  weatherIcon: {
    width: 180,
    height: 180,
  },
  temperatureText: {
    fontSize: 64,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginVertical: 10,
  },
  descriptionText: {
    fontSize: 24,
    fontFamily: "outfit",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: "outfit",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorTitle: {
    fontSize: 18,
    color: "#e11d48",
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginBottom: 10,
  },
  errorResolution: {
    fontSize: 16,
    color: "#666",
    fontFamily: "outfit",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  petAdviceContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendationText: {
    fontSize: 22,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginBottom: 20,
  },
  conditionsContainer: {
    width: "100%",
    gap: 12,
  },
});
