import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);

  // Load saved recipes
  const loadFavorites = async () => {
    try {
      let saved = await AsyncStorage.getItem("favorites");
      let favs = saved ? JSON.parse(saved) : [];
      setFavorites(favs);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // ✅ Screen focus hone par reload kare
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  if (!favorites.length) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-xl text-gray-700 text-center">
          You haven’t added any favorites yet ❤️
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-emerald-600 mb-4">
        ⭐ Your Favorite Recipes
      </Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mb-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow"
            onPress={() => router.push(`/recipe/${item.idMeal}`)}
          >
            <Image
              source={{ uri: item.strMealThumb }}
              style={{ width: "100%", height: 180 }}
              resizeMode="cover"
            />
            <View className="p-3">
              <Text className="text-lg font-semibold text-gray-800">
                {item.strMeal}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
