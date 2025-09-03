import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function RecipesScreen() {
  const { q } = useLocalSearchParams();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;

    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${q}`
        );
        const data = await res.json();
        console.log("Recipes API data:", data);
        setRecipes(data.meals || []); // API se results
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [q]);

  const addToFavorites = async (recipe: any) => {
    try {
      let saved = await AsyncStorage.getItem("favorites");
      let favs = saved ? JSON.parse(saved) : [];

      // duplicate check
      if (!favs.find((r: any) => r.idMeal === recipe.idMeal)) {
        favs.push(recipe);
        await AsyncStorage.setItem("favorites", JSON.stringify(favs));
        alert("Added to favorites ❤️");
      } else {
        alert("Already in favorites ⭐");
      }
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="mt-4 text-gray-600">Fetching recipes...</Text>
      </View>
    );
  }

  if (!recipes.length) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-xl text-gray-700">
          No recipes found for <Text className="font-bold">{q}</Text> ❌
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-emerald-600 mb-4">
        🍲 Recipes with {q}
      </Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <View className="mb-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow">
            {/* Navigate to Recipe Details */}
            <TouchableOpacity onPress={() => router.push(`/recipe/${item.idMeal}`)}>
              <Image
                source={{ uri: item.strMealThumb }}
                style={{ width: "100%", height: 180, borderRadius: 10 }}
                resizeMode="cover"
              />
            </TouchableOpacity>

            {/* Title + Favorite Button */}
            <View className="p-3 flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">
                {item.strMeal}
              </Text>

              <TouchableOpacity onPress={() => addToFavorites(item)}>
                <Ionicons name="heart-outline" size={26} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
