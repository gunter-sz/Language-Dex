import { Stack } from "expo-router";
import { useTheme } from "@/lib/contexts/theme";
import RouteRoot from "@/lib/components/route-root";

export default function () {
  const theme = useTheme();

  return (
    <RouteRoot style={theme.styles.wordsRoot}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: theme.styles.wordsRoot,
          animation: "fade",
        }}
      />
    </RouteRoot>
  );
}
