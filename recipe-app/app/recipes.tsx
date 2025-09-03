import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RecipesScreen() {
  const { q } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white justify-center items-center px-4">
      <Text className="text-2xl font-bold text-emerald-600 mb-4">
        🍲 Recipes
      </Text>
      <Text className="text-lg text-gray-700">
        Showing results for: <Text className="font-semibold">{q}</Text>
      </Text>
    </View>
  );
}
