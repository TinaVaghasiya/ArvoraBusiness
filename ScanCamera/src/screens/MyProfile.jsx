import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function MyProfile({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const fetchUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const user = JSON.parse(data);
        setUserData({
          id: user.id || '',
          name: user.name || 'N/A',
          email: user.email || 'N/A',
          phone: user.phone || 'N/A',
          company: user.company || 'N/A',
        });
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const InfoRow = ({ icon, label, value, field }) => {
    const handleEdit = async () => {
      try {
        // Get user data for identifier
        const stored = await AsyncStorage.getItem("userData");
        const user = JSON.parse(stored);

        if (field === 'email') {
          navigation.navigate('OtpScreen', {
            identifier: user.email,
            source: 'editScreen',
            nextScreen: 'EditField',
            field: field,
            value: value,
          });
          return;
        }
        navigation.navigate('EditField', {
          field: field,
          value: value,
          onSuccess: (message, type) => {
            setToastMessage(message);
            setToastType(type);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }).start();

            setTimeout(() => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }).start(() => {
                setToastMessage("");
              });
            }, 1300);
          },
        });
      } catch (error) {
        console.log("Error getting user data:", error);
        navigation.navigate('EditField', {
          field: field,
          value: value,
        });
      }
    };


    return (
      <View style={styles.infoItem}>
        <View style={styles.infoIconBg}>
          <Ionicons name={icon} size={21} color="#2563EB" />
        </View>

        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>

        <TouchableOpacity onPress={handleEdit}>
          <AntDesign name="edit" size={18} color="#2563EB" style={styles.editIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>My Profile</Text>

      </View>

      {/* PROFILE ICON */}
      <View style={styles.profileWrapper}>
        <View style={styles.profileCircle}>
          <Ionicons name="person" size={45} color="#2563EB" />
        </View>
        <Text style={styles.profileName}>{userData.name}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* INFO CARD */}
        <View style={styles.infoCard}>

          <InfoRow
            icon="person-outline"
            label="Full Name"
            value={userData.name}
            field="name"
          />

          <View style={styles.divider} />

          <InfoRow
            icon="mail-outline"
            label="Email"
            value={userData.email}
            field="email"
          />

          <View style={styles.divider} />

          <InfoRow
            icon="call-outline"
            label="Phone"
            value={userData.phone}
            field="phone"
          />

          <View style={styles.divider} />

          <InfoRow
            icon="business-outline"
            label="Company"
            value={userData.company}
            field="company"
          />

        </View>
      </ScrollView>

      {toastMessage ? (
        <Animated.View style={[
          styles.toast,
          { opacity: fadeAnim },
          toastType === "error" ? styles.toastError : styles.toastSuccess
        ]}>
          <MaterialIcons 
            name={toastType === "error" ? "error" : "check-circle"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  header: {
    height: 180, 
    backgroundColor: '#2E4A9E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: -45,
    // right: 55,
  },

  profileWrapper: {
    alignItems: 'center',
    marginTop: -50, 
  },

  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 55,
    backgroundColor: '#DFE3EA',
    borderColor: '#f4f6fa',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileName: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 40,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    justifyContent: 'center',
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  infoIconBg: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  editIcon: {
    marginLeft: 10,
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  toast: {
    position: "absolute",
    top: 70,
    left: 40,
    right: 40,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastSuccess: {
    backgroundColor: "#10B981",
  },
  toastError: {
    backgroundColor: "#EF4444",
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});