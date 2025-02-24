import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useCallback, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Fontisto } from "@expo/vector-icons";

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
  const { signOut, isSignedIn, getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({
    strategy: "oauth_facebook",
  });

  const verifySession = async () => {
    try {
      const token = await getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  };

  const handleOAuthLogin = useCallback(
    async (startOAuthFlow: typeof startGoogleOAuthFlow) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        if (isSignedIn) {
          await signOut();
        }

        const { createdSessionId, setActive } = await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
        });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });

          const isSessionValid = await verifySession();

          if (isSessionValid) {
            router.replace("/(tabs)/home");
          } else {
            alert("Failed to sign in. Please try again.");
            router.replace("/");
          }
        } else {
          alert("Failed to sign in. Please try again.");
          router.replace("/");
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
              redirectUrl: Linking.createURL("/(tabs)/home", {
                scheme: "myapp",
              }),
            });

            if (createdSessionId && setActive) {
              await setActive({ session: createdSessionId });

              const isSessionValid = await verifySession();

              if (isSessionValid) {
                router.replace("/(tabs)/home");
              } else {
                alert("Failed to sign in. Please try again.");
                router.replace("/");
              }
            }
          } catch (retryErr) {
            console.error("Retry login error:", retryErr);
            alert("Failed to sign in. Please try again.");
            router.replace("/");
          }
        } else {
          alert("An error occurred during sign in. Please try again.");
          router.replace("/");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router, signOut, isSignedIn, isLoading]
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
        source={require("../../assets/images/login.png")}
        style={styles.image}
      />
      <Text style={styles.title}>Ready to make a friend?</Text>
      <Text style={styles.description}>
        Let's adopt the pet you like and make their life happy again.
      </Text>

      <View style={styles.buttonsContainer}>
        <Pressable style={styles.googleButton} onPress={onPressGoogle}>
          <Fontisto name="google" size={20} color="#EA4335" />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </Pressable>

        <Pressable style={styles.facebookButton} onPress={onPressFacebook}>
          <Fontisto name="facebook" size={20} color="white" />
          <Text style={[styles.buttonText, styles.facebookText]}>
            Continue with Facebook
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  image: {
    width: "80%",
    height: 300,
    alignSelf: "center",
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonsContainer: {
    gap: 15,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 12,
  },
  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1877F2",
    borderRadius: 12,
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  facebookText: {
    color: "white",
  },
});
