import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {BASE_API} from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OtpScreen({ navigation, route }) {
  const identifier = route?.params?.identifier;
  const inputs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [reSend, setResend] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (timer === 0) {
      setResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text, index) => {
    if (!/^[0-9]?$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter 6-digit OTP");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const response = await fetch(`${BASE_API}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, otp: code }),
      });
      const data = await response.json();
      
      console.log("Login Response:", data);
      if (!response.ok) {
        setLoading(false);
        Alert.alert("Login Failed", data.message);
        return;
      }
      await AsyncStorage.setItem("authToken", data.token);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    console.log("Resending OTP for identifier:", identifier);
    try {
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
      setTimer(30);
      setResend(false);
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.replace("LoginScreen");
        }}
      >
        <Ionicons name="arrow-back" size={26} color="#2563EB" />
      </TouchableOpacity>
      <Text style={styles.title}>Verification Code</Text>

      <Text style={styles.subtitle}>
        We sent a 6 digit verification code to your email address.
      </Text>

      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleBackspace(e, index)}
            autoFocus={index === 0}
          />
        ))}
      </View>
      {error ? <Text style={{ color: "red", fontSize: 13, textAlign: "start", marginTop: 10 }}>{error}</Text> : null}
      <View>
        <TouchableOpacity
          style={styles.resend}
          onPress={handleResend}
          disabled={!reSend}
        >
          <Text
            style={[
              styles.resendButtonText,
              { color: reSend ? "#407fe4" : "gray" },
            ]}
          >
            {reSend ? "Resend OTP" : `Resend OTP in ${timer}s`}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 , backgroundColor: "#94a3b8"}]} onPress={verifyOtp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify OTP"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fc",
    padding: 20,
  },

  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 60,
  },

  subtitle: {
    color: "#666",
    marginBottom: 30,
    textAlign: "left",
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  otpInput: {
    width: 44,
    height: 53,
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 10,
    marginHorizontal: 5,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#fff",
  },
  resend: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 20,
  },
  resendButtonText: {
    color: "#407fe4",
    fontWeight: "bold",
    fontSize: 12,
  },

  button: {
    marginTop: 30,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
    alignSelf: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
