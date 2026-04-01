import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    title: "Scan Business Cards Instantly",
    description: "Capture any business card in seconds using your camera.",
    image: require("../../assets/scann.png"),
  },
  {
    id: "2",
    title: "Extract Details Automatically",
    description:
      "We detect name, phone, email and more with high accuracy.",
    image: require("../../assets/ocrr.png"),
  },
  {
    id: "3",
    title: "Save & Share Contacts",
    description:
      "Organize your contacts and share details anytime with ease.",
    image: require("../../assets/Contactt.png"),
  },
];

export default function Onboarding({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace("LoginScreen");
    }
  };
  const handleSkip = () => {
    navigation.replace("LoginScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip<Ionicons name="chevron-forward" style={{ fontWeight: "extrabold" }}></Ionicons></Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        )}
      />
      <View style={styles.dotsContainer}>
        {data.map((_, i) => {
          const inputRange = [
            (i - 1) * width,
            i * width,
            (i + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === data.length - 1
            ? "Get Started"
            : "Next"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E4EDF2",
  },

  skip: {
    position: "absolute",
    top: 50,
    right: 22,
    zIndex: 1,
  },

  skipText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
    // borderBottomWidth: 1,
    // borderColor: "#2563EB",
  },

  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: 280,
    height: 230,
    marginBottom: 4,
    marginTop: 40,
    resizeMode: "cover",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#111827",
  },

  desc: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
    marginHorizontal: 4,
  },

  button: {
    backgroundColor: "#2563EB",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 30,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});