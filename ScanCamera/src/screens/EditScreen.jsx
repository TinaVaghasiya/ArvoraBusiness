// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   Animated,
// } from "react-native";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { BASE_API } from "../utils/api";

// export default function EditScreen({ route, navigation }) {
//   const { field, value, onSuccess } = route.params;
//   const [input, setInput] = useState(value || "");
//   const [loading, setLoading] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const getTitle = () => {
//     switch (field) {
//       case "name": return "Edit Full Name";
//       case "phone": return "Edit Phone Number";
//       case "email": return "Edit Email";
//       case "company": return "Edit Company";
//       default: return "Edit";
//     }
//   };

//   const showToast = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 150,
//       useNativeDriver: true,
//     }).start();

//     if (type === "success") {
//       setTimeout(() => {
//         if (onSuccess) {
//           onSuccess(message, type);
//         }
//         navigation.goBack();
//       }, 700);
//     }
//   };

// const handleSave = async () => {
//   if (!input.trim()) {
//     showToast("Field cannot be empty", "error");
//     return;
//   }

//   try {
//     setLoading(true);

//     const token = await AsyncStorage.getItem("authToken");
    
//     if (!token) {
//       showToast("Please login again", "error");
//       return;
//     }

//     const response = await fetch(`${BASE_API}/api/user/profileupdate`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           [field]: input,
//         }),
//       }
//     );

//     const contentType = response.headers.get("content-type");
    
//     if (!contentType || !contentType.includes("application/json")) {
//       const textResponse = await response.text();
//       console.log("Server returned HTML:", textResponse);
//       showToast("API endpoint not found", "error");
//       return;
//     }

//     const data = await response.json();

//     if (!response.ok) {
//       if (data?.message?.toLowerCase().includes("phone")) {
//         showToast("Phone number already exists", "error");
//       } else {
//         showToast(data?.message || "Something went wrong", "error");
//       }
//       return;
//     }
    
//     const stored = await AsyncStorage.getItem("userData");
//     const user = JSON.parse(stored);
//     user[field] = input;
//     await AsyncStorage.setItem("userData", JSON.stringify(user));

//     showToast("Updated successfully", "success");

//   } catch (error) {
//     console.log("Full error:", error);
//     if (error.message.includes("JSON Parse error")) {
//       showToast("Server returned invalid response", "error");
//     } else {
//       showToast("Network error", "error");
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   const isDisabled = !input.trim() || loading || input.trim() === value?.trim();

//   return (
//     <SafeAreaView style={styles.container}>
      
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Ionicons name="arrow-back" size={24} color="#1E293B" />
//       </TouchableOpacity>

//       <Text style={styles.title}>{getTitle()}</Text>

//       <Text style={styles.label}>
//         {field === "name" ? "Full Name *" :
//          field === "phone" ? "Phone Number *" :
//          field === "email" ? "Email *" :
//          "Company"}
//       </Text>

//       <TextInput
//         value={input}
//         onChangeText={setInput}
//         style={styles.input}
//         keyboardType={field === "phone" ? "numeric" : "default"}
//       />

//       <TouchableOpacity
//         style={[
//           styles.button,
//           isDisabled && { backgroundColor: "#BFDBFE" },
//         ]}
//         onPress={handleSave}
//         disabled={isDisabled}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Save Changes</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Text style={styles.cancel}>Cancel</Text>
//       </TouchableOpacity>

//       {toastMessage ? (
//         <Animated.View style={[
//           styles.toast,
//           { opacity: fadeAnim },
//           toastType === "error" ? styles.toastError : styles.toastSuccess
//         ]}>
//           <MaterialIcons 
//             name={toastType === "error" ? "error" : "check-circle"} 
//             size={20} 
//             color="#fff" 
//           />
//           <Text style={styles.toastText}>{toastMessage}</Text>
//         </Animated.View>
//       ) : null}

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#F8FAFC" },

//   title: {
//     fontSize: 26,
//     fontWeight: "700",
//     marginTop: 30,
//     marginBottom: 20,
//   },

//   label: {
//     fontSize: 14,
//     marginBottom: 8,
//     color: "#334155",
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#B2BEB5",
//     borderRadius: 12,
//     padding: 13,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     marginBottom: 40,
//   },

//   button: {
//     backgroundColor: "#1E3A8A",
//     padding: 16,
//     borderRadius: 30,
//     alignItems: "center",
//   },

//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//   },

//   cancel: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#1E3A8A",
//     padding: 14,
//     borderRadius: 20,
//     fontWeight: "700",
//     borderColor: "#DCDCDC",
//     borderWidth: 1,
//   },
//   toast: {
//     position: "absolute",
//     top: 70,
//     left: 40,
//     right: 40,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 38,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   toastSuccess: {
//     backgroundColor: "#10B981",
//   },
//   toastError: {
//     backgroundColor: "#EF4444",
//   },
//   toastText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
// });

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_API } from "../utils/api";

export default function EditScreen({ route, navigation }) {
  const { userData } = route.params;
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    company: userData.company || "",
  });

  const [originalEmail] = useState(userData.email || "");
  const [emailEditable, setEmailEditable] = useState(false);
  const [newEmailVerified, setNewEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- LOGIC SECTION ---
  useFocusEffect(
    React.useCallback(() => {
      const checkVerificationResult = async () => {
        const verificationResult = await AsyncStorage.getItem("emailVerificationResult");
        if (verificationResult) {
          const result = JSON.parse(verificationResult);
          if (result.success) {
            if (result.type === "enableEmailEdit") {
              setEmailEditable(true);
              showToast("Email verified! You can now edit it", "success");
            } else if (result.type === "verifyNewEmail") {
              setNewEmailVerified(true);
              showToast("New email verified successfully", "success");
            }
          }
          await AsyncStorage.removeItem("emailVerificationResult");
        }
      };
      checkVerificationResult();
    }, [])
  );

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setToastMessage("");
      });
    }, 2000);
  };

  const handleVerifyCurrentEmail = () => {
    navigation.navigate('OtpScreen', { identifier: originalEmail, source: 'enableEmailEdit', verificationType: 'enableEmailEdit' });
  };

  const handleVerifyNewEmail = () => {
    if (!formData.email.trim()) { showToast("Please enter email first", "error"); return; }
    navigation.navigate('OtpScreen', { identifier: formData.email, source: 'verifyNewEmail', verificationType: 'verifyNewEmail' });
  };

  const handleEmailChange = (text) => {
    setFormData({ ...formData, email: text });
    if (text !== originalEmail) { setNewEmailVerified(false); }
    else { setNewEmailVerified(true); }
  };

  const isEmailChanged = () => formData.email !== originalEmail;

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      showToast("Name, email and phone are required", "error");
      return;
    }
    if (isEmailChanged() && !newEmailVerified) {
      showToast("Please verify your new email first", "error");
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_API}/api/user/profileupdate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const stored = await AsyncStorage.getItem("userData");
        const user = JSON.parse(stored);
        await AsyncStorage.setItem("userData", JSON.stringify({ ...user, ...formData }));
        showToast("Profile updated successfully", "success");
        setTimeout(() => navigation.goBack(), 1500);
      }
    } catch (error) { showToast("Network error", "error"); }
    finally { setLoading(false); }
  };

  const canSave = () => {
    if (isEmailChanged() && !newEmailVerified) return false;
    return true;
  };

  // --- UI SECTION ---
    return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Card Container */}
        <View style={styles.card}>
          
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                style={styles.input}
                placeholder="Enter your full name"
              />
            </View>
          </View>

          {/* Email Section */}
          <View style={styles.inputGroup}>
            <View style={styles.emailHeader}>
              <Text style={styles.label}>Email *</Text>
              {!emailEditable ? (
                <TouchableOpacity onPress={handleVerifyCurrentEmail}>
                  <Text style={styles.inlineVerifyText}>Verify to Edit</Text>
                </TouchableOpacity>
              ) : isEmailChanged() && !newEmailVerified ? (
                <TouchableOpacity onPress={handleVerifyNewEmail}>
                  <Text style={styles.inlineVerifyText}>Verify New Email</Text>
                </TouchableOpacity>
              ) : isEmailChanged() && newEmailVerified ? (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="check-circle" size={14} color="#10B981" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              ) : null}
            </View>
            <View style={[styles.inputWrapper, !emailEditable && styles.disabledWrapper]}>
              <Feather name="mail" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                value={formData.email}
                onChangeText={handleEmailChange}
                style={[styles.input, !emailEditable && styles.disabledInput]}
                editable={emailEditable}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailEditable && isEmailChanged() && !newEmailVerified && (
              <Text style={styles.warningText}>Verification required for change</Text>
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={styles.inputWrapper}>
              <Feather name="phone" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                style={styles.input}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Company */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company</Text>
            <View style={styles.inputWrapper}>
              <Feather name="briefcase" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                value={formData.company}
                onChangeText={(text) => setFormData({...formData, company: text})}
                style={styles.input}
                placeholder="Update testing"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, (!canSave() || loading) && styles.disabledButton]}
            onPress={handleSave}
            disabled={!canSave() || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButtonContainer}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Toast Notification */}
      {toastMessage ? (
        <Animated.View style={[styles.toast, { opacity: fadeAnim }, toastType === "error" ? styles.toastError : styles.toastSuccess]}>
          <MaterialIcons name={toastType === "error" ? "error" : "check-circle"} size={20} color="#fff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    top: 15
  },
  backButton: {
    padding: 8,
  },
  title: { fontSize: 22, fontWeight: "700", marginLeft: 15, color: "#1E293B",  },
  scrollContent: { paddingBottom: 40 },
  
  // Card Design
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: "600", color: "#64748B", marginBottom: 8, marginLeft: 4 },
  
  // Refined Input Wrappers
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    backgroundColor: "#FBFDFF",
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "500",
  },
  disabledWrapper: { backgroundColor: "#F1F5F9", borderColor: "#CBD5E1" },
  disabledInput: { color: "#94A3B8" },

  // Email Header & Verification
  emailHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  inlineVerifyText: { color: "#2563EB", fontSize: 12, fontWeight: "700", marginBottom: 8 },
  verifiedBadge: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  verifiedText: { color: "#10B981", fontSize: 12, fontWeight: "700", marginLeft: 4 },
  warningText: { color: "#F59E0B", fontSize: 11, marginTop: 4, marginLeft: 4, fontWeight: "500" },

  // Buttons
  buttonContainer: { marginTop: 30, paddingHorizontal: 25 },
  saveButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: { backgroundColor: "#94A3B8", shadowOpacity: 0 },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelButtonContainer: { marginTop: 15, alignItems: "center", padding: 10 },
  cancelButtonText: { color: "#64748B", fontWeight: "600", fontSize: 15 },

  // Toast
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  toastSuccess: { backgroundColor: "#10B981" },
  toastError: { backgroundColor: "#EF4444" },
  toastText: { color: "#fff", fontSize: 14, fontWeight: "600", marginLeft: 10 },
});