/* eslint-env jest */

import React from "react";
import renderer from "react-test-renderer";

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  QueryClient: jest.fn(() => ({})),
  QueryClientProvider: ({ children }) => children,
  useQuery: () => ({
    data: [],
    isLoading: false,
  }),
}));

jest.mock("react-native-paper", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  const Button = ({ children, onPress, testID }) => (
    <Text onPress={onPress} testID={testID || `button-${children}`}>
      {children}
    </Text>
  );

  const Card = ({ children }) => <View>{children}</View>;
  Card.Title = ({ title, subtitle }) => (
    <View>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
    </View>
  );
  Card.Content = ({ children }) => <View>{children}</View>;

  return {
    Button,
    Card,
    Chip: ({ children }) => <Text>{children}</Text>,
    PaperProvider: ({ children }) => children,
    Searchbar: ({ placeholder }) => <Text>{placeholder}</Text>,
    Text,
  };
});

jest.mock("react-native-paper-snackbar-stack", () => ({
  SnackbarProvider: ({ children }) => children,
}));

jest.mock("../app/includes/Background", () => ({
  __esModule: true,
  default: ({ children }) => {
    const React = require("react");
    const { View } = require("react-native");

    return <View>{children}</View>;
  },
}));

jest.mock("../app/includes/LanguagePicker", () => ({
  __esModule: true,
  default: () => {
    const React = require("react");
    const { View } = require("react-native");

    return <View testID="language-picker" />;
  },
  getResponsiveLanguagePickerStyle: () => ({}),
}));

jest.mock("../app/includes/LocalizationProvider", () => ({
  LocalizationProvider: ({ children }) => children,
  useLocalization: () => ({
    strings: {
      plugins: {
        backToHome: "Back to home",
        disabledTitle: "Plugins are not available yet",
        disabledDescription: "Disabled",
        heroTitle: "WPrint 3D Plugins",
        heroDescription: "Discover plugins.",
        officialRegistry: "Official registry",
        examplePlugin: "Example plugin",
        searchPlaceholder: "Search plugins",
        unversioned: "unversioned",
        downloadPackage: "Download package",
        documentation: "Documentation",
        homepage: "Homepage",
      },
    },
  }),
}));

jest.mock("../app/includes/Theme", () => ({
  __esModule: true,
  default: () => ({}),
}));

jest.mock("../config/featureFlags", () => ({
  isPluginSystemEnabled: () => true,
}));

jest.mock("../config/pluginRegistry", () => ({
  normalizeRegistryPayload: (payload) => payload,
  pluginRegistryConfig: {
    indexUrl: "https://example.com/index.json",
    repositoryUrl: "https://example.com/registry",
    examplesUrl: "https://example.com/examples",
  },
}));

describe("plugins page", () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockReplace.mockReset();
  });

  it("offers a back-to-home action when the marketplace is enabled", async () => {
    const PluginMarketplacePage = require("../app/plugins").default;
    let tree;

    await renderer.act(async () => {
      tree = renderer.create(<PluginMarketplacePage />);
    });

    const backButton = tree.root.findByProps({ testID: "button-Back to home" });

    expect(backButton).toBeTruthy();

    await renderer.act(async () => {
      backButton.props.onPress();
    });

    expect(mockReplace).toHaveBeenCalledWith("/");

    await renderer.act(async () => {
      tree.unmount();
    });
  });
});
