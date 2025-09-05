import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
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

  const clearAll = async () => {
    try {
      await AsyncStorage.removeItem("groceryList");
      setGroceryList([]);
      Alert.alert("✅ Cleared", "Your grocery list is now empty.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>🛒 Grocery List</Text>
        {groceryList.length > 0 && (
          <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Empty State */}
      {groceryList.length === 0 ? (
        <Text style={styles.emptyText}>No items yet.</Text>
      ) : (
        groceryList.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity
              onPress={() => removeItem(index)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0", // Soft beige
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D62828", // Tomato Red
  },
  clearBtn: {
    backgroundColor: "#F77F00", // Warm Orange
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearBtnText: {
    color: "white",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#6C757D", // Muted gray
    marginTop: 20,
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2, // shadow for Android
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  removeBtn: {
    backgroundColor: "#F77F00", // Warm Orange
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeBtnText: {
    color: "white",
    fontWeight: "600",
  },
});
