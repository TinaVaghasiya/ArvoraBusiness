import React from "react";
import { View, StyleSheet } from "react-native";

export default function ScanBox({ stable }) {
  return (
    <View
      style={[
        styles.box,
        { borderColor: stable ? "green" : "white" },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "35%",
    height: 220,
    borderWidth: 2,
    borderRadius: 15,
  },
});
