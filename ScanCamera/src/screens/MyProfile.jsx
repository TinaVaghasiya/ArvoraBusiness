import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import {Ionicons, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
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

  const handleEditProfile = () => {
    navigation.navigate('EditScreen', {
      userData: userData,
    });
  };

  const InfoRow = ({ icon, label, value }) => {
    return (
      <View style={styles.infoItem}>
        <View style={styles.infoIconBg}>
          <Ionicons name={icon} size={21} color="#2563EB" />
        </View>

        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
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
      </View>

      <View style={{ alignItems: 'center', marginBottom: 20, flexDirection: 'row', justifyContent: 'center', marginBottom: 50 }}>
        <Text style={styles.profileName}>{userData.name}</Text>
        <TouchableOpacity
          style={styles.headerEditButton}
          onPress={handleEditProfile}
        >
          <FontAwesome6 name="pencil" size={17} color="#808080" />
        </TouchableOpacity>

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
          />

          <View style={styles.divider} />

          <InfoRow
            icon="mail-outline"
            label="Email"
            value={userData.email}
          />

          <View style={styles.divider} />

          <InfoRow
            icon="call-outline"
            label="Phone"
            value={userData.phone}
          />

          <View style={styles.divider} />

          <InfoRow
            icon="business-outline"
            label="Company"
            value={userData.company}
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
    flexDirection: 'row',
  },

  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#fff',
    marginTop: -45,
    marginRight: 130,
  },

  headerEditButton: {
    top: 6,
    left: 6,
    
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