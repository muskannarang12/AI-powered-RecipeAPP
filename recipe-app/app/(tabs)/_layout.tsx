import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import React from "react";

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#4CAF50" }, // Green header
          headerTintColor: "#fff", // White text
          headerTitleStyle: { fontWeight: "bold" }, // Default bold font
        }}
      />
    </SafeAreaView>
  );
}
