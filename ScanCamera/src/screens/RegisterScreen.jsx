import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BASE_API } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dialog, Portal, Button } from "react-native-paper";
import {
  validateEmail,
  validatePhone,
  validateName,
  validateCompany,
} from "../utils/validation";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleRegister = async () => {
    setError("");

    // Validate First Name
    const firstNameValidation = validateName(firstName, "First name");
    if (!firstNameValidation.isValid) {
      setError(firstNameValidation.error);
      return;
    }

    // Validate Last Name
    // const lastNameValidation = validateName(lastName, "Last name");
    // if (!lastNameValidation.isValid) {
    //   setError(lastNameValidation.error);
    //   return;
    // }

    // Validate Email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return;
    }

    // Validate Phone
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error);
      return;
    }

    // Validate Company (optional)
    const companyValidation = validateCompany(company);
    if (!companyValidation.isValid) {
      setError(companyValidation.error);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          company: company.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDialogMessage(data.message || "Try again");
        setDialogVisible(true);
        return;
      }

      if (data.token) {
        await AsyncStorage.setItem("userToken", data.token);
      }

      if (data.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));
      }

      navigation.replace("OtpScreen", {
        identifier: email.trim(),
        user: data.user,
        isNewUser: true,
        source: "register",
      });
    } catch (error) {
      console.error("Error registering:", error);
      setDialogMessage("An error occurred while registering");
      setDialogVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="user-plus" size={26} color="white" />
          </View>
          <Text style={styles.subtitle}>Sign Up to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.row}>
            <TextInput
              placeholder="First Name *"
              placeholderTextColor="#999"
              style={styles.inputHalf}
              value={firstName}
              onChangeText={(text) => setFirstName(text.replace(/\d/g, ""))}
              editable={!loading}
              maxLength={50}
            />
            <TextInput
              placeholder="Last Name *"
              placeholderTextColor="#999"
              style={styles.inputHalf}
              value={lastName}
              onChangeText={(text) => setLastName(text.replace(/\d/g, ""))}
              editable={!loading}
              maxLength={50}
            />
          </View>

          <TextInput
            placeholder="E-mail *"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
            maxLength={100}
          />

          <TextInput
            placeholder="+91 XXXXXXXXXX *"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => setPhone(text.replace(/[^0-9+\-() ]/g, ""))}
            editable={!loading}
            maxLength={15}
          />

          <TextInput
            placeholder="Company Name (Optional)"
            placeholderTextColor="#999"
            style={styles.input}
            value={company}
            onChangeText={setCompany}
            editable={!loading}
            maxLength={100}
          />
        </View>

        {error ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <MaterialIcons name="error-outline" size={20} color="red" />
            <Text
              style={{
                color: "red",
                fontSize: 13,
                marginLeft: 8,
                textAlign: "start",
              }}
            >
              {error}
            </Text>
          </View>
        ) : (
          <Text
            style={{
              color: "red",
              fontSize: 14,
              marginLeft: 20,
              textAlign: "start",
            }}
          >
            * Fields are required
          </Text>
        )}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text
            style={[
              styles.buttonText,
              loading && { opacity: 0.5, backgroundColor: "#1E3A8A" },
            ]}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomWrapper}>
          <View style={styles.curve} />
          <Image
            source={require("../../assets/register4.png")}
            style={styles.bottomImage}
          />

          <View style={styles.bottomSection}>
            <Text style={styles.bottomText}>Already have an Account? </Text>
            <TouchableOpacity
              style={{ fontWeight: "bold" }}
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.bottomTextSign}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          >
            <Dialog.Title>Registration Failed</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: "#6B7280" }}>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f7f7",
  },

  titleContainer: {
    textAlign: "center",
    width: "100%",
    height: 220,
    backgroundColor: "#1E3A8A",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  iconCircle: {
    backgroundColor: "#4A61A1",
    width: 75,
    height: 75,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f1f6f9",
    marginLeft: 20,
    marginTop: 20,
    alignItems: "center",
  },

  form: {
    marginHorizontal: 20,
    marginTop: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    marginLeft: 8,
  },

  inputHalf: {
    width: "48%",
    borderBottomWidth: 1.5,
    borderBottomColor: "#2565a1",
    paddingVertical: 15,
    marginBottom: 10,
    fontSize: 16,
    alignSelf: "center",
  },

  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#2565a1",
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    width: "95%",
    alignSelf: "center",
  },

  button: {
    backgroundColor: "#1B347C",
    paddingVertical: 14,
    borderRadius: 14,
    alignSelf: "center",
    elevation: 3,
    marginTop: 19,
    width: "40%",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
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
    backgroundColor: "#E5E6F3",
    borderTopLeftRadius: 140,
    borderTopRightRadius: 120,
  },

  bottomImage: {
    width: 210,
    height: 160,
    position: "absolute",
    bottom: 80,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
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
  },
});
