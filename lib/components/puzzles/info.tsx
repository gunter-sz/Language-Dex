import React from "react";
import { Span } from "../text";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/lib/contexts/theme";
import { HintIcon, IncorrectIcon, TimerIcon } from "../icons";

export function GameTitle({ children }: React.PropsWithChildren) {
  const theme = useTheme();

  return (
    <Span style={[styles.title, theme.styles.subMenuTitle]}>{children}</Span>
  );
}

export function ScoreRow({ children }: React.PropsWithChildren) {
  return <View style={styles.scoreRow}>{children}</View>;
}

export function GameClock({ seconds }: { seconds: number }) {
  const theme = useTheme();

  seconds = Math.max(Math.ceil(seconds), 0);

  return (
    <View style={styles.clockBlock}>
      <TimerIcon color={theme.colors.disabledText} size={28} />
      <Span style={[styles.clock, theme.styles.disabledText]}>
        {Math.floor(seconds / 60)}:{seconds % 60 < 10 ? "0" : ""}
        {seconds % 60}
      </Span>
    </View>
  );
}

export function Score({ score }: { score: number }) {
  const theme = useTheme();

  return (
    <Span style={[styles.score, styles.scoreFont, theme.styles.poppingText]}>
      {score}
    </Span>
  );
}

export function HintScore({ score }: { score: number }) {
  const theme = useTheme();

  return (
    <View style={styles.hintBlock}>
      <Span style={[styles.scoreFont, theme.styles.hintScoreText]}>
        {score}
      </Span>
      <HintIcon size={28} color={theme.colors.text} />
    </View>
  );
}

export function IncorrectScore({ score }: { score: number }) {
  const theme = useTheme();

  return (
    <View style={styles.incorrectBlock}>
      <IncorrectIcon size={29} color={theme.colors.text} />
      <Span
        style={[
          styles.scoreFont,
          score == 0
            ? theme.styles.disabledText
            : theme.styles.incorrectScoreText,
        ]}
      >
        {score}
      </Span>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  clockBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clock: {
    fontWeight: "bold",
    fontSize: 22,
  },
  scoreFont: {
    fontWeight: "bold",
    fontSize: 22,
  },
  score: {
    marginLeft: "auto",
    marginRight: 4,
  },
  hintBlock: {
    marginLeft: "auto",
    flexDirection: "row",
    gap: 6,
  },
  incorrectBlock: {
    flexDirection: "row",
    gap: 2,
  },
});
