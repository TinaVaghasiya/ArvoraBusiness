import React, { use, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import "../utils/api";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const navigation = useNavigation();

  const handleSend = async () => {
    try {
      if (!identifier) {
        Alert.alert("Please enter your email or phone number");
        return;
      }
      const response = await fetch(`${BASE_API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Login Failed", data.message);
        return;
      }
      Alert.alert("Success", " OTP sent to your email.");
      navigation.replace("OtpScreen", {
        identifier: identifier,
        user: data.user,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Error", "An error occurred while logging in");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={styles.container}
    >
      <View style={styles.topHeader}>
        <View style={styles.iconCircle}>
          <Entypo name="login" size={35} color="white" />
        </View>

        <Text style={styles.headerTitle}>Turn Every Business Card into a</Text>

        <Text style={styles.headerTitleBold}>Smart Searchable Contact</Text>
      </View>
      <SafeAreaView style={styles.container}>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Login with </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Fontisto
              name="email"
              size={20}
              color="#606064"
              style={{ marginRight: 4 }}
            />

            <TextInput
              placeholder="Email or Phone Number"
              placeholderTextColor="#999"
              value={identifier}
              onChangeText={setIdentifier}
              style={styles.input}
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSend}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.background}></View>
        <View style={styles.bottomWrapper}>
          <View style={styles.curve} />

          <Image
            source={require("../../assets/sitted.png")}
            style={styles.bottomImage}
            resizeMode="contain"
          />

          <View style={styles.bottomSection}>
            <Text style={styles.bottomText}>Don’t have an Account? </Text>
            <TouchableOpacity
              style={{ fontWeight: "bold" }}
              onPress={() => navigation.navigate("RegisterScreen")}
            >
              <Text style={styles.bottomTextSign}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f9f7f7",
    alignItems: "center",
  },
  topHeader: {
    width: "100%",
    height: 280,
    backgroundColor: "#4c7de8",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },

  iconCircle: {
    backgroundColor: "#6a9bf1",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
    elevation: 5,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },

  headerTitleBold: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  subtitleContainer: {
    flex: 1,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 24,
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    marginTop: 5,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  formContainer: {
    width: "85%",
    alignItems: "center",
    marginBottom: 180,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2565a1",
    borderBottomWidth: 1.5,
    paddingHorizontal: 12,
    height: 50,
    width: "95%",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#3973df",
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    marginTop: 24,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    alignItems: "center",
  },

  curve: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 170,
    backgroundColor: "#d6e5fd",
    borderTopLeftRadius: 140,
    borderTopRightRadius: 120,
  },

  bottomImage: {
    width: 300,
    height: 205,
    position: "absolute",
    bottom: 80,
    marginLeft: 40,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 60,
    marginLeft: 20,
  },
  bottomText: {
    fontSize: 14,
    color: "#3f3f3f",
  },
  bottomTextSign: {
    fontSize: 14,
    color: "#3f3f3f",
    fontWeight: "bold",
    textDecorationColor: "#3f3f3f",
    textDecorationLine: "underline",
  }
});
