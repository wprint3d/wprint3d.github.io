import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { PaperProvider, Button, Text } from "react-native-paper";
import { SnackbarProvider } from "react-native-paper-snackbar-stack";
import Background from "./includes/Background";
import LanguagePicker, { getResponsiveLanguagePickerStyle } from "./includes/LanguagePicker";
import PluginMarketplaceContent from "./includes/PluginMarketplaceContent";
import { LocalizationProvider, useLocalization } from "./includes/LocalizationProvider";
import Theme from "./includes/Theme";
import { isPluginSystemEnabled } from "../config/featureFlags";

const queryClient = new QueryClient();

const PluginMarketplace = () => {
  const router = useRouter();
  const pluginSystemEnabled = isPluginSystemEnabled();
  const { strings } = useLocalization();
  const isSmallScreen = useWindowDimensions().width <= 768;
  const goHome = () => router.replace("/");

  if (!pluginSystemEnabled) {
    return (
      <Background>
        <View style={styles.disabledState}>
          <LanguagePicker
            style={[
              { marginBottom: 24 },
              getResponsiveLanguagePickerStyle({ isSmallScreen }),
            ]}
          />
          <Text variant="headlineMedium" style={{ textAlign: "center", marginBottom: 12 }}>
            {strings.plugins.disabledTitle}
          </Text>
          <Text style={{ textAlign: "center", marginBottom: 16, maxWidth: 560 }}>
            {strings.plugins.disabledDescription}
          </Text>
          <Button mode="contained" onPress={goHome}>
            {strings.plugins.backToHome}
          </Button>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <ScrollView testID="page-scroll-view" contentContainerStyle={styles.container}>
        <View style={styles.heroNav}>
          <Button mode="text" onPress={goHome}>
            {strings.plugins.backToHome}
          </Button>
        </View>
        <PluginMarketplaceContent
          isSmallScreen={isSmallScreen}
          showTitle
          showLanguagePicker
        />
      </ScrollView>
    </Background>
  );
};

export default function PluginMarketplacePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <PaperProvider theme={Theme()}>
          <SnackbarProvider maxSnack={3}>
            <PluginMarketplace />
          </SnackbarProvider>
        </PaperProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 64,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1200,
  },
  hero: {
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
    width: "100%",
  },
  heroNav: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  disabledState: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
