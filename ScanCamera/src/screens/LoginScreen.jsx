import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import { BASE_API } from "../utils/api";
import { Dialog, Portal, Button } from "react-native-paper";
import { validateEmail, validatePhone } from "../utils/validation";

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigation = useNavigation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const handleSend = async () => {
    setError("");
    if (!identifier || !identifier.trim()) {
      setError("Please enter your email or phone number");
      return;
    }
    const isEmail = identifier.includes("@");
    if (isEmail) {
      const emailValidation = validateEmail(identifier);
      if (!emailValidation.isValid) { setError(emailValidation.error); return; }
    } else {
      const phoneValidation = validatePhone(identifier);
      if (!phoneValidation.isValid) { setError(phoneValidation.error); return; }
    }
    try {
      setLoading(true);
      const response = await fetch(`${BASE_API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setDialogMessage(data.message);
        setDialogVisible(true);
        return;
      }
      navigation.replace("OtpScreen", {
        identifier: identifier.trim(),
        user: data.user,
        source: "login",
      });
    } catch (error) {
      console.error("Error logging in:", error);
      setDialogMessage("An error occurred while logging in");
      setDialogVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.iconCircle}>
          <Entypo name="login" size={35} color="white" />
        </View>
        <Text style={styles.headerTitle}>Turn Every Business Card into a</Text>
        <Text style={styles.headerTitleBold}>Smart Searchable Contact</Text>
      </View>

      {/* Form - middle section */}
      <View style={styles.formWrapper}>
        <Text style={styles.subtitle}>Login with</Text>
        <View style={styles.inputContainer}>
          <Fontisto name="email" size={20} color="#606064" />
          <TextInput
            placeholder="Email or Phone Number"
            placeholderTextColor="#999"
            value={identifier}
            onChangeText={setIdentifier}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.5 }]}
          onPress={handleSend}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Sending..." : "Send OTP"}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom - hidden when keyboard is open */}
      {!keyboardVisible && <View style={styles.bottomWrapper} pointerEvents="box-none">
        <View style={styles.curve} />
        <Image
          source={require("../../assets/sitted.png")}
          style={styles.bottomImage}
          resizeMode="contain"
        />
        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>Don't have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
            <Text style={styles.bottomTextSign}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Login Failed</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: "#6B7280" }}>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topHeader: {
    width: "100%",
    height: height * 0.35,
    backgroundColor: "#1E3A8A",
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
    backgroundColor: "#4A61A1",
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
  formWrapper: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  subtitle: {
    fontSize: 24,
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    marginBottom: 20,
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
  errorText: {
    color: "red",
    fontSize: 13,
    alignSelf: "flex-start",
    marginTop: 8,
    marginLeft: 12,
  },
  button: {
    backgroundColor: "#1B347C",
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
    height: height * 0.32,
    alignItems: "center",
  },
  curve: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E6F3",
    borderTopLeftRadius: 140,
    borderTopRightRadius: 120,
  },
  bottomImage: {
    width: 300,
    height: height * 0.25,
    position: "absolute",
    bottom: 45,
    marginLeft: 40,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 18,
  },
  bottomText: {
    fontSize: 14,
    color: "#3f3f3f",
  },
  bottomTextSign: {
    fontSize: 14,
    color: "#3f3f3f",
    fontWeight: "bold",
  },
});
