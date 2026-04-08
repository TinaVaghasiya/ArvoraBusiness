import { Provider as PaperProvider } from "react-native-paper";
import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';
import Home from "./src/screens/Home";
import OpeningScreen from "./src/screens/OpeningScreen";
import OnboardScreen from "./src/screens/Onboardscreen";
import ScanScreen from "./src/screens/ScanScreen";
import ResultScreen from "./src/screens/ResultScreen";
import ListScreen from "./src/screens/ListScreen";
import CardDetails from "./src/screens/CardDetails";
import LoginScreen from "./src/screens/LoginScreen";
import OtpScreen from "./src/screens/OtpScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ShareCard from "./src/screens/ShareCard";
import MyProfile from "./src/screens/MyProfile";
import PrivacyPolicy from "./src/screens/PrivacyPolicy";
import TermsConditions from "./src/screens/TermsConditions";
import HelpSupport from "./src/screens/HelpSupport";
import ShareApp from "./src/screens/ShareApp";
import Settings from "./src/screens/Settings";
import SetupMPinScreen from "./src/screens/SetupMPinScreen";
import VerifyMPinScreen from "./src/screens/VerifyMPinScreen";
import ChangeMPinScreen from "./src/screens/ChangeMPinScreen";
import ForgotPin from "./src/screens/ForgotPin";
import NotificationScreen from "./src/screens/NotificationScreen";
import CustomTabBar from "./src/components/CustomTabBar";
import NotificationPopup from "./src/components/NotificationPopup";
import EditScreen from "./src/screens/EditScreen";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { registerForPushNotifications } from "./src/utils/fcm";
import { notificationEmitter } from "./src/utils/notificationEvents";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="ListScreen"
        component={ListScreen}
        options={{ headerShown: true }}
      />
      <Tab.Screen name="MyProfile" component={MyProfile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [destination, setDestination] = useState(null);
  const [notificationPopup, setNotificationPopup] = useState({
    visible: false,
    notification: null,
  });
  const navigationRef = useRef();

  useEffect(() => {
  if (Platform.OS === "android") {
    NavigationBar.setVisibilityAsync("hidden"); 
    // NavigationBar.setBehaviorAsync("overlay-swipe");
  }
}, []);

  useEffect(() => {
    const checkAuth = async () => {
      const [authToken, hasLaunched] = await Promise.all([
        AsyncStorage.getItem("authToken"),
        AsyncStorage.getItem("hasLaunched"),
      ]);
      console.log("authToken from storage:", authToken);
      if (!hasLaunched) await AsyncStorage.setItem("hasLaunched", "true");
      setDestination(authToken ? "MainTabs" : "LoginScreen");
      
      if (authToken) {
        registerForPushNotifications();
      }
    };
    checkAuth();

    // Handle foreground notifications with Firebase
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('📬 FCM Notification received in foreground:', remoteMessage);
      console.log('📬 Title:', remoteMessage.notification?.title);
      console.log('📬 Body:', remoteMessage.notification?.body);
      console.log('📬 Data:', remoteMessage.data);
      
      const popupData = {
        visible: true,
        notification: {
          title: remoteMessage.notification?.title || 'Notification',
          message: remoteMessage.notification?.body || 'You have a new notification',
          type: remoteMessage.data?.type || 'system',
        },
      };
      
      console.log('🎯 Setting popup data:', popupData);
      setNotificationPopup(popupData);
      
      // Emit event to refresh badge count immediately
      notificationEmitter.emit('newNotification');
    });

    // Handle notification tap (background/quit state)
    const unsubscribeNotificationOpen = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification tapped (background):', remoteMessage);
      if (navigationRef.current) {
        navigationRef.current.navigate('NotificationScreen');
      }
    });

    // Check if app was opened from notification (quit state)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification opened app from quit state:', remoteMessage);
          if (navigationRef.current) {
            navigationRef.current.navigate('NotificationScreen');
          }
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpen();
    };
  }, []);

  if (!destination)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar translucent backgroundColor="transparent" />

        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="OpeningScreen">
            <Stack.Screen
              name="OpeningScreen"
              component={OpeningScreen}
              options={{ headerShown: false }}
              initialParams={{ destination }}
            />
            <Stack.Screen
              name="Onboarding"
              component={OnboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ScanScreen"
              component={ScanScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResultScreen"
              component={ResultScreen}
              options={{
                title: "Scan Result",
                headerTintColor: "#fff",
                headerShown: true,
                headerStyle: { backgroundColor: "#1E3A8A" },
              }}
            />
            <Stack.Screen
              name="CardDetails"
              component={CardDetails}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OtpScreen"
              component={OtpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ShareCard"
              component={ShareCard}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicy}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TermsConditions"
              component={TermsConditions}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HelpSupport"
              component={HelpSupport}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ShareApp"
              component={ShareApp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SetupMPinScreen"
              component={SetupMPinScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VerifyMPinScreen"
              component={VerifyMPinScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChangeMPinScreen"
              component={ChangeMPinScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPin"
              component={ForgotPin}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditField"
              component={EditScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>

        {/* In-App Notification Popup */}
        <NotificationPopup
          visible={notificationPopup.visible}
          notification={notificationPopup.notification}
          onPress={() => {
            setNotificationPopup({ visible: false, notification: null });
            if (navigationRef.current) {
              navigationRef.current.navigate('NotificationScreen');
            }
          }}
          onDismiss={() => {
            setNotificationPopup({ visible: false, notification: null });
          }}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}