/* eslint-env jest */

import React from "react";
import renderer from "react-test-renderer";

import TabDocker from "../app/tabs/TabDocker";

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(),
}));

jest.mock("react-native-device-info", () => ({
  getBaseOs: jest.fn().mockResolvedValue("Linux"),
}));

jest.mock("react-native-paper-snackbar-stack", () => ({
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}));

jest.mock("../app/includes/LocalizationProvider", () => ({
  useLocalization: () => ({
    strings: {
      docker: {
        copiedToClipboard: "Copied to clipboard!",
        compatibility: "Compatible text",
        recommendedHeadline: "Recommended headline",
        recommendedBody: "Recommended body",
        progressHint: "Progress hint",
        windowsSetupTitle: "Windows setup",
        windowsSetupDescription: "Windows setup description",
        connectTitle: "Connect to the target machine",
        connectDescription: "Connect description",
        installEngineTitle: "Install Podman",
        installEngineDescription: "Install Podman description",
        installReleaseTitle: "Install the latest release",
        installReleaseDescription: "Install release description",
        accessWebTitle: "Access the web interface",
        accessWebDescription: "Access web description",
        wslNextStepsTitle: "On WSL 2?",
        wslNextStepsDescription: "WSL steps",
        updaterWarningTitle: "Updater warning",
        updaterWarningBody: "Updater body",
        updaterWarningFootnote: "Updater footnote",
      },
    },
  }),
}));

jest.mock("../app/includes/TabWrapper", () => {
  const { View } = require("react-native");

  return ({ children }) => <View>{children}</View>;
});

jest.mock("../app/includes/CompatibilityHint", () => {
  const { Text } = require("react-native");

  return ({ text }) => <Text>{text}</Text>;
});

jest.mock("../app/includes/ClickableStep", () => {
  const { Text, View } = require("react-native");

  return ({ title, description }) => (
    <View testID={`clickable-step-${title}`}>
      <Text>{title}</Text>
      <Text>{description}</Text>
    </View>
  );
});

jest.mock("react-native-paper", () => {
  const { Text, View } = require("react-native");

  const TextInput = ({ value }) => <Text>{value}</Text>;
  TextInput.Icon = () => null;

  const List = {
    Icon: () => null,
    Item: ({ title, description }) => (
      <View>
        <Text>{title}</Text>
        <Text>{description}</Text>
      </View>
    ),
  };

  return {
    List,
    Text,
    TextInput,
    useTheme: () => ({
      colors: {
        error: "red",
      },
    }),
  };
});

describe("TabDocker", () => {
  it("does not render a post-install step in the Podman flow", async () => {
    let tree;

    await renderer.act(async () => {
      tree = renderer.create(<TabDocker />);
    });

    const output = JSON.stringify(tree.toJSON());
    expect(output).toContain("Connect to the target machine");
    expect(output).toContain("Install Podman");
    expect(output).toContain("Install the latest release");
    expect(output).toContain("Access the web interface");
    expect(output).not.toContain("post-install");
    expect(
      tree.root.findByProps({ testID: "clickable-step-Connect to the target machine" })
    ).toBeTruthy();
    expect(tree.root.findByProps({ testID: "clickable-step-Install Podman" })).toBeTruthy();
    expect(
      tree.root.findByProps({ testID: "clickable-step-Install the latest release" })
    ).toBeTruthy();
    expect(
      tree.root.findByProps({ testID: "clickable-step-Access the web interface" })
    ).toBeTruthy();

    await renderer.act(async () => {
      tree.unmount();
    });
  });
});
