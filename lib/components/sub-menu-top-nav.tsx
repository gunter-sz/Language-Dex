import React from "react";
import { useTheme } from "../contexts/theme";
import { StyleSheet, StyleProp, View, ViewStyle } from "react-native";
import { ArrowLeftIcon } from "./icons";
import { router } from "expo-router";
import { SubMenuIconButton } from "./icon-button";
import { Span } from "./text";

type Props = { style?: StyleProp<ViewStyle> } & React.PropsWithChildren;

export default function SubMenuTopNav({ style, children }: Props) {
  const theme = useTheme();

  return (
    <View style={[styles.header, theme.styles.subMenuTopNav, style]}>
      {children}
    </View>
  );
}

export function SubMenuTitle({ children }: React.PropsWithChildren) {
  const theme = useTheme();
  return (
    <Span style={[styles.title, theme.styles.subMenuTitle]}>{children}</Span>
  );
}

export function SubMenuActions({ style, children }: Props) {
  return <View style={[styles.actions, style]}>{children}</View>;
}

export function SubMenuBackButton() {
  return (
    <SubMenuIconButton icon={ArrowLeftIcon} onPress={() => router.back()} />
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 4,
  },
  title: {
    marginLeft: 8,
    fontSize: 22,
    alignSelf: "center",
  },
  actions: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
  },
});
