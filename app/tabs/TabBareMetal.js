import { Linking, View } from 'react-native';

import TabWrapper from '../includes/TabWrapper';
import { useLocalization } from '../includes/LocalizationProvider';
import { List, Text } from 'react-native-paper';
import CompatibilityHint from '../includes/CompatibilityHint';
import ClickableStep from '../includes/ClickableStep';

const TabBareMetal = ({ isSmallScreen = false }) => {
    const { strings } = useLocalization();

    return (
        <TabWrapper isSmallScreen={isSmallScreen}>
            <Text style={{ width: '100%', textAlign: 'center', marginBottom: 16 }}>
                {strings.bareMetal.compatibility}
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
                    {strings.bareMetal.recommendedHeadline}
                </Text>
                {'\n\n'}
                {strings.bareMetal.recommendedBody}
                {'\n\n'}
                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>
                    {strings.bareMetal.progressHint}
                </Text>
            </Text>

            <ClickableStep
                title={strings.bareMetal.guideTitle}
                descriptionNumberOfLines={4}
                description={strings.bareMetal.guideDescription}
                right={props => <List.Icon {...props} icon='arrow-right' />}
                onPress={() => Linking.openURL('https://github.com/wprint3d/wprint3d-core?tab=readme-ov-file#getting-started')}
            />
        </TabWrapper>
    );
}

export default TabBareMetal;
