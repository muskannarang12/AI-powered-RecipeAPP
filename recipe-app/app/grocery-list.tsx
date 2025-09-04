import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GroceryListScreen() {
  const [groceryList, setGroceryList] = useState<string[]>([]);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    try {
      let saved = await AsyncStorage.getItem("groceryList");
      setGroceryList(saved ? JSON.parse(saved) : []);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (index: number) => {
    try {
      const newList = groceryList.filter((_, i) => i !== index);
      await AsyncStorage.setItem("groceryList", JSON.stringify(newList));
      setGroceryList(newList);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white", padding: 16 }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        🛒 Grocery List
      </Text>

      {groceryList.length === 0 ? (
        <Text style={{ fontSize: 16, color: "gray" }}>No items yet.</Text>
      ) : (
        groceryList.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 16 }}>{item}</Text>
            <TouchableOpacity
              onPress={() => removeItem(index)}
              style={{
                backgroundColor: "red",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "white" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}
