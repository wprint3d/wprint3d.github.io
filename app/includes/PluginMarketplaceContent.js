import { useMemo, useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Chip, Searchbar, Text } from "react-native-paper";

import LanguagePicker, { getResponsiveLanguagePickerStyle } from "./LanguagePicker";
import { useLocalization } from "./LocalizationProvider";

import { normalizeRegistryPayload, pluginRegistryConfig } from "../../config/pluginRegistry";

export default function PluginMarketplaceContent({
  isSmallScreen = false,
  showTitle = true,
  showLanguagePicker = true,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { strings } = useLocalization();

  const registryQuery = useQuery({
    queryKey: ["pluginRegistryPage"],
    queryFn: async () => {
      const response = await fetch(pluginRegistryConfig.indexUrl);
      const payload = await response.json();

      return normalizeRegistryPayload(payload);
    },
  });

  const plugins = useMemo(() => {
    const items = registryQuery.data || [];
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((plugin) => {
      const haystack = `${plugin?.name || ""} ${plugin?.id || ""} ${plugin?.description || ""} ${(plugin?.categories || []).join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [registryQuery.data, searchQuery]);

  return (
    <View>
      <View style={styles.hero}>
        {showLanguagePicker && (
          <LanguagePicker
            style={[
              styles.languagePicker,
              getResponsiveLanguagePickerStyle({ isSmallScreen }),
            ]}
          />
        )}

        {showTitle && (
          <Text variant="displaySmall" style={styles.title}>
            {strings.plugins.heroTitle}
          </Text>
        )}

        <Text style={styles.description}>
          {strings.plugins.heroDescription}
        </Text>

        <View style={styles.ctaRow}>
          <Button
            mode="contained"
            onPress={() => Linking.openURL(pluginRegistryConfig.repositoryUrl)}
          >
            {strings.plugins.officialRegistry}
          </Button>
          <Button
            mode="outlined"
            onPress={() => Linking.openURL(pluginRegistryConfig.examplesUrl)}
          >
            {strings.plugins.examplePlugin}
          </Button>
        </View>
      </View>

      <Searchbar
        placeholder={strings.plugins.searchPlaceholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
      />

      {plugins.map((plugin) => (
        <Card key={plugin.id} style={styles.card}>
          <Card.Title
            title={plugin.name}
            subtitle={`${plugin.id} • ${plugin.version || plugin.latestVersion || strings.plugins.unversioned}`}
          />
          <Card.Content>
            {!!plugin.description && (
              <Text style={styles.pluginDescription}>
                {plugin.description}
              </Text>
            )}

            <View style={styles.chipRow}>
              {(plugin.categories || []).map((category) => (
                <Chip key={`${plugin.id}-${category}`}>{category}</Chip>
              ))}
              {!!plugin.author && <Chip icon="account">{plugin.author}</Chip>}
            </View>

            <View style={styles.actionRow}>
              {!!plugin.packageUrl && (
                <Button
                  mode="contained-tonal"
                  onPress={() => Linking.openURL(plugin.packageUrl)}
                >
                  {strings.plugins.downloadPackage}
                </Button>
              )}
              {!!plugin.documentationUrl && (
                <Button
                  mode="outlined"
                  onPress={() => Linking.openURL(plugin.documentationUrl)}
                >
                  {strings.plugins.documentation}
                </Button>
              )}
              {!!plugin.homepageUrl && (
                <Button
                  mode="outlined"
                  onPress={() => Linking.openURL(plugin.homepageUrl)}
                >
                  {strings.plugins.homepage}
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
    width: "100%",
  },
  languagePicker: {
    marginBottom: 8,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    textAlign: "center",
    maxWidth: 860,
    marginBottom: 16,
  },
  ctaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  searchbar: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  pluginDescription: {
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
