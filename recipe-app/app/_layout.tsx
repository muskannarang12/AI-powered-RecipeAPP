import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
           headerShown: false,
        }}
      />
      <Toast /> {/* 👈 global toast container */}
    </SafeAreaView>
  );
}
