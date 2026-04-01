import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpSupport({ navigation }) {
  const handleEmail = () => {
    Linking.openURL('mailto:support@arvora.business');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleWebsite = () => {
    Linking.openURL('https://arvora.ai/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="help-circle" size={60} color="#2563EB" />
        </View>

        <Text style={styles.title}>How can we help you?</Text>
        <Text style={styles.subtitle}>
          We're here to assist you with any questions or issues
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <View style={styles.contactIconBg}>
              <Ionicons name="mail" size={24} color="#2563EB" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>support@arvora.business</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handlePhone}>
            <View style={styles.contactIconBg}>
              <Ionicons name="call" size={24} color="#2563EB" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Phone Support</Text>
              <Text style={styles.contactValue}>+1 (234) 567-890</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
            <View style={styles.contactIconBg}>
              <Ionicons name="globe" size={24} color="#2563EB" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue}>arvora.business</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I scan a business card?</Text>
            <Text style={styles.faqAnswer}>
              Tap the "Start Scanning" button on the home screen, position the business card within the frame, and capture the image. Our AI will automatically extract the contact information.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I edit scanned information?</Text>
            <Text style={styles.faqAnswer}>
              Go to "View Saved Cards", select the card you want to edit, and tap the edit icon to modify any information.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I export my contacts?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can share individual cards or export multiple contacts from the saved cards screen.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is my data secure?</Text>
            <Text style={styles.faqAnswer}>
              Yes, all your data is encrypted and stored securely. We follow industry-standard security practices to protect your information.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I delete my account?</Text>
            <Text style={styles.faqAnswer}>
              Please contact our support team at support@arvora.business to request account deletion.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Arvora Business</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
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
    padding: 20,
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
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  contactIconBg: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  faqItem: {
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 15,
  },
});
