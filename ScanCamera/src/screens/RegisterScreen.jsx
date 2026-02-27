import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const handleRegister = async () => {
    try {
      if (!firstName || !lastName || !email || !phone) {
        Alert.alert("Please fill all required fields");
        return;
      }

      const response = await fetch(`${BASE_API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          phone,
          company, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Registration Failed", data.message || "Try again");
        return;
      }

      Alert.alert("Success", "Account created successfully!");

      navigation.replace("OtpScreen", {
        identifier: email,
        user: data.user,
      });

    } catch (error) {
      console.error("Error registering:", error);
      Alert.alert("Error", "An error occurred while registering");
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
              placeholder="First Name"
              placeholderTextColor="#999"
              style={styles.inputHalf}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#999"
              style={styles.inputHalf}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="+91 Mobile Number"
            placeholderTextColor="#999"
            style={styles.input}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            placeholder="Company Name (Optional)"
            placeholderTextColor="#999"
            style={styles.input}
            value={company}
            onChangeText={setCompany}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

         <View style={styles.bottomWrapper}>
          <View style={styles.curve} />
          <Image
            source={require("../../assets/register4.png")}
            style={styles.bottomImage}
          />

          <View style={styles.bottomSection}>
            <Text style={styles.bottomText}>
              Already have an Account?{" "}
            </Text>
            <TouchableOpacity style={{ fontWeight: "bold" }} onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.bottomTextSign}>Sign In
              </Text>
              </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: "#4c7de8",
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
    backgroundColor: "#6a9bf1",
    width: 75,
    height: 75,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 20,
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
    backgroundColor: "#3973df",
    paddingVertical: 14,
    borderRadius: 14,
    alignSelf: "center",
    elevation: 3,
    marginTop: 19,
    width: "40%",
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
    backgroundColor: "#d6e5fd",
    borderTopLeftRadius: 140,
    borderTopRightRadius: 120,
  },

  bottomImage: {
    width: 220,
    height: 160,
    position: "absolute",
    bottom: 90,
    marginLeft: 40,
  },
  bottomSection: {
    flexDirection:"row",
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
  }
});