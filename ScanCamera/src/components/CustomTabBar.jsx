import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  const bottomPadding = Platform.select({
    ios: Math.max(insets.bottom, 20),
    android: Math.max(insets.bottom, 15),
    default: 15
  });
  
  const tabBarHeight = 70;
  const totalHeight = tabBarHeight + bottomPadding;

  // Error handling
  if (!state || !descriptors || !navigation) {
    console.warn('CustomTabBar: Missing required props');
    return null;
  }

  const getIcon = (routeName, isFocused) => {
    const icons = {
      Home: isFocused ? "home" : "home-outline",
      ListScreen: isFocused ? "albums" : "albums-outline",
      MyProfile: isFocused ? "person" : "person-outline",
      Settings: isFocused ? "settings" : "settings-outline",
    };
    return icons[routeName] || "help-outline";
  };

  const getLabel = (routeName) => {
    const labels = { 
      Home: "Home", 
      ListScreen: "Cards", 
      MyProfile: "Profile", 
      Settings: "Settings" 
    };
    return labels[routeName] || routeName;
  };

  return (
    <View style={[styles.bottomContainer, { height: totalHeight }]}>
      <Svg width={width} height={totalHeight} style={styles.svgBackground}>
        <Path
          d={`M0,${totalHeight} L0,20 Q0,0 20,0 L${width/2 - 40},0 A40,40 0 0 0 ${width/2 + 40},0 L${width - 20},0 Q${width},0 ${width},20 L${width},${totalHeight} Z`}
          fill="#F8FAFC"
          stroke="#1E40AF"
          strokeWidth="1.5"
        />
      </Svg>

      <View style={[styles.tabBarContent, { 
        paddingBottom: bottomPadding, 
        height: totalHeight 
      }]}>
        
        <View style={styles.leftTabs}>
          {state.routes.slice(0, 2).map((route, index) => {
            const isFocused = state.index === index;
            const onPress = () => {
              const event = navigation.emit({ 
                type: "tabPress", 
                target: route.key, 
                canPreventDefault: true 
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity 
                key={route.key} 
                style={styles.tabButton} 
                onPress={onPress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={getIcon(route.name, isFocused)}
                  size={24}
                  color={isFocused ? "#1E40AF" : "#94A3B8"}
                />
                <Text style={[styles.tabText, isFocused && styles.activeText]}>
                  {getLabel(route.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Center Camera Button */}
        <TouchableOpacity 
          style={styles.centerButton} 
          onPress={() => navigation.navigate("ScanScreen")}
          activeOpacity={0.8}
        >
          <LinearGradient 
            colors={["#2563EB", "#1E40AF"]} 
            style={styles.centerGradient}
          >
            <Ionicons name="camera" size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Right Side Tabs (Profile, Settings) */}
        <View style={styles.rightTabs}>
          {state.routes.slice(2, 4).map((route, index) => {
            const actualIndex = index + 2; 
            const isFocused = state.index === actualIndex;
            const onPress = () => {
              const event = navigation.emit({ 
                type: "tabPress", 
                target: route.key, 
                canPreventDefault: true 
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity 
                key={route.key} 
                style={styles.tabButton} 
                onPress={onPress}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={getIcon(route.name, isFocused)}
                  size={24}
                  color={isFocused ? "#1E40AF" : "#94A3B8"}
                />
                <Text style={[styles.tabText, isFocused && styles.activeText]}>
                  {getLabel(route.name)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    alignItems: "center",
  },
  svgBackground: { 
    position: "absolute", 
    bottom: 0,
  },
  tabBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  leftTabs: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
  },
  rightTabs: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
  },
  tabButton: { 
    justifyContent: "center", 
    alignItems: "center",
    paddingVertical: 8,
    minWidth: 60,
  },
  tabText: { 
    fontSize: 11, 
    marginTop: 4, 
    color: "#94A3B8",
    fontWeight: "500",
  },
  activeText: { 
    color: "#2563EB", 
    fontWeight: "600" 
  },
  centerButton: {
    width: 70,
    height: 70,
    borderRadius: 33,
    marginTop: -65,
    padding: 3,
  },
  centerGradient: { 
    flex: 1, 
    borderRadius: 33, 
    justifyContent: "center", 
    alignItems: "center", 
  },
});