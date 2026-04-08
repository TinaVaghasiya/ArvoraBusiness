import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomPinInput from "../components/CustomPinInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_API } from "../utils/api";


const MAX_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

export default function VerifyMPinScreen({ route, navigation }) {
  const { 
    onSuccess, 
    isFromRegistration = false, 
    hideForgotPin = false, 
    isAfterReset = false 
  } = route.params || {};
  
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lockRemaining, setLockRemaining] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const pinInputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkLockStatus();
    loadAttempts();
  }, []);

  const loadAttempts = async () => {
    const savedAttempts = await AsyncStorage.getItem("mpin_attempts");
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  };

  const checkLockStatus = async () => {
    const lockTime = await AsyncStorage.getItem("mpin_lock_until");

    if (lockTime) {
      const remaining = parseInt(lockTime) - Date.now();

      if (remaining > 0) {
        startTimer(remaining);
      } else {
        await AsyncStorage.removeItem("mpin_lock_until");
      }
    }
  };

  const startTimer = (duration) => {
    setLockRemaining(duration);

    const interval = setInterval(() => {
      setLockRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          AsyncStorage.removeItem("mpin_lock_until");
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
  };



  const handlePinComplete = async (inputtedPin) => {
    if (lockRemaining > 0) return;

    try {
      setLoading(true);
      setErrorMessage("");
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(`${BASE_API}/api/auth/mpin/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ mpin: inputtedPin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setErrorMessage("");
        await AsyncStorage.removeItem("mpin_attempts");
        setAttempts(0);
        
        setSuccessMessage("PIN verified successfully");
        showSuccessToast();
        
        setTimeout(() => {
          if (onSuccess) onSuccess();
          navigation.replace("MainTabs");
        }, 900);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        await AsyncStorage.setItem("mpin_attempts", newAttempts.toString());

        const remainingAttempts = MAX_ATTEMPTS - newAttempts;

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockUntil = Date.now() + LOCK_TIME;
          await AsyncStorage.setItem("mpin_lock_until", lockUntil.toString());
          startTimer(LOCK_TIME);
          setErrorMessage("Too many attempts. Try again after 5 minutes.");
        } else if (newAttempts >= 3) {
          setErrorMessage(`Incorrect PIN. ${remainingAttempts} attempts left`);
        } else {
          setErrorMessage("Incorrect PIN");
        }
        
        pinInputRef.current?.triggerError();
      }
    } catch (error) {
      console.error("Error verifying M-PIN:", error);
      setErrorMessage("Something went wrong");
      pinInputRef.current?.triggerError();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPin = () => {
    navigation.navigate("ForgotPin");
  };

  const showSuccessToast = () => {
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

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <MaterialIcons name="lock-outline" size={60} color="#1E3A8A" />
        <Text style={styles.title}>
          {isAfterReset ? "Verify New M-PIN" : "Enter M-PIN"}
        </Text>
        <Text style={styles.subtitle}>
          {isAfterReset ? "Enter your new PIN to confirm" : "Enter your PIN to continue"}
        </Text>
      </View>

      <View style={styles.bottomSection}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {lockRemaining > 0 ? (
          <Text style={styles.lockText}>
            Try again in {formatTime(lockRemaining)}
          </Text>
        ) : (
          <CustomPinInput
            ref={pinInputRef}
            onComplete={handlePinComplete}
            onPinChange={() => setErrorMessage("")}
          />
        )}

        {!hideForgotPin && !isAfterReset && !isFromRegistration && lockRemaining === 0 && (
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={handleForgotPin}
          >
            <Text style={styles.forgotText}>Forgot PIN?</Text>
          </TouchableOpacity>
        )}
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
    padding: 20,
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 15,
    textAlign: "center",
  },
  lockText: {
    marginTop: 20,
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "bold",
  },
  forgotButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  forgotText: {
    color: "#7C7C7C",
    fontSize: 14,
    fontWeight: "600",
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
