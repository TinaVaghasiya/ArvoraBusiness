import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import DocumentScanner from "react-native-document-scanner-plugin";
import * as Progress from "react-native-progress";

export default function ScanScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    startScan();
  }, []);

  const startScan = async () => {
    try {
      console.log("📸 Opening scanner...");

      const { scannedImages } = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
        responseType: "imageFilePath",
      });

      if (!scannedImages?.length) {
        navigation.goBack();
        return;
      }

      const imageUri = scannedImages[0];
      setLoading(true);

      await uploadToBackend(imageUri);
    } catch (error) {
      Alert.alert("Error", "Scanning failed");
      navigation.goBack();
    }
  };

  const uploadToBackend = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "card.jpg",
      });

      const res = await fetch("http://192.168.1.20:8000/extract", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      const card = json?.data?.[0] ?? {};

      setLoading(false);

      navigation.replace("Result", {
        name: card?.name?.name1 ?? "",
        company: card?.company_name?.company1 ?? "",
        email: card?.emails?.email1 ?? "",
        phone: card?.mobile_numbers?.ph1 ?? "",
        imageUri,
      });
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to send image to server");
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.loaderBox}>
            <Progress.Bar
              indeterminate
              width={220}
              height={10}
              color="#2563EB"
              unfilledColor="#E5E7EB"
              borderWidth={0}
              borderRadius={15}
            />
          </View>
          <Text style={{ marginTop: 10, fontSize: 16, color: "#E5E7EB" }}>Processing...</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(8, 8, 8, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loaderBox: {
    backgroundColor: "#E5E7EB",
    padding: 2,
    borderRadius: 14,
    alignItems: "center",
    width: 225,
  },
});
