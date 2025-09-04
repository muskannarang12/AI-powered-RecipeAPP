import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Load saved recipes
  const loadFavorites = async () => {
    try {
      let saved = await AsyncStorage.getItem("favorites");
      let favs = saved ? JSON.parse(saved) : [];
      setFavorites(favs);
      setFiltered(favs); // default show all
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Reload every time screen opens
  useFocusEffect(() => {
    loadFavorites();
  });

  // Filter when search changes
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(favorites);
    } else {
      setFiltered(
        favorites.filter((item) =>
          item.strMeal.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, favorites]);

  if (!favorites.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          You haven’t added any favorites yet ❤️
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>⭐ Your Favorite Recipes</Text>

      {/* 🔍 Search bar */}
      <TextInput
        placeholder="Search in favorites..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/recipe/${item.idMeal}`)}
          >
            <Image
              source={{ uri: item.strMealThumb }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.strMeal}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 2, // Android shadow
  },
  image: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
});
