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
    handleSearch,
  } = useInbox();

  const renderEmptyComponent = useCallback(() => {
    if (loader) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Cargando conversaciones...</Text>
        </View>
      );
    }

    if (!hasSearchQuery) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay conversaciones aún</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={50} color={Colors.GRAY} />
        <Text style={styles.emptyText}>
          No se encontraron usuarios que coincidan con "{searchQuery}"
        </Text>
      </View>
    );
  }, [hasSearchQuery, searchQuery, loader]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.GRAY} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={Colors.GRAY}
        />
      </View>

      <FlatList
        style={styles.list}
        data={filteredList}
        keyExtractor={(item) => item.docId}
        renderItem={({ item }) => <UserItem userInfo={item} />}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 30,
    marginBottom: 15,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
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
    minHeight: 200,
  },
  emptyText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: "center",
    marginTop: 10,
  },
});
