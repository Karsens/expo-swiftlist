import React from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";

import { BlurView } from "expo-blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const FADE_MS = 500;
//leckr
class BlurViewWrapper extends React.Component {
  state = {
    intensity: new Animated.Value(0)
  };

  componentDidUpdate() {
    const { slowBlur } = this.props;
    let { intensity } = this.state;

    if (slowBlur) {
      Animated.timing(intensity, { duration: FADE_MS, toValue: 90 }).start(
        () => {
          //niks erna
        }
      );
    } else {
      Animated.timing(intensity, { duration: FADE_MS, toValue: 0 }).start();
      //rustahhg
    }
  }

  render() {
    const { children, slowBlur, onStopBlur } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {children}
        {slowBlur && (
          <TouchableWithoutFeedback onPress={() => onStopBlur()}>
            <AnimatedBlurView
              tint="light"
              intensity={this.state.intensity}
              style={StyleSheet.absoluteFill}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

export default BlurViewWrapper;
