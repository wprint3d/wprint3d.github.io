import { useEffect, useState } from "react";
import { Linking, View } from "react-native";
import { List, Text, TextInput, useTheme } from "react-native-paper";

import * as Clipboard from 'expo-clipboard';

import { useSnackbar } from "react-native-paper-snackbar-stack";

import { getBaseOs } from 'react-native-device-info';

import ClickableStep from "../includes/ClickableStep";
import { useLocalization } from "../includes/LocalizationProvider";
import TabWrapper    from "../includes/TabWrapper";
import CompatibilityHint from "../includes/CompatibilityHint";

const TabDocker = ({ isSmallScreen = false }) => {
    const { colors } = useTheme();
    const { strings } = useLocalization();

    const { enqueueSnackbar } = useSnackbar();

    const COMMAND = 'curl https://wprint3d.com/install | bash';

    const [ isCopied, setIsCopied ] = useState(false);
    const [ baseOs,   setBaseOs   ] = useState('');

    const copyCommand = () => {
        Clipboard.setStringAsync(COMMAND);

        setIsCopied(true);

        enqueueSnackbar({
            message: strings.docker.copiedToClipboard,
            duration: 1500,
            variant: 'success'
        });
    }

    useEffect(() => {
        if (!isCopied) { return; }

        const timeout = globalThis.setTimeout(() => setIsCopied(false), 1000);

        return () => globalThis.clearTimeout(timeout);
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
                {strings.docker.compatibility}
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
                    {strings.docker.recommendedHeadline}
                </Text>
                {'\n\n'}
                {strings.docker.recommendedBody}
                {'\n\n'}
                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>
                    {strings.docker.progressHint}
                </Text>
            </Text>

            <View>
                {baseOs.includes('Windows') && (
                    <ClickableStep
                        title={strings.docker.windowsSetupTitle}
                        descriptionNumberOfLines={4}
                        description={strings.docker.windowsSetupDescription}
                        left={ props => <List.Icon {...props} icon='alert' color="orange" />}
                        right={props => <List.Icon {...props} icon='cog' />}
                        onPress={() => Linking.openURL('https://github.com/wprint3d/wprint3d-core?tab=readme-ov-file#preparing-your-windows-host')}
                    />
                )}

                <ClickableStep
                    title={strings.docker.connectTitle}
                    descriptionNumberOfLines={4}
                    description={strings.docker.connectDescription}
                    left={ props => <List.Icon {...props} icon='numeric-1-circle' />}
                    right={props => <List.Icon {...props} icon='console' />}
                />

                <ClickableStep
                    title={strings.docker.installEngineTitle}
                    descriptionNumberOfLines={4}
                    description={strings.docker.installEngineDescription}
                    left={ props => <List.Icon {...props} icon='numeric-2-circle' />}
                    right={props => <List.Icon {...props} icon='arrow-right' />}
                    onPress={() => Linking.openURL('https://docs.docker.com/engine/install/')}
                />

                <ClickableStep
                    title={strings.docker.postInstallTitle}
                    descriptionNumberOfLines={4}
                    description={strings.docker.postInstallDescription}
                    left={ props => <List.Icon {...props} icon='numeric-3-circle' />}
                    right={props => <List.Icon {...props} icon='arrow-right' />}
                    onPress={() => Linking.openURL('https://docs.docker.com/engine/install/linux-postinstall/')}
                />

                <ClickableStep
                    title={strings.docker.installReleaseTitle}
                    descriptionNumberOfLines={4}
                    description={strings.docker.installReleaseDescription}
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
                    title={strings.docker.accessWebTitle}
                    descriptionNumberOfLines={4}
                    description={strings.docker.accessWebDescription}
                    left={ props => <List.Icon {...props} icon='numeric-5-circle' />}
                    right={props => <List.Icon {...props} icon='web' />}
                    style={{ marginTop: 16 }}
                />

                {baseOs.includes('Windows') && (
                    <ClickableStep
                        title={strings.docker.wslNextStepsTitle}
                        descriptionNumberOfLines={4}
                        description={strings.docker.wslNextStepsDescription}
                        left={ props => <List.Icon {...props} icon='numeric-6-circle' color="orange" />}
                        right={props => <List.Icon {...props} icon='usb' />}
                        onPress={() => Linking.openURL('https://github.com/wprint3d/wprint3d-core?tab=readme-ov-file#next-steps-on-your-windows-host')}
                    />
                )}

                <List.Item
                    title={strings.docker.updaterWarningTitle}
                    titleNumberOfLines={2}
                    description={
                        <Text>
                            {strings.docker.updaterWarningBody}
                            {'\n\n'}
                            {strings.docker.updaterWarningFootnote}
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
