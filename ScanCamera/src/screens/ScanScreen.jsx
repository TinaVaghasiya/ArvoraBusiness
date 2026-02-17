import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import ImagePicker from "react-native-image-crop-picker";
import ScanBox from "../components/scanBox";
import isStable from "../utils/stabiltityDetector";

export default function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const backDevice = useCameraDevice("back");
  const frontDevice = useCameraDevice("front");
  const device = backDevice || frontDevice;
  const [stable, setStable] = useState(false);
  const cameraRef = useRef(null);
  const capturedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const permission = await Camera.requestCameraPermission();
        console.log("Camera permission status:", permission);
        if (permission === "granted") {
          setHasPermission(true);
          setTimeout(() => setIsReady(true), 1000);
        }
      } catch (error) {
        console.log("Permission error:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hasPermission || !device || processing) return;

    const interval = setInterval(() => {
      const result = isStable();
      setStable(result);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasPermission, device, processing]);

  useEffect(() => {
    if (stable && !capturedRef.current && cameraRef.current && device) {
      capturedRef.current = true;
      setTimeout(() => {
        capturePhoto();
      }, 1500);
    }
  }, [stable, device]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      capturedRef.current = false;
      setStable(false);
      setProcessing(false);
      setUploading(false);
    });

    return unsubscribe;
  }, [navigation]);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>No Camera Permission</Text>
      </View>
    );
  }

  if (!isReady || device == null) {
    return (
      <View style={styles.center}>
        <Text>Loading Camera...</Text>
      </View>
    );
  }

  if (uploading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Fetching...</Text>
        </View>
      </View>
    );
  }

  const capturePhoto = async () => {
    try {
      setProcessing(true);
      console.log("📸 Capture started");
      setStable(false);

      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: "quality",
      });

      const originalPath = "file://" + photo.path;

      const croppedImage = await ImagePicker.openCropper({
        path: originalPath,
        width: 1050,
        height: 600,
        compressImageQuality: 1.0,
        cropping: true,
        freeStyleCropEnabled: false,
        showCropGuidelines: true,
        showCropFrame: true,
        hideBottomControls: true,
        enableRotationGesture: true,
        disableCropperColorSetters: false,
      });

      setUploading(true);
      setProcessing(false);

      const formData = new FormData();
      formData.append("file", {
        uri: croppedImage.path.startsWith("file://")
          ? croppedImage.path
          : "file://" + croppedImage.path,
        type: "image/jpeg",
        name: "image.jpg",
      });

      console.log("📤 Sending to backend...");

      const res = await fetch("http://192.168.1.20:8000/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`API Error ${res.status}`);
      }

      const response = await res.json();
      console.log("📥 Backend response:", response);

      const extractedData =
        response.data && response.data[0] ? response.data[0] : {};

      console.log("📄 Extracted data:", extractedData);

      let name = "";
      let company = "";
      let email = "";
      let phone = "";

      if (extractedData.name && Object.keys(extractedData.name).length > 0) {
        const nameKey = Object.keys(extractedData.name)[0];
        name = extractedData.name[nameKey];
      }

      if (
        extractedData.company_name &&
        Object.keys(extractedData.company_name).length > 0
      ) {
        const companyKey = Object.keys(extractedData.company_name)[0];
        company = extractedData.company_name[companyKey];
      }

      if (
        extractedData.emails &&
        Object.keys(extractedData.emails).length > 0
      ) {
        const emailKey = Object.keys(extractedData.emails)[0];
        email = extractedData.emails[emailKey];
      }

      if (
        extractedData.mobile_numbers &&
        Object.keys(extractedData.mobile_numbers).length > 0
      ) {
        const phoneKey = Object.keys(extractedData.mobile_numbers)[0];
        phone = extractedData.mobile_numbers[phoneKey];
      }

      const rawText = extractedData.details
        ? extractedData.details.join(" ")
        : "";

      console.log("📝 Final extracted:", { name, company, email, phone });

      setUploading(false);

      navigation.navigate("Result", {
        name: name || "Not detected",
        company: company || "Not detected",
        email: email || "Not detected",
        phone: phone || "Not detected",
        rawText: rawText,
        imageUri: croppedImage.path,
      });
    } catch (err) {
      console.log("❌ Error:", err.message);
      capturedRef.current = false;
      setStable(false);
      setUploading(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isReady && !!device}
        photo={true}
      />
      <ScanBox stable={stable} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingBox: {
    backgroundColor: "#484747",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
    marginTop: 20,
  },
});
