import React from "react";
import * as Icon from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

const SIZE = 64;
const MARGIN = 8;

const MEDIUM_SHADOW = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowRadius: 3,
  shadowOpacity: 0.25,
  elevation: 3
};

const FloatingActionButton = ({
  icon = "ios-add",
  IconFont = Icon.Ionicons,
  iconColor = "white",
  onPress = () => console.log("No onPress set!"),
  text = "",
  backgroundColor = "blue",
  position = 0
}) => {
  return (
    <View
      style={{
        position: "absolute",
        right: MARGIN + position * (SIZE + MARGIN),
        bottom: MARGIN,
        width: SIZE + MARGIN,
        height: SIZE + MARGIN,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: SIZE / 2,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor,
            ...MEDIUM_SHADOW
          }}
        >
          <IconFont name={icon} size={32} color={iconColor} />
        </View>
      </TouchableOpacity>
      {text ? (
        <Text style={{ textAlign: "center", fontSize: 10 }}>{text}</Text>
      ) : null}
    </View>
  );
};

export default FloatingActionButton;
