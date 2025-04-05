import { useEffect, useState } from "react";
import { Linking, View } from "react-native";
import { List, Text, TextInput, useTheme } from "react-native-paper";

import * as Clipboard from 'expo-clipboard';

import { useSnackbar } from "react-native-paper-snackbar-stack";

import { getBaseOs } from 'react-native-device-info';

import ClickableStep from "../includes/ClickableStep";
import TabWrapper    from "../includes/TabWrapper";
import CompatibilityHint from "../includes/CompatibilityHint";

const TabDocker = ({ isSmallScreen = false }) => {
    const { colors } = useTheme();

    const { enqueueSnackbar } = useSnackbar();

    const COMMAND = 'curl https://wprint3d.com/install | bash';

    const [ isCopied, setIsCopied ] = useState(false);
    const [ baseOs,   setBaseOs   ] = useState('');

    const copyCommand = () => {
        Clipboard.setStringAsync(COMMAND);

        setIsCopied(true);

        enqueueSnackbar({
            message: 'Copied to clipboard!',
            duration: 1500,
            variant: 'success'
        });
    }

    useEffect(() => {
        if (!isCopied) { return; }

        const timeout = setTimeout(() => setIsCopied(false), 1000);

        return () => clearTimeout(timeout);
    }, [isCopied]);

    useEffect(() => {
        getBaseOs().then(setBaseOs);
    }, []);

    useEffect(() => {
        console.debug('Base OS:', baseOs);
    }, [baseOs]);

    return (
        <TabWrapper isSmallScreen={isSmallScreen}>
            <Text style={{ width: '100%', textAlign: 'center', marginBottom: 16 }}>
                Compatible with the following operating systems in <Text style={{ fontWeight: 'bold' }}>amd64</Text> and <Text style={{ fontWeight: 'bold' }}>arm64</Text> architectures:
            </Text>

            <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                <CompatibilityHint
                    icon="linux"
                    text="Linux"
                />

                <CompatibilityHint
                    icon="microsoft-windows"
                    text="Windows (WSL 2)"
                />
            </View>

            <Text style={{ textAlign: 'center', marginBottom: 16 }}>
                <Text style={{ fontWeight: 'bold' }}>
                    This installation method is recommended for users that want to keep using the host device for other purposes.
                </Text>
                {'\n\n'}
                The process consists of downloading the pre-built images and running them in Docker containers on the host device.
                {'\n\n'}
                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>
                    Click or tap on the steps to keep track of your progress.
                </Text>
            </Text>

            <View>
                {baseOs.includes('Windows') && (
                    <ClickableStep
                        title='Planning on using WSL 2?'
                        descriptionNumberOfLines={4}
                        description='Addiontal setup is required, click or tap on this step to learn more.'
                        left={ props => <List.Icon {...props} icon='alert' color="orange" />}
                        right={props => <List.Icon {...props} icon='cog' />}
                        onPress={() => Linking.openURL('https://github.com/wprint3d/wprint3d-core?tab=readme-ov-file#preparing-your-windows-host')}
                    />
                )}

                <ClickableStep
                    title='Connect to the target machine'
                    descriptionNumberOfLines={4}
                    description='Connect to the terminal of the target machine.'
                    left={ props => <List.Icon {...props} icon='numeric-1-circle' />}
                    right={props => <List.Icon {...props} icon='console' />}
                />

                <ClickableStep
                    title='Install the Docker engine'
                    descriptionNumberOfLines={4}
                    description='Install the Docker engine on the target machine.'
                    left={ props => <List.Icon {...props} icon='numeric-2-circle' />}
                    right={props => <List.Icon {...props} icon='arrow-right' />}
                    onPress={() => Linking.openURL('https://docs.docker.com/engine/install/')}
                />

                <ClickableStep
                    title='Follow the post-installation steps'
                    descriptionNumberOfLines={4}
                    description='Run the post-installation steps for the Docker engine.'
                    left={ props => <List.Icon {...props} icon='numeric-3-circle' />}
                    right={props => <List.Icon {...props} icon='arrow-right' />}
                    onPress={() => Linking.openURL('https://docs.docker.com/engine/install/linux-postinstall/')}
                />

                <ClickableStep
                    title='Install the latest release'
                    descriptionNumberOfLines={4}
                    description='Copy the command below and run it in the terminal of the target machine.'
                    left={ props => <List.Icon {...props} icon='numeric-4-circle' />}
                    right={props => <List.Icon {...props} icon='bash' />}
                />

                <TextInput
                    mode='outlined'
                    value={COMMAND}
                    style={{ marginHorizontal: 32, marginTop: 16 }}
                    readOnly={true}
                    right={
                        <TextInput.Icon
                            icon={ isCopied ? 'check' : 'content-copy'}
                            color={isCopied ? 'green' : null}
                            animated={true}
                            onPress={copyCommand}
                        />
                    }
                />

                <ClickableStep
                    title='Access the web interface'
                    descriptionNumberOfLines={4}
                    description='Point your browser to the IP address of the target machine.'
                    left={ props => <List.Icon {...props} icon='numeric-5-circle' />}
                    right={props => <List.Icon {...props} icon='web' />}
                    style={{ marginTop: 16 }}
                />

                {baseOs.includes('Windows') && (
                    <ClickableStep
                        title='On WSL 2?'
                        descriptionNumberOfLines={4}
                        description='Additional steps are required to enable USB plug and play. Please click or tap on this step to learn more.'
                        left={ props => <List.Icon {...props} icon='numeric-6-circle' color="orange" />}
                        right={props => <List.Icon {...props} icon='usb' />}
                        onPress={() => Linking.openURL('https://github.com/wprint3d/wprint3d-core?tab=readme-ov-file#next-steps-on-your-windows-host')}
                    />
                )}

                <List.Item
                    title='Having trouble with the built-in updater?'
                    titleNumberOfLines={2}
                    description={
                        <Text>
                            If you are having trouble running the integrated updater, you can simply re-run the command above to update the application!
                            {'\n\n'}
                            This action won't affect your data or settings.
                        </Text>
                    }
                    descriptionNumberOfLines={8}
                    left={ props => <List.Icon {...props} icon='alert' color={colors.error} />}
                    style={{ marginTop: 24 }}
                />
            </View>
        </TabWrapper>
    );
}

export default TabDocker;
