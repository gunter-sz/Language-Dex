import { Stack } from "expo-router";
import { useTheme } from "@/lib/contexts/theme";
import RouteRoot from "@/lib/components/route-root";

export default function () {
  const theme = useTheme();

  return (
    <RouteRoot style={theme.styles.wordsRoot}>
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
    </RouteRoot>
  );
}
