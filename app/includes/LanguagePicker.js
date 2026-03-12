import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Menu } from "react-native-paper";

import { AUTO_LANGUAGE } from "../../config/localization";
import { useLocalization } from "./LocalizationProvider";

export const getResponsiveLanguagePickerStyle = ({ isSmallScreen = false, isOverlay = false } = {}) => {
  if (!isSmallScreen) {
    return {
      alignSelf: "flex-end",
      ...(isOverlay ? { right: 24 } : {}),
    };
  }

  return {
    alignSelf: "center",
    alignItems: "center",
    ...(isOverlay ? { left: 0, right: 0 } : {}),
  };
};

export default function LanguagePicker({ style }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    effectiveLanguage,
    getLanguageOption,
    languageOptions,
    selectedLanguage,
    setSelectedLanguage,
    strings,
  } = useLocalization();

  const effectiveOption = getLanguageOption(effectiveLanguage);
  const selectedOption = (
    selectedLanguage === AUTO_LANGUAGE
      ? languageOptions[0]
      : getLanguageOption(selectedLanguage)
  );

  return (
    <View style={[styles.container, style]}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={(
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            contentStyle={styles.buttonContent}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {`${selectedOption.flag} ${
              selectedLanguage === AUTO_LANGUAGE
                ? strings.language.autoDetect
                : selectedOption.nativeLabel
            }`}
          </Button>
        )}
      >
        {languageOptions.map((option) => {
          const isAuto = option.value === AUTO_LANGUAGE;
          const title = (
            isAuto
              ? `${option.flag} ${strings.language.autoDetect} (${strings.language.detectedLabel}: ${effectiveOption.nativeLabel})`
              : `${option.flag} ${option.nativeLabel}`
          );

          return (
            <Menu.Item
              key={option.value}
              title={title}
              trailingIcon={selectedLanguage === option.value ? "check" : undefined}
              onPress={async () => {
                setMenuVisible(false);
                await setSelectedLanguage(option.value);
              }}
            />
          );
        })}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  button: {},
  buttonContent: {
    justifyContent: "space-between",
    minHeight: 44,
  },
  buttonLabel: {
    marginVertical: 10,
  },
});
