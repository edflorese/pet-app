import { View, Animated, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import Colors from "@/constants/Colors";

export default function FormSkeleton() {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.titleSkeleton,
          { opacity: animatedValue }
        ]} 
      />

      <Animated.View 
        style={[
          styles.imageSkeleton,
          { opacity: animatedValue }
        ]} 
      />

      {[1, 2, 3, 4, 5, 6, 7].map((index) => (
        <View key={index} style={styles.fieldContainer}>
          <Animated.View 
            style={[
              styles.labelSkeleton,
              { opacity: animatedValue }
            ]} 
          />
          <Animated.View 
            style={[
              styles.inputSkeleton,
              { opacity: animatedValue }
            ]} 
          />
        </View>
      ))}

      <Animated.View 
        style={[
          styles.buttonSkeleton,
          { opacity: animatedValue }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titleSkeleton: {
    height: 24,
    width: '60%',
    backgroundColor: Colors.GRAY,
    borderRadius: 4,
    marginBottom: 15,
  },
  imageSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: Colors.GRAY,
    marginBottom: 20,
  },
  fieldContainer: {
    marginVertical: 5,
  },
  labelSkeleton: {
    height: 16,
    width: '30%',
    backgroundColor: Colors.GRAY,
    borderRadius: 4,
    marginVertical: 5,
  },
  inputSkeleton: {
    height: 40,
    backgroundColor: Colors.GRAY,
    borderRadius: 7,
  },
  buttonSkeleton: {
    height: 50,
    backgroundColor: Colors.GRAY,
    borderRadius: 7,
    marginVertical: 10,
    marginBottom: 50,
  },
});