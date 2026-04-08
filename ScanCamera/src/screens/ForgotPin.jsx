import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { BASE_API } from "../utils/api";
import { validateEmail } from "../utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ForgotPinScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loggedInEmail, setLoggedInEmail] = useState("");

    useEffect(() => {
        loadUserEmail();
    }, []);

    const loadUserEmail = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                // Decode JWT token to get user info
                const payload = JSON.parse(atob(token.split('.')[1]));
                setLoggedInEmail(payload.email?.toLowerCase() || "");
            }
        } catch (error) {
            console.error("Error loading user email from token:", error);
        }
    };

    const sendOtp = async () => {
        setError("");

        if (!email || !email.trim()) {
            setError("Please enter your email");
            return;
        }

        // Validate email format
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setError(emailValidation.error);
            return;
        }

        // Check if entered email matches logged-in email
        const enteredEmail = email.trim().toLowerCase();
        if (enteredEmail !== loggedInEmail) {
            setError("Please enter your registered email address");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${BASE_API}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
                },
                body: JSON.stringify({
                    identifier: enteredEmail
                }),
            });

            const data = await response.json();

            if (response.ok) {
                navigation.navigate("OtpScreen", {
                    identifier: enteredEmail,
                    source: "forgot-pin"
                });
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (error) {
            console.log("Error sending OTP:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#1E3A8A" />
            </TouchableOpacity>

            <Text style={styles.title}>Reset M-PIN</Text>
            <Text style={styles.subtitle}>
                Enter your registered email to reset your M-PIN
            </Text>

            <TextInput
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setError("");
                }}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={sendOtp}
                disabled={loading}
            >
                <Text style={styles.btnText}>
                    {loading ? "Sending..." : "Send OTP"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f7f7"
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
        marginTop: 100,
    },
    subtitle: {
        color: "#666",
        marginBottom: 30,
        textAlign: "left",
    },
    input: {
        borderWidth: 1,
        borderColor: "#1E3A8A",
        padding: 12,
        marginTop: 25,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: "#fff"
    },
    button: {
        backgroundColor: "#1E3A8A",
        padding: 13,
        marginTop: 25,
        borderRadius: 10
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    btnText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
    error: {
        color: "#EF4444",
        textAlign: "left",
        marginTop: 12,
        fontSize: 14,
        fontWeight: "500",
    },
});
