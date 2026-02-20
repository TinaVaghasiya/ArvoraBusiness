import { View, Text, StyleSheet, TouchableOpacity, Image, BackHandler, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";


export default function HomeScreen() {
  // useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => {
  //       Alert.alert(
  //         "Exit App",
  //         "Are you sure you want to exit?",
  //         [
  //           { text: "Cancel", style: "cancel" },
  //           { text: "Exit", onPress: () => BackHandler.exitApp() }
  //         ]
  //       );
  //       return true;
  //     };

  //     // const subscription = BackHandler.addEventListener(
  //     //   "hardwareBackPress",
  //     //   onBackPress
  //     // );

  //     return () => subscription.remove();
  //   }, [])
  // );

  const [exitModalVisible, setExitModalVisible] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
    setExitModalVisible(false);
    
    const onBackPress = () => {
      setExitModalVisible(true);
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [])
);


  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/heading1removebg.png")}
        style={styles.headingImage}

      />
      <Image
        source={require("../../assets/Untitleddesign.png")}
        style={styles.mainImage}
      />

      <Text style={styles.title}>Scan Business Cards</Text>
      <Text style={styles.subtitle}>
        Extract card details instantly with smart scanning
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("ScanScreen")}
      >
        <Text style={styles.buttonText}>Start Scanning</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ListScreen")}>
        <Text style={{
          color: "#2563EB",
          fontSize: 16,
          marginTop: 15,
          fontWeight: "600",
        }}>View Saved Cards</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Powered by arvora.business
      </Text>

      <Modal
        visible={exitModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Exit App</Text>
            <Text style={styles.alertMessage}>Are you sure you want to exit?</Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={[styles.alertButton, styles.cancelButton]}
                onPress={() => setExitModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.alertButton, styles.exitButton]}
                onPress={() => BackHandler.exitApp()}
              >
                <Text style={styles.exitText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: 70,
  },
  headingImage: {
    width: "135%",
    height: 150,
    marginBottom: 20,
  },
  mainImage: {
    width: "150%",
    height: 200,
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 5,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 30,
  },

  button: {
    marginTop: 40,
    backgroundColor: "#2563EB",
    width: "80%",
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },

  footerText: {
    marginTop: 30,
    fontSize: 12,
    color: "#9CA3AF",
  },
   modalOverlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "75%",
    height: "20%"
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  alertButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  alertButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#e9eaed",
  },
  exitButton: {
    backgroundColor: "#da4961",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },
  exitText: {
    color: "#fff",
    fontWeight: "600",
  },
});