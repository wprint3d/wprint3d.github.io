import { Asset } from 'expo-asset';
import { useEvent } from 'expo';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const { useVideoPlayer, VideoView } = require('expo-video');

const HeroVideoBackground = ({ isPosterLoaded = false }) => {
    const theme = useTheme();

    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [videoUri, setVideoUri] = useState(null);

    const posterImage = require('../../assets/images/video_alt.webp');

    useEffect(() => {
        (async () => {
            const asset = Asset.fromModule(require('../../assets/videos/bg.m4v'));
            await asset.downloadAsync();
            setVideoUri(asset.uri);
        })();
    }, []);

    const player = useVideoPlayer(videoUri, player => {
        player.play();
    });

    if (!isPosterLoaded) { return null; }

    return (
        <View style={{ overflow: 'hidden', top: 0, left: 0, width: '100%', height: '100%', position: 'absolute' }}>
            <View testID='hero-video-overlay' style={[ styles.overlay, {
                backgroundColor: theme.dark ? 'black' : 'white'
            }]} />

            <Image
                source={posterImage}
                style={styles.video}
            />

            {Platform.OS === 'web'
                ? <video
                    src={videoUri}
                    style={{ ...styles.video, opacity: isVideoLoaded ? 1 : 0 }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => setIsVideoLoaded(true)}
                />
                : (player && <VideoView
                    player={player}
                    style={{ ...styles.video, opacity: isVideoLoaded ? 1 : 0 }}
                    nativeControls={false}
                />)
            }
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.75,
        zIndex: 1
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'blur(5px)',
        transform: 'scale(1.1)'
    }
});

export default HeroVideoBackground;