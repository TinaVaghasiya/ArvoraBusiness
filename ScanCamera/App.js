// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import ScanScreen from "./screens/ScanScreen";
// import ResultScreen from "./screens/ResultScreen";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Onboard">
//         <Stack.Screen name="Scan" component={ScanScreen}
//         options={{ headerShown: true,
//           headerTitle: "Scan Business Card",
//           headerStyle: {
//             backgroundColor: "#1e88e5",
//           },
//           headerTintColor: "#fff",
//           headerTitleStyle: {
//             fontWeight: "bold",
//           },
//          }} />
//         <Stack.Screen name="Result" component={ResultScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Onboard from "./screens/Onboardscreen";
import ScanScreen from "./screens/ScanScreen";
import ResultScreen from "./screens/ResultScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
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
          name="Scan"
          component={ScanScreen}
          options={{
            headerShown: true,
            headerTitle: "Scan Business Card",
            headerStyle: {
              backgroundColor: "#1e88e5",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            title: "Scan Result",
            headerTintColor: "#fff",
            headerShown: true,
            headerStyle: { backgroundColor: "#2563EB" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
