import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async (): Promise<void> => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission required",
      "Please enable notifications to receive updates about your pets"
    );
  }
};

export const showSuccessNotification = async (
  petName: string
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Pet Added Successfully! 🐾",
      body: `${petName} has been added to the adoption list. Thank you for helping pets find their forever home!`,
      data: { screen: "Home" },
    },
    trigger: null,
  });
};
