import { Keyboard, StyleProp, View, ViewStyle } from "react-native";

export default function KeyboardDismisser({
  children,
}: React.PropsWithChildren) {
  return (
    <View
      style={style}
      onStartShouldSetResponder={() => {
        Keyboard.dismiss();
        return false;
      }}
    >
      {children}
    </View>
  );
}

const style: StyleProp<ViewStyle> = { flex: 1 };
