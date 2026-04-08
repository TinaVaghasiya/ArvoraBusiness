import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_API, handleApiError } from "../utils/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { notificationEmitter } from "../utils/notificationEvents";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [userName, setUserName] = useState("User");
  const [lastLogin, setLastLogin] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recentCards, setRecentCards] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [advertisements, setAdvertisements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollViewRef = useRef(null);
  const autoScrollTimer = useRef(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotAnimations = useRef([]).current;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || "User");
        }

        const loginTime = await AsyncStorage.getItem("lastLoginTime");
        if (loginTime) {
          const date = new Date(loginTime);
          const formattedDate = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          setLastLogin(`Last Login: ${formattedDate} ${formattedTime}`);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
    fetchRecentCards();
    fetchAdvertisements();
    fetchUnreadCount();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const totalSlides = 3 + advertisements.length;
    while (dotAnimations.length < totalSlides) {
      dotAnimations.push(new Animated.Value(dotAnimations.length === 0 ? 1 : 0));
    }
  }, [advertisements]);

  useEffect(() => {
    dotAnimations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: currentSlide === index ? 1 : 0,
        friction: 5,
        tension: 40,
        useNativeDriver: false,
      }).start();
    });
  }, [currentSlide]);

  useEffect(() => {
    const totalSlides = 3 + advertisements.length;
    autoScrollTimer.current = setInterval(() => {
      if (scrollViewRef.current && scrollEnabled) {
        const nextSlide = (currentSlide + 1) % totalSlides;
        scrollViewRef.current.scrollTo({
          x: nextSlide * width,
          animated: true,
        });
      }
    }, 4000);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [currentSlide, scrollEnabled, advertisements.length]);

  useFocusEffect(
    useCallback(() => {
      fetchRecentCards();
      fetchUnreadCount();
      const onBackPress = () => {
        setExitModalVisible(true);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    // Listen for new notification events for immediate badge update
    const handleNewNotification = () => {
      console.log('🔔 New notification event received, refreshing badge count');
      fetchUnreadCount();
    };
    
    notificationEmitter.on('newNotification', handleNewNotification);

    return () => {
      clearInterval(interval);
      notificationEmitter.off('newNotification', handleNewNotification);
    };
  }, []);

  const handleCancelExit = () => {
    setExitModalVisible(false);
  };

  const handleConfirmExit = () => {
    setExitModalVisible(false);
    setTimeout(() => {
      BackHandler.exitApp();
    }, 200);
  };

  const fetchRecentCards = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_API}/api/cards/get-cards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (await handleApiError(response, navigation)) return;
      
      const data = await response.json();
      if (data.success) {
        setRecentCards(data.data.slice(0, 5));
      }
    } catch (error) {
      console.log("Error fetching recent cards:", error);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_API}/api/advertisements/active`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (await handleApiError(response, navigation)) return;
      
      const data = await response.json();
      if (data.success) {
        setAdvertisements(data.data || []);
      }
    } catch (error) {
      console.log("Error fetching advertisements:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_API}/api/notifications/unread-count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (await handleApiError(response, navigation)) return;
      
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.log("Error fetching unread count:", error);
    }
  };

  const getInitials = (name, company, email) => {
    if (name && name.trim()) {
      const nameParts = name.trim().split(" ");
      if (nameParts.length >= 2) {
        return (
          nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
        ).toUpperCase();
      } else {
        return nameParts[0].charAt(0).toUpperCase();
      }
    } else if (company && company.trim()) {
      return company.charAt(0).toUpperCase();
    } else if (email && email.trim()) {
      return email.charAt(0).toUpperCase();
    }
    return "?";
  };
  const getAvatarColor = (index) => {
    const colors = [
      ["#667eea", "#764ba2"], // Blue to Purple
      ["#f093fb", "#f5576c"], // Pink to Red
      ["#4facfe", "#00f2fe"], // Blue to Cyan
      ["#fbc2eb", "#a6c1ee"], // Pink to Blue
      ["#43e97b", "#38f9d7"], // Green to Turquoise
      ["#fa709a", "#fee140"], // Pink to Yellow
      ["#30cfd0", "#330867"], // Cyan to Deep Purple
      ["#a8edea", "#fed6e3"], // Mint to Pink
      ["#ff9a9e", "#fecfef"], // Coral to Light Pink
      ["#ffecd2", "#fcb69f"], // Peach to Orange
      ["#ff6e7f", "#bfe9ff"], // Red to Light Blue
      ["#e0c3fc", "#8ec5fc"], // Lavender to Blue
      
    ];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      <View style={styles.HeaderWrapper}>
        <LinearGradient
          colors={["#1E3A8A", "#1E3A8A", "#1E3A8A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 2, y: 2 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.profileCircle}>
                <Ionicons name="person" size={28} color="#fff" />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerWelcome}>Welcome Back!</Text>
                <Text style={styles.headerGreeting}>{userName}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.headerProfile}
              onPress={() => navigation.navigate("NotificationScreen")}
            >
              <Ionicons name="notifications-outline" size={26} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.waveWrapper} pointerEvents="none">
        <Svg height="90" width="100%" viewBox="0 0 1440 320">
          <Path
            fill="#1E3A8A"
            fillOpacity="1"
            d="M0,160L60,154.7C120,149,240,139,360,144C480,149,600,171,720,181.3C840,192,960,192,1080,186.7C1200,181,1320,171,1380,165.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </Svg>
      </View>

      <View style={styles.backgroundTop} />
      <View style={styles.backgroundBottom} />

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 5 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          {/* Swiper Section */}
          <View style={styles.swiperSection}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={() => {
                if (autoScrollTimer.current) {
                  clearInterval(autoScrollTimer.current);
                }
              }}
              onScrollEndDrag={() => {
                const totalSlides = 3 + advertisements.length;
                autoScrollTimer.current = setInterval(() => {
                  if (scrollViewRef.current && scrollEnabled) {
                    const nextSlide = (currentSlide + 1) % totalSlides;
                    scrollViewRef.current.scrollTo({
                      x: nextSlide * width,
                      animated: true,
                    });
                  }
                }, 4000);
              }}
              onMomentumScrollEnd={(e) => {
                const slide = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentSlide(slide);
              }}
              scrollEventThrottle={16}
              decelerationRate="fast"
            >
              {advertisements.map((ad) => (
                <View key={ad._id} style={styles.slideCard}>
                  <TouchableOpacity
                    style={styles.adCardInner}
                    activeOpacity={0.9}
                    onPress={() => ad.link && Linking.openURL(ad.link)}
                  >
                    <Image
                      source={{ uri: `${BASE_API}${ad.imageUrl}` }}
                      style={styles.adImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.slideCard}>
                <View
                  style={[
                    styles.slideCardInner,
                    { backgroundColor: "#BFDBFE" },
                  ]}
                >
                  <View style={styles.slideLeft}>
                    <Text style={styles.slideTitle}>
                      AI-Powered{"\n"}Scanning
                    </Text>
                    <Text style={styles.slideSubtitle}>
                      Advanced OCR technology instantly extracts contact details
                      from business cards with 99% accuracy
                    </Text>
                  </View>
                  <View style={styles.slideRight}>
                    <View
                      style={[
                        styles.slideIconCircle,
                        { backgroundColor: "#93C5FD" },
                      ]}
                    >
                      <Ionicons name="scan" size={56} color="#1E40AF" />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.slideCard}>
                <View
                  style={[
                    styles.slideCardInner,
                    { backgroundColor: "#D1FAE5" },
                  ]}
                >
                  <View style={styles.slideLeft}>
                    <Text style={styles.slideTitle}>
                      Smart Digital{"\n"}Storage
                    </Text>
                    <Text style={styles.slideSubtitle}>
                      Never lose a contact again. All your business cards
                      organized and accessible in one place
                    </Text>
                  </View>
                  <View style={styles.slideRight}>
                    <View
                      style={[
                        styles.slideIconCircle,
                        { backgroundColor: "#86EFAC" },
                      ]}
                    >
                      <Ionicons name="cloud-done" size={56} color="#047857" />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.slideCard}>
                <View
                  style={[
                    styles.slideCardInner,
                    { backgroundColor: "#E9D5FF" },
                  ]}
                >
                  <View style={styles.slideLeft}>
                    <Text style={styles.slideTitle}>
                      Quick & Easy{"\n"}Access
                    </Text>
                    <Text style={styles.slideSubtitle}>
                      Search, share, and manage contacts instantly. Save time
                      and stay organized effortlessly
                    </Text>
                  </View>
                  <View style={styles.slideRight}>
                    <View
                      style={[
                        styles.slideIconCircle,
                        { backgroundColor: "#C4B5FD" },
                      ]}
                    >
                      <Ionicons name="flash" size={56} color="#6D28D9" />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.pagination}>
              {[...Array(3 + advertisements.length)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.paginationDot,
                    {
                      width: dotAnimations[i]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: [6, 20],
                      }) || 6,
                      backgroundColor: dotAnimations[i]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["#CBD5E1", "#2563EB"],
                      }) || "#CBD5E1",
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Recent Cards Section */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Recent Cards</Text>
                <Text style={styles.sectionSubtitle}>
                  Your latest scanned contacts
                </Text>
              </View>
              {recentCards.length > 0 && (
                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={() => navigation.navigate("ListScreen")}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                  <Ionicons name="arrow-forward" size={16} color="#2563EB" />
                </TouchableOpacity>
              )}
            </View>

            {recentCards.length > 0 ? (
              <View style={styles.cardsContainer}>
                {recentCards.map((card, index) => (
                  <View key={card._id}>
                    <TouchableOpacity
                      style={styles.recentCard}
                      onPress={() =>
                        navigation.navigate("CardDetails", { card })
                      }
                      activeOpacity={0.7}
                    >
                      <View style={styles.cardLeft}>
                        <LinearGradient
                          colors={getAvatarColor(index)}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.cardIconBg}
                        >
                          <Text style={styles.initialsText}>
                            {getInitials(card.name, card.company, card.email)}
                          </Text>
                        </LinearGradient>
                        <View style={styles.cardInfo}>
                          <Text style={styles.cardName} numberOfLines={1}>
                            {card.name || card.company || card.email}
                          </Text>
                          <Text style={styles.cardDetail} numberOfLines={1}>
                            {card.name
                              ? card.company || card.email || card.phone
                              : card.email || card.phone}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.cardArrow}>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#CBD5E1"
                        />
                      </View>
                    </TouchableOpacity>
                    {index < recentCards.length - 1 && (
                      <View style={styles.cardDivider} />
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconBg}>
                  <Ionicons name="albums-outline" size={48} color="#2563EB" />
                </View>
                <Text style={styles.emptyTitle}>No Cards Yet</Text>
                <Text style={styles.emptyText}>
                  Start scanning business cards to build your digital collection
                </Text>
                {/* <TouchableOpacity
                  style={styles.emptyScanButton}
                  onPress={() => navigation.navigate('ScanScreen')}
                >
                  <Ionicons name="scan" size={20} color="#fff" />
                  {/* <Text style={styles.emptyScanButtonText}>Scan First Card</Text> */}
                {/* </TouchableOpacity> */}
              </View>
            )}
          </View>
          <View style={{ height: insets.bottom + 100 }} />
        </View>
      </ScrollView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  HeaderWrapper: {
    position: "relative",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingBottom: 10,
    overflow: "hidden",
    zIndex: 10,
  },
  waveWrapper: {
    position: "absolute",
    top: 90,
    left: 0,
    right: 0,
    width: "100%",
    height: 60,
    overflow: "hidden",
    zIndex: 9,
  },
  backgroundTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    backgroundColor: "transparent",
  },
  backgroundBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 0,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flex: 1,
    // marginTop: 90,
  },
  scrollContentContainer: { paddingTop: 20 },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 10,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  headerTextContainer: {
    justifyContent: "center",
  },
  headerWelcome: {
    fontSize: 14.5,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  headerGreeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 2,
  },
  headerProfile: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  mainContent: {
    paddingTop: 40,
  },
  swiperSection: {
    marginBottom: 24,
  },
  slideCard: {
    width: width,
    height: 180,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  slideCardInner: {
    flex: 1,
    height: 180,
    borderRadius: 20,
    backgroundColor: "#BFDBFE",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 16,
    elevation: 6,
    shadowColor: "#2563EB",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  slideLeft: {
    flex: 1,
    justifyContent: "center",
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 6,
    lineHeight: 28,
  },
  slideSubtitle: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  slideRight: {
    justifyContent: "center",
    alignItems: "center",
  },
  slideIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 6,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
  },
  recentSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  cardsContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  initialsText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  cardIconBg: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 13.5,
    color: "#505C6F",
  },
  cardArrow: {
    marginLeft: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  navContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    borderRadius: 25,
  },
  navBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "100%",
    height: 70,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navLabel: { fontSize: 11, color: "#94A3B8", marginTop: 4 },
  navLabelActive: { color: "#2563EB", fontWeight: "600" },
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
  adImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  adCardInner: {
    flex: 1,
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#2563EB",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
