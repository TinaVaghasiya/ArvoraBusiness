import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function ResultScreen({ route }) {
  const data = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Scanned Data</Text>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{data.name || "Not detected"}</Text>

      <Text style={styles.label}>Company:</Text>
      <Text style={styles.value}>{data.company || "Not detected"}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{data.email || "Not detected"}</Text>

      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value}>{data.phone || "Not detected"}</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 2,
  },
});
