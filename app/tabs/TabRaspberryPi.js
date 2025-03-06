import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Linking, Platform, View } from "react-native";
import { ActivityIndicator, List, Text } from "react-native-paper";

import ClickableStep from "../includes/ClickableStep";
import TabWrapper    from "../includes/TabWrapper";
import CompatibilityHint from "../includes/CompatibilityHint";

const TabRaspberryPi = ({ isSmallScreen = false }) => {
    const [ showDownloadHint, setShowDownloadHint ] = useState(false);

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
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', fileName);

            document.body.appendChild(link);

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

    useEffect(() => {
        const timeout = setTimeout(() => setShowDownloadHint(true), 5000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <TabWrapper isSmallScreen={isSmallScreen}>
            <Text style={{ width: '100%', textAlign: 'center', marginBottom: 16 }}>
                Compatible with the following <Text style={{ fontWeight: 'bold' }}>arm64-ready</Text> devices:
            </Text>

            <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                <CompatibilityHint
                    icon="raspberry-pi"
                    text="Raspberry Pi 3 (or newer)"
                />
            </View>

            <Text style={{ textAlign: 'center', marginBottom: 16 }}>
                <Text style={{ fontWeight: 'bold' }}>
                    This installation method is recommended for most users.
                </Text>
                {'\n\n'}
                The process consists of downloading a pre-built image and flashing it to an SD card.
                {'\n\n'}
                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>
                    Click or tap on the steps to keep track of your progress.
                </Text>
            </Text>

            <View>
                <ClickableStep
                    title='Download the latest release'
                    descriptionNumberOfLines={4}
                    description={
                        <Text>
                            Download the latest image from the remote server.

                            {(!imageUrlQuery.isFetched && showDownloadHint) && (
                                <Text style={{ fontWeight: 'bold' }}>
                                    {'\n\n'}
                                    (Click to download)
                                </Text>
                            )}

                            {imageUrlQuery.isError && (
                                <Text style={{ color: 'red' }}>
                                    {'\n\n'}
                                    An error occurred while fetching the image URL, please try again later.
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
                    title='Unpack the ZIP archive'
                    descriptionNumberOfLines={4}
                    description='Unpack the ZIP archive to obtain the image file.'
                    left={ props => <List.Icon {...props} icon='numeric-2-circle' />}
                    right={props => <List.Icon {...props} icon='archive' />}
                />

                <ClickableStep
                    title='Flash the image to an SD card'
                    descriptionNumberOfLines={4}
                    description='Use the official Raspberry Pi Imager to flash the image to an SD card. Select the "Custom" option to flash the image.'
                    left={ props => <List.Icon {...props} icon='numeric-3-circle' />}
                    right={props => <List.Icon {...props} icon='file-move' />}
                    onPress={() => Linking.openURL('https://www.raspberrypi.com/software/#:~:text=Pi%20OS%20using-,Raspberry%C2%A0Pi%C2%A0Imager,-Raspberry%20Pi%20Imager')}
                />

                <ClickableStep
                    title='Boot the Raspberry Pi'
                    descriptionNumberOfLines={4}
                    description='Insert the SD card into the Raspberry Pi and power it on. Wait between 5 to 10 minutes for the system to boot for the first time.'
                    left={ props => <List.Icon {...props} icon='numeric-4-circle' />}
                    right={props => <List.Icon {...props} icon='power' />}
                />

                <ClickableStep
                    title='Access the web interface'
                    descriptionNumberOfLines={20}
                    description={
                        <Text>
                            Open a web browser and navigate to the IP address of the Raspberry Pi. The default username is "<Text style={{ fontWeight: 'bold' }}>admin</Text>" and the default password is "<Text style={{ fontWeight: 'bold' }}>admin</Text>".
                            {'\n\n'}
                            If you can't find the IP address of the Raspberry Pi, you can access your router's web interface to find it.
                        </Text>
                    }
                    left={ props => <List.Icon {...props} icon='numeric-5-circle' />}
                    right={props => <List.Icon {...props} icon='web' />}
                />

                <List.Item
                    title={
                        <Text style={{ whiteSpace: 'normal' }}>
                            Looking for a more detailed guide? {' '}
                            <Text style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://github.com/wprint3d/wprint3dos-pi-gen?tab=readme-ov-file#installation')}>
                                Check out the full documentation!
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