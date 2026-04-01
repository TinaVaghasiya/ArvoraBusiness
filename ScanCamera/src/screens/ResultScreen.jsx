import { useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { BASE_API } from "../utils/api";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dialog, Portal, Button } from "react-native-paper";
import { validateEmail, validatePhone, validateName, validateWebsite, validateCompany, validateAddress } from "../utils/validation";
export default function ResultScreen({ route, navigation }) {
  const {
    name: scannedName,
    designation: scannedDesignation,
    company: scannedCompany,
    email: scannedEmail,
    phone: scannedPhone,
    website: scannedWebsite,
    address: scannedAddress,
    imageUrl,
  } = route.params;

  const [name, setName] = useState(scannedName);
  const [designation, setDesignation] = useState(scannedDesignation);
  const [company, setCompany] = useState(scannedCompany);
  const [email, setEmail] = useState(scannedEmail);
  const [address, setAddress] = useState(scannedAddress);
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState(scannedPhone);
  const [website, setWebsite] = useState(scannedWebsite);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [successDialogVisible, setSuccessDialogVisible] = useState(false);

  const handleNameChange = (text) => {
    setName(text.replace(/\d/g, ''));
  };

  const handlePhoneChange = (text) => {
    setPhone(text.replace(/[a-zA-Z]/g, ''));
  };

  const handleSave = async () => {
    // Validate Name (required)
    const nameValidation = validateName(name, "Name");
    if (!nameValidation.isValid) {
      setDialogMessage(nameValidation.error);
      setDialogVisible(true);
      return;
    }

    // Validate Email (optional but must be valid if provided)
    if (email && email.trim()) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setDialogMessage(emailValidation.error);
        setDialogVisible(true);
        return;
      }
    }

    // Validate Phone (optional but must be valid if provided)
    if (phone && phone.trim()) {
      const phoneValidation = validatePhone(phone.split('\n')[0]);
      if (!phoneValidation.isValid) {
        setDialogMessage(phoneValidation.error);
        setDialogVisible(true);
        return;
      }
    }

    // Validate Website (optional)
    const websiteValidation = validateWebsite(website);
    if (!websiteValidation.isValid) {
      setDialogMessage(websiteValidation.error);
      setDialogVisible(true);
      return;
    }

    // Validate Company (optional)
    const companyValidation = validateCompany(company);
    if (!companyValidation.isValid) {
      setDialogMessage(companyValidation.error);
      setDialogVisible(true);
      return;
    }

    // Validate Address (optional)
    const addressValidation = validateAddress(address);
    if (!addressValidation.isValid) {
      setDialogMessage(addressValidation.error);
      setDialogVisible(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setDialogMessage("Please login again.");
        setDialogVisible(true);
        navigation.replace("LoginScreen");
        return;
      }
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("designation", designation.trim());
      formData.append("company", company.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phone", phone.trim());
      formData.append("website", website.trim());
      formData.append("address", address.trim());
      formData.append("note", note.trim());

      formData.append("image", {
        uri: imageUrl,
        type: "image/jpeg",
        name: "card.jpg",
      });

      const response = await fetch(
        `${BASE_API}/api/cards/save-card`,

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        setName("");
        setDesignation("");
        setCompany("");
        setEmail("");
        setPhone("");
        setWebsite("");
        setAddress("");
        setNote("");

        setSuccessDialogVisible(true);
      }
    } catch (error) {
      setDialogMessage(error.message);
      setDialogVisible(true);
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

          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={handleNameChange}
            maxLength={50}
          />

          <Text style={styles.label}>Designation</Text>

          <TextInput
            style={styles.input}
            value={designation}
            onChangeText={setDesignation}
            maxLength={50}
          />

          <Text style={styles.label}>Company</Text>

          <TextInput
            style={styles.input}
            value={company}
            onChangeText={setCompany}
            maxLength={100}
          />

          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            maxLength={100}
          />

          <Text style={styles.label}>Phone</Text>

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            multiline={true}
          />

          <Text style={styles.label}>Website</Text>

          <TextInput
            style={styles.input}
            value={website}
            onChangeText={setWebsite}
            keyboardType="url"
            autoCapitalize="none"
            maxLength={100}
          />

          <Text style={styles.label}>Address</Text>

          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter Address"
            multiline
            maxLength={200}
          />

          <Text style={styles.label}>Note</Text>

          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add note..."
            multiline
            maxLength={500}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Card</Text>
        </TouchableOpacity>
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          >
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: "#6B7280" }}>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>OK</Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog
            visible={successDialogVisible}
            onDismiss={() => {
              setSuccessDialogVisible(false);
              navigation.replace("ListScreen");
            }}
          >
            <Dialog.Title>Saved!</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: "#6B7280" }}>Card stored successfully</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => {
                setSuccessDialogVisible(false);
                navigation.replace("ListScreen");
              }}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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

  addressInput: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: "auto",
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
