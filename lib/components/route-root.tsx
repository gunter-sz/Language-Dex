import React, { useEffect, useState } from "react";
import { Keyboard, StyleProp, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RouteRootProps = {
  style?: StyleProp<ViewProps>;
} & React.PropsWithChildren;

export default function RouteRoot({ style, children }: RouteRootProps) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <View style={[style, { flex: 1 }]}>
      <View style={{ height: insets.top }} />

      {children}

      <View style={{ height: keyboardHeight }} />
    </View>
  );
}
