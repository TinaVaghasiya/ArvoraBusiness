import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const CustomPinInput = forwardRef(({ onComplete, onPinChange, length = 4 }, ref) => {
  const [pin, setPin] = useState("");
  const dotAnimations = useRef([...Array(length)].map(() => new Animated.Value(1))).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    triggerError: () => {
      Vibration.vibrate([0, 100, 50, 100]);
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
      setTimeout(() => {
        setPin("");
      }, 150);
    },
    clearPin: () => {
      setPin("");
    },
  }));

  const handlePress = (num) => {
    if (pin.length < length) {
      Vibration.vibrate(50);
      const newPin = pin + num;
      setPin(newPin);
      
      if (onPinChange && pin.length === 0) {
        onPinChange();
      }
      
      Animated.sequence([
        Animated.timing(dotAnimations[newPin.length - 1], {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnimations[newPin.length - 1], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      if (newPin.length === length) {
        setTimeout(() => {
          onComplete(newPin);
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      Vibration.vibrate(30);
    }
    setPin(pin.slice(0, -1));
  };

  const renderDots = () => {
    return (
      <Animated.View style={[styles.dotsContainer, {
        transform: [{
          translateX: shakeAnimation.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, -10, 10, -10, 0],
          }),
        }],
      }]}>
        {[...Array(length)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              pin.length > i && styles.dotFilled,
              {
                transform: [{ scale: dotAnimations[i] }],
              },
            ]}
          />
        ))}
      </Animated.View>
    );
  };

  const renderKeypad = () => {
    const keys = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["", "0", "del"],
    ];

    return (
      <View style={styles.keypad}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key, keyIndex) => (
              <TouchableOpacity
                key={keyIndex}
                style={[styles.key, key === "" && styles.keyEmpty]}
                onPress={() => {
                  if (key === "del") handleDelete();
                  else if (key !== "") handlePress(key);
                }}
                disabled={key === ""}
              >
                {key === "del" ? (
                  <MaterialIcons name="backspace" size={24} color="#1E3A8A" />
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderDots()}
      {renderKeypad()}
    </View>
  );
});

export default CustomPinInput;

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  dotsContainer: {
    flexDirection: "row",
    marginVertical: 40,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    marginHorizontal: 10,
  },
  dotFilled: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  keypad: { marginTop: 20 },
  row: {
    flexDirection: "row",
    marginBottom: 15,
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  keyEmpty: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  keyText: {
    fontSize: 28,
    color: "#1E3A8A",
    fontWeight: "600",
  },
});
