import React, { useEffect, useState } from "react";
import { View, Alert, Modal, Text, StyleSheet } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import * as Progress from "react-native-progress";
import "../utils/api";

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
    const formattedUri = imageUrl.startsWith("file://")
      ? imageUrl
      : "file://" + imageUrl;

    const formData = new FormData();
    formData.append("file", {
      uri: formattedUri,
      type: "image/jpeg",
      name: "card.jpg",
    });

    setLoading(true);

    let card = {};

    // First API extract-card
    try {
      console.log("Uploading to extract-card API...");
      const res = await fetch(`${OCR_API}/extract-card`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok)
        throw new Error(`extract-card API returned status ${res.status}`);

      const json = await res.json();
      card = json?.data?.[0] ?? {};
      console.log("extract-card success:", card);
    } catch (error) {
      console.warn(
        "extract-card failed:",
        error,
      );

      // Second API extract-business-data
      try {
        const res2 = await fetch(
          `${OCR_API}/extract-business-data`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!res2.ok)
          throw new Error(
            `extract-business-data API returned status ${res2.status}`,
          );

        const json2 = await res2.json();
        card = json2?.data?.[0] ?? {};
        console.log("extract-business-data success:", card);
      } catch (error2) {
        console.error("Both APIs failed:", error2);
        setLoading(false);
        Alert.alert("Error", `Failed to process the image: ${error2.message}`);
        navigation.goBack();
        return;
      }
    }

    const name = card?.name?.name1 ?? "";
    const designation =
      card?.designations?.des1 || card?.designations?.designation1 || "";
    const company =
      card?.company_name?.company1 || card?.company_name?.name1 || "";
    const email = card?.emails?.email1 ?? "";
    const phone = [
      card?.mobile_numbers?.ph1,
      card?.mobile_numbers?.ph2,
      card?.mobile_numbers?.ph3,
    ]
      .filter(Boolean)
      .join("\n");
    const address = card?.addresses?.add1 || card?.addresses?.address1 || "";

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
