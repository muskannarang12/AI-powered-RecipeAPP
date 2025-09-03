import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // 🔹 Load recipe details
  useEffect(() => {
    if (!id) return;
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();
        setRecipe(data.meals[0]);
        checkIfFavorite(data.meals[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // 🔹 Check if already favorite
  const checkIfFavorite = async (recipeData: any) => {
    try {
      let saved = await AsyncStorage.getItem("favorites");
      let favs = saved ? JSON.parse(saved) : [];
      const exists = favs.some((r: any) => r.idMeal === recipeData.idMeal);
      setIsFavorite(exists);
    } catch (err) {
      console.error("Error checking favorites:", err);
    }
  };

  // 🔹 Add/Remove from favorites
  const toggleFavorite = async () => {
    try {
      let saved = await AsyncStorage.getItem("favorites");
      let favs = saved ? JSON.parse(saved) : [];

      if (isFavorite) {
        favs = favs.filter((r: any) => r.idMeal !== recipe.idMeal);
        await AsyncStorage.setItem("favorites", JSON.stringify(favs));
        setIsFavorite(false);
        Alert.alert("Removed", `${recipe.strMeal} removed from favorites`);
      } else {
        favs.push(recipe);
        await AsyncStorage.setItem("favorites", JSON.stringify(favs));
        setIsFavorite(true);
        Alert.alert("Added", `${recipe.strMeal} added to favorites`);
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 16, color: "#4B5563" }}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <Text style={{ fontSize: 18 }}>❌ Recipe not found</Text>
      </View>
    );
  }

  // Collect ingredients + measures
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 16, paddingTop: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#059669", marginBottom: 12 }}>
        {recipe.strMeal}
      </Text>

      <Image
        source={{ uri: recipe.strMealThumb }}
        style={{ width: "100%", height: 250, borderRadius: 15, marginBottom: 20 }}
        resizeMode="cover"
      />

      {/* ❤️ Add to Favorites Button */}
      <TouchableOpacity
        onPress={toggleFavorite}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 10,
          marginBottom: 16,
          backgroundColor: isFavorite ? "red" : "#059669",
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" }}>
          {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
        </Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>📝 Ingredients</Text>
      {ingredients.map((item, idx) => (
        <Text key={idx} style={{ color: "#374151", marginBottom: 4 }}>• {item}</Text>
      ))}

      <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 16, marginBottom: 8 }}>👨‍🍳 Instructions</Text>
      <Text style={{ color: "#374151", lineHeight: 22 }}>{recipe.strInstructions}</Text>

      {recipe.strYoutube ? (
        <Text
          style={{ color: "#2563EB", marginTop: 16, textDecorationLine: "underline" }}
          onPress={() => Linking.openURL(recipe.strYoutube)}
        >
          ▶ Watch Tutorial on YouTube
        </Text>
      ) : null}
    </ScrollView>
  );
}
