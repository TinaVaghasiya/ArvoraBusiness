import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

export default function ResultScreen({ route, navigation }) {
  const {
    name: scannedName,
    company: scannedCompany,
    email: scannedEmail,
    phone: scannedPhone,
  } = route.params;

  const [name, setName] = useState(scannedName);
  const [company, setCompany] = useState(scannedCompany);
  const [email, setEmail] = useState(scannedEmail);
  const [phone, setPhone] = useState(scannedPhone);
  const [note, setNote] = useState("");

  const handleSave = async () => {
    try {
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
        setName("");
        setCompany("");
        setEmail("");
        setPhone("");
        setNote("");
      } else {
        Alert.alert("Error", "Failed to save card");
      }
    } catch (error) {
      Alert.alert("Error", "Server not reachable");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fcfcfc" }}
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Name</Text>
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

        <Text style={styles.label}>
          Note
          <Text style={{ fontWeight: "400", color: "#5a5656", fontSize: 14 }}>
            {" "}
            (Optional)
          </Text>
        </Text>
        <TextInput
          style={styles.inputbox}
          value={note}
          onChangeText={setNote}
          placeholder="Enter Note"
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputbox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
