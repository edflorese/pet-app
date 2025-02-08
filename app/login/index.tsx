import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback } from "react";
import Colors from "@/constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

// Define an interface for Clerk errors
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
      //ensure we're signed out to prevent session conflicts
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

      // Check if it's a session exists error
      const sessionExistsError = error.errors?.some(
        (e) =>
          e.code === "session_exists" || e.message?.includes("session_exists")
      );

      if (sessionExistsError) {
        try {
          await signOut();
          // Retry login after signing out
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
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Image
        source={require("./../../assets/images/login.png")}
        style={{
          width: "100%",
          height: 500,
        }}
      />
      <View
        style={{
          padding: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 30,
          }}
        >
          Ready to make a friend?
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 18,
            textAlign: "center",
            color: Colors.GRAY,
          }}
        >
          Let's adopt the pet which you like and make their life happy again
        </Text>
        <Pressable
          onPress={onPress}
          style={{
            padding: 14,
            marginTop: 100,
            backgroundColor: Colors.PRIMARY,
            width: "100%",
            borderRadius: 14,
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
    </View>
  );
}
