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
    backgroundColor: "#FFF8F0", // soft beige background
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D62828", // tomato red for heading
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1.5,
    borderColor: "#6C757D", // muted gray
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  card: {
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: "#eee",
    borderRadius: 14,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6C757D", // muted gray for titles
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F0", // beige
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#6C757D", // muted gray
    textAlign: "center",
  },
});
