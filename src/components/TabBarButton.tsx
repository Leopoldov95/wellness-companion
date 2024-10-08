import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: {
  onPress: Function;
  onLongPress: Function;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string;
}) => {
  const icons = {
    index: (props: any) => <Feather name="map" size={24} {...props} />,
    home: (props: any) => <Feather name="home" size={24} {...props} />,
    goals: (props: any) => <Feather name="target" size={24} {...props} />,
    chart: (props: any) => <Feather name="bar-chart" size={24} {...props} />,
    profile: (props: any) => <Feather name="user" size={24} {...props} />,
  };

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      opacity,
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);

    const top = interpolate(scale.value, [0, 1], [0, 9]);

    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top,
    };
  });
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItems}
    >
      <Animated.View style={animatedIconStyle}>
        {icons[routeName]({
          color: isFocused ? "#fff" : Colors.light.quaternary,
        })}
      </Animated.View>

      <Animated.Text
        style={[
          {
            color: isFocused ? Colors.light.text : "grey",
            fontSize: 12,
          },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabBarItems: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});

export default TabBarButton;
