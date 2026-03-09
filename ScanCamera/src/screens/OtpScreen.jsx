import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import "../utils/api";

export default function OtpScreen({ navigation, route }) {
  const identifier = route?.params?.identifier;
  console.log("Identifier received:", identifier);
  const inputs = useRef([]);
  //   const { identifier } = route.params;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

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
      Alert.alert("Enter 6 digit OTP");
      return;
    }
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
      if (!response.ok) {
        Alert.alert("Login Failed", data.message);
        return;
      }
      Alert.alert("Login Successfully");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
    console.log("OTP:", code);
  };

  const handleResend = async () => {
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
      <View>
        <TouchableOpacity style={styles.resend} onPress={handleResend}>
          <Text style={styles.resendButtonText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
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
    marginBottom: 10,
    marginTop: 80,
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