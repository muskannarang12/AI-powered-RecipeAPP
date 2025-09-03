import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RecipeDetails() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();
        setRecipe(data.meals[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="mt-4 text-gray-600">Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl">❌ Recipe not found</Text>
      </View>
    );
  }

  // Collect ingredients + measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-3xl font-bold text-emerald-600 mb-3">
        {recipe.strMeal}
      </Text>

      <Image
  source={{ uri: recipe.strMealThumb }}
  style={{
    width: "100%",
    height: 250,          // 👈 fixed height
    borderRadius: 15,
    marginBottom: 20,
  }}
  resizeMode="cover"
/>


      <Text className="text-xl font-semibold mb-2">📝 Ingredients</Text>
      {ingredients.map((item, idx) => (
        <Text key={idx} className="text-gray-700 mb-1">• {item}</Text>
      ))}

      <Text className="text-xl font-semibold mt-4 mb-2">👨‍🍳 Instructions</Text>
      <Text className="text-gray-700 leading-6">{recipe.strInstructions}</Text>

      {recipe.strYoutube ? (
        <Text
          className="text-blue-600 mt-4 underline"
          onPress={() => Linking.openURL(recipe.strYoutube)}
        >
          ▶ Watch Tutorial on YouTube
        </Text>
      ) : null}
    </ScrollView>
  );
}
