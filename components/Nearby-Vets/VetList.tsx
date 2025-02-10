import React from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  RefreshControl,
} from "react-native";
import { Vet } from "@/models/Vets";
import Colors from "@/constants/Colors";

interface VetListProps {
  vets: Vet[];
  selectedVet: Vet | null;
  onSelectVet: (vet: Vet) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const VetList: React.FC<VetListProps> = ({
  vets,
  selectedVet,
  onSelectVet,
  onRefresh,
  isRefreshing,
}) => {
  const openCount = vets.filter((vet) => vet.opening_hours?.open_now).length;
  const closedCount = vets.length - openCount;

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>
        {vets.length} veterinarias encontradas
      </Text>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "green" }]} />
          <Text style={styles.legendText}>Abierto: {openCount}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "red" }]} />
          <Text style={styles.legendText}>Cerrado: {closedCount}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.listContainer}>
      <FlatList
        ListHeaderComponent={ListHeader}
        data={vets}
        keyExtractor={(item) => item.place_id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              selectedVet?.place_id === item.place_id && styles.selectedCard,
            ]}
            onPress={() => onSelectVet(item)}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardAddress}>📍 {item.vicinity}</Text>
            <Text
              style={[
                styles.statusText,
                { color: item.opening_hours?.open_now ? "green" : "red" },
              ]}
            >
              {item.opening_hours?.open_now ? "Abierto ahora" : "Cerrado"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default VetList;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  listHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listTitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: "outfit",
    color: Colors.GRAY,
  },
  card: {
    backgroundColor: Colors.WHITE,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  selectedCard: {
    backgroundColor: "#e6f0ff",
    borderColor: Colors.PRIMARY,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    flex: 1,
  },
  cardAddress: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.GRAY,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "outfit-medium",
  },
});
