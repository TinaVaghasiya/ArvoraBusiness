import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicy({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Policy</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={60} color="#2563EB" />
        </View>

        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: January 2025</Text>

        <View style={styles.section}>
          <Text style={styles.paragraphText}>
            At Arvora Business, your privacy matters to us. This policy explains how we handle your information when you use our business card scanning application. We collect the information you provide during registration, such as your name, email address, phone number, and company details. When you scan business cards, we process and store the extracted contact information to help you manage your professional network efficiently.
          </Text>

          <Text style={styles.paragraphText}>
            We use your information solely to provide and improve our services. This includes processing scanned business cards using AI technology, storing your contacts securely, and communicating important updates about our service. We implement strong security measures to protect your data from unauthorized access, alteration, or disclosure. Your information is encrypted and stored safely on secure servers.
          </Text>

          <Text style={styles.paragraphText}>
            We respect your privacy and will never sell, trade, or rent your personal information to third parties. Your data is yours, and we only share it with your explicit consent or when required by law. You have complete control over your information and can access, update, or delete your data anytime through your account settings.
          </Text>

          <Text style={styles.paragraphText}>
            We may use cookies and similar technologies to enhance your experience and understand how you use our app. We may update this policy occasionally to reflect changes in our practices or legal requirements. When we do, we will notify you and update the date above. If you have questions or concerns about how we handle your data, please reach out to us at support@arvora.business. We are committed to protecting your privacy and earning your trust.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Arvora Business Inc.| All rights reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    paddingHorizontal: 25,
  },
  paragraphText: {
    textAlign: 'justify',
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
});
