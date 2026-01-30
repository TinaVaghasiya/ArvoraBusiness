import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function OpeningScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>arvora.business</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4d8ee3",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    color: "#e0e0e0",
  },

  nextText: {
    color: "#00ffcc",
    fontSize: 16,
  },
});
