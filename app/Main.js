import { ScrollView, Image, Linking, StyleSheet, View, Dimensions, useWindowDimensions } from 'react-native';
import { Appbar, Text, Button, Card, Title, Paragraph, useTheme, Icon } from 'react-native-paper';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { useEffect, useState } from 'react';

import CompatibilityHint    from './includes/CompatibilityHint';

import BackButton           from './includes/BackButton';
import HeroVideoBackground  from './includes/HeroVideoBackground';
import SimpleDialog         from './includes/SimpleDialog';

import TabBareMetal         from './tabs/TabBareMetal';
import TabDocker            from './tabs/TabDocker';
import TabRaspberryPi       from './tabs/TabRaspberryPi';

import {
    TabsProvider,
    Tabs,
    TabScreen,
    useTabIndex,
    useTabNavigation,
} from 'react-native-paper-tabs';

import Markdown from '@ronradtke/react-native-markdown-display';

import { SnackbarProvider } from 'react-native-paper-snackbar-stack';

const Main = () => {
    const theme = useTheme();

    const [ isDialogVisible, setIsDialogVisible ] = useState(false);

    const windowWidth = useWindowDimensions().width;

    const IS_TABLET         = windowWidth <= 1024;
    const IS_SMALL_SCREEN   = windowWidth <= 768;

    const cards = [
        {
            image: (
                theme.dark
                    ? require('../assets/images/printers_dark.webp')
                    : require('../assets/images/printers.webp')
            ),
            title: 'One host, multiple printers',
            description: 'Connect, manage and use multiple printers from a single machine.*',
            note: 'Multiple print jobs are run simultaneously',
        },
        {
            image: (
                theme.dark
                    ? require('../assets/images/recording_dark.webp')
                    : require('../assets/images/recording.webp')
            ),
            title: 'Record your prints',
            description: 'A simple and easy-to-use interface to record timelapses.',
            note: 'Requires enough USB bandwidth',
        },
        {
            image: (
                theme.dark
                    ? require('../assets/images/ui_promo_dark.webp')
                    : require('../assets/images/ui_promo.webp')
            ),
            title: 'Everything in one place',
            description: 'Connected printers, current and target temperatures, webcam previews and your preferred materials in a single place.',
        },
        {
            image: require('../assets/images/performance.webp'),
            title: 'Extremely efficient',
            description: 'On a **Raspberry Pi 3 Model B+** a **40% CPU load average** was measured while printing a large file, previewing from two clients and recording **in HD**.',
        },
        {
            image: (
                theme.dark
                    ? require('../assets/images/controls_dark.webp')
                    : require('../assets/images/controls.webp')
            ),
            title: 'Control your printer',
            description: 'Control your printer with a simple and easy-to-use interface, wherever you are.',
        },
        {
            image: (
                theme.dark
                    ? require('../assets/images/gcode_preview_dark.webp')
                    : require('../assets/images/gcode_preview.webp')
            ),
            title: 'G-code preview',
            description: 'Preview your G-code file as it is being printed.',
        }
    ];

    useEffect(() => {
        console.debug('windowWidth:', windowWidth);
    }, [windowWidth]);

    return (
        <>
            {/* <Appbar.Header style={{ backgroundColor: theme.colors.elevation.level2 }}>
                <Appbar.Content title="WPrint 3D" />
            </Appbar.Header> */}

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.hero}>
                    <HeroVideoBackground />
                    <Text variant='displayMedium' style={styles.title}>
                        WPrint 3D
                    </Text>
                    <Paragraph style={styles.paragraph}>
                        Improve your 3D-printing experience with a fast and reliable web-based remote control software.
                    </Paragraph>
                    <Button mode="contained" onPress={() => setIsDialogVisible(true)}>
                        Get started
                    </Button>
                    <Text style={{ width: '100%', textAlign: 'center', marginVertical: 16 }}>
                        Compatible with:
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
                        * Windows support is experimental and requires WSL 2
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
                            <Card style={[ styles.card, { backgroundColor: theme.colors.elevation.level2 } ]}>
                                <Card.Content>
                                    <Image
                                        style={styles.image}
                                        source={card.image}
                                        resizeMode="contain"
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
                    <Text style={styles.footerText}>© 2024 - WPrint 3D</Text>
                </View>
            </ScrollView>

            <SimpleDialog
                title="Getting started"
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
                            To get started, follow the instructions associated with your platform of choice.
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
                                <TabScreen label='Raspberry Pi' icon='raspberry-pi'>
                                    <TabRaspberryPi isSmallScreen={IS_SMALL_SCREEN} />
                                </TabScreen>
                                <TabScreen label='Docker' icon='docker'>
                                    <TabDocker isSmallScreen={IS_SMALL_SCREEN} />
                                </TabScreen>
                                <TabScreen label='Bare metal' icon='server'>
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
        marginBottom: 16
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
        height: 200,
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