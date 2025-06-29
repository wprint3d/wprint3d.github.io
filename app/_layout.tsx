import Head from 'expo-router/head';

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <Head>
        <title>
          WPrint 3D - Print from anywhere!
        </title>

        {/* Primary Meta Tags */}
        <meta name="description" content="Improve your 3D-printing experience with a fast and reliable web-based remote control software. Compatible with Linux, Windows (WSL 2), and Raspberry Pi." />
        <meta name="keywords" content="3D printing, remote control, Raspberry Pi, Docker, Linux, Windows, WSL 2, G-code preview, timelapse, multiple printers" />
        <meta name="author" content="WPrint 3D" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="generator" content="Expo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="canonical" content="https://wprint3d.github.io/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wprint3d.github.io/" />
        <meta property="og:title" content="WPrint 3D - Print from anywhere!" />
        <meta property="og:description" content="Improve your 3D-printing experience with a fast and reliable web-based remote control software. Compatible with Linux, Windows (WSL 2), and Raspberry Pi." />
        <meta property="og:image" content={require('../assets/images/ui_promo.webp').uri} />
        <meta property="og:image:alt" content="WPrint 3D user interface" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://wprint3d.github.io/" />
        <meta property="twitter:title" content="WPrint 3D - Print from anywhere!" />
        <meta property="twitter:description" content="Improve your 3D-printing experience with a fast and reliable web-based remote control software. Compatible with Linux, Windows (WSL 2), and Raspberry Pi." />
        <meta property="twitter:image" content={require('../assets/images/ui_promo.webp').uri} />
        <meta property="twitter:image:alt" content="WPrint 3D user interface" />

        {/* Application Features */}
        <meta name="application-name" content="WPrint 3D" />
        <meta name="apple-mobile-web-app-title" content="WPrint 3D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#4F5863" />

        {/* Microsoft Tile */}
        <meta name="msapplication-TileColor" content="#4F5863" />
        <meta name="msapplication-TileImage" content={require('../assets/images/icon.png').uri} />

        {/* Favicons */}
        <link rel="icon" href={require('../assets/images/favicon.png').uri} />
        <link rel="apple-touch-icon" href={require('../assets/images/icon.png').uri} />
        <link rel="shortcut icon" href={require('../assets/images/favicon.png').uri} type="image/png" />
      </Head>
    
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
