import { useUser } from "@clerk/clerk-expo";
import { Link, Redirect, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { user } = useUser();

  const rootNavigationState = useRootNavigationState();
  useEffect(() => {
    CheckNavLoaded();
  }, []);
  const CheckNavLoaded = () => {
    if (!rootNavigationState.key) {
      return null;
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {user ? (
        <Redirect href={"../(tabs)/home"} />
      ) : (
        <Redirect href={"../login"} />
      )}
    </View>
  );
}
