import { View, Text, Image, Pressable, Dimensions } from "react-native";
import React, { useCallback } from "react";
import Colors from "@/constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

const { width } = Dimensions.get("window");

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

interface ClerkError {
  status: number;
  message?: string;
  clerkError: boolean;
  errors?: Array<{
    code: string;
    message: string;
    longMessage?: string;
  }>;
}

export default function LoginScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { signOut } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      await signOut();

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.push("/(tabs)/home");
      }
    } catch (err) {
      const error = err as ClerkError;
      console.error("Login error:", error);

      const sessionExistsError = error.errors?.some(
        (e) =>
          e.code === "session_exists" || e.message?.includes("session_exists")
      );

      if (sessionExistsError) {
        try {
          await signOut();
          const { createdSessionId, setActive } = await startOAuthFlow({
            redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
          });

          if (createdSessionId && setActive) {
            await setActive({ session: createdSessionId });
            router.push("/(tabs)/home");
          }
        } catch (retryErr) {
          const retryError = retryErr as ClerkError;
          console.error("Retry login error:", retryError);
        }
      }
    }
  }, [startOAuthFlow, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../../assets/images/login.png")}
        style={{
          width: width * 0.9,
          height: width * 0.9,
          resizeMode: "cover",
          marginBottom: 30,
          borderRadius: 30,
        }}
      />
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 28,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Ready to make a friend?
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 16,
          textAlign: "center",
          color: Colors.GRAY,
          marginBottom: 40,
        }}
      >
        Let's adopt the pet you like and make their life happy again.
      </Text>
      <Pressable
        onPress={onPress}
        style={{
          paddingVertical: 16,
          backgroundColor: Colors.PRIMARY,
          width: "100%",
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 20,
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Get started!
        </Text>
      </Pressable>
    </View>
  );
}
