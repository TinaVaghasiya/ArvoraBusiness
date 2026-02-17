// import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// export default function HomeScreen() {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <Image 
//         source={require("../../assets/heading1removebg.png")} 
//         style={styles.headingImage} 
        
//       />
//         <Image 
//           source={require("../../assets/Untitleddesign.png")} 
//           style={styles.mainImage} 
//         />

//       <Text style={styles.title}>Scan Business Cards</Text>
//       <Text style={styles.subtitle}>
//         Extract card details instantly with smart scanning
//       </Text>

//       <TouchableOpacity
//         style={styles.button}
//         activeOpacity={0.8}
//         onPress={() => navigation.navigate("Scan")}
//       >
//         <Text style={styles.buttonText}>Start Scanning</Text>
//       </TouchableOpacity>

//       <Text style={styles.footerText}>
//         Powered by arvora.business
//       </Text>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//     alignItems: "center",
//     paddingTop: 70,
//   },
//    headingImage: {
//     width: "135%",
//     height: 150,
//     marginBottom: 20,
//   },
//   mainImage: {
//     width: "150%",
//     height: 200,
//     marginBottom: 25,
//   },

//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#111827",
//     marginTop: 5,
//   },

//   subtitle: {
//     fontSize: 15,
//     color: "#6B7280",
//     marginTop: 6,
//     textAlign: "center",
//     paddingHorizontal: 30,
//   },

//   button: {
//     marginTop: 40,
//     backgroundColor: "#2563EB",
//     width: "80%",
//     height: 56,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//   },

//   buttonText: {
//     color: "#ffffff",
//     fontSize: 18,
//     fontWeight: "600",
//   },

//   footerText: {
//     marginTop: 30,
//     fontSize: 12,
//     color: "#9CA3AF",
//   },
// });
import { View, Text, StyleSheet, TouchableOpacity, Image, BackHandler, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function HomeScreen() {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() }
          ]
        );
        return true; // prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/heading1removebg.png")} 
        style={styles.headingImage} 
        
      />
        <Image 
          source={require("../assets/Untitleddesign.png")} 
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

      <Text style={styles.footerText}>
        Powered by arvora.business
      </Text>

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
});