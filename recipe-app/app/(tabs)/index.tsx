import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

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

    // 🔹 Fetch categories from API
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
        const data = await res.json();
        setCategories(data.meals || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
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

  // Handle category tap
  const handleCategory = (category: string) => {
    router.push(`/recipes?c=${category}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍳 AI Recipe App</Text>
      <Text style={styles.subtitle}>Find recipes from ingredients or browse categories</Text>

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

      {/* Categories */}
      <View style={{ marginTop: 25, width: "100%" }}>
        <Text style={styles.recentTitle}>🍕 Categories</Text>
        {loadingCategories ? (
          <ActivityIndicator size="small" color="#4CAF50" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.categoryItem}
                onPress={() => handleCategory(cat.strCategory)}
              >
                <Text style={styles.categoryText}>{cat.strCategory}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

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
    padding: 20,
    paddingTop: 50,
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
  categoryItem: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
