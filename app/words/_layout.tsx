import { View } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/lib/contexts/theme";

export default function () {
  const theme = useTheme();

  return (
    <View style={theme.styles.wordsRoot}>
      <Stack
        screenOptions={{
          navigationBarColor:
            typeof theme.colors.definitionBackground == "string"
              ? theme.colors.definitionBackground
              : undefined,
          headerShown: false,
          contentStyle: theme.styles.wordsRoot,
          animation: "fade",
        }}
      />
    </View>
  );
}
