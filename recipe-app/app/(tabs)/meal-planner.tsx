import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MealPlannerScreen() {
  const [mealPlan, setMealPlan] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadMealPlan();
  }, []);

  const loadMealPlan = async () => {
    try {
      const saved = await AsyncStorage.getItem("mealPlan");
      if (saved) setMealPlan(JSON.parse(saved));
    } catch (err) {
      console.error(err);
    }
  };

  const saveMeal = async (day: string, meal: string) => {
    try {
      const newPlan = { ...mealPlan, [day]: meal };
      setMealPlan(newPlan);
      await AsyncStorage.setItem("mealPlan", JSON.stringify(newPlan));
    } catch (err) {
      console.error(err);
    }
  };

  const clearPlan = async () => {
    try {
      await AsyncStorage.removeItem("mealPlan");
      setMealPlan({});
      Alert.alert("✅ Cleared", "Your weekly meal plan is now empty.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>📅 Weekly Meal Planner</Text>
        <TouchableOpacity onPress={clearPlan} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Days */}
      {days.map((day) => (
        <View key={day} style={styles.dayBlock}>
          <Text style={styles.dayTitle}>{day}</Text>
          <TextInput
            placeholder="Enter meal..."
            placeholderTextColor="#6C757D"
            value={mealPlan[day] || ""}
            onChangeText={(text) => saveMeal(day, text)}
            style={styles.input}
          />
        </View>
      ))}
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
    color: "#D62828", // Tomato red
  },
  clearBtn: {
    backgroundColor: "#F77F00", // Warm orange
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearBtnText: {
    color: "white",
    fontWeight: "600",
  },
  dayBlock: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fdfdfd",
    color: "#333",
  },
});
