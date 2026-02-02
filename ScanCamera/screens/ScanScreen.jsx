import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Vibration,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";

export default function ScanScreen({ navigation }) {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const extractCardData = (text) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 1);

    let email = "Not detected";
    let phone = "Not detected";
    let name = "Not detected";
    let company = "Not detected";

    const companyKeywords = [
      "pvt",
      "ltd",
      "limited",
      "llp",
      "inc",
      "technologies",
      "technology",
      "solutions",
      "systems",
      "software",
      "studio",
      "labs",
      "corp",
      "company",
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || "";

      const hasKeyword = companyKeywords.some(
        (k) =>
          line.toLowerCase().includes(k) || nextLine.toLowerCase().includes(k),
      );

      const looksLikeCompany = (l) =>
        l.length > 3 && !l.includes("@") && !/\d/.test(l);

      if (
        company === "Not detected" &&
        hasKeyword &&
        looksLikeCompany(line) &&
        looksLikeCompany(nextLine)
      ) {
        company = `${line} ${nextLine}`;
        break;
      }

      if (company === "Not detected" && hasKeyword && looksLikeCompany(line)) {
        company = line;
      }
    }

    for (let line of lines) {
      if (
        email === "Not detected" &&
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(line)
      ) {
        email = line;
      }

      if (phone === "Not detected" && /(\+91[-\s]?)?[6-9]\d{9}/.test(line)) {
        phone = line;
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (
        line === company || 
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(line) || 
        /(\+91[-\s]?)?[6-9]\d{9}/.test(line) ||
        line.length < 2 ||
        line.length > 40 || 
        /\d/.test(line)
      ) {
        continue;
      }

      const wordCount = line.split(" ").length;
      if (wordCount <= 4) {
        name = line;
        break; 
      }
    }

    return { name, email, phone, company };
  };

  const scanCard = async () => {
    if (!cameraRef.current || scanning) return;

    try {
      setScanning(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        shutterSound: false,
      });
      const visionResult = await TextRecognition.recognize(photo.uri);
      const parsed = extractCardData(visionResult.text);
      Vibration.vibrate(150);
      navigation.navigate("Result", parsed);
    } catch (err) {
      console.log("Scan failed:", err);
    } finally {
      setScanning(false);
    }
  };

  const scanLinePosition = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 210],
  });

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} />

      <View style={styles.overlay}>
        <Text style={styles.instruction}>
          {scanning ? "Scanning..." : "Place card inside frame"}
        </Text>
        <View style={styles.scanFrame}>
          <Animated.View style={[styles.scanLine, { top: scanLinePosition }]} />
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={scanCard}
          disabled={scanning}
        >
          <Text style={styles.scanButtonText}>
            {scanning ? "Scanning..." : "Tap to Scan"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    
  },
  scanFrame: {
    width: 330,
    height: 210,
    borderWidth: 2,
    borderColor: "#979393",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginBottom: 60,
    marginTop: 100,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: "#3bee52",
  },
  instruction: {
    color: "#fff",
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 17,
    marginBottom: 30,
    marginTop: 100,
  },
  scanButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 35,
    paddingVertical: 16,
    borderRadius: 25,
  },
  scanButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { backgroundColor: "#2563EB", padding: 15, borderRadius: 10 },
  buttonText: { fontWeight: "bold", fontSize: 16, color: "#fff" },
});