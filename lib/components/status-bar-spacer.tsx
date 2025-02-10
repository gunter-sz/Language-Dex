import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function () {
  const insets = useSafeAreaInsets();

  return <View style={{ height: insets.top }} />;
}
