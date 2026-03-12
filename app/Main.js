import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Text, Button, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { Image } from 'expo-image';

import CompatibilityHint    from './includes/CompatibilityHint';
import LanguagePicker       from './includes/LanguagePicker';
import { getResponsiveLanguagePickerStyle } from './includes/LanguagePicker';
import { useLocalization }  from './includes/LocalizationProvider';

import BackButton           from './includes/BackButton';
import HeroVideoBackground  from './includes/HeroVideoBackground';
import SimpleDialog         from './includes/SimpleDialog';

import TabBareMetal         from './tabs/TabBareMetal';
import TabDocker            from './tabs/TabDocker';
import TabRaspberryPi       from './tabs/TabRaspberryPi';

import { TabsProvider, Tabs, TabScreen } from 'react-native-paper-tabs';

import Markdown from '@ronradtke/react-native-markdown-display';

import { SnackbarProvider } from 'react-native-paper-snackbar-stack';
import { isPluginSystemEnabled } from '../config/featureFlags';

const Main = ({ isPosterLoaded = false, isFontLoaded = false }) => {
    const theme = useTheme();
    const router = useRouter();
    const { strings } = useLocalization();

    const [ isDialogVisible, setIsDialogVisible ] = useState(false);

    const windowWidth = useWindowDimensions().width;
    const pluginSystemEnabled = isPluginSystemEnabled();

    const IS_TABLET         = windowWidth <= 1024;
    const IS_SMALL_SCREEN   = windowWidth <= 768;

    const cardImages = [
        (
            theme.dark
                ? require('../assets/images/printers_dark.webp')
                : require('../assets/images/printers.webp')
        ),
        (
            theme.dark
                ? require('../assets/images/recording_dark.webp')
                : require('../assets/images/recording.webp')
        ),
        (
            theme.dark
                ? require('../assets/images/ui_promo_dark.webp')
                : require('../assets/images/ui_promo.webp')
        ),
        require('../assets/images/performance.webp'),
        (
            theme.dark
                ? require('../assets/images/controls_dark.webp')
                : require('../assets/images/controls.webp')
        ),
        (
            theme.dark
                ? require('../assets/images/gcode_preview_dark.webp')
                : require('../assets/images/gcode_preview.webp')
        ),
    ];

    const cards = strings.main.cards.map((card, index) => ({
        ...card,
        image: cardImages[index]
    }));

    useEffect(() => {
        console.debug('windowWidth:', windowWidth);
    }, [windowWidth]);

    if (!isPosterLoaded) { return null; }

    return (
        <>
            {/* <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }}>
                <Appbar.Content title="WPrint 3D" />
            </Appbar.Header> */}

            <ScrollView testID="page-scroll-view" contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <LanguagePicker style={[styles.languagePicker, getResponsiveLanguagePickerStyle({ isSmallScreen: IS_SMALL_SCREEN, isOverlay: true })]} />
                    <HeroVideoBackground isPosterLoaded={isPosterLoaded} />
                    <Text variant='displayMedium' style={styles.title}>
                        WPrint 3D
                    </Text>
                    <Paragraph style={styles.paragraph}>
                        {strings.main.heroDescription}
                    </Paragraph>
                    <Button mode="contained" onPress={() => setIsDialogVisible(true)}>
                        {strings.main.getStarted}
                    </Button>
                    {pluginSystemEnabled && (
                        <Button mode="outlined" onPress={() => router.push('/plugins')} style={{ marginTop: 8 }}>
                            {strings.main.browsePlugins}
                        </Button>
                    )}
                    <Text style={{ width: '100%', textAlign: 'center', marginVertical: 16 }}>
                        {strings.main.compatibleWith}
                    </Text>
                    <View style={{ flexGrow: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
                        <CompatibilityHint
                            icon="linux"
                            text="Linux"
                        />

                        <CompatibilityHint
                            icon="microsoft-windows"
                            text="Windows *"
                        />

                        <CompatibilityHint
                            icon="raspberry-pi"
                            text="Raspberry Pi"
                        />
                    </View>

                    <Text style={{
                        fontSize: 12,
                        marginTop: 16,
                        color: (theme.dark ? '#a9a9a9' : '#696969')
                    }}>
                        {strings.main.windowsExperimental}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {cards.map((card, index) => (
                        <View key={index} style={[
                            { paddingHorizontal: 16 },
                            {
                                width: (
                                    IS_SMALL_SCREEN
                                        ? '100%'
                                        : (
                                            IS_TABLET
                                                ? '50%'
                                                : '33%'
                                        )
                                )
                            }
                        ]}>
                            <Card style={[ styles.card, { backgroundColor: theme.colors.elevation.level1 } ]}>
                                <Card.Content>
                                    <Image
                                        style={styles.image}
                                        source={card.image}
                                        contentFit='contain'
                                        transition={100}
                                    />
                                    <Title>{card.title}</Title>
                                    <Paragraph>
                                        <Markdown style={{
                                            body: {
                                                color: (theme.dark ? '#a9a9a9' : '#696969') }
                                            }}
                                        >
                                            {card.description}
                                        </Markdown>
                                    </Paragraph>
                                    {card.note && (
                                        <Markdown style={{
                                            body: {
                                                color: (theme.dark ? '#a9a9a9' : '#696969') }
                                            }}
                                        >
                                            {`\\* ${card.note}`}
                                        </Markdown>
                                    )}
                                </Card.Content>
                            </Card>
                        </View>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 - WPrint 3D</Text>
                </View>
            </ScrollView>

            <SimpleDialog
                title={strings.main.gettingStartedTitle}
                visible={isDialogVisible}
                setVisible={setIsDialogVisible}
                onDismiss={() => setIsDialogVisible(false)}
                left={IS_SMALL_SCREEN && <BackButton onPress={() => setIsDialogVisible(false)} />}
                style={
                    IS_SMALL_SCREEN
                        ? {
                            position: 'absolute',
                            margin: 0,
                            borderRadius: 0,
                            top: 0,
                            padding: 0,
                            width: '100%',
                            height: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }
                        : { maxWidth: 850 }
                }
                titleStyle={IS_SMALL_SCREEN && { marginHorizontal: 8 }}
                content={
                    <SnackbarProvider maxSnack={3} wrapperStyle={{ maxWidth: 'fit-content' }} style={{ paddingHorizontal: 4 }}>
                        <Text style={{ marginBottom: 16, textAlign: 'center' }}>
                            {strings.main.gettingStartedBody}
                        </Text>

                        <TabsProvider defaultIndex={0}>
                            <Tabs
                                showLeadingSpace={false}
                                showTextLabel={true}
                                mode='scrollable'
                                style={{
                                    maxWidth: '100%',
                                    alignSelf: 'center',
                                    backgroundColor: theme.colors.elevation.level0
                                }}
                            >
                                <TabScreen label={strings.main.tabs.raspberryPi} icon='raspberry-pi'>
                                    <TabRaspberryPi isSmallScreen={IS_SMALL_SCREEN} />
                                </TabScreen>
                                <TabScreen label={strings.main.tabs.docker} icon='docker'>
                                    <TabDocker isSmallScreen={IS_SMALL_SCREEN} />
                                </TabScreen>
                                <TabScreen label={strings.main.tabs.bareMetal} icon='server'>
                                    <TabBareMetal isSmallScreen={IS_SMALL_SCREEN} />
                                </TabScreen>
                            </Tabs>
                        </TabsProvider>
                    </SnackbarProvider>
                }
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {},
    hero: {
        alignItems: 'center',
        paddingVertical: 160,
        paddingHorizontal: 16,
        marginBottom: 16,
        position: 'relative',
    },
    languagePicker: {
        position: 'absolute',
        top: 24,
        zIndex: 2,
    },
    title: {
        marginBottom: 8,
        textAlign: 'center',
    },
    paragraph: {
        textAlign: 'center',
        marginBottom: 16,
    },
    card: {
        marginVertical: 8,
        padding: 8,
        flexGrow: 1,
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 16,
    },
    note: {
        fontSize: 12,
        marginTop: 8,
    },
    footer: {
        marginVertical: 24,
        alignItems: 'center',
    },
    footerText: {
        color: '#999',
    },
});

export default Main;
