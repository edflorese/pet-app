import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import React, { useCallback } from "react";
import UserItem from "@/components/Inbox/UserItem";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useInbox } from "@/hooks/useInbox";

export default function Inbox() {
  const {
    loader,
    searchQuery,
    filteredList,
    isEmpty,
    hasSearchQuery,
    GetUserList,
    handleSearch,
  } = useInbox();

  const renderEmptyComponent = useCallback(() => {
    if (!hasSearchQuery) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={50} color={Colors.GRAY} />
        <Text style={styles.emptyText}>
          No se encontraron usuarios que coincidan con "{searchQuery}"
        </Text>
      </View>
    );
  }, [hasSearchQuery, searchQuery]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.GRAY} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery} // Texto visible en UI en tiempo real
          onChangeText={handleSearch} // Debounce aplicado solo en búsqueda
          placeholderTextColor={Colors.GRAY}
        />
      </View>

      <FlatList
        style={styles.list}
        data={filteredList}
        refreshing={loader}
        onRefresh={GetUserList}
        keyExtractor={(item) => item.docId}
        renderItem={({ item }) => <UserItem userInfo={item} />}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
  list: {
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: Colors.GRAY + "20",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: "center",
    marginTop: 10,
  },
});
