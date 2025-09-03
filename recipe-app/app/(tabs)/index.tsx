import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from AsyncStorage
  const loadSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem("recentSearches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading searches:", error);
    }
  };

  useEffect(() => {
    loadSearches();
  }, []);

  // Save a new search
  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      let updated = [query, ...recentSearches.filter((q) => q !== query)];
      if (updated.length > 5) updated = updated.slice(0, 5); // keep only last 5

      await AsyncStorage.setItem("recentSearches", JSON.stringify(updated));
      setRecentSearches(updated);

      router.push(`/recipes?q=${query}`);
      setQuery("");
    } catch (error) {
      console.error("Error saving search:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍳 AI Recipe App</Text>
      <Text style={styles.subtitle}>Find recipes from ingredients you have</Text>

      {/* Search Input */}
      <TextInput
        placeholder="Enter ingredients (e.g. chicken, tomato)"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search Recipes</Text>
      </TouchableOpacity>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={{ marginTop: 30, width: "100%" }}>
          <Text style={styles.recentTitle}>🕘 Recent Searches</Text>
          <FlatList
            data={recentSearches}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentItem}
                onPress={() => router.push(`/recipes?q=${item}`)}
              >
                <Text style={styles.recentText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF50",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  recentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  recentText: {
    fontSize: 16,
    color: "#4CAF50",
  },
});
