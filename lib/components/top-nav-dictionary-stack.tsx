import { StyleSheet } from "react-native";
import { useUserDataContext } from "@/lib/contexts/user-data";
import NavRow from "./nav-row";
import DictionaryDropdown from "./dictionary-dropdown";
import IconButton from "./icon-button";
import { SettingsIcon } from "./icons";
import { router } from "expo-router";

export default function () {
  const [userData, setUserData] = useUserDataContext();

  return (
    <NavRow
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <DictionaryDropdown
        style={styles.languageOptionContainer}
        labelStyle={styles.languageText}
        value={userData.activeDictionary}
        onChange={(v) => {
          const updatedData = { ...userData };
          updatedData.activeDictionary = v;
          setUserData(updatedData);
        }}
      />

      <IconButton
        icon={SettingsIcon}
        onPress={() => router.navigate("/settings")}
      />
    </NavRow>
  );
}

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  languageOptionContainer: {
    padding: 8,
  },
  languageText: {
    // fontWeight: "400",
    fontSize: 20,
  },
});
