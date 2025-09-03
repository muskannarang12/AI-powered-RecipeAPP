import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";   // 👈 yeh import karo

export default function HomeScreen() {
  const [query, setQuery] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍳 AI Recipe App</Text>
      <Text style={styles.subtitle}>Find recipes from ingredients you have</Text>

      {/* Search Input */}
      <TextInput
        placeholder="Enter ingredients (e.g. chicken, tomato)"
        style={styles.input}
        value={query}
        onChangeText={setQuery}   // 👈 input ko state se bind karo
      />

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (query.trim().length > 0) {
            router.push(`/recipes?q=${query}`);  // 👈 navigate karo aur query pass karo
          }
        }}
      >
        <Text style={styles.buttonText}>Search Recipes</Text>
      </TouchableOpacity>
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
});
