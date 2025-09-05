import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function RecipesScreen() {
  const { q, c } = useLocalSearchParams(); // q = ingredient, c = category
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (!q && !c) return;

    const fetchRecipes = async () => {
      try {
        let url = "";
        if (q) {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${q}`;
        } else if (c) {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${c}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setRecipes(data.meals || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const loadFavorites = async () => {
      const saved = await AsyncStorage.getItem("favorites");
      setFavorites(saved ? JSON.parse(saved) : []);
    };

    fetchRecipes();
    loadFavorites();
  }, [q, c]);

  const showMessage = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      console.log(msg);
    }
  };

  const toggleFavorite = async (recipe: any) => {
    try {
      let favs = [...favorites];
      const exists = favs.find((r) => r.idMeal === recipe.idMeal);

      if (exists) {
        favs = favs.filter((r) => r.idMeal !== recipe.idMeal);
        showMessage("❌ Removed from favorites");
      } else {
        favs.push(recipe);
        showMessage("✅ Added to favorites");
      }

      setFavorites(favs);
      await AsyncStorage.setItem("favorites", JSON.stringify(favs));
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: "#FFF8F0" }}>
        <ActivityIndicator size="large" color="#D62828" />
        <Text style={{ marginTop: 10, color: "#6C757D", fontSize: 16 }}>
          Fetching recipes...
        </Text>
      </View>
    );
  }

  if (!recipes.length) {
    return (
      <View
        className="flex-1 justify-center items-center px-6 mt-10"
        style={{ backgroundColor: "#FFF8F0" }}
      >
        <Text style={{ fontSize: 20, color: "#6C757D", textAlign: "center", lineHeight: 28,   marginTop: 50 }}>
          Sorry, no recipes found for{" "}
          <Text style={{ fontWeight: "bold", color: "#D62828" }}>{q ? q : c}</Text> 🙁
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4" style={{ backgroundColor: "#FFF8F0" }}>
      {/* Centered heading with extra padding */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: "#D62828",
          textAlign: "center",
          marginTop: 50,
          marginBottom: 20,
        }}
      >
        🍲 Recipes with {q ? q : c}
      </Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => {
          const isFavorite = favorites.some((r) => r.idMeal === item.idMeal);

          return (
            <View
              style={{
                marginBottom: 16,
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              {/* Navigate to Recipe Details */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(`/recipe/${item.idMeal}`)}
              >
                <Image
                  source={{ uri: item.strMealThumb }}
                  style={{ width: "100%", height: 200 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {/* Title + Favorite Button */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 12,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#333", flex: 1 }}>
                  {item.strMeal}
                </Text>

                <TouchableOpacity
                  onPress={() => toggleFavorite(item)}
                  style={{
                    marginLeft: 10,
                    backgroundColor: isFavorite ? "#F77F00" : "#f3f4f6",
                    padding: 8,
                    borderRadius: 20,
                  }}
                >
                  <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={22}
                    color={isFavorite ? "white" : "#6C757D"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
