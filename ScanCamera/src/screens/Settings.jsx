import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Modal,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { BASE_API } from '../utils/api';
import messaging from '@react-native-firebase/messaging';
import { registerForPushNotifications } from '../utils/fcm';

export default function Settings({ navigation }) {
  const [mpinEnabled, setMpinEnabled] = useState(false);
  const [mpinActuallySet, setMpinActuallySet] = useState(false);
  const [loadingMpin, setLoadingMpin] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notificationModalConfig, setNotificationModalConfig] = useState({});

  useEffect(() => {
    fetchMPinStatus();
    checkNotificationPermission();
  }, []);

  const fetchMPinStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_API}/api/auth/mpin/status`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMpinEnabled(data.mpinEnabled);
        setMpinActuallySet(data.mpinEnabled);
      }
    } catch (error) {
      console.log('Error fetching M-PIN status:', error);
    }
  };

  const checkNotificationPermission = async () => {
    try {
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      setNotificationsEnabled(enabled);
    } catch (error) {
      console.log('Error checking notification permission:', error);
    }
  };

  const handleNotificationToggle = async (value) => {
    if (value) {
      setLoadingNotifications(true);
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          await registerForPushNotifications();
          setNotificationsEnabled(true);
        } else {
          setNotificationsEnabled(false);
          setNotificationModalConfig({
            icon: 'close-circle-outline',
            iconColor: '#EF4444',
            iconBg: '#FEE2E2',
            title: 'Permission Denied',
            message: 'Please enable notifications from your device settings.',
            buttons: [
              { text: 'Cancel', onPress: () => setNotificationModalVisible(false), style: 'cancel' },
              { text: 'Open Settings', onPress: () => { setNotificationModalVisible(false); Linking.openSettings(); } },
            ],
          });
          setNotificationModalVisible(true);
        }
      } catch (error) {
        console.log('Error enabling notifications:', error);
        setNotificationsEnabled(false);
      } finally {
        setLoadingNotifications(false);
      }
    } else {
      setNotificationModalConfig({
        icon: 'notifications-off-outline',
        iconColor: '#F59E0B',
        iconBg: '#FEF3C7',
        title: 'Disable Notifications',
        message: 'To disable notifications, please go to your device settings.',
        buttons: [
          { text: 'Cancel', onPress: () => setNotificationModalVisible(false), style: 'cancel' },
          { text: 'Open Settings', onPress: () => { setNotificationModalVisible(false); Linking.openSettings(); } },
        ],
      });
      setNotificationModalVisible(true);
    }
  };

  const handleMPinToggle = async (value) => {
    if (value) {
      setMpinEnabled(true);
      setTimeout(() => {
        navigation.navigate('SetupMPinScreen', {
          isOptional: false,
          isReset: false,
          isChangingPin: false,
        });
      }, 150);
    } else {
      setMpinEnabled(false);
      setMpinActuallySet(false);
      try {
        setLoadingMpin(true);
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${BASE_API}/api/auth/mpin/disable`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          setMpinEnabled(true);
          setMpinActuallySet(true);
        }
      } catch (error) {
        setMpinEnabled(true);
      } finally {
        setLoadingMpin(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setLogoutModalVisible(false);
      navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
    } catch (error) {
      console.log('Error logging out:', error);
      setLogoutModalVisible(false);
    }
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconBg}>
                <Ionicons name="notifications-outline" size={22} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.settingText}>Allow Notifications</Text>
                <Text style={styles.settingSubtext}>Receive updates and alerts</Text>
              </View>
            </View>
            {loadingNotifications ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={notificationsEnabled ? '#2563EB' : '#F3F4F6'}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconBg}>
                <Ionicons name="lock-closed-outline" size={22} color="#2563EB" />
              </View>
              <Text style={styles.settingText}>M-PIN Security</Text>
            </View>
            {loadingMpin ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Switch
                value={mpinEnabled}
                onValueChange={handleMPinToggle}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={mpinEnabled ? '#2563EB' : '#F3F4F6'}
              />
            )}
          </View>

          {mpinActuallySet && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('ChangeMPinScreen')}
            >
              <View style={styles.settingLeft}>
                <View style={styles.iconBg}>
                  <Ionicons name="key-outline" size={22} color="#2563EB" />
                </View>
                <Text style={styles.settingText}>Change PIN</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconBg}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#2563EB" />
              </View>
              <Text style={styles.settingText}>Privacy & Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('TermsConditions')}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconBg}>
                <Ionicons name="document-text-outline" size={22} color="#2563EB" />
              </View>
              <Text style={styles.settingText}>Terms & Conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('ShareApp')}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconBg}>
                <Ionicons name="arrow-redo-outline" size={24} color="#2563EB" />
              </View>
              <Text style={styles.settingText}>Share App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconBg}>
                <Ionicons name="help-circle-outline" size={24} color="#2563EB" />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.settingItem, styles.logoutItem]}
            onPress={() => setLogoutModalVisible(true)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconBg, styles.logoutIconBg]}>
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              </View>
              <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconContainer}>
              <Ionicons name="log-out-outline" size={34} color="#EF4444" />
            </View>
            <Text style={styles.alertTitle}>Logout</Text>
            <Text style={styles.alertMessage}>
              Are you sure you want to logout from your account?
            </Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                activeOpacity={0.8}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      <Modal
        visible={notificationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <View style={[styles.alertIconContainer, { backgroundColor: notificationModalConfig.iconBg }]}>
              <Ionicons name={notificationModalConfig.icon} size={34} color={notificationModalConfig.iconColor} />
            </View>
            <Text style={styles.alertTitle}>{notificationModalConfig.title}</Text>
            <Text style={styles.alertMessage}>{notificationModalConfig.message}</Text>
            <View style={styles.alertButtons}>
              {notificationModalConfig.buttons?.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={button.style === 'cancel' ? styles.cancelButton : styles.actionButton}
                  onPress={button.onPress}
                  activeOpacity={0.8}
                >
                  <Text style={button.style === 'cancel' ? styles.cancelButtonText : styles.actionButtonText}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </BlurView>
      </Modal>
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
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#334155',
  },
  settingSubtext: {
    fontSize: 12,
    color: '#94A3AF',
    marginTop: 2,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutIconBg: {
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#E8E9EB',
    borderRadius: 28,
    padding: 28,
    width: '88%',
    alignItems: 'center',
    elevation: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  alertIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  alertButtons: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#EF4444',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#EF4444',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  actionButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#2563EB',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
