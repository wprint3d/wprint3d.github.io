/* eslint-env jest */

import React from "react";
import renderer from "react-test-renderer";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: () => ({
    data: [],
    isLoading: false,
  }),
}));

jest.mock("react-native-paper", () => {
  const React = require("react");
  const { Text, View } = require("react-native");

  const Button = ({ children, onPress, testID, style }) => (
    <Text onPress={onPress} testID={testID || `button-${children}`} style={style}>
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
    Paragraph: ({ children }) => <Text>{children}</Text>,
    Searchbar: ({ placeholder, value, onChangeText }) => (
      <Text
        onPress={() => onChangeText(value)}
        testID={`searchbar-${placeholder}`}
      >
        {placeholder}
      </Text>
    ),
    Text,
    Title: ({ children }) => <Text>{children}</Text>,
    useTheme: () => ({
      dark: false,
      colors: {
        elevation: {
          level0: "#fff",
          level1: "#f2f2f2",
        },
      },
    }),
  };
});

jest.mock("react-native-paper-tabs", () => ({
  TabsProvider: ({ children }) => children,
  Tabs: ({ children }) => children,
  TabScreen: ({ children }) => children,
}));

jest.mock("react-native-paper-snackbar-stack", () => ({
  SnackbarProvider: ({ children }) => children,
}));

jest.mock("@ronradtke/react-native-markdown-display", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return ({ children }) => <Text>{children}</Text>;
});

jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    Image: () => <View testID="card-image" />,
  };
});

jest.mock("../app/includes/CompatibilityHint", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return ({ text }) => <Text>{text}</Text>;
});

jest.mock("../app/includes/LanguagePicker", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    __esModule: true,
    default: () => <View testID="language-picker" />,
    getResponsiveLanguagePickerStyle: () => ({}),
  };
});

jest.mock("../app/includes/BackButton", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return ({ onPress }) => (
    <Text onPress={onPress} testID="back-button">
      Back
    </Text>
  );
});

jest.mock("../app/includes/HeroVideoBackground", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    __esModule: true,
    default: () => <View testID="hero-video" />,
  };
});

jest.mock("../app/includes/SimpleDialog", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  return {
    __esModule: true,
    default: ({ visible, title, content, style }) => (
      visible
        ? (
          <View testID={`dialog-${title}`} style={style}>
            <Text>{title}</Text>
            {content}
          </View>
        )
        : null
    ),
  };
});

jest.mock("../app/tabs/TabBareMetal", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return () => <Text>Bare metal tab</Text>;
});

jest.mock("../app/tabs/TabDocker", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return () => <Text>Docker tab</Text>;
});

jest.mock("../app/tabs/TabRaspberryPi", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return () => <Text>Raspberry Pi tab</Text>;
});

jest.mock("../app/includes/LocalizationProvider", () => ({
  useLocalization: () => ({
    strings: {
      main: {
        heroDescription: "Hero description",
        getStarted: "Get started",
        browsePlugins: "Browse plugins",
        compatibleWith: "Compatible with:",
        windowsExperimental: "Windows note",
        gettingStartedTitle: "Getting started",
        gettingStartedBody: "Body copy",
        tabs: {
          raspberryPi: "Raspberry Pi",
          docker: "Docker",
          bareMetal: "Bare metal",
        },
        cards: [
          { title: "Card 1", description: "Description 1" },
          { title: "Card 2", description: "Description 2" },
          { title: "Card 3", description: "Description 3" },
          { title: "Card 4", description: "Description 4" },
          { title: "Card 5", description: "Description 5" },
          { title: "Card 6", description: "Description 6" },
        ],
      },
      plugins: {
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

describe("Main plugins modal", () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it("opens plugin browsing in a modal and hides the hero video while open", async () => {
    const Main = require("../app/Main").default;
    let tree;

    await renderer.act(async () => {
      tree = renderer.create(<Main isPosterLoaded isFontLoaded />);
    });

    expect(tree.root.findByProps({ testID: "hero-video" })).toBeTruthy();

    const browseButton = tree.root.findByProps({ testID: "button-Browse plugins" });

    await renderer.act(async () => {
      browseButton.props.onPress();
    });

    const pluginsDialog = tree.root.findByProps({ testID: "dialog-WPrint 3D Plugins" });

    expect(pluginsDialog).toBeTruthy();
    expect(pluginsDialog.props.style).toMatchObject({
      width: "100%",
      height: "100%",
      maxWidth: "100%",
      maxHeight: "100%",
    });
    expect(tree.root.findAllByProps({ testID: "hero-video" })).toHaveLength(0);
    expect(mockPush).not.toHaveBeenCalled();

    await renderer.act(async () => {
      tree.unmount();
    });
  });
});
