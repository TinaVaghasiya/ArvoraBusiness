import React, { useEffect, useState } from "react";
import { View, Alert, Modal, Text, StyleSheet } from "react-native";
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

  const uploadToBackend = async (imageUrl) => {
    try {
      const formattedUri = imageUrl.startsWith("file://")
        ? imageUrl
        : "file://" + imageUrl;

      const formData = new FormData();
      formData.append("file", {
        uri: formattedUri,
        type: "image/jpeg",
        name: "card.jpg",
      });
      console.log("Image URI:", formattedUri);

      const res = await fetch("http://192.168.1.6:8000/extract-business-data", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("API Error - Status:", res.status);
        throw new Error(`Server returned status ${res.status}`);
      }

      const json = await res.json();
      // console.log("API Response:", json);

      const card = json?.data?.[0] ?? {};
      console.log("Extracted card data:", card);

      const name = card?.name?.name1 ?? "";
      const designation = card?.designations?.designation1 ?? "";
      const company = card?.company_name?.company1 ?? "";
      const email = card?.emails?.email1 ?? "";

      const phone = [
        card?.mobile_numbers?.ph1,
        card?.mobile_numbers?.ph2,
        card?.mobile_numbers?.ph3,
      ]
        .filter(Boolean)
        .join(", ");

      const address = card?.addresses?.address1 ?? "";

      console.log("Final card data:", {
        name,
        designation,
        company,
        email,
        phone,
        address,
      });

      setLoading(false);

      if (name.trim() || company.trim() || email.trim() || phone.trim()) {
        navigation.replace("ResultScreen", {
          name,
          designation,
          company,
          email,
          phone,
          address,
          imageUrl,
        });
      } else {
        navigation.replace("ScanScreen");
      }
    } catch (error) {
      console.error("Full error details:", error);

      setLoading(false);
      Alert.alert("Error", `Failed to send image to server: ${error.message}`);
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
          <Text style={{ marginTop: 10, fontSize: 16, color: "#E5E7EB" }}>
            Processing...
          </Text>
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
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  loaderBox: {
    backgroundColor: "#E5E7EB",
    padding: 2,
    borderRadius: 14,
    alignItems: "center",
    width: 225,
  },
});