import { Link, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function Index() {
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
      <Link href={"../login"}>
        <Text>Go to Login Screen</Text>
      </Link>
    </View>
  );
}
