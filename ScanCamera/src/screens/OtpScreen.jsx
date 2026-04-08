import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_API } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dialog, Portal, Button } from "react-native-paper";

export default function OtpScreen({ route, navigation }) {
  const { source, email, phone } = route.params || {};
  const getTitle = () => {
    if (source === 'editScreen' || source === 'edit') {
      return "Reverify it's you";
    }
    return "Verification Code";
  };  
  const identifier = route?.params?.identifier;
  const inputs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const [reSend, setResend] = useState(false);
  const [error, setError] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

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
  const source = route?.params?.source;

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
      setDialogMessage(data.message);
      setDialogVisible(true);
      return;
    }
    await AsyncStorage.setItem("authToken", data.token);
    await AsyncStorage.setItem("userData", JSON.stringify(data.user));
    await AsyncStorage.setItem("lastLoginTime", new Date().toISOString());

     if (source === "editScreen" || source === "edit") {
      const { nextScreen, field, value } = route.params;
      
      if (nextScreen === "EditField") {
        navigation.replace("EditField", {
          field: field,
          value: value,
        });
      } else {
        navigation.goBack(); 
      }
      return;
    }

    if (source === "register") {
      navigation.replace("SetupMPinScreen", { isOptional: true });
    } else if (source === "forgot-pin") {
      navigation.replace("SetupMPinScreen", { 
        isOptional: false, 
        isReset: true 
      });
    } else {
      const mpinEnabled = await AsyncStorage.getItem("mpinEnabled");
      if (mpinEnabled === "true") {
        navigation.replace("VerifyMPinScreen", { hideForgotPin: false });
      } else {
        navigation.replace("MainTabs");
      }
    }
  } catch (error) {
    setDialogMessage("Something went wrong");
    setDialogVisible(true);
  } finally {
    setLoading(false);
  }
};


  const handleResend = async () => {
    // console.log("Resending OTP for identifier:", identifier);
    try {
      setResendLoading(true);
      const response = await fetch(`${BASE_API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      });
      const data = await response.json();
      if (!response.ok) {
        setDialogMessage(data.message);
        setDialogVisible(true);
        return;
      }
      setSuccessDialogVisible(true);
      setTimer(45);
      setResend(false);
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
  const generateOTPForEdit = async () => {
    // console.log(" Debug - Source:", source, "Identifier:", identifier);
    
    if (source === 'editScreen' || source === 'edit') {
      
      if (!identifier) {
        setDialogMessage("Missing email for verification");
        setDialogVisible(true);
        return;
      }
      
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
          console.log("❌ OTP Error:", data.message);
          setDialogMessage(data.message || "Failed to send OTP");
          setDialogVisible(true);
        } else {
          // console.log("OTP sent successfully");
        }
      } catch (error) {
        console.error("❌ Network Error:", error);
        setDialogMessage("Failed to send verification code");
        setDialogVisible(true);
      }
    }
  };
  if (identifier && (source === 'editScreen' || source === 'edit')) {
    generateOTPForEdit();
  }
}, [identifier, source]);


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons name="arrow-back" size={26} color="#1E3A8A" />
      </TouchableOpacity>
      
      <Text style={styles.title}>{getTitle()}</Text>

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
      {error ? (
        <Text
          style={{
            color: "red",
            fontSize: 13,
            textAlign: "start",
            marginTop: 10,
          }}
        >
          {error}
        </Text>
      ) : null}
      <View>
        <TouchableOpacity
          style={styles.resend}
          onPress={handleResend}
          disabled={!reSend || resendLoading}
        >
          <Text
            style={[
              styles.resendButtonText,
              { color: reSend ? "#407fe4" : "gray" },
            ]}
          >
            {resendLoading ? "Resending..." : reSend ? "Resend OTP" : `Resend OTP in ${timer}s`}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          loading && { opacity: 0.7, backgroundColor: "#94a3b8" },
        ]}
        onPress={verifyOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Login Failed</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: "#6B7280" }}>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {setDialogVisible(false);
              setOtp(["", "", "", "", "", ""]);
            setTimeout(() => {
              inputs.current[0]?.focus();
            }, 100);
          }}>OK</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={successDialogVisible}
          onDismiss={() => setSuccessDialogVisible(false)}
        >
          <Dialog.Title>Success</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: "#6B7280" }}>OTP sent to your email.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSuccessDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
        position: "absolute",
        top: 50,
        left: 10,
        padding: 10,
    },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 120,
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
    borderColor: "#1E3A8A",
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
    color: "#1E3A8A",
    fontWeight: "bold",
    fontSize: 13,
  },

  button: {
    marginTop: 25,
    backgroundColor: "#1E3A8A",
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