import React from 'react';

import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SnackbarProvider } from 'react-native-paper-snackbar-stack';

import Background from './includes/Background';
import Theme      from "./includes/Theme";

import Main from './Main';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useFonts } from 'expo-font';

export default function Index() {
  const queryClient = new QueryClient();

  const [isLoaded] = useFonts({ ...MaterialCommunityIcons.font });

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={Theme()}>
        <Background>
          <View style={styles.root}>
            <SnackbarProvider maxSnack={3}>
              {isLoaded && <Main />}
            </SnackbarProvider>
          </View>
        </Background>
      </PaperProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    width:  '100%',
    height: '100%'
  }
})