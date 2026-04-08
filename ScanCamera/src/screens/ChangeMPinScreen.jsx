import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomPinInput from "../components/CustomPinInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_API } from "../utils/api";

export default function ChangeMPinScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const pinInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showSuccessToast = () => {
    setSuccessMessage("Current PIN verified");
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.delay(600),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setSuccessMessage(""));
  };

  const handlePinComplete = async (currentPin) => {
    try {
      setErrorMessage("");
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        setErrorMessage("Please login again");
        pinInputRef.current?.triggerError();
        return;
      }

      const response = await fetch(`${BASE_API}/api/auth/mpin/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ mpin: currentPin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccessToast();
        
        setTimeout(() => {
          navigation.navigate("SetupMPinScreen", { 
            isOptional: false, 
            isChangingPin: true,
            currentPin: currentPin 
          });
        }, 900);
      } else {
        setErrorMessage(data.message || "Incorrect current PIN");
        pinInputRef.current?.triggerError();
      }
    } catch (error) {
      console.error("Error verifying current PIN:", error);
      setErrorMessage("Something went wrong");
      pinInputRef.current?.triggerError();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <MaterialIcons name="lock-outline" size={60} color="#1E3A8A" style={styles.icon} />
        <Text style={styles.title}>Change M-PIN</Text>
        <Text style={styles.subtitle}>Enter your current PIN</Text>
      </View>

      <View style={styles.keyboardSection}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <CustomPinInput 
          ref={pinInputRef} 
          onComplete={handlePinComplete}
          onPinChange={() => setErrorMessage("")} 
        />
      </View>

      {successMessage ? (
        <Animated.View style={[styles.successToast, { opacity: fadeAnim }]}>
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.successToastText}>{successMessage}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f7f7",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  icon: {
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#1E3A8A",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  successToast: {
    position: "absolute",
    top: 50,
    left: 40,
    right: 40,
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successToastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});