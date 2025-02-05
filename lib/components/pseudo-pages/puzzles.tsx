import React, { useEffect, useState } from "react";
import { useTheme } from "@/lib/contexts/theme";
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Span } from "../text";
import { Theme } from "@/lib/themes";
import { Href, router } from "expo-router";
import { useDictionaryVersioning } from "@/lib/hooks/use-word-definitions";
import { listGameWords, listWords } from "@/lib/data";
import { logError } from "@/lib/log";
import ListPopup from "../list-popup";
import { LockIcon } from "../icons";

import { definitionMatchModeList } from "@/app/puzzles/[mode]/definition-match";
import { unscrambleModeList } from "@/app/puzzles/[mode]/unscramble";
import { useUserDataContext } from "@/lib/contexts/user-data";
import Dialog, { DialogDescription, DialogTitle } from "../dialog";
import {
  ConfirmationDialogAction,
  ConfirmationDialogActions,
} from "../confirmation-dialog";

type GameListingProps = {
  label: string;
  style: StyleProp<ViewStyle>;
  theme: Theme;
  lockedCallback: ((description: string) => void) | false;
} & (
  | {
      href?: undefined;
      modes: string[];
      onSelect: (mode: string) => void;
    }
  | {
      modes?: undefined;
      onSelect?: undefined;
      href?: Href;
    }
);

function GameListing({
  label,
  style,
  theme,
  href,
  lockedCallback,
  modes,
  onSelect,
}: GameListingProps) {
  const [t] = useTranslation();

  if (lockedCallback != false) {
    return (
      <View style={style}>
        <Pressable
          style={styles.pressable}
          android_ripple={theme.ripples.transparentButton}
          onPress={() => lockedCallback(t(label + "_Requirements"))}
        >
          <LockIcon
            style={styles.lock}
            size={24}
            color={theme.colors.iconButton}
          />

          <Span>{t(label)}</Span>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={style}>
      {modes ? (
        <ListPopup
          style={styles.pressable}
          android_ripple={theme.ripples.transparentButton}
          list={modes}
          getItemText={(mode) => t("mode_" + mode)}
          keyExtractor={(value) => value}
          centerItems
          onSelect={onSelect}
        >
          <Span>{t(label)}</Span>
        </ListPopup>
      ) : (
        <Pressable
          style={styles.pressable}
          android_ripple={theme.ripples.transparentButton}
          onPress={() => {
            if (href != undefined) {
              router.navigate(href);
            }
          }}
        >
          <Span>{t(label)}</Span>
        </Pressable>
      )}
    </View>
  );
}

function testLock<Options>(
  lockFn: (lock: boolean) => void,
  f: (
    dictionaryId: number,
    options: Options & { limit: number }
  ) => Promise<any[]>,
  dictionaryId: number,
  options: Options & { limit: number }
) {
  f(dictionaryId, options)
    .then((list) => lockFn(list.length < options.limit))
    .catch(logError);
}

export default function () {
  const theme = useTheme();
  const [t] = useTranslation();
  const [userData] = useUserDataContext();
  const dictionaryVersion = useDictionaryVersioning();
  const [matchLocked, setMatchLocked] = useState(true);
  const [unscrambleLocked, setUnscrambledLocked] = useState(true);
  const [crosswordsLocked, setCrosswordsLocked] = useState(true);
  const [lockedDialogOpen, setLockedDialogOpen] = useState(true);
  const [lockDescription, setLockDescription] = useState("");

  const listingStyles = [theme.styles.gameListing, styles.listing];

  useEffect(() => {
    setMatchLocked(true);
    setCrosswordsLocked(true);
    setCrosswordsLocked(true);

    testLock(setMatchLocked, listGameWords, userData.activeDictionary, {
      limit: 3,
    });

    testLock(setUnscrambledLocked, listGameWords, userData.activeDictionary, {
      minLength: 2,
      limit: 3,
    });

    testLock(setCrosswordsLocked, listWords, userData.activeDictionary, {
      ascending: false,
      orderBy: "longest",
      limit: 20,
    });
  }, [userData.activeDictionary, dictionaryVersion]);

  const lockCallback = (desc: string) => {
    setLockDescription(desc);
    setLockedDialogOpen(true);
  };

  const closeLockDialog = () => {
    setLockedDialogOpen(false);
  };

  return (
    <View style={styles.list}>
      <View style={styles.row}>
        <GameListing
          label="Match"
          style={listingStyles}
          theme={theme}
          modes={definitionMatchModeList}
          lockedCallback={matchLocked && lockCallback}
          onSelect={(mode) =>
            router.navigate(`/puzzles/${mode}/definition-match`)
          }
        />

        <GameListing
          label="Unscramble"
          style={listingStyles}
          theme={theme}
          lockedCallback={unscrambleLocked && lockCallback}
          modes={unscrambleModeList}
          onSelect={(mode) => router.navigate(`/puzzles/${mode}/unscramble`)}
        />
      </View>

      <View style={styles.row}>
        <GameListing
          label="Crosswords"
          style={listingStyles}
          theme={theme}
          lockedCallback={crosswordsLocked && lockCallback}
        />

        <View style={styles.spacer} />
      </View>

      <Dialog open={lockedDialogOpen} onClose={closeLockDialog}>
        <DialogTitle>{t("Locked")}</DialogTitle>
        <DialogDescription>{lockDescription}</DialogDescription>

        <ConfirmationDialogActions>
          <ConfirmationDialogAction onPress={closeLockDialog}>
            {t("Close")}
          </ConfirmationDialogAction>
        </ConfirmationDialogActions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexWrap: "wrap",
    gap: 4,
    padding: 8,
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  listing: {
    flexDirection: "column",
    aspectRatio: 1,
    flexGrow: 1,
    alignItems: "stretch",
    flexBasis: "50%",
  },
  lock: {
    position: "absolute",
    right: 2,
    top: 4,
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  spacer: {
    flexGrow: 1,
    flexBasis: "50%",
  },
});
