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
    if (source === 'enableEmailEdit') {
      return "Verify Current Email";
    }
    if (source === 'verifyNewEmail') {
      return "Verify New Email";
    }
    return "Verification Code";
  };  
  const identifier = route?.params?.identifier;
  const verificationType = route?.params?.verificationType;
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
  const verificationType = route?.params?.verificationType;

  if (code.length !== 6) {
    setError("Please enter 6-digit OTP");
    return;
  }
  setError("");
  
  try {
    setLoading(true);
    
    if (source === 'verifyNewEmail') {
      console.log("🔄 Verifying new email with verify-change API");
      
      const token = await AsyncStorage.getItem("authToken");
      console.log("🔑 Token check for verification:");
      console.log("  - Token exists:", !!token);
      console.log("  - Token length:", token ? token.length : 0);
      console.log("  - Token preview:", token ? token.substring(0, 20) + "..." : "null");
      
      if (!token) {
        setDialogMessage("Please login again");
        setDialogVisible(true);
        return;
      }
      
      const verifyEndpoint = `${BASE_API}/api/email/verify-change`;
      const verifyBody = { newEmail: identifier, otp: code };
      const verifyHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      };
      
      console.log("📤 Verify-change request details:");
      console.log("  - URL:", verifyEndpoint);
      console.log("  - Headers:", JSON.stringify(verifyHeaders, null, 2));
      console.log("  - Body:", JSON.stringify(verifyBody, null, 2));
      
      const response = await fetch(verifyEndpoint, {
        method: "POST",
        headers: verifyHeaders,
        body: JSON.stringify(verifyBody),
      });
      
      console.log("📥 Verify-change response details:");
      console.log("  - Status:", response.status);
      console.log("  - Status Text:", response.statusText);
      console.log("  - OK:", response.ok);
      
      const contentType = response.headers.get("content-type");
      console.log("  - Content-Type:", contentType);
      
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.log("  - Non-JSON Response:", textResponse);
        setDialogMessage("Server returned invalid response format");
        setDialogVisible(true);
        return;
      }
      
      console.log("  - Response data:", JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.log("❌ Verify-change failed:", data.message);
        setDialogMessage(data.message || "Invalid verification code");
        setDialogVisible(true);
        return;
      }
      
      console.log("✅ New email verified and updated successfully");
      
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const user = JSON.parse(userData);
          user.email = identifier;
          await AsyncStorage.setItem("userData", JSON.stringify(user));
          console.log("✅ Local user data updated with new email");
        }
      } catch (error) {
        console.log("⚠️ Error updating local user data:", error);
      }
      
      await AsyncStorage.setItem("emailVerificationResult", JSON.stringify({
        success: true,
        type: verificationType || source
      }));
      
      navigation.goBack();
      return;
    }
    
    if (source === 'enableEmailEdit') {
      console.log("🔄 Verifying existing email with verify-otp API");
      
      const response = await fetch(`${BASE_API}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ identifier, otp: code }),
      });
      
      console.log("📥 Verify-otp response:");
      console.log("  - Status:", response.status);
      console.log("  - OK:", response.ok);
      
      const data = await response.json();
      console.log("  - Response data:", JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        setDialogMessage(data.message || "Invalid verification code");
        setDialogVisible(true);
        return;
      }
      
      console.log("✅ Existing email verified successfully");
      
      await AsyncStorage.setItem("emailVerificationResult", JSON.stringify({
        success: true,
        type: verificationType || source
      }));
      
      navigation.goBack();
      return;
    }
    
    const response = await fetch(`${BASE_API}/api/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ identifier, otp: code }),
    });
    const data = await response.json();

    console.log("Verification Response:", data);
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
      
      if (nextScreen === "EditScreen") {
        navigation.replace("EditScreen", {
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
      const mpinEnabled = data.user?.mpinEnabled || false;
      if (mpinEnabled === "true") {
        navigation.replace("VerifyMPinScreen", { hideForgotPin: false });
      } else {
        navigation.replace("MainTabs");
      }
    }
  } catch (error) {
    console.error("❌ Detailed Verification Error:");
    console.error("  - Error name:", error.name);
    console.error("  - Error message:", error.message);
    console.error("  - Error stack:", error.stack);
    
    if (error.message.includes('Network request failed')) {
      setDialogMessage("Network connection failed. Check your internet connection.");
    } else if (error.message.includes('JSON')) {
      setDialogMessage("Server returned invalid response format.");
    } else {
      setDialogMessage(`Verification error: ${error.message}`);
    }
    setDialogVisible(true);
  } finally {
    setLoading(false);
  }
};

  const handleResend = async () => {
    console.log("🔄 Resending OTP for:", identifier, "Source:", source);
    
    try {
      setResendLoading(true);
      
      let apiEndpoint;
      let requestBody;
      let headers = {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      };
      
      // Handle resend for new email verification
      if (source === 'verifyNewEmail') {
        console.log("📤 Resending OTP to new email using request-change API");
        
        const token = await AsyncStorage.getItem("authToken");
        console.log("🔑 Token check for resend:");
        console.log("  - Token exists:", !!token);
        console.log("  - Token length:", token ? token.length : 0);
        
        if (!token) {
          setDialogMessage("Please login again");
          setDialogVisible(true);
          return;
        }
        
        apiEndpoint = `${BASE_API}/api/email/request-change`;
        requestBody = { newEmail: identifier };
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        // Handle resend for existing email verification
        console.log("📤 Resending OTP to existing email using login API");
        apiEndpoint = `${BASE_API}/api/auth/login`;
        requestBody = { identifier };
      }
      
      console.log("📤 Resend request details:");
      console.log("  - URL:", apiEndpoint);
      console.log("  - Headers:", JSON.stringify(headers, null, 2));
      console.log("  - Body:", JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });
      
      console.log("📥 Resend response:");
      console.log("  - Status:", response.status);
      console.log("  - OK:", response.ok);
      
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.log("  - Non-JSON Response:", textResponse);
        setDialogMessage("Server returned invalid response format");
        setDialogVisible(true);
        return;
      }
      
      console.log("  - Response data:", JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        console.log("❌ Resend failed:", data.message);
        setDialogMessage(data.message);
        setDialogVisible(true);
        return;
      }
      
      console.log("✅ OTP resent successfully");
      setSuccessDialogVisible(true);
      setTimer(45);
      setResend(false);
    } catch (error) {
      console.error("❌ Detailed Resend Error:");
      console.error("  - Error name:", error.name);
      console.error("  - Error message:", error.message);
      console.error("  - Error stack:", error.stack);
      
      if (error.message.includes('Network request failed')) {
        setDialogMessage("Network connection failed. Check your internet connection.");
      } else if (error.message.includes('JSON')) {
        setDialogMessage("Server returned invalid response format.");
      } else {
        setDialogMessage(`Resend error: ${error.message}`);
      }
      setDialogVisible(true);
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
  const generateOTPForEdit = async () => {
    // console.log("🔍 Debug - Source:", source, "Identifier:", identifier);
    
    if (source === 'editScreen' || source === 'edit' || source === 'enableEmailEdit' || source === 'verifyNewEmail') {
      
      if (!identifier) {
        console.log("❌ Missing identifier");
        setDialogMessage("Missing email for verification");
        setDialogVisible(true);
        return;
      }
      
      try {
        let apiEndpoint;
        let requestBody;
        let headers = {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        };
        
        // Handle new email verification
        if (source === 'verifyNewEmail') {
          // console.log("📤 Sending OTP to new email using request-change API");
          
          const token = await AsyncStorage.getItem("authToken");
          // console.log("🔑 Token check:");
          // console.log("  - Token exists:", !!token);
          // console.log("  - Token length:", token ? token.length : 0);
          // console.log("  - Token preview:", token ? token.substring(0, 20) + "..." : "null");
          
          if (!token) {
            console.log("❌ No token found");
            setDialogMessage("Please login again");
            setDialogVisible(true);
            return;
          }
          
          apiEndpoint = `${BASE_API}/api/email/request-change`;
          requestBody = { newEmail: identifier };
          headers["Authorization"] = `Bearer ${token}`;
        } else {
          // Handle existing email verification (enableEmailEdit, editScreen, edit)
          console.log("📤 Sending OTP to existing email using login API");
          apiEndpoint = `${BASE_API}/api/auth/login`;
          requestBody = { identifier };
        }
        
        // console.log("📤 Final request details:");
        // console.log("  - URL:", apiEndpoint);
        // console.log("  - Method: POST");
        // console.log("  - Headers:", JSON.stringify(headers, null, 2));
        // console.log("  - Body:", JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestBody),
        });
        
        // console.log("📥 Response details:");
        // console.log("  - Status:", response.status);
        // console.log("  - Status Text:", response.statusText);
        // console.log("  - OK:", response.ok);
        // console.log("  - Headers:", JSON.stringify([...response.headers.entries()]));
        
        const contentType = response.headers.get("content-type");
        // console.log("  - Content-Type:", contentType);
        
        let data;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const textResponse = await response.text();
          // console.log("  - Non-JSON Response:", textResponse);
          setDialogMessage("Server returned invalid response format");
          setDialogVisible(true);
          return;
        }
        
        // console.log("  - Response data:", JSON.stringify(data, null, 2));
        
        if (!response.ok) {
          console.log("❌ API Error:");
          console.log("  - Status:", response.status);
          console.log("  - Message:", data.message);
          
          // More specific error handling
          if (response.status === 401) {
            setDialogMessage("Authentication failed. Please login again.");
          } else if (response.status === 404) {
            setDialogMessage("API endpoint not found. Please contact support.");
          } else if (response.status === 500) {
            setDialogMessage("Server error. Please try again later.");
          } else {
            setDialogMessage(data.message || `Request failed with status ${response.status}`);
          }
          setDialogVisible(true);
        } else {
          console.log("✅ OTP sent successfully");
        }
      } catch (error) {
        console.error("❌ Detailed Network Error:");
        console.error("  - Error name:", error.name);
        console.error("  - Error message:", error.message);
        console.error("  - Error stack:", error.stack);
        
        // More specific error messages
        if (error.message.includes('Network request failed')) {
          setDialogMessage("Network connection failed. Please check your internet connection.");
        } else if (error.message.includes('fetch')) {
          setDialogMessage("Unable to connect to server. Please check if the server is running.");
        } else if (error.message.includes('JSON')) {
          setDialogMessage("Server returned invalid data format.");
        } else {
          setDialogMessage(`Connection error: ${error.message}`);
        }
        setDialogVisible(true);
      }
    }
  };
  
  if (identifier && (source === 'editScreen' || source === 'edit' || source === 'enableEmailEdit' || source === 'verifyNewEmail')) {
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
          <Dialog.Title>Verification Failed</Dialog.Title>
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
            <Text style={{ color: "#6B7280" }}>
              {source === 'verifyNewEmail' 
                ? "Verification code sent to your new email address." 
                : "OTP sent to your email."}
            </Text>
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