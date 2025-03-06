import { Linking, View } from 'react-native';

import TabWrapper from '../includes/TabWrapper';
import { List, Text } from 'react-native-paper';
import CompatibilityHint from '../includes/CompatibilityHint';
import ClickableStep from '../includes/ClickableStep';

const TabBareMetal = ({ isSmallScreen = false }) => {
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
                    This installation method is recommended for developers and advanced users.
                </Text>
                {'\n\n'}
                The process consists of downloading the source code and compiling it on the target machine. Then, running containers bound to the host's network and storage, allowing to plug and unplug modules and components in real time.
                {'\n\n'}
                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>
                    Click or tap on the steps to keep track of your progress.
                </Text>
            </Text>

            <ClickableStep
                title='Follow the installation guide'
                descriptionNumberOfLines={4}
                description='Download the source code, compile it, and run the containers.'
                right={props => <List.Icon {...props} icon='arrow-right' />}
                onPress={() => Linking.openURL('https://github.com/wprint3d/wprint3d-core?tab=readme-ov-file#getting-started')}
            />
        </TabWrapper>
    );
}

export default TabBareMetal;