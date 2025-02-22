import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { WeatherCondition } from "@/models/Weather";

interface WeatherConditionCardProps {
  condition: WeatherCondition;
}

export const WeatherConditionCard = ({
  condition,
}: WeatherConditionCardProps) => (
  <View
    style={[
      styles.conditionCard,
      { borderColor: condition.isSafe ? Colors.PRIMARY : "#e11d48" },
    ]}
  >
    <Text style={styles.conditionIcon}>{condition.icon}</Text>
    <Text
      style={[
        styles.conditionText,
        { color: condition.isSafe ? "green" : "#e11d48" },
      ]}
    >
      {condition.message}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  conditionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  conditionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  conditionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfit",
  },
});
