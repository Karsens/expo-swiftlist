import React from "react";
import { View, Easing, Animated, TouchableOpacity } from "react-native";
import * as Icon from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";

//leckr

import { Config } from "../config";

import { Util } from "../index.leckr.imports";
const { allSides } = Util;

export type Props = {
  onPress: () => void,
  iconName: string,
  /**
   * default is fontAwesome
   */
  fontFamily: string,
  isActive: (state: any) => boolean,
  isActiveRotate: (state: any) => boolean,
  state: any
};
export class Component extends React.Component<Props> {
  spinValue = new Animated.Value(0);

  render() {
    const {
      onPress,
      iconName,
      fontFamily = "FontAwesome",
      isActive,
      isActiveRotate,
      state,
      style
    } = this.props;

    const IconClass = Icon[fontFamily];
    const _isActive = isActive?.(state);
    const shouldRotate = isActiveRotate?.(state);

    let RotateOrView = ({ children }) => <View>{children}</View>;

    if (shouldRotate) {
      // First set up animation
      Animated.timing(this.spinValue, {
        toValue: 5,
        duration: 15000,
        easing: Easing.linear
      }).start();

      // Second interpolate beginning and end values (in this case 0 and 1)
      const spin = this.spinValue.interpolate({
        inputRange: [0, 5],
        outputRange: ["0deg", "1800deg"]
      });

      RotateOrView = ({ children }) => (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          {children}
        </Animated.View>
      );
    }
    return (
      <Touchable
        style={[{ margin: 10 }, style]}
        hitSlop={allSides(15)}
        onPress={onPress}
      >
        <RotateOrView>
          <IconClass
            name={iconName}
            size={20}
            style={{
              color: _isActive
                ? Config.layouts?.[0]?.colors?.iconHighlightColor
                : "black"
            }}
          />
        </RotateOrView>
      </Touchable>
    );
  }
}
