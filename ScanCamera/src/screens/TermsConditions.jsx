import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TermsConditions({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={60} color="#2563EB" />
        </View>

        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.lastUpdated}>Last Updated: January 2025</Text>

        <View style={styles.section}>
          <Text style={styles.paragraphText}>
            Welcome to Arvora Business, your smart companion for managing
            business connections effortlessly. By using our business card
            scanning app, you are agreeing to these simple terms. This app is
            designed for personal and non commercial use, helping you digitize
            and organize your professional contacts with ease. You are
            responsible for keeping your account credentials secure and
            maintaining the confidentiality of your information.
          </Text>

          <Text style={styles.paragraphText}>
            Our app uses advanced AI technology to scan business cards and
            extract contact details like names, phone numbers, emails, company
            information, and addresses. It is like having a personal assistant
            that never forgets a contact! Please use our service responsibly and
            do not attempt any unauthorized access or misuse the platform in
            ways that could harm the service or other users.
          </Text>

          <Text style={styles.paragraphText}>
            Everything you see in Arvora Business, from the design to the
            features, is our intellectual property and protected by law. While
            we work hard to provide a reliable service, we cannot be held
            responsible for any issues that might arise from using or being
            unable to use the app. We reserve the right to update, modify, or
            discontinue features as we continue improving your experience.
          </Text>

          <Text style={styles.paragraphText}>
            If these terms are violated, we may need to suspend or terminate
            your account to protect our community. These terms follow applicable
            laws and regulations. Have questions or need clarification? We are
            here to help, just reach out to us at support@arvora.business. Thank
            you for choosing Arvora Business to streamline your professional
            networking!
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Arvora Business Inc.| All rights reserved
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#1E3A8A",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  content: {
    flex: 1,
    // padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    paddingHorizontal: 25,
  },
  paragraphText: {
    textAlign: "justify",
    fontSize: 13.5,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 10,
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
  },
});
