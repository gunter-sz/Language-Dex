import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "@/lib/contexts/theme";
import StatusBarSpacer from "./status-bar-spacer";
import React from "react";

type PropsWithStyleAndChildren = {
  style?: StyleProp<ViewStyle>;
} & React.PropsWithChildren;

export default function ({ style, children }: PropsWithStyleAndChildren) {
  const theme = useTheme();

  return (
    <>
      <StatusBarSpacer />
      <View style={[theme.styles.topNav, style]}>{children}</View>
    </>
  );
}
