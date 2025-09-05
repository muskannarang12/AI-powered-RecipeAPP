// ai-chef.tsx (React Native screen)
import React, { useState } from "react";
import { View, TextInput, Button, Text, ScrollView } from "react-native";

export default function AiChef() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const getAiRecipe = async () => {
    try {
      const res = await fetch("http://localhost:3000/ai-chef", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "white" }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Enter ingredients (e.g. eggs, bread, cheese)"
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />
      <Button title="Get AI Recipe" onPress={getAiRecipe} />
      {response ? (
        <Text style={{ marginTop: 16, fontSize: 16, color: "#333" }}>
          {response}
        </Text>
      ) : null}
    </ScrollView>
  );
}
