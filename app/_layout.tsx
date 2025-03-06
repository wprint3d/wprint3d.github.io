import Head from 'expo-router/head';

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Head>
        <title>
          WPrint 3D - Print from anywhere!
        </title>
        <meta name="description" content="Print from anywhere!" />
      </Head>
    
      <Stack screenOptions={{ headerShown: false }} />;
    </>
  );
}
