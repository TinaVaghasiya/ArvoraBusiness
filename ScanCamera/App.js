// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Home from "./src/screens/Home";
// import Onboard from "./src/screens/Onboardscreen";
// import ScanScreen from "./src/screens/ScanScreen";
// import ResultScreen from "./src/screens/ResultScreen";

// const Stack = createNativeStackNavigator();

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboard">
//         <Stack.Screen name="Home" component={Home} />
//         <Stack.Screen name="Onboard" component={Onboard} />
//         <Stack.Screen name="Scan" component={ScanScreen} />
//         <Stack.Screen name="Result" component={ResultScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import { Provider as PaperProvider } from "react-native-paper";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Onboard from "./src/screens/Onboardscreen";
import ScanScreen from "./src/screens/ScanScreen";
import ResultScreen from "./src/screens/ResultScreen";
import ListScreen from "./src/screens/ListScreen";
import CardDetails from "./src/screens/CardDetails";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Onboard"
            component={Onboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ScanScreen"
            component={ScanScreen}
            options={{
              title: "Scan Business Card",
              headerTintColor: "#fff",
              headerShown: true,
              headerStyle: { backgroundColor: "#2563EB" },
            }}
          />
          <Stack.Screen
            name="ResultScreen"
            component={ResultScreen}
            options={{
              title: "Scan Result",
              headerTintColor: "#fff",
              headerShown: true,
              headerStyle: { backgroundColor: "#618af0" },
            }}
          />
          <Stack.Screen
            name="ListScreen"
            component={ListScreen}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="CardDetails"
            component={CardDetails}
            options={{
              headerShown: false,
              
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
