import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>📅 Weekly Meal Planner</Text>
        <TouchableOpacity
          onPress={clearPlan}
          style={{ backgroundColor: "red", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {days.map((day) => (
        <View key={day} style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 6 }}>{day}</Text>
          <TextInput
            placeholder="Enter meal..."
            value={mealPlan[day] || ""}
            onChangeText={(text) => saveMeal(day, text)}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              backgroundColor: "#f9f9f9",
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
}
