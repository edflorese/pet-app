import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { Vet } from "@/models/Vets";
import { INITIAL_REGION, ZOOM_LEVELS } from "@/constants/MapConstants";
import Header from "@/components/Nearby-Vets/Header";
import VetList from "@/components/Nearby-Vets/VetList";
import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function NearbyVets() {
  const mapRef = useRef<MapView | null>(null);
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVet, setSelectedVet] = useState<Vet | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchLocation();
    navigation.setOptions({
      headerTitle: "Nearby Vets",
    });
  }, []);

  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission is required to display nearby vets");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);

      const newRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        ...ZOOM_LEVELS.INITIAL,
      };

      mapRef.current?.animateToRegion(newRegion, 1000);
      fetchVets(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } catch (err) {
      setError("Error obtaining location");
      setLoading(false);
    }
  };

  const fetchVets = async (latitude: number, longitude: number) => {
    try {
      const radius = 3000;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=veterinary_care&key=${GOOGLE_API_KEY}&language=en`
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        setVets(response.data.results);
        setError(null);
      } else {
        setError("No nearby vets found");
      }
    } catch (err) {
      setError("Error fetching nearby vets");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (location) {
      await fetchVets(location.coords.latitude, location.coords.longitude);
    } else {
      await fetchLocation();
    }
  };

  const focusOnVet = (vet: Vet) => {
    setSelectedVet(vet);
    const newRegion = {
      latitude: vet.geometry.location.lat,
      longitude: vet.geometry.location.lng,
      ...ZOOM_LEVELS.FOCUSED,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading nearby vets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Nearby Vets (3 km Radius)"
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={INITIAL_REGION}
            showsMyLocationButton={true}
          >
            {vets.map((vet) => (
              <Marker
                key={vet.place_id}
                coordinate={{
                  latitude: vet.geometry.location.lat,
                  longitude: vet.geometry.location.lng,
                }}
                title={vet.name}
                description={vet.vicinity}
                pinColor={
                  selectedVet?.place_id === vet.place_id
                    ? "blue"
                    : vet.opening_hours?.open_now
                    ? "green"
                    : "red"
                }
                onPress={() => focusOnVet(vet)}
              />
            ))}
          </MapView>
          <VetList
            vets={vets}
            selectedVet={selectedVet}
            onSelectVet={focusOnVet}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  map: {
    height: Dimensions.get("window").height * 0.3,
    width: "100%",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.PRIMARY,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "outfit",
    color: Colors.ERROR,
    textAlign: "center",
    marginVertical: 20,
  },
});
