import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_API } from "../utils/api";

export default function EditField({ route, navigation }) {
  const { field, value, onSuccess } = route.params;
  const [input, setInput] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getTitle = () => {
    switch (field) {
      case "name": return "Edit Full Name";
      case "phone": return "Edit Phone Number";
      case "email": return "Edit Email";
      case "company": return "Edit Company";
      default: return "Edit";
    }
  };

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();

    if (type === "success") {
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(message, type);
        }
        navigation.goBack();
      }, 700);
    }
  };

const handleSave = async () => {
  if (!input.trim()) {
    showToast("Field cannot be empty", "error");
    return;
  }

  try {
    setLoading(true);

    const token = await AsyncStorage.getItem("authToken");
    
    if (!token) {
      showToast("Please login again", "error");
      return;
    }

    const response = await fetch(`${BASE_API}/api/user/profileupdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [field]: input,
        }),
      }
    );

    const contentType = response.headers.get("content-type");
    
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.log("Server returned HTML:", textResponse);
      showToast("API endpoint not found", "error");
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      if (data?.message?.toLowerCase().includes("phone")) {
        showToast("Phone number already exists", "error");
      } else {
        showToast(data?.message || "Something went wrong", "error");
      }
      return;
    }
    
    const stored = await AsyncStorage.getItem("userData");
    const user = JSON.parse(stored);
    user[field] = input;
    await AsyncStorage.setItem("userData", JSON.stringify(user));

    showToast("Updated successfully", "success");

  } catch (error) {
    console.log("Full error:", error);
    if (error.message.includes("JSON Parse error")) {
      showToast("Server returned invalid response", "error");
    } else {
      showToast("Network error", "error");
    }
  } finally {
    setLoading(false);
  }
};

  const isDisabled = !input.trim() || loading || input.trim() === value?.trim();

  return (
    <SafeAreaView style={styles.container}>
      
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#1E293B" />
      </TouchableOpacity>

      <Text style={styles.title}>{getTitle()}</Text>

      <Text style={styles.label}>
        {field === "name" ? "Full Name *" :
         field === "phone" ? "Phone Number *" :
         field === "email" ? "Email *" :
         "Company"}
      </Text>

      <TextInput
        value={input}
        onChangeText={setInput}
        style={styles.input}
        keyboardType={field === "phone" ? "numeric" : "default"}
      />

      <TouchableOpacity
        style={[
          styles.button,
          isDisabled && { backgroundColor: "#BFDBFE" },
        ]}
        onPress={handleSave}
        disabled={isDisabled}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>

      {toastMessage ? (
        <Animated.View style={[
          styles.toast,
          { opacity: fadeAnim },
          toastType === "error" ? styles.toastError : styles.toastSuccess
        ]}>
          <MaterialIcons 
            name={toastType === "error" ? "error" : "check-circle"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#334155",
  },

  input: {
    borderWidth: 1,
    borderColor: "#B2BEB5",
    borderRadius: 12,
    padding: 13,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#1E3A8A",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  cancel: {
    textAlign: "center",
    marginTop: 20,
    color: "#1E3A8A",
    padding: 14,
    borderRadius: 20,
    fontWeight: "700",
    borderColor: "#DCDCDC",
    borderWidth: 1,
  },
  toast: {
    position: "absolute",
    top: 70,
    left: 40,
    right: 40,
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
  toastSuccess: {
    backgroundColor: "#10B981",
  },
  toastError: {
    backgroundColor: "#EF4444",
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});