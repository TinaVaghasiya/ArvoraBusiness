import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  Image,
} from "react-native";
import "../utils/api";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default function ResultScreen({ route, navigation }) {
  const {
    name: scannedName,
    designation: scannedDesignation,
    company: scannedCompany,
    email: scannedEmail,
    phone: scannedPhone,
    address: scannedAddress,
    imageUrl,
  } = route.params;

  const [name, setName] = useState(scannedName);
  const [designation, setDesignation] = useState(scannedDesignation);
  const [company, setCompany] = useState(scannedCompany);
  const [email, setEmail] = useState(scannedEmail);
  const [phone, setPhone] = useState(scannedPhone);
  const [address, setAddress] = useState(scannedAddress);
  const [note, setNote] = useState("");

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("designation", designation);
      formData.append("company", company);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("note", note);

      formData.append("image", {
        uri: imageUrl,
        type: "image/jpeg",
        name: "card.jpg",
      });

      const response = await fetch(
        `${BASE_API}/api/cards/save-card`,

        {
          method: "POST",

          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert("Saved!", "Card stored successfully", [
          {
            text: "OK",
            onPress: () => navigation.navigate("ListScreen"),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={230}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.imageCard}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Form Card */}

        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>

          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.label}>Designation</Text>

          <TextInput
            style={styles.input}
            value={designation}
            onChangeText={setDesignation}
          />

          <Text style={styles.label}>Company</Text>

          <TextInput
            style={styles.input}
            value={company}
            onChangeText={setCompany}
          />

          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone</Text>

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Address</Text>

          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter Address"
            multiline
          />

          <Text style={styles.label}>Note</Text>

          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add note..."
            multiline
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Card</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#dfe7f8",
  },
  container: {
    padding: 20,
    paddingBottom: 100,
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

  addressInput: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 70,
    lineHeight: 20,
    textAlignVertical: "top",
  },

  noteInput: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 90,
    lineHeight: 20,
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
