import { useMemo, useState } from "react";
import { Linking, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { PaperProvider, Button, Card, Chip, Searchbar, Text } from "react-native-paper";
import { SnackbarProvider } from "react-native-paper-snackbar-stack";
import Background from "./includes/Background";
import LanguagePicker from "./includes/LanguagePicker";
import { getResponsiveLanguagePickerStyle } from "./includes/LanguagePicker";
import { LocalizationProvider, useLocalization } from "./includes/LocalizationProvider";
import Theme from "./includes/Theme";
import { isPluginSystemEnabled } from "../config/featureFlags";
import { normalizeRegistryPayload, pluginRegistryConfig } from "../config/pluginRegistry";

const queryClient = new QueryClient();

const PluginMarketplace = () => {
  const router = useRouter();
  const [ searchQuery, setSearchQuery ] = useState("");
  const pluginSystemEnabled = isPluginSystemEnabled();
  const { strings } = useLocalization();
  const isSmallScreen = useWindowDimensions().width <= 768;
  const goHome = () => router.replace("/");

  const registryQuery = useQuery({
    queryKey: ["pluginRegistryPage"],
    enabled: pluginSystemEnabled,
    queryFn: async () => {
      const response = await fetch(pluginRegistryConfig.indexUrl);
      const payload = await response.json();

      return normalizeRegistryPayload(payload);
    }
  });

  const plugins = useMemo(() => {
    const items = registryQuery.data || [];
    const query = searchQuery.trim().toLowerCase();

    if (!query) { return items; }

    return items.filter((plugin) => {
      const haystack = `${plugin?.name || ""} ${plugin?.id || ""} ${plugin?.description || ""} ${(plugin?.categories || []).join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [ registryQuery.data, searchQuery ]);

  if (!pluginSystemEnabled) {
    return (
      <Background>
        <View style={styles.disabledState}>
          <LanguagePicker style={[{ marginBottom: 24 }, getResponsiveLanguagePickerStyle({ isSmallScreen })]} />
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
        <View style={styles.hero}>
          <LanguagePicker style={[styles.languagePicker, getResponsiveLanguagePickerStyle({ isSmallScreen })]} />
          <Text variant="displaySmall" style={{ textAlign: "center", marginBottom: 12 }}>
            {strings.plugins.heroTitle}
          </Text>
          <Text style={{ textAlign: "center", maxWidth: 860, marginBottom: 16 }}>
            {strings.plugins.heroDescription}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Button mode="contained" onPress={() => Linking.openURL(pluginRegistryConfig.repositoryUrl)}>
              {strings.plugins.officialRegistry}
            </Button>
            <Button mode="outlined" onPress={() => Linking.openURL(pluginRegistryConfig.examplesUrl)}>
              {strings.plugins.examplePlugin}
            </Button>
          </View>
        </View>

        <Searchbar
          placeholder={strings.plugins.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginBottom: 16 }}
        />

        {(plugins || []).map((plugin) => (
          <Card key={plugin.id} style={styles.card}>
            <Card.Title title={plugin.name} subtitle={`${plugin.id} • ${plugin.version || plugin.latestVersion || strings.plugins.unversioned}`} />
            <Card.Content>
              {!!plugin.description && (
                <Text style={{ marginBottom: 12 }}>
                  {plugin.description}
                </Text>
              )}
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {(plugin.categories || []).map((category) => (
                  <Chip key={`${plugin.id}-${category}`}>{category}</Chip>
                ))}
                {!!plugin.author && <Chip icon="account">{plugin.author}</Chip>}
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                {!!plugin.packageUrl && (
                  <Button mode="contained-tonal" onPress={() => Linking.openURL(plugin.packageUrl)}>
                    {strings.plugins.downloadPackage}
                  </Button>
                )}
                {!!plugin.documentationUrl && (
                  <Button mode="outlined" onPress={() => Linking.openURL(plugin.documentationUrl)}>
                    {strings.plugins.documentation}
                  </Button>
                )}
                {!!plugin.homepageUrl && (
                  <Button mode="outlined" onPress={() => Linking.openURL(plugin.homepageUrl)}>
                    {strings.plugins.homepage}
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
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
  card: {
    marginBottom: 16,
  },
  languagePicker: {
    marginBottom: 8,
  },
});
