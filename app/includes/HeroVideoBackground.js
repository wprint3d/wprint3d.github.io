import { useEvent } from 'expo';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

const { useVideoPlayer, VideoView } = require('expo-video');

const HeroVideoBackground = () => {
    const theme = useTheme();

    const video = require('../../assets/videos/bg.m4v');

    const player = useVideoPlayer(video, player => {
        // player.loop = true;
        player.play();
    });

    const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    useEffect(() => {
        console.debug('isPlaying:', isPlaying);
    }, [isPlaying]);

    return (
        <View style={{ overflow: 'hidden', top: 0, left: 0, width: '100%', height: '100%', position: 'absolute' }}>
            <View testID='hero-video-overlay' style={[ styles.overlay, {
                backgroundColor: theme.dark ? 'black' : 'white'
            }]} />

            {Platform.OS === 'web'
                ? <video src={video} style={styles.video} autoPlay loop muted playsInline />
                : <VideoView player={player} style={styles.video} nativeControls={false} />
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
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'blur(5px)',
        transform: 'scale(1.1)'
    }
});

export default HeroVideoBackground;