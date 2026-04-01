import { Provider as PaperProvider } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const Stack = createNativeStackNavigator();

export default function App() {
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const [authToken, hasLaunched] = await Promise.all([
        AsyncStorage.getItem("authToken"),
        AsyncStorage.getItem("hasLaunched"),
      ]);
      console.log("authToken from storage:", authToken);
      if (!hasLaunched) await AsyncStorage.setItem("hasLaunched", "true");
      setDestination(authToken ? "Home" : "LoginScreen");
    };
    checkAuth();
  }, []);

  if (!destination) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#1E3A8A" />
    </View>
  );

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="OpeningScreen">
          <Stack.Screen
            name="OpeningScreen"
            component={OpeningScreen}
            options={{ headerShown: false }}
            initialParams={{ destination }}
          />
          <Stack.Screen name="Onboarding" component={OnboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="ScanScreen" component={ScanScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="ResultScreen"
            component={ResultScreen}
            options={{ title: "Scan Result", headerTintColor: "#fff", headerShown: true, headerStyle: { backgroundColor: "#1E3A8A" } }}
          />
          <Stack.Screen name="ListScreen" component={ListScreen} options={{ headerShown: true }} />
          <Stack.Screen name="CardDetails" component={CardDetails} options={{ headerShown: false }} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ShareCard" component={ShareCard} options={{ headerShown: false }} />
          <Stack.Screen name="MyProfile" component={MyProfile} options={{ headerShown: false }} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
          <Stack.Screen name="TermsConditions" component={TermsConditions} options={{ headerShown: false }} />
          <Stack.Screen name="HelpSupport" component={HelpSupport} options={{ headerShown: false }} />
          <Stack.Screen name="ShareApp" component={ShareApp} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
