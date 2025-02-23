import { View, Text, Image, Pressable, Dimensions, StyleSheet, ViewStyle, TextStyle } from "react-native";
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

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  // Función auxiliar para manejar el flujo de OAuth
  const handleOAuthLogin = useCallback(
    async (startOAuthFlow: typeof startGoogleOAuthFlow) => {
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
    },
    [router, signOut]
  );

  const onPressGoogle = useCallback(async () => {
    await handleOAuthLogin(startGoogleOAuthFlow);
  }, [handleOAuthLogin, startGoogleOAuthFlow]);

  const onPressFacebook = useCallback(async () => {
    await handleOAuthLogin(startFacebookOAuthFlow);
  }, [handleOAuthLogin, startFacebookOAuthFlow]);

  return (
    <View style={styles.container}>
      <Image
        source={require("./../../assets/images/login.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Ready to make a friend?</Text>
      <Text style={styles.description}>
        Let's adopt the pet you like and make their life happy again.
      </Text>

      {/* Botón para login con Google */}
      <Pressable onPress={onPressGoogle} style={styles.googleButton}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </Pressable>

      {/* Botón para login con Facebook */}
      <Pressable onPress={onPressFacebook} style={styles.facebookButton}>
        <Text style={styles.buttonText}>Sign in with Facebook</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  image: {
    width: width * 0.9,
    height: width * 0.9,
    resizeMode: "cover",
    marginBottom: 30,
    borderRadius: 30,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 28,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontFamily: "outfit",
    fontSize: 16,
    textAlign: "center",
    color: Colors.GRAY,
    marginBottom: 40,
  },
  googleButton: {
    paddingVertical: 16,
    backgroundColor: "#4285F4", // Color característico de Google
    width: "100%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
  } as ViewStyle,
  facebookButton: {
    paddingVertical: 16,
    backgroundColor: "#1877F2", // Color característico de Facebook
    width: "100%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
  buttonText: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    textAlign: "center",
    color: Colors.WHITE,
  } as TextStyle,
});
