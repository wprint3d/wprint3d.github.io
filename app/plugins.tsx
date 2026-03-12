import { useMemo, useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { PaperProvider, Button, Card, Chip, Searchbar, Text } from "react-native-paper";
import { SnackbarProvider } from "react-native-paper-snackbar-stack";
import Background from "./includes/Background";
import Theme from "./includes/Theme";
import { isPluginSystemEnabled } from "../config/featureFlags";

const REGISTRY_INDEX_URL = "https://raw.githubusercontent.com/wprint3d/plugin-registry/main/index.json";

const queryClient = new QueryClient();

const PluginMarketplace = () => {
  const router = useRouter();
  const [ searchQuery, setSearchQuery ] = useState("");
  const pluginSystemEnabled = isPluginSystemEnabled();

  const registryQuery = useQuery({
    queryKey: ["pluginRegistryPage"],
    enabled: pluginSystemEnabled,
    queryFn: async () => {
      const response = await fetch(REGISTRY_INDEX_URL);
      const payload = await response.json();

      return Array.isArray(payload?.plugins) ? payload.plugins : payload;
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
          <Text variant="headlineMedium" style={{ textAlign: "center", marginBottom: 12 }}>
            Plugins are not available yet
          </Text>
          <Text style={{ textAlign: "center", marginBottom: 16, maxWidth: 560 }}>
            The plugin system is behind a feature flag right now, so the marketplace is intentionally disabled in this build.
          </Text>
          <Button mode="contained" onPress={() => router.replace("/")}>
            Back to home
          </Button>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text variant="displaySmall" style={{ textAlign: "center", marginBottom: 12 }}>
            WPrint 3D Plugins
          </Text>
          <Text style={{ textAlign: "center", maxWidth: 860, marginBottom: 16 }}>
            Discover community-built extensions, lightweight declarative panels, isolated WebView experiences, and advanced custom bundle plugins for WPrint 3D.
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Button mode="contained" onPress={() => Linking.openURL("https://github.com/wprint3d/plugin-registry")}>
              Official registry
            </Button>
            <Button mode="outlined" onPress={() => Linking.openURL("https://github.com/wprint3d/wprint3d-core/tree/main/examples/plugins")}>
              Example plugin
            </Button>
          </View>
        </View>

        <Searchbar
          placeholder="Search plugins by name, category, or description"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginBottom: 16 }}
        />

        {(plugins || []).map((plugin) => (
          <Card key={plugin.id} style={styles.card}>
            <Card.Title title={plugin.name} subtitle={`${plugin.id} • ${plugin.version || plugin.latestVersion || "unversioned"}`} />
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
                    Download package
                  </Button>
                )}
                {!!plugin.documentationUrl && (
                  <Button mode="outlined" onPress={() => Linking.openURL(plugin.documentationUrl)}>
                    Documentation
                  </Button>
                )}
                {!!plugin.homepageUrl && (
                  <Button mode="outlined" onPress={() => Linking.openURL(plugin.homepageUrl)}>
                    Homepage
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
      <PaperProvider theme={Theme()}>
        <SnackbarProvider maxSnack={3}>
          <PluginMarketplace />
        </SnackbarProvider>
      </PaperProvider>
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
});
