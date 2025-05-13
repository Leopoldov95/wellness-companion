import { View, StyleSheet, LayoutChangeEvent, Keyboard } from "react-native";
import { usePathname } from "expo-router";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Colors from "@/src/constants/Colors";
import TabBarButton from "./TabBarButton";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
const EXCLUDED_ROUTES = [
  "meditate",
  "meditate/player",
  "journal",
  "journal/entries",
  "journal/shared",
];

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // get the current location to hide the navbar on specified pages
  const pathname = usePathname();
  const routeName = pathname.replace("/", "");

  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });

  //* removing pages from the navbar index so it will not appear as a Nav menu
  const filteredRoutes = state.routes.filter(
    (route) => EXCLUDED_ROUTES.indexOf(route.name) === -1
  );

  const buttonWidth = dimensions.width / filteredRoutes.length;

  // const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View
      onLayout={onTabbarLayout}
      style={[
        styles.tabBar,
        EXCLUDED_ROUTES.includes(routeName) && styles.hide,
        keyboardVisible && { display: "none" }, // Hide tab bar when keyboard is visible
      ]}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: Colors.light.primary,
            borderRadius: 30,
            marginHorizontal: 12,
            height: dimensions.height - 15,
            width: buttonWidth - 25,
          },
        ]}
      />
      {filteredRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: 1500,
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? "#fff" : Colors.light.quaternary}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  hide: {
    display: "none",
  },
});
