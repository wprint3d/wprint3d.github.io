import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Linking, Platform, View } from "react-native";
import { ActivityIndicator, List, Text, useTheme } from "react-native-paper";

import ClickableStep from "../includes/ClickableStep";
import { useLocalization } from "../includes/LocalizationProvider";
import TabWrapper    from "../includes/TabWrapper";
import CompatibilityHint from "../includes/CompatibilityHint";

const TabRaspberryPi = ({ isSmallScreen = false }) => {
    const { colors } = useTheme();
    const { strings } = useLocalization();

    const imageUrlQuery = useQuery({
        enabled: false,
        queryKey: ['raspberry-pi-image-url'],
        queryFn: async () => (
            fetch('https://api.github.com/repos/wprint3d/wprint3dos-pi-gen/releases/tags/latest')
                .then(response => response.json())
        )
    });

    const downloadFile = async (url, fileName) => {
        if (Platform.OS === 'web') {
            const link = globalThis.document.createElement('a');

            link.href = url;
            link.setAttribute('download', fileName);

            globalThis.document.body.appendChild(link);

            link.click();
            link.remove();
        } else {
            console.error('Not implemented');
        }
    };

    useEffect(() => {
        console.debug('imageUrlQuery:', imageUrlQuery);

        if (!imageUrlQuery.isFetched || !imageUrlQuery.isSuccess) {
            return;
        }

        const asset = imageUrlQuery.data.assets.find(asset => asset.name.endsWith('.zip'));

        if (!asset) {
            console.error('No asset found');

            return;
        }

        downloadFile(asset.browser_download_url, asset.name);
    }, [imageUrlQuery]);

    return (
        <TabWrapper isSmallScreen={isSmallScreen}>
            <Text style={{ width: '100%', textAlign: 'center', marginBottom: 16 }}>
                {strings.raspberryPi.compatibility}
            </Text>

            <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                <CompatibilityHint
                    icon="raspberry-pi"
                    text={strings.raspberryPi.deviceLabel}
                />
            </View>

            <Text style={{ textAlign: 'center', marginBottom: 16 }}>
                <Text style={{ fontWeight: 'bold' }}>
                    {strings.raspberryPi.recommendedHeadline}
                </Text>
                {'\n\n'}
                {strings.raspberryPi.recommendedBody}
                {'\n\n'}
                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>
                    {strings.raspberryPi.progressHint}
                </Text>
            </Text>

            <View>
                <ClickableStep
                    title={strings.raspberryPi.downloadTitle}
                    descriptionNumberOfLines={4}
                    description={
                        <Text>
                            {strings.raspberryPi.downloadDescription}

                            {imageUrlQuery.isError && (
                                <Text style={{ color: 'red' }}>
                                    {'\n\n'}
                                    {strings.raspberryPi.downloadError}
                                </Text>
                            )}
                        </Text>
                    }
                    left={ props => <List.Icon {...props} icon='numeric-1-circle' />}
                    right={props => {
                        if (imageUrlQuery.isLoading) {
                            return <ActivityIndicator animating={true} />;
                        }

                        if (imageUrlQuery.isError) {
                            return <List.Icon {...props} icon='alert' />;
                        }

                        return <List.Icon {...props} icon='download' />;
                    }}
                    onPress={() => imageUrlQuery.refetch()}
                />

                <ClickableStep
                    title={strings.raspberryPi.unpackTitle}
                    descriptionNumberOfLines={4}
                    description={strings.raspberryPi.unpackDescription}
                    left={ props => <List.Icon {...props} icon='numeric-2-circle' />}
                    right={props => <List.Icon {...props} icon='archive' />}
                />

                <ClickableStep
                    title={strings.raspberryPi.flashTitle}
                    descriptionNumberOfLines={4}
                    description={strings.raspberryPi.flashDescription}
                    left={ props => <List.Icon {...props} icon='numeric-3-circle' />}
                    right={props => <List.Icon {...props} icon='file-move' />}
                    onPress={() => Linking.openURL('https://www.raspberrypi.com/software/#:~:text=Pi%20OS%20using-,Raspberry%C2%A0Pi%C2%A0Imager,-Raspberry%20Pi%20Imager')}
                />

                <ClickableStep
                    title={strings.raspberryPi.bootTitle}
                    descriptionNumberOfLines={4}
                    description={strings.raspberryPi.bootDescription}
                    left={ props => <List.Icon {...props} icon='numeric-4-circle' />}
                    right={props => <List.Icon {...props} icon='power' />}
                />

                <ClickableStep
                    title={strings.raspberryPi.accessWebTitle}
                    descriptionNumberOfLines={20}
                    description={
                        <Text>
                            {strings.raspberryPi.accessWebLead}
                            {'\n\n'}
                            {strings.raspberryPi.accessWebCredentials}
                        </Text>
                    }
                    left={ props => <List.Icon {...props} icon='numeric-5-circle' />}
                    right={props => <List.Icon {...props} icon='arrow-right' />}
                    onPress={() => Linking.openURL('https://wprint3d-pi.local')}
                />

                <List.Item
                    title={strings.raspberryPi.troubleTitle}
                    titleNumberOfLines={2}
                    titleStyle={{ fontWeight: 'bold' }}
                    description={strings.raspberryPi.troubleDescription}
                    descriptionNumberOfLines={8}
                    left={ props => <List.Icon {...props} icon='alert' color={colors.error} />}
                    style={{ marginTop: 24 }}
                />

                <List.Item
                    title={
                        <Text style={{ whiteSpace: 'normal' }}>
                            {strings.raspberryPi.detailedGuideLead}{' '}
                            <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://github.com/wprint3d/wprint3dos-pi-gen?tab=readme-ov-file#installation')}>
                                {strings.raspberryPi.detailedGuideLink}
                            </Text>
                        </Text>
                    }
                    titleStyle={{ textAlign: 'center' }}
                    style={{ marginTop: 16 }}
                />
            </View>
        </TabWrapper>
    );
}

export default TabRaspberryPi;
