import { useColorScheme } from 'react-native';

import {
    useMaterial3Theme,
    isDynamicThemeSupported
} from '@pchmn/expo-material3-theme';

import {
    MD3LightTheme,
    MD3DarkTheme
} from 'react-native-paper';

export default (() => {
    const preferredScheme = useColorScheme();

    console.debug('themes: preferred:', preferredScheme);

    const availableThemes = {
        light:  require('../../assets/themes/light.json'),
        dark:   require('../../assets/themes/dark.json')
    };

    console.debug('themes: static:', availableThemes);

    const { theme } = useMaterial3Theme({ sourceColor: '#4F5863' });

    console.debug('themes: dynamic:', theme);

    if (!isDynamicThemeSupported) {
        return (
            preferredScheme === 'dark'
                ? availableThemes.dark
                : availableThemes.light
        );
    }

    return (
        preferredScheme === 'dark'
            ? { ...MD3DarkTheme,  colors: theme.dark  }
            : { ...MD3LightTheme, colors: theme.light }
    );
})
