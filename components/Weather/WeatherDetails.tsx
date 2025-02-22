import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WeatherData } from "@/models/Weather";

interface WeatherDetailsProps {
  weather: WeatherData;
}

export const WeatherDetails = ({ weather }: WeatherDetailsProps) => (
  <View style={styles.detailsContainer}>
    <Text style={styles.detailText}>
      Viento: {weather.wind.speed.toFixed(2)} m/s
    </Text>
    <Text style={styles.detailText}>Humedad: {weather.main.humidity}%</Text>
    <Text style={styles.detailText}>
      Sensación: {weather.main.feels_like.toFixed(1)}°C
    </Text>
    <Text style={styles.detailText}>
      Mín/Máx: {weather.main.temp_min.toFixed(1)}°C /{" "}
      {weather.main.temp_max.toFixed(1)}°C
    </Text>
  </View>
);

const styles = StyleSheet.create({
  detailsContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailText: {
    fontSize: 18,
    fontFamily: "outfit",
    marginVertical: 5,
  },
});
