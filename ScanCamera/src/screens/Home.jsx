import { StatusBar } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState('User');
  const [lastLogin, setLastLogin] = useState('');
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || 'User');
        }
        
        const loginTime = await AsyncStorage.getItem('lastLoginTime');
        if (loginTime) {
          const date = new Date(loginTime);
          const formattedDate = date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          setLastLogin(`Last Login: ${formattedDate} ${formattedTime}`);
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };
    fetchUserData();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : -width * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuVisible]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (menuVisible) {
          setMenuVisible(false);
          return true;
        }
        setExitModalVisible(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => backHandler.remove();
    }, [menuVisible]),
  );

  const handleLogout = () => {
    setMenuVisible(false);
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setLogoutModalVisible(false);
      navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const handleCancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handleCancelExit = () => {
    setExitModalVisible(false);
  };

  const handleConfirmExit = () => {
    setExitModalVisible(false);
    setTimeout(() => {
      BackHandler.exitApp();
    }, 200);
  };

  const navigateFromSidebar = (screenName) => {
  navigation.navigate(screenName);
  setTimeout(() => setMenuVisible(false), 300);
};


  const scanLinePosition = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, 90],
  });

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            setMenuVisible(true);
          }}
          style={styles.menuIconButton}
        >
          <Ionicons
            name="menu-outline"
            size={32}
            color="#fff"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerGreeting}>Hi,{userName.toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.headerProfile} onPress={() => {navigation.navigate("MyProfile")}}>
          <Ionicons name="person-circle" size={37} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Side Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ translateX: slideAnim }] },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.menuHeader}>
              <View style={styles.menuProfileSection} >
                <TouchableOpacity style={styles.menuProfileIcon} onPress={() => {
                navigateFromSidebar("MyProfile")}}>
                  <Ionicons name="person" size={26} color="#2563EB" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuProfileText} onPress={() => {
                navigateFromSidebar("MyProfile")}}>
                <Text style={styles.menuProfileName}>Hi, {userName.toUpperCase()}</Text>
                <Text style={styles.menuProfileEmail}>{lastLogin || 'Last Login: N/A'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.menuDivider} />

            <View style={styles.menuItems}>
              <View style={styles.menuItem} >
                <TouchableOpacity onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("Home")}} >
                <View style={styles.menuItemIconBg}>
                  <Ionicons name="home-outline" size={22} color="#2563EB" />
                </View></TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', flex:1}} onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("Home")}} >
                <Text style={styles.menuItemText}>Home</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              </View>

              <View style={styles.menuItem} >
                <TouchableOpacity onPress={() => navigateFromSidebar("MyProfile")} >
                <View style={styles.menuItemIconBg}>
                  <Ionicons name="person-outline" size={24} color="#2563EB" />
                </View></TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', flex:1}} onPress={() => navigateFromSidebar("MyProfile")} >
                <Text style={styles.menuItemText}>My Profile</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              </View>

              <View
                style={styles.menuItem}
              ><TouchableOpacity onPress={() => navigateFromSidebar("PrivacyPolicy")} >
                <View style={styles.menuItemIconBg}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#2563EB" />
                </View></TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', flex:1}} onPress={() => navigateFromSidebar("PrivacyPolicy")} >
                <Text style={styles.menuItemText}>Privacy & Policy</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" /></TouchableOpacity>
              </View>

              <View
                style={styles.menuItem}
              >
                <TouchableOpacity onPress={() => navigateFromSidebar("TermsConditions")}>
                <View style={styles.menuItemIconBg}>
                  <Ionicons name="document-text-outline" size={22} color="#2563EB" />
                </View></TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', flex:1}} onPress={() => navigateFromSidebar("TermsConditions")}>
                <Text style={styles.menuItemText}>Terms & Conditions</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              </View>

              <View
                style={styles.menuItem}
              >
                <TouchableOpacity onPress={() => navigateFromSidebar("ShareApp")}>
                <View style={styles.menuItemIconBg}>
                  <Ionicons name="arrow-redo-outline" size={24} color="#2563EB" />
                </View></TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', flex:1}} onPress={() => navigateFromSidebar("ShareApp")}>
                <Text style={styles.menuItemText}>Share App</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              </View>

              <View
                style={styles.menuItem}
              >
                <TouchableOpacity onPress={() => navigateFromSidebar("HelpSupport")}>
                <View style={styles.menuItemIconBg}>
                  <Ionicons name="help-circle-outline" size={24} color="#2563EB" />
                </View></TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', flex:1}} onPress={() => navigateFromSidebar("HelpSupport")}>
                <Text style={styles.menuItemText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              </View>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogout}
              >
                <View style={styles.menuItemIconBg}>
                  <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                </View>
                <Text style={[styles.menuItemText, { color: "#EF4444" }]}>
                  Logout
                </Text>
                {/* <Ionicons name="chevron-forward" size={20} color="#CBD5E1" /> */}
              </TouchableOpacity>
            </View>

            <View style={styles.menuFooter}>
              <Text style={styles.menuFooterText}>© 2026 Arvora Business</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.backgroundTop} />
      <View style={styles.backgroundBottom} />

      <Animated.View
        style={[styles.rotatingCircle1, { transform: [{ rotate }] }]}
      />
      <Animated.View
        style={[styles.rotatingCircle2, { transform: [{ rotate }] }]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.textSection}>
          <Text style={styles.title}>Scan Business Cards</Text>
        </View>

        <Animated.View
          style={[styles.heroSection, { transform: [{ translateY: floatY }] }]}
        >
          <Animated.View
            style={[
              styles.scanIconContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.scanIconOuter}>
              <View style={styles.scanIconMiddle}>
                <View style={styles.scanIconInner}>
                  <Ionicons name="scan" size={64} color="#2563EB" />
                  <Animated.View
                    style={[
                      styles.scanLine,
                      { transform: [{ translateY: scanLinePosition }] },
                    ]}
                  />
                </View>
              </View>
            </View>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />

            <View style={styles.orbitDot1} />
            <View style={styles.orbitDot2} />
            <View style={styles.orbitDot3} />
          </Animated.View>
        </Animated.View>

        <View style={styles.titleUnderline} />
        <Text style={styles.subtitle}>
          Extract contact details instantly with AI-powered smart scanning
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("ScanScreen")}
          >
            <View style={styles.buttonIconCircle}>
              <Ionicons name="scan-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.primaryButtonText}>Start Scanning</Text>
            <Ionicons name="arrow-forward-circle" size={26} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("ListScreen")}
          >
            <View style={styles.secondaryIconBg}>
              <Ionicons name="albums-outline" size={22} color="#2563EB" />
            </View>
            <Text style={styles.secondaryButtonText}>View Saved Cards</Text>
            <View style={styles.chevronBadge}>
              <Ionicons name="chevron-forward" size={18} color="#2563EB" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Powered by arvora.business</Text>
      </Animated.View>

      <Modal
        visible={exitModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelExit}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconContainer}>
              <Ionicons name="log-out-outline" size={34} color="#EF4444" />
            </View>
            <Text style={styles.alertTitle}>Exit Application?</Text>
            <Text style={styles.alertMessage}>
              Are you sure you want to close the app?
            </Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelExit}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exitButton}
                activeOpacity={0.8}
                onPress={handleConfirmExit}
              >
                <Text style={styles.exitText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelLogout}
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconContainer}>
              <Ionicons name="log-out-outline" size={34} color="#EF4444" />
            </View>
            <Text style={styles.alertTitle}>Logout</Text>
            <Text style={styles.alertMessage}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exitButton}
                activeOpacity={0.8}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.exitText}>Logout</Text>
              </TouchableOpacity>
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
    backgroundColor: "#0F172A",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1000,
    backgroundColor: "rgba(34, 80, 175, 0.4)",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  menuIconButton: {
    position: "absolute",
    top: 45,
    left: 20,
    zIndex: 999,
    padding: 5,
  },
  headerProfile: {
    position: "absolute",
    top: 45,
    right: 8,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  headerCenter: {
    position: "absolute",
    top: 58,
    left: 70,
    right: 0,
    alignItems: "start",
    justifyContent: "center",
  },
  headerGreeting: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.5,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 1,
    backgroundColor: "#F1F1F2",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: "#1E3A8A",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  menuProfileSection: {
    flex: 1,
    flexDirection: "row",
  },
  menuProfileText: {
    marginLeft: 20,
    justifyContent: "center",
  },
  menuProfileIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 35,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#DBEAFE",
  },
  menuProfileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  menuProfileEmail: {
    fontSize: 11,
    color: "#94A3B8",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  menuItems: {
    paddingTop: 8,
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 18,
    gap: 12,
  },
  menuItemIconBg: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#334155",
    flex: 1,
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    alignItems: "center",
  },
  menuFooterText: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
  },
  backgroundTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#1E3A8A",
  },
  backgroundBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#1E3A8A",
  },
  rotatingCircle1: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    borderWidth: 40,
    borderColor: "rgba(59, 130, 246, 0.1)",
    top: -100,
    right: -100,
  },
  rotatingCircle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 35,
    borderColor: "rgba(147, 197, 253, 0.08)",
    bottom: -80,
    left: -80,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  textSection: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: 40,
  },
  scanIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  scanIconOuter: {
    width: 160,
    height: 160,
    borderRadius: 110,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    elevation: 15,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.5,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 10 },
  },
  scanIconMiddle: {
    width: 125,
    height: 125,
    borderRadius: 90,
    backgroundColor: "#93C5FD",
    alignItems: "center",
    justifyContent: "center",
  },
  scanIconInner: {
    width: 80,
    height: 80,
    borderRadius: 70,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  scanLine: {
    position: "absolute",
    width: "100%",
    height: 4,
    backgroundColor: "#2563EB",
    opacity: 0.7,
    shadowColor: "#2563EB",
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  cornerTL: {
    position: "absolute",
    top: 6,
    left: 6,
    width: 40,
    height: 40,
    borderTopWidth: 6,
    borderLeftWidth: 6,
    borderColor: "#fff",
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 40,
    height: 40,
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderColor: "#fff",
    borderTopRightRadius: 12,
  },
  cornerBL: {
    position: "absolute",
    bottom: 6,
    left: 6,
    width: 40,
    height: 40,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
    borderColor: "#fff",
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 40,
    height: 40,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderColor: "#fff",
    borderBottomRightRadius: 12,
  },
  orbitDot1: {
    position: "absolute",
    top: 24,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#60A5FA",
  },
  orbitDot2: {
    position: "absolute",
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#BFDBFE",
  },
  orbitDot3: {
    position: "absolute",
    bottom: 30,
    left: 30,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#BFDBFE",
  },
  titleUnderline: {
    width: 100,
    height: 5,
    backgroundColor: "#60A5FA",
    borderRadius: 3,
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#E0E7FF",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 34,
  },
  buttonContainer: {
    width: "100%",
    gap: 14,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
    height: 64,
    borderRadius: 18,
    gap: 12,
    marginBottom: 8,
    paddingHorizontal: 20,
    elevation: 12,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 60,
    borderRadius: 18,
    gap: 12,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  secondaryIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  chevronBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: "auto",
    marginBottom: 24,
    fontSize: 13,
    color: "#E0E7FF",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "#E8E9EB",
    borderRadius: 28,
    padding: 28,
    width: "88%",
    alignItems: "center",
    elevation: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  alertIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  alertButtons: {
    flexDirection: "row",
    gap: 14,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    height: 45,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  exitButton: {
    flex: 1,
    height: 45,
    backgroundColor: "#EF4444",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#EF4444",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cancelText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 16,
  },
  exitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
