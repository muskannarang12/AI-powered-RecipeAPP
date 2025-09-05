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
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // AI modal states
  const [aiVisible, setAiVisible] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // 🔹 Load recent searches
  useEffect(() => {
    const loadSearches = async () => {
      try {
        const saved = await AsyncStorage.getItem("recentSearches");
        if (saved) setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading searches:", error);
      }
    };
    loadSearches();

    // 🔹 Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
        );
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

  // 🔹 Save a new search
  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      let updated = [query, ...recentSearches.filter((q) => q !== query)];
      if (updated.length > 5) updated = updated.slice(0, 5);

      await AsyncStorage.setItem("recentSearches", JSON.stringify(updated));
      setRecentSearches(updated);

      router.push(`/recipes?q=${query}`);
      setQuery("");
    } catch (error) {
      console.error("Error saving search:", error);
    }
  };

  // 🔹 Handle category tap
  const handleCategory = (category: string) => {
    router.push(`/recipes?c=${category}`);
  };

  // 🔹 Get AI Recipe
  const getAiRecipe = async () => {
    if (!aiQuery.trim()) return;
    setLoadingAi(true);
    try {
      const res = await fetch("http://localhost:3000/ai-chef", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: aiQuery }),
      });
      const data = await res.json();
      setAiResponse(data.reply || "Sorry, I couldn't generate a recipe.");
    } catch (err) {
      console.error(err);
      setAiResponse("Error: Unable to connect to AI service.");
    } finally {
      setLoadingAi(false);
    }
  };

  // 🔹 Share AI Recipe
  const shareAiRecipe = async () => {
    try {
      if (!aiResponse) return;
      await navigator.share({
        title: "AI Generated Recipe",
        text: aiResponse,
      });
    } catch (err) {
      console.log("Sharing cancelled or failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍳 AI Recipe App</Text>
      <Text style={styles.subtitle}>Discover delicious recipes with AI</Text>

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
          <ActivityIndicator size="small" color="#E85D04" />
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

      {/* 🔹 Floating AI Button */}
      <TouchableOpacity style={styles.aiFab} onPress={() => setAiVisible(true)}>
        <Text style={{ color: "white", fontWeight: "600" }}>
          🤖 Chat with AI
        </Text>
      </TouchableOpacity>

      {/* 🔹 AI Modal */}
      <Modal visible={aiVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🤖 AI Chef</Text>

            <TextInput
              value={aiQuery}
              onChangeText={setAiQuery}
              placeholder="Enter ingredients (e.g. eggs, bread)"
              style={styles.aiInput}
            />

            <TouchableOpacity style={styles.aiButton} onPress={getAiRecipe}>
              <Text style={{ color: "white", fontWeight: "600" }}>
                {loadingAi ? "Loading..." : "Get AI Recipe"}
              </Text>
            </TouchableOpacity>

            <ScrollView style={{ marginTop: 16, maxHeight: 250, width: "100%" }}>
              {aiResponse ? (
                <View>
                  <Text style={styles.aiResponse}>{aiResponse}</Text>
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={shareAiRecipe}
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>
                      📤 Share Recipe
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAiVisible(false)}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0", // warm light background
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#D62828", // tomato red
  },
  subtitle: {
    fontSize: 16,
    color: "#6C757D", // muted gray
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0C097",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#E85D04", // orange
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
    color: "#6C757D",
    marginBottom: 10,
  },
  recentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F4A261",
  },
  recentText: {
    fontSize: 16,
    color: "#E85D04",
  },
  categoryItem: {
    backgroundColor: "#FFE5B4",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D62828",
  },
  aiFab: {
    position: "absolute",
    bottom: 40,
    right: 30,
    backgroundColor: "#E85D04", // bright orange
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF8F0",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D62828",
    marginBottom: 12,
  },
  aiInput: {
    borderWidth: 1,
    borderColor: "#E0C097",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  aiButton: {
    backgroundColor: "#E85D04",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  aiResponse: {
    fontSize: 16,
    color: "#6C757D",
    marginBottom: 12,
  },
  shareButton: {
    backgroundColor: "#F77F00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#6C757D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
