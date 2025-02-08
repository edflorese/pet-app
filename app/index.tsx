import { useUser } from "@clerk/clerk-expo";
import { Redirect, useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  const { user } = useUser();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    if (user) {
      router.replace("../(tabs)/home");
    } else {
      router.replace("../login");
    }
  }, [user, rootNavigationState]);

  return <View style={{ flex: 1 }} />;
}
