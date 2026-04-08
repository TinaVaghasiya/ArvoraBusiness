import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomPinInput from "../components/CustomPinInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_API } from "../utils/api";


export default function SetupMPinScreen({ route, navigation }) {
  const { 
    isOptional = true, 
    isReset = false, 
    isChangingPin = false, 
    currentPin = "" 
  } = route.params || {};
  
  const [pin, setPin] = useState("");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const pinInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;



  const showSuccessToast = (message) => {
    setSuccessMessage(message);
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

  const handlePinComplete = async (inputtedPin) => {
    if (step === 1) {
      if (isChangingPin && inputtedPin === currentPin) {
        setErrorMessage("New PIN cannot be same as current PIN");
        pinInputRef.current?.triggerError();
        return;
      }
      setPin(inputtedPin);
      setStep(2);
      pinInputRef.current?.clearPin();
    } else {
      if (inputtedPin === pin) {
        try {
          const token = await AsyncStorage.getItem("authToken");
          
          let endpoint, body;
          
          if (isChangingPin) {
            endpoint = '/api/auth/mpin/change';
            body = { currentMpin: currentPin, newMpin: inputtedPin };
          } else {
            endpoint = '/api/auth/mpin/set';
            body = { mpin: inputtedPin };
          }
          
          const response = await fetch(`${BASE_API}${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify(body),
          });

          const data = await response.json();
          
          if (response.ok && data.success) {
            pinInputRef.current?.clearPin();
            
            let message;
            if (isReset) {
              message = "PIN reset successfully";
            } else if (isChangingPin) {
              message = "PIN changed successfully";
            } else {
              message = "PIN set successfully";
            }
            
            showSuccessToast(message);
            
            setTimeout(() => {
              if (isReset) {
                navigation.replace("VerifyMPinScreen", { 
                  hideForgotPin: true,
                  isAfterReset: true
                });
              } else if (isChangingPin) {
                navigation.navigate("MainTabs");
              } else {
                navigation.replace("MainTabs");
              }
            }, 900);
          } else {
            setErrorMessage(data.message || "Failed to set M-PIN");
            setStep(1);
            setPin("");
            pinInputRef.current?.clearPin();
          }
        } catch (error) {
          console.error("Error setting M-PIN:", error);
          setErrorMessage("Something went wrong");
          setStep(1);
          setPin("");
          pinInputRef.current?.clearPin();
        }
      } else {
        setErrorMessage("PINs do not match");
        pinInputRef.current?.triggerError();
      }
    }
  };

  const handleSkip = () => {
    navigation.replace("MainTabs");
  };

  const getTitle = () => {
    if (step === 2) return "Confirm M-PIN";
    if (isReset) return "Reset Your M-PIN";
    if (isChangingPin) return "Set New M-PIN";
    return "Set Your M-PIN";
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
  {isOptional && !isReset && !isChangingPin && step === 1 && (
    <TouchableOpacity onPress={handleSkip} style={styles.skipTopButton}>
      <Text style={styles.skipTopText}>Skip</Text>
    </TouchableOpacity>
  )}
  
  <MaterialIcons name="lock" size={60} color="#1E3A8A" style={styles.icon} />
  <Text style={styles.title}>{getTitle()}</Text>
  <Text style={styles.subtitle}>
    {step === 1 ? "Enter 4-digit PIN for extra security" : "Re-enter your PIN"}
  </Text>
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
    justifyContent: "space-between", 
    alignItems: "center", 
    backgroundColor: "#f9f7f7", 
    // padding: 20 
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
    color: "#1E3A8A" 
  },
  subtitle: { 
    fontSize: 16, 
    color: "#666", 
    marginTop: 10 
  },
  skipTopButton: {
    position: "absolute",
    top: 70,
    right: -20,
  },
  skipTopText: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  successToast: {
    position: "absolute",
    top: 70,
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