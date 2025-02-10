import { Region } from "react-native-maps";

export const ZOOM_LEVELS = {
  INITIAL: {
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  },
  FOCUSED: {
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  },
};

export const INITIAL_REGION: Region = {
  latitude: 0,
  longitude: 0,
  ...ZOOM_LEVELS.INITIAL,
};
