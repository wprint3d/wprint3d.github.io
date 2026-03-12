/* eslint-env jest */

import React from "react";
import renderer from "react-test-renderer";

import LanguagePicker, { getResponsiveLanguagePickerStyle } from "../app/includes/LanguagePicker";

jest.mock("../app/includes/LocalizationProvider", () => ({
  useLocalization: () => ({
    effectiveLanguage: "en",
    getLanguageOption: (value) => ({
      auto: { value: "auto", flag: "🌐", nativeLabel: "Auto" },
      en: { value: "en", flag: "🇺🇸", nativeLabel: "English" },
    }[value]),
    languageOptions: [
      { value: "auto", flag: "🌐", nativeLabel: "Auto" },
      { value: "en", flag: "🇺🇸", nativeLabel: "English" },
    ],
    selectedLanguage: "auto",
    setSelectedLanguage: jest.fn(),
    strings: {
      language: {
        label: "Language",
        autoDetect: "Auto-detect",
        detectedLabel: "Detected",
      },
    },
  }),
}));

jest.mock("react-native-paper", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  const Menu = ({ children, anchor }) => (
    <View>
      {anchor}
      {children}
    </View>
  );

  Menu.Item = function MenuItem({ title }) {
    return <Text>{title}</Text>;
  };

  function Button({ children, style }) {
    return (
      <View testID="language-picker-button" style={style}>
        <Text>{children}</Text>
      </View>
    );
  }

  return {
    Button,
    Menu,
    Text,
  };
});

describe("LanguagePicker", () => {
  const renderLanguagePicker = async () => {
    let tree;

    await renderer.act(async () => {
      tree = renderer.create(<LanguagePicker />);
    });

    return tree;
  };

  it("centers the picker horizontally on small displays", () => {
    expect(getResponsiveLanguagePickerStyle({ isSmallScreen: true })).toEqual({
      alignSelf: "center",
      alignItems: "center",
    });

    expect(getResponsiveLanguagePickerStyle({ isSmallScreen: true, isOverlay: true })).toEqual({
      alignSelf: "center",
      alignItems: "center",
      left: 0,
      right: 0,
    });
  });

  it('does not render a separate "Language" label above the picker', async () => {
    const tree = await renderLanguagePicker();
    const output = JSON.stringify(tree.toJSON());

    expect(output).not.toContain("Language");
    expect(output).toContain("Auto-detect");

    await renderer.act(async () => {
      tree.unmount();
    });
  });

  it("sizes the picker button to the selected option instead of forcing a minimum width", async () => {
    const tree = await renderLanguagePicker();
    const button = tree.root.findByProps({ testID: "language-picker-button" });

    expect(button.props.style).not.toMatchObject({ minWidth: 210 });

    await renderer.act(async () => {
      tree.unmount();
    });
  });
});
