import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_API } from "../utils/api";

export default function OpeningScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        setTimeout(async () => {
          if (token) {
            try {
              const response = await fetch(`${BASE_API}/api/auth/mpin/status`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'ngrok-skip-browser-warning': 'true',
                },
              });
              const data = await response.json();
              
              if (response.ok && data.success) {
                if (data.mpinEnabled === true) {
                  navigation.replace("VerifyMPinScreen");
                } else {
                  navigation.replace("MainTabs");
                }
              } else {
                navigation.replace("MainTabs");
              }
            } catch (error) {
              console.log("Error fetching M-PIN status:", error);
              navigation.replace("MainTabs");
            }
          } else {
            navigation.replace("Onboarding");
          }
        }, 2000); 
      } catch (error) {
        console.log("Error checking auth:", error);
        navigation.replace("Onboarding");
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>arvora.business</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
});