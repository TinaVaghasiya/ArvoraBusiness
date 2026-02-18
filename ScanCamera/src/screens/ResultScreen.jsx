import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";

export default function ResultScreen({ route, navigation }) {
  const {
    name: scannedName,
    company: scannedCompany,
    email: scannedEmail,
    phone: scannedPhone,
    imageUri,
  } = route.params;

  const [name, setName] = useState(scannedName);
  const [company, setCompany] = useState(scannedCompany);
  const [email, setEmail] = useState(scannedEmail);
  const [phone, setPhone] = useState(scannedPhone);
  const [note, setNote] = useState("");

  const handleSave = async () => {
    try {
      console.log("🔄 Attempting to save...");
      const response = await fetch(
        "http://192.168.1.11:5000/api/cards/save-card",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            company,
            email,
            phone,
            note,
          }),
        },
      );
      const data = await response.json();

      if (data.success) {
        Alert.alert("Saved!", "Card stored in database successfully");
      } else {
        Alert.alert("Error", "Failed to save card");
      }
    } catch (error) {
      Alert.alert("Error", `Server not reachable: ${error.message}`);
    }
  };

  return (
  <KeyboardAvoidingView style={styles.root} behavior="padding">
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.title}>Contact Details</Text>
      {/* Image Card */}
      <View style={styles.imageCard}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Name"
        />

        <Text style={styles.label}>Company</Text>
        <TextInput
          style={styles.input}
          value={company}
          onChangeText={setCompany}
          placeholder="Enter Company"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter Phone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Note (Optional)</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Add note..."
          multiline
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Contact</Text>
      </TouchableOpacity>

    </ScrollView>
  </KeyboardAvoidingView>
);

}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#dfe7f8",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
    color: "#1F2937",
  },

  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },

  formCard: {
    backgroundColor: "#eff2f4",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },

  input: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  noteInput: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 90,
    textAlignVertical: "top",
  },

  saveButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    elevation: 3,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

