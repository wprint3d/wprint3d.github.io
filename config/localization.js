export const AUTO_LANGUAGE = "auto";
export const DEFAULT_LANGUAGE = "en";
export const LANGUAGE_STORAGE_KEY = "wprint3d.language";

export const LANGUAGE_OPTIONS = [
  { value: AUTO_LANGUAGE, flag: "🌐", nativeLabel: "Auto" },
  { value: "en", flag: "🇺🇸", nativeLabel: "English" },
  { value: "es", flag: "🇪🇸", nativeLabel: "Español" },
  { value: "fr", flag: "🇫🇷", nativeLabel: "Français" },
  { value: "pt", flag: "🇵🇹", nativeLabel: "Português" },
  { value: "it", flag: "🇮🇹", nativeLabel: "Italiano" },
  { value: "de", flag: "🇩🇪", nativeLabel: "Deutsch" },
  { value: "es_AR", flag: "🇦🇷", nativeLabel: "Español (Argentina)" },
];

const SUPPORTED_LANGUAGES = new Set(
  LANGUAGE_OPTIONS
    .map((option) => option.value)
    .filter((value) => value !== AUTO_LANGUAGE)
);

const normalizeLanguageTag = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  const [rawLanguage = "", rawRegion = ""] = value.replace("-", "_").split("_");
  const language = rawLanguage.toLowerCase();
  const region = rawRegion.toUpperCase();

  return region ? `${language}_${region}` : language;
};

const ARGENTINA_TIMEZONE_ALIASES = new Set([
  "America/Buenos_Aires",
  "America/Catamarca",
  "America/Cordoba",
  "America/Jujuy",
  "America/Mendoza",
]);

const isSpanishLanguageTag = (value) => normalizeLanguageTag(value).startsWith("es");

const isArgentinaTimeZone = (timeZone) => (
  typeof timeZone === "string" && (
    timeZone.startsWith("America/Argentina/") ||
    ARGENTINA_TIMEZONE_ALIASES.has(timeZone)
  )
);

export const resolveSupportedLanguage = (languageTag) => {
  const normalized = normalizeLanguageTag(languageTag);

  if (!normalized) {
    return DEFAULT_LANGUAGE;
  }

  if (normalized === "es_AR") {
    return "es_AR";
  }

  const [language] = normalized.split("_");

  if (SUPPORTED_LANGUAGES.has(language)) {
    return language;
  }

  return DEFAULT_LANGUAGE;
};

export const resolveSupportedLanguageFromLocaleTags = (languageTags = []) => {
  const normalizedTags = Array.isArray(languageTags)
    ? languageTags.map(normalizeLanguageTag).filter(Boolean)
    : [];

  for (const normalized of normalizedTags) {
    if (SUPPORTED_LANGUAGES.has(normalized)) {
      return normalized;
    }
  }

  for (const normalized of normalizedTags) {
    const [language] = normalized.split("_");

    if (SUPPORTED_LANGUAGES.has(language)) {
      return language;
    }
  }

  return DEFAULT_LANGUAGE;
};

export const getEffectiveLanguage = (selectedLanguage, deviceLanguageTag) => {
  const manualLanguage = getStoredLanguageSelectionValue(selectedLanguage);

  if (manualLanguage) {
    return manualLanguage;
  }

  return resolveSupportedLanguage(deviceLanguageTag);
};

const shouldUseArgentinianSpanish = (normalizedTags, timeZone, resolvedLocaleTag) => {
  if (!isArgentinaTimeZone(timeZone)) {
    return false;
  }

  if (isSpanishLanguageTag(resolvedLocaleTag)) {
    return true;
  }

  return normalizedTags.includes("es_419") || normalizedTags.includes("es_AR");
};

export const getEffectiveLanguageFromLocaleTags = (
  selectedLanguage,
  deviceLanguageTags = [],
  timeZone = null,
  resolvedLocaleTag = null
) => {
  const manualLanguage = getStoredLanguageSelectionValue(selectedLanguage);

  if (manualLanguage) {
    return manualLanguage;
  }

  const normalizedTags = Array.isArray(deviceLanguageTags)
    ? deviceLanguageTags.map(normalizeLanguageTag).filter(Boolean)
    : [];

  if (shouldUseArgentinianSpanish(normalizedTags, timeZone, resolvedLocaleTag)) {
    return "es_AR";
  }

  return resolveSupportedLanguageFromLocaleTags(normalizedTags);
};

export const getStoredLanguageSelectionValue = (selectedLanguage) => {
  if (typeof selectedLanguage !== "string") {
    return null;
  }

  const normalized = normalizeLanguageTag(selectedLanguage);

  if (!normalized || normalized === AUTO_LANGUAGE) {
    return null;
  }

  return SUPPORTED_LANGUAGES.has(normalized) ? normalized : null;
};

export const getLanguageOption = (value) => (
  LANGUAGE_OPTIONS.find((option) => option.value === value) || LANGUAGE_OPTIONS[1]
);

export const translations = {
  en: {
    language: {
      label: "Language",
      autoDetect: "Auto-detect",
      detectedLabel: "Detected",
    },
    main: {
      heroDescription: "Improve your 3D-printing experience with a fast and reliable web-based remote control software.",
      getStarted: "Get started",
      browsePlugins: "Browse plugins",
      compatibleWith: "Compatible with:",
      windowsExperimental: "* Windows support is experimental and requires WSL\u00A02",
      gettingStartedTitle: "Getting started",
      gettingStartedBody: "To get started, follow the instructions associated with your platform of choice.",
      tabs: {
        raspberryPi: "Raspberry Pi",
        docker: "Podman (Docker-like)",
        bareMetal: "Bare metal",
      },
      cards: [
        {
          title: "One host, multiple printers",
          description: "Connect, manage and use multiple printers from a single machine.*",
          note: "Multiple print jobs are run simultaneously",
        },
        {
          title: "Record your prints",
          description: "A simple and easy-to-use interface to record timelapses.",
          note: "Requires enough USB bandwidth",
        },
        {
          title: "Everything in one place",
          description: "Connected printers, current and target temperatures, webcam previews and your preferred materials in a single place.",
        },
        {
          title: "Extremely efficient",
          description: "On a **Raspberry Pi 3 Model B+** a **40% CPU load average** was measured while printing a large file, previewing from two clients and recording **in HD**.",
        },
        {
          title: "Control your printer",
          description: "Control your printer with a simple and easy-to-use interface, wherever you are.",
        },
        {
          title: "G-code preview",
          description: "Preview your G-code file as it is being printed.",
        },
      ],
    },
    plugins: {
      disabledTitle: "Plugins are not available yet",
      disabledDescription: "The plugin system is behind a feature flag right now, so the marketplace is intentionally disabled in this build.",
      backToHome: "Back to home",
      heroTitle: "WPrint 3D Plugins",
      heroDescription: "Discover community-built extensions, lightweight declarative panels, isolated WebView experiences, and advanced custom bundle plugins for WPrint 3D.",
      officialRegistry: "Official registry",
      examplePlugin: "Example plugin",
      searchPlaceholder: "Search plugins by name, category, or description",
      unversioned: "unversioned",
      downloadPackage: "Download package",
      documentation: "Documentation",
      homepage: "Homepage",
    },
    bareMetal: {
      compatibility: "Compatible with the following operating systems in amd64 and arm64 architectures:",
      recommendedHeadline: "This installation method is recommended for developers and advanced users.",
      recommendedBody: "The process consists of downloading the source code and compiling it on the target machine. Then, running containers bound to the host's network and storage, allowing you to plug and unplug modules and components in real time.",
      progressHint: "Click or tap on the steps to keep track of your progress.",
      guideTitle: "Follow the installation guide",
      guideDescription: "Download the source code, compile it, and run the containers.",
    },
    docker: {
      copiedToClipboard: "Copied to clipboard!",
      compatibility: "Compatible with the following operating systems in amd64 and arm64 architectures:",
      recommendedHeadline: "This installation method is recommended for users that want to keep using the host device for other purposes.",
      recommendedBody: "The process consists of downloading the pre-built images and running them with Podman on the host device.",
      progressHint: "Click or tap on the steps to keep track of your progress.",
      windowsSetupTitle: "Planning on using WSL 2?",
      windowsSetupDescription: "Additional setup is required. Click or tap on this step to learn more.",
      connectTitle: "Connect to the target machine",
      connectDescription: "Connect to the terminal of the target machine.",
      installEngineTitle: "Install Podman",
      installEngineDescription: "Install Podman on the target machine.",
      installReleaseTitle: "Install the latest release",
      installReleaseDescription: "Copy the command below and run it in the terminal of the target machine.",
      accessWebTitle: "Access the web interface",
      accessWebDescription: "Point your browser to the IP address of the target machine.",
      wslNextStepsTitle: "On WSL 2?",
      wslNextStepsDescription: "Additional steps are required to enable USB plug and play. Please click or tap on this step to learn more.",
      updaterWarningTitle: "Having trouble with the built-in updater?",
      updaterWarningBody: "If you are having trouble running the integrated updater, you can simply re-run the command above to update the application!",
      updaterWarningFootnote: "This action won't affect your data or settings.",
    },
    raspberryPi: {
      deviceLabel: "Raspberry Pi 3 (or newer)",
      compatibility: "Compatible with the following arm64-ready devices:",
      recommendedHeadline: "This installation method is recommended for most users.",
      recommendedBody: "The process consists of downloading a pre-built image and flashing it to an SD card.",
      progressHint: "Click or tap on the steps to keep track of your progress.",
      downloadTitle: "Download the latest release",
      downloadDescription: "Click or tap here to download the latest image from the remote server.",
      downloadError: "An error occurred while fetching the image URL. Please try again later.",
      unpackTitle: "Unpack the ZIP archive",
      unpackDescription: "Unpack the ZIP archive to obtain the image file.",
      flashTitle: "Flash the image to an SD card",
      flashDescription: "Use the official Raspberry Pi Imager to flash the image to an SD card. Select the \"Custom\" option to flash the image.",
      bootTitle: "Boot the Raspberry Pi",
      bootDescription: "Insert the SD card into the Raspberry Pi and power it on. Wait between 5 to 10 minutes for the system to boot for the first time.",
      accessWebTitle: "Access the web interface",
      accessWebLead: "Click or tap here to navigate to your Raspberry Pi!",
      accessWebCredentials: "The default username is \"admin\" and the default password is \"admin\".",
      troubleTitle: "Having trouble accessing the web interface?",
      troubleDescription: "If you are having trouble accessing the web interface, you can try to log into your router's web interface. Then, check if your Raspberry Pi is listed as a device and access its IP address.",
      detailedGuideLead: "Looking for a more detailed guide?",
      detailedGuideLink: "Check out the full documentation!",
    },
  },
  es: {
    language: {
      label: "Idioma",
      autoDetect: "Detección automática",
      detectedLabel: "Detectado",
    },
    main: {
      heroDescription: "Mejora tu experiencia de impresión 3D con un software de control remoto web rápido y fiable.",
      getStarted: "Primeros pasos",
      browsePlugins: "Explorar plugins",
      compatibleWith: "Compatible con:",
      windowsExperimental: "* La compatibilidad con Windows es experimental y requiere WSL\u00A02",
      gettingStartedTitle: "Primeros pasos",
      gettingStartedBody: "Para empezar, sigue las instrucciones correspondientes a la plataforma que elijas.",
      tabs: {
        raspberryPi: "Raspberry Pi",
        docker: "Podman (similar a Docker)",
        bareMetal: "Bare metal",
      },
      cards: [
        {
          title: "Un host, varias impresoras",
          description: "Conecta, administra y usa varias impresoras desde una sola máquina.*",
          note: "Se ejecutan varios trabajos de impresión de forma simultánea",
        },
        {
          title: "Graba tus impresiones",
          description: "Una interfaz simple y fácil de usar para grabar timelapses.",
          note: "Requiere suficiente ancho de banda USB",
        },
        {
          title: "Todo en un solo lugar",
          description: "Impresoras conectadas, temperaturas actuales y objetivo, vistas previas de cámaras web y tus materiales preferidos en un solo lugar.",
        },
        {
          title: "Extremadamente eficiente",
          description: "En una **Raspberry Pi 3 Model B+** se midió una **carga promedio de CPU del 40%** mientras imprimía un archivo grande, mostraba la vista previa en dos clientes y grababa **en HD**.",
        },
        {
          title: "Controla tu impresora",
          description: "Controla tu impresora con una interfaz simple y fácil de usar, estés donde estés.",
        },
        {
          title: "Vista previa de G-code",
          description: "Previsualiza tu archivo G-code mientras se imprime.",
        },
      ],
    },
    plugins: {
      disabledTitle: "Los plugins todavía no están disponibles",
      disabledDescription: "El sistema de plugins está detrás de una feature flag en este momento, así que el marketplace está deshabilitado intencionalmente en esta build.",
      backToHome: "Volver al inicio",
      heroTitle: "Plugins de WPrint 3D",
      heroDescription: "Descubre extensiones creadas por la comunidad, paneles declarativos ligeros, experiencias aisladas con WebView y plugins avanzados con bundles personalizados para WPrint 3D.",
      officialRegistry: "Registro oficial",
      examplePlugin: "Plugin de ejemplo",
      searchPlaceholder: "Buscar plugins por nombre, categoría o descripción",
      unversioned: "sin versión",
      downloadPackage: "Descargar paquete",
      documentation: "Documentación",
      homepage: "Sitio web",
    },
    bareMetal: {
      compatibility: "Compatible con los siguientes sistemas operativos en arquitecturas amd64 y arm64:",
      recommendedHeadline: "Este método de instalación se recomienda para desarrolladores y usuarios avanzados.",
      recommendedBody: "El proceso consiste en descargar el código fuente y compilarlo en la máquina de destino. Después, se ejecutan contenedores vinculados a la red y al almacenamiento del host, lo que permite conectar y desconectar módulos y componentes en tiempo real.",
      progressHint: "Haz clic o toca los pasos para seguir tu progreso.",
      guideTitle: "Sigue la guía de instalación",
      guideDescription: "Descarga el código fuente, compílalo y ejecuta los contenedores.",
    },
    docker: {
      copiedToClipboard: "¡Copiado al portapapeles!",
      compatibility: "Compatible con los siguientes sistemas operativos en arquitecturas amd64 y arm64:",
      recommendedHeadline: "Este método de instalación se recomienda para usuarios que quieren seguir usando el dispositivo host para otros fines.",
      recommendedBody: "El proceso consiste en descargar las imágenes precompiladas y ejecutarlas con Podman en el dispositivo host.",
      progressHint: "Haz clic o toca los pasos para seguir tu progreso.",
      windowsSetupTitle: "¿Piensas usar WSL 2?",
      windowsSetupDescription: "Se requiere configuración adicional. Haz clic o toca este paso para obtener más información.",
      connectTitle: "Conéctate a la máquina de destino",
      connectDescription: "Conéctate a la terminal de la máquina de destino.",
      installEngineTitle: "Instala Podman",
      installEngineDescription: "Instala Podman en la máquina de destino.",
      installReleaseTitle: "Instala la versión más reciente",
      installReleaseDescription: "Copia el comando de abajo y ejecútalo en la terminal de la máquina de destino.",
      accessWebTitle: "Accede a la interfaz web",
      accessWebDescription: "Apunta tu navegador a la dirección IP de la máquina de destino.",
      wslNextStepsTitle: "¿En WSL 2?",
      wslNextStepsDescription: "Se necesitan pasos adicionales para habilitar USB plug and play. Haz clic o toca este paso para obtener más información.",
      updaterWarningTitle: "¿Tienes problemas con el actualizador integrado?",
      updaterWarningBody: "Si tienes problemas para ejecutar el actualizador integrado, puedes volver a ejecutar el comando de arriba para actualizar la aplicación.",
      updaterWarningFootnote: "Esta acción no afectará tus datos ni tu configuración.",
    },
    raspberryPi: {
      deviceLabel: "Raspberry Pi 3 (o más reciente)",
      compatibility: "Compatible con los siguientes dispositivos preparados para arm64:",
      recommendedHeadline: "Este método de instalación se recomienda para la mayoría de los usuarios.",
      recommendedBody: "El proceso consiste en descargar una imagen precompilada y grabarla en una tarjeta SD.",
      progressHint: "Haz clic o toca los pasos para seguir tu progreso.",
      downloadTitle: "Descarga la versión más reciente",
      downloadDescription: "Haz clic o toca aquí para descargar la imagen más reciente desde el servidor remoto.",
      downloadError: "Se produjo un error al obtener la URL de la imagen. Vuelve a intentarlo más tarde.",
      unpackTitle: "Descomprime el archivo ZIP",
      unpackDescription: "Descomprime el archivo ZIP para obtener la imagen.",
      flashTitle: "Graba la imagen en una tarjeta SD",
      flashDescription: "Usa la herramienta oficial Raspberry Pi Imager para grabar la imagen en una tarjeta SD. Selecciona la opción \"Custom\" para grabar la imagen.",
      bootTitle: "Inicia la Raspberry Pi",
      bootDescription: "Inserta la tarjeta SD en la Raspberry Pi y enciéndela. Espera entre 5 y 10 minutos para que el sistema arranque por primera vez.",
      accessWebTitle: "Accede a la interfaz web",
      accessWebLead: "Haz clic o toca aquí para ir a tu Raspberry Pi.",
      accessWebCredentials: "El usuario por defecto es \"admin\" y la contraseña por defecto es \"admin\".",
      troubleTitle: "¿Tienes problemas para acceder a la interfaz web?",
      troubleDescription: "Si tienes problemas para acceder a la interfaz web, puedes iniciar sesión en la interfaz web de tu router. Después, comprueba si tu Raspberry Pi aparece como dispositivo y accede a su dirección IP.",
      detailedGuideLead: "¿Buscas una guía más detallada?",
      detailedGuideLink: "Consulta la documentación completa.",
    },
  },
  fr: {
    language: {
      label: "Langue",
      autoDetect: "Détection automatique",
      detectedLabel: "Détectée",
    },
    main: {
      heroDescription: "Améliorez votre expérience d'impression 3D avec un logiciel de contrôle à distance web rapide et fiable.",
      getStarted: "Commencer",
      browsePlugins: "Parcourir les plugins",
      compatibleWith: "Compatible avec :",
      windowsExperimental: "* La prise en charge de Windows est expérimentale et nécessite WSL\u00A02",
      gettingStartedTitle: "Premiers pas",
      gettingStartedBody: "Pour commencer, suivez les instructions correspondant à la plateforme de votre choix.",
      tabs: {
        raspberryPi: "Raspberry Pi",
        docker: "Podman (similaire à Docker)",
        bareMetal: "Bare metal",
      },
      cards: [
        {
          title: "Un hôte, plusieurs imprimantes",
          description: "Connectez, gérez et utilisez plusieurs imprimantes depuis une seule machine.*",
          note: "Plusieurs travaux d'impression sont exécutés simultanément",
        },
        {
          title: "Enregistrez vos impressions",
          description: "Une interface simple et facile à utiliser pour enregistrer des timelapses.",
          note: "Nécessite une bande passante USB suffisante",
        },
        {
          title: "Tout au même endroit",
          description: "Imprimantes connectées, températures actuelles et cibles, aperçus webcam et matériaux préférés au même endroit.",
        },
        {
          title: "Extrêmement efficace",
          description: "Sur un **Raspberry Pi 3 Model B+**, une **charge CPU moyenne de 40 %** a été mesurée pendant l'impression d'un gros fichier, l'aperçu depuis deux clients et l'enregistrement **en HD**.",
        },
        {
          title: "Contrôlez votre imprimante",
          description: "Contrôlez votre imprimante avec une interface simple et facile à utiliser, où que vous soyez.",
        },
        {
          title: "Aperçu G-code",
          description: "Prévisualisez votre fichier G-code pendant l'impression.",
        },
      ],
    },
    plugins: {
      disabledTitle: "Les plugins ne sont pas encore disponibles",
      disabledDescription: "Le système de plugins est actuellement derrière un feature flag, donc la marketplace est volontairement désactivée dans cette build.",
      backToHome: "Retour à l'accueil",
      heroTitle: "Plugins WPrint 3D",
      heroDescription: "Découvrez des extensions créées par la communauté, des panneaux déclaratifs légers, des expériences WebView isolées et des plugins avancés avec bundles personnalisés pour WPrint 3D.",
      officialRegistry: "Registre officiel",
      examplePlugin: "Plugin d'exemple",
      searchPlaceholder: "Rechercher des plugins par nom, catégorie ou description",
      unversioned: "sans version",
      downloadPackage: "Télécharger le paquet",
      documentation: "Documentation",
      homepage: "Page d'accueil",
    },
    bareMetal: {
      compatibility: "Compatible avec les systèmes d'exploitation suivants en architectures amd64 et arm64 :",
      recommendedHeadline: "Cette méthode d'installation est recommandée pour les développeurs et les utilisateurs avancés.",
      recommendedBody: "Le processus consiste à télécharger le code source et à le compiler sur la machine cible. Ensuite, des conteneurs liés au réseau et au stockage de l'hôte sont exécutés, ce qui permet de brancher et débrancher des modules et des composants en temps réel.",
      progressHint: "Cliquez ou appuyez sur les étapes pour suivre votre progression.",
      guideTitle: "Suivre le guide d'installation",
      guideDescription: "Téléchargez le code source, compilez-le et exécutez les conteneurs.",
    },
    docker: {
      copiedToClipboard: "Copié dans le presse-papiers !",
      compatibility: "Compatible avec les systèmes d'exploitation suivants en architectures amd64 et arm64 :",
      recommendedHeadline: "Cette méthode d'installation est recommandée pour les utilisateurs qui veulent continuer à utiliser l'appareil hôte pour d'autres usages.",
      recommendedBody: "Le processus consiste à télécharger les images préconstruites et à les exécuter avec Podman sur l'appareil hôte.",
      progressHint: "Cliquez ou appuyez sur les étapes pour suivre votre progression.",
      windowsSetupTitle: "Vous comptez utiliser WSL 2 ?",
      windowsSetupDescription: "Une configuration supplémentaire est nécessaire. Cliquez ou appuyez sur cette étape pour en savoir plus.",
      connectTitle: "Se connecter à la machine cible",
      connectDescription: "Connectez-vous au terminal de la machine cible.",
      installEngineTitle: "Installer Podman",
      installEngineDescription: "Installez Podman sur la machine cible.",
      installReleaseTitle: "Installer la dernière version",
      installReleaseDescription: "Copiez la commande ci-dessous et exécutez-la dans le terminal de la machine cible.",
      accessWebTitle: "Accéder à l'interface web",
      accessWebDescription: "Pointez votre navigateur vers l'adresse IP de la machine cible.",
      wslNextStepsTitle: "Sous WSL 2 ?",
      wslNextStepsDescription: "Des étapes supplémentaires sont nécessaires pour activer l'USB plug and play. Cliquez ou appuyez sur cette étape pour en savoir plus.",
      updaterWarningTitle: "Des problèmes avec le programme de mise à jour intégré ?",
      updaterWarningBody: "Si vous avez des difficultés à exécuter le programme de mise à jour intégré, vous pouvez relancer la commande ci-dessus pour mettre à jour l'application.",
      updaterWarningFootnote: "Cette action n'affectera ni vos données ni vos paramètres.",
    },
    raspberryPi: {
      deviceLabel: "Raspberry Pi 3 (ou plus récent)",
      compatibility: "Compatible avec les appareils suivants prêts pour arm64 :",
      recommendedHeadline: "Cette méthode d'installation est recommandée pour la plupart des utilisateurs.",
      recommendedBody: "Le processus consiste à télécharger une image préconstruite et à la flasher sur une carte SD.",
      progressHint: "Cliquez ou appuyez sur les étapes pour suivre votre progression.",
      downloadTitle: "Télécharger la dernière version",
      downloadDescription: "Cliquez ou appuyez ici pour télécharger la dernière image depuis le serveur distant.",
      downloadError: "Une erreur s'est produite lors de la récupération de l'URL de l'image. Veuillez réessayer plus tard.",
      unpackTitle: "Décompresser l'archive ZIP",
      unpackDescription: "Décompressez l'archive ZIP pour obtenir le fichier image.",
      flashTitle: "Flasher l'image sur une carte SD",
      flashDescription: "Utilisez l'outil officiel Raspberry Pi Imager pour flasher l'image sur une carte SD. Sélectionnez l'option \"Custom\" pour flasher l'image.",
      bootTitle: "Démarrer le Raspberry Pi",
      bootDescription: "Insérez la carte SD dans le Raspberry Pi et allumez-le. Attendez entre 5 et 10 minutes pour le premier démarrage du système.",
      accessWebTitle: "Accéder à l'interface web",
      accessWebLead: "Cliquez ou appuyez ici pour accéder à votre Raspberry Pi.",
      accessWebCredentials: "Le nom d'utilisateur par défaut est \"admin\" et le mot de passe par défaut est \"admin\".",
      troubleTitle: "Des difficultés pour accéder à l'interface web ?",
      troubleDescription: "Si vous avez des difficultés pour accéder à l'interface web, essayez de vous connecter à l'interface web de votre routeur. Vérifiez ensuite si votre Raspberry Pi apparaît comme appareil et accédez à son adresse IP.",
      detailedGuideLead: "Vous cherchez un guide plus détaillé ?",
      detailedGuideLink: "Consultez la documentation complète !",
    },
  },
  pt: {
    language: {
      label: "Idioma",
      autoDetect: "Detecção automática",
      detectedLabel: "Detectado",
    },
    main: {
      heroDescription: "Melhore sua experiência de impressão 3D com um software web de controle remoto rápido e confiável.",
      getStarted: "Começar",
      browsePlugins: "Explorar plugins",
      compatibleWith: "Compatível com:",
      windowsExperimental: "* O suporte ao Windows é experimental e requer WSL\u00A02",
      gettingStartedTitle: "Primeiros passos",
      gettingStartedBody: "Para começar, siga as instruções associadas à plataforma da sua escolha.",
      tabs: {
        raspberryPi: "Raspberry Pi",
        docker: "Podman (semelhante ao Docker)",
        bareMetal: "Bare metal",
      },
      cards: [
        {
          title: "Um host, várias impressoras",
          description: "Conecte, gerencie e use várias impressoras a partir de uma única máquina.*",
          note: "Vários trabalhos de impressão são executados simultaneamente",
        },
        {
          title: "Grave suas impressões",
          description: "Uma interface simples e fácil de usar para gravar timelapses.",
          note: "Requer largura de banda USB suficiente",
        },
        {
          title: "Tudo em um só lugar",
          description: "Impressoras conectadas, temperaturas atuais e alvo, pré-visualizações da webcam e seus materiais preferidos em um só lugar.",
        },
        {
          title: "Extremamente eficiente",
          description: "Em um **Raspberry Pi 3 Model B+**, foi medida uma **carga média de CPU de 40%** enquanto imprimia um arquivo grande, fazia pré-visualização em dois clientes e gravava **em HD**.",
        },
        {
          title: "Controle sua impressora",
          description: "Controle sua impressora com uma interface simples e fácil de usar, onde quer que você esteja.",
        },
        {
          title: "Pré-visualização de G-code",
          description: "Visualize seu arquivo G-code enquanto ele está sendo impresso.",
        },
      ],
    },
    plugins: {
      disabledTitle: "Os plugins ainda não estão disponíveis",
      disabledDescription: "O sistema de plugins está atrás de uma feature flag agora, então o marketplace está desativado intencionalmente nesta build.",
      backToHome: "Voltar ao início",
      heroTitle: "Plugins do WPrint 3D",
      heroDescription: "Descubra extensões criadas pela comunidade, painéis declarativos leves, experiências isoladas em WebView e plugins avançados com bundles personalizados para o WPrint 3D.",
      officialRegistry: "Registro oficial",
      examplePlugin: "Plugin de exemplo",
      searchPlaceholder: "Buscar plugins por nome, categoria ou descrição",
      unversioned: "sem versão",
      downloadPackage: "Baixar pacote",
      documentation: "Documentação",
      homepage: "Página inicial",
    },
    bareMetal: {
      compatibility: "Compatível com os seguintes sistemas operacionais nas arquiteturas amd64 e arm64:",
      recommendedHeadline: "Este método de instalação é recomendado para desenvolvedores e usuários avançados.",
      recommendedBody: "O processo consiste em baixar o código-fonte e compilá-lo na máquina de destino. Depois, executar contêineres vinculados à rede e ao armazenamento do host, permitindo conectar e desconectar módulos e componentes em tempo real.",
      progressHint: "Clique ou toque nos passos para acompanhar seu progresso.",
      guideTitle: "Siga o guia de instalação",
      guideDescription: "Baixe o código-fonte, compile-o e execute os contêineres.",
    },
    docker: {
      copiedToClipboard: "Copiado para a área de transferência!",
      compatibility: "Compatível com os seguintes sistemas operacionais nas arquiteturas amd64 e arm64:",
      recommendedHeadline: "Este método de instalação é recomendado para usuários que querem continuar usando o dispositivo host para outras finalidades.",
      recommendedBody: "O processo consiste em baixar as imagens pré-compiladas e executá-las com o Podman no dispositivo host.",
      progressHint: "Clique ou toque nos passos para acompanhar seu progresso.",
      windowsSetupTitle: "Vai usar WSL 2?",
      windowsSetupDescription: "É necessária uma configuração adicional. Clique ou toque neste passo para saber mais.",
      connectTitle: "Conecte-se à máquina de destino",
      connectDescription: "Conecte-se ao terminal da máquina de destino.",
      installEngineTitle: "Instale o Podman",
      installEngineDescription: "Instale o Podman na máquina de destino.",
      installReleaseTitle: "Instale a versão mais recente",
      installReleaseDescription: "Copie o comando abaixo e execute-o no terminal da máquina de destino.",
      accessWebTitle: "Acesse a interface web",
      accessWebDescription: "Aponte seu navegador para o endereço IP da máquina de destino.",
      wslNextStepsTitle: "No WSL 2?",
      wslNextStepsDescription: "Etapas adicionais são necessárias para habilitar USB plug and play. Clique ou toque neste passo para saber mais.",
      updaterWarningTitle: "Com problemas com o atualizador integrado?",
      updaterWarningBody: "Se você estiver com dificuldade para executar o atualizador integrado, basta executar novamente o comando acima para atualizar a aplicação.",
      updaterWarningFootnote: "Essa ação não afetará seus dados nem suas configurações.",
    },
    raspberryPi: {
      deviceLabel: "Raspberry Pi 3 (ou mais recente)",
      compatibility: "Compatível com os seguintes dispositivos prontos para arm64:",
      recommendedHeadline: "Este método de instalação é recomendado para a maioria dos usuários.",
      recommendedBody: "O processo consiste em baixar uma imagem pré-compilada e gravá-la em um cartão SD.",
      progressHint: "Clique ou toque nos passos para acompanhar seu progresso.",
      downloadTitle: "Baixe a versão mais recente",
      downloadDescription: "Clique ou toque aqui para baixar a imagem mais recente do servidor remoto.",
      downloadError: "Ocorreu um erro ao buscar a URL da imagem. Tente novamente mais tarde.",
      unpackTitle: "Extraia o arquivo ZIP",
      unpackDescription: "Extraia o arquivo ZIP para obter o arquivo de imagem.",
      flashTitle: "Grave a imagem em um cartão SD",
      flashDescription: "Use o Raspberry Pi Imager oficial para gravar a imagem em um cartão SD. Selecione a opção \"Custom\" para gravar a imagem.",
      bootTitle: "Inicialize o Raspberry Pi",
      bootDescription: "Insira o cartão SD no Raspberry Pi e ligue-o. Aguarde entre 5 e 10 minutos para que o sistema inicialize pela primeira vez.",
      accessWebTitle: "Acesse a interface web",
      accessWebLead: "Clique ou toque aqui para abrir o seu Raspberry Pi.",
      accessWebCredentials: "O nome de usuário padrão é \"admin\" e a senha padrão é \"admin\".",
      troubleTitle: "Está com problemas para acessar a interface web?",
      troubleDescription: "Se você estiver com problemas para acessar a interface web, tente fazer login na interface web do seu roteador. Depois, verifique se o seu Raspberry Pi aparece como dispositivo e acesse o endereço IP dele.",
      detailedGuideLead: "Procurando um guia mais detalhado?",
      detailedGuideLink: "Confira a documentação completa!",
    },
  },
  it: {
    language: {
      label: "Lingua",
      autoDetect: "Rilevamento automatico",
      detectedLabel: "Rilevata",
    },
    main: {
      heroDescription: "Migliora la tua esperienza di stampa 3D con un software web di controllo remoto rapido e affidabile.",
      getStarted: "Inizia",
      browsePlugins: "Esplora i plugin",
      compatibleWith: "Compatibile con:",
      windowsExperimental: "* Il supporto per Windows è sperimentale e richiede WSL\u00A02",
      gettingStartedTitle: "Primi passi",
      gettingStartedBody: "Per iniziare, segui le istruzioni associate alla piattaforma che preferisci.",
      tabs: {
        raspberryPi: "Raspberry Pi",
        docker: "Podman (simile a Docker)",
        bareMetal: "Bare metal",
      },
      cards: [
        {
          title: "Un host, più stampanti",
          description: "Collega, gestisci e usa più stampanti da una singola macchina.*",
          note: "Più lavori di stampa vengono eseguiti simultaneamente",
        },
        {
          title: "Registra le tue stampe",
          description: "Un'interfaccia semplice e facile da usare per registrare timelapse.",
          note: "Richiede una larghezza di banda USB sufficiente",
        },
        {
          title: "Tutto in un unico posto",
          description: "Stampanti collegate, temperature correnti e target, anteprime webcam e materiali preferiti in un unico posto.",
        },
        {
          title: "Estremamente efficiente",
          description: "Su un **Raspberry Pi 3 Model B+** è stato misurato un **carico medio della CPU del 40%** durante la stampa di un file grande, l'anteprima da due client e la registrazione **in HD**.",
        },
        {
          title: "Controlla la tua stampante",
          description: "Controlla la tua stampante con un'interfaccia semplice e facile da usare, ovunque tu sia.",
        },
        {
          title: "Anteprima G-code",
          description: "Visualizza in anteprima il file G-code mentre viene stampato.",
        },
      ],
    },
    plugins: {
      disabledTitle: "I plugin non sono ancora disponibili",
      disabledDescription: "Il sistema di plugin è dietro una feature flag in questo momento, quindi il marketplace è intenzionalmente disabilitato in questa build.",
      backToHome: "Torna alla home",
      heroTitle: "Plugin di WPrint 3D",
      heroDescription: "Scopri estensioni create dalla community, pannelli dichiarativi leggeri, esperienze WebView isolate e plugin avanzati con bundle personalizzati per WPrint 3D.",
      officialRegistry: "Registro ufficiale",
      examplePlugin: "Plugin di esempio",
      searchPlaceholder: "Cerca plugin per nome, categoria o descrizione",
      unversioned: "senza versione",
      downloadPackage: "Scarica pacchetto",
      documentation: "Documentazione",
      homepage: "Homepage",
    },
    bareMetal: {
      compatibility: "Compatibile con i seguenti sistemi operativi nelle architetture amd64 e arm64:",
      recommendedHeadline: "Questo metodo di installazione è consigliato per sviluppatori e utenti avanzati.",
      recommendedBody: "Il processo consiste nello scaricare il codice sorgente e compilarlo sulla macchina di destinazione. Poi si eseguono container collegati alla rete e allo storage dell'host, permettendo di collegare e scollegare moduli e componenti in tempo reale.",
      progressHint: "Fai clic o tocca i passaggi per tenere traccia dei tuoi progressi.",
      guideTitle: "Segui la guida di installazione",
      guideDescription: "Scarica il codice sorgente, compilalo ed esegui i container.",
    },
    docker: {
      copiedToClipboard: "Copiato negli appunti!",
      compatibility: "Compatibile con i seguenti sistemi operativi nelle architetture amd64 e arm64:",
      recommendedHeadline: "Questo metodo di installazione è consigliato agli utenti che vogliono continuare a usare il dispositivo host per altri scopi.",
      recommendedBody: "Il processo consiste nello scaricare le immagini precompilate ed eseguirle con Podman sul dispositivo host.",
      progressHint: "Fai clic o tocca i passaggi per tenere traccia dei tuoi progressi.",
      windowsSetupTitle: "Hai intenzione di usare WSL 2?",
      windowsSetupDescription: "È necessaria una configurazione aggiuntiva. Fai clic o tocca questo passaggio per saperne di più.",
      connectTitle: "Connettiti alla macchina di destinazione",
      connectDescription: "Connettiti al terminale della macchina di destinazione.",
      installEngineTitle: "Installa Podman",
      installEngineDescription: "Installa Podman sulla macchina di destinazione.",
      installReleaseTitle: "Installa l'ultima versione",
      installReleaseDescription: "Copia il comando qui sotto ed eseguilo nel terminale della macchina di destinazione.",
      accessWebTitle: "Accedi all'interfaccia web",
      accessWebDescription: "Punta il browser all'indirizzo IP della macchina di destinazione.",
      wslNextStepsTitle: "Su WSL 2?",
      wslNextStepsDescription: "Sono necessari passaggi aggiuntivi per abilitare USB plug and play. Fai clic o tocca questo passaggio per saperne di più.",
      updaterWarningTitle: "Problemi con l'aggiornamento integrato?",
      updaterWarningBody: "Se hai problemi a eseguire l'aggiornamento integrato, puoi semplicemente rieseguire il comando sopra per aggiornare l'applicazione.",
      updaterWarningFootnote: "Questa azione non influirà sui tuoi dati o sulle tue impostazioni.",
    },
    raspberryPi: {
      deviceLabel: "Raspberry Pi 3 (o successivo)",
      compatibility: "Compatibile con i seguenti dispositivi pronti per arm64:",
      recommendedHeadline: "Questo metodo di installazione è consigliato alla maggior parte degli utenti.",
      recommendedBody: "Il processo consiste nello scaricare un'immagine precompilata e scriverla su una scheda SD.",
      progressHint: "Fai clic o tocca i passaggi per tenere traccia dei tuoi progressi.",
      downloadTitle: "Scarica l'ultima versione",
      downloadDescription: "Fai clic o tocca qui per scaricare l'immagine più recente dal server remoto.",
      downloadError: "Si è verificato un errore durante il recupero dell'URL dell'immagine. Riprova più tardi.",
      unpackTitle: "Estrai l'archivio ZIP",
      unpackDescription: "Estrai l'archivio ZIP per ottenere il file immagine.",
      flashTitle: "Scrivi l'immagine su una scheda SD",
      flashDescription: "Usa lo strumento ufficiale Raspberry Pi Imager per scrivere l'immagine su una scheda SD. Seleziona l'opzione \"Custom\" per scrivere l'immagine.",
      bootTitle: "Avvia il Raspberry Pi",
      bootDescription: "Inserisci la scheda SD nel Raspberry Pi e accendilo. Attendi da 5 a 10 minuti affinché il sistema si avvii per la prima volta.",
      accessWebTitle: "Accedi all'interfaccia web",
      accessWebLead: "Fai clic o tocca qui per aprire il tuo Raspberry Pi.",
      accessWebCredentials: "Il nome utente predefinito è \"admin\" e la password predefinita è \"admin\".",
      troubleTitle: "Problemi ad accedere all'interfaccia web?",
      troubleDescription: "Se hai problemi ad accedere all'interfaccia web, puoi provare ad accedere all'interfaccia web del router. Poi verifica se il Raspberry Pi è elencato come dispositivo e apri il suo indirizzo IP.",
      detailedGuideLead: "Cerchi una guida più dettagliata?",
      detailedGuideLink: "Consulta la documentazione completa!",
    },
  },
  de: {
    language: {
      label: "Sprache",
      autoDetect: "Automatische Erkennung",
      detectedLabel: "Erkannt",
    },
    main: {
      heroDescription: "Verbessern Sie Ihr 3D-Druck-Erlebnis mit einer schnellen und zuverlässigen webbasierten Fernsteuerungssoftware.",
      getStarted: "Loslegen",
      browsePlugins: "Plugins entdecken",
      compatibleWith: "Kompatibel mit:",
      windowsExperimental: "* Die Windows-Unterstützung ist experimentell und erfordert WSL\u00A02",
      gettingStartedTitle: "Erste Schritte",
      gettingStartedBody: "Folgen Sie zum Einstieg den Anweisungen für die Plattform Ihrer Wahl.",
      tabs: {
        raspberryPi: "Raspberry Pi",
        docker: "Podman (Docker-ähnlich)",
        bareMetal: "Bare metal",
      },
      cards: [
        {
          title: "Ein Host, mehrere Drucker",
          description: "Verbinden, verwalten und nutzen Sie mehrere Drucker von einem einzigen Rechner aus.*",
          note: "Mehrere Druckaufträge werden gleichzeitig ausgeführt",
        },
        {
          title: "Zeichnen Sie Ihre Drucke auf",
          description: "Eine einfache und leicht zu bedienende Oberfläche zum Aufzeichnen von Timelapses.",
          note: "Erfordert ausreichend USB-Bandbreite",
        },
        {
          title: "Alles an einem Ort",
          description: "Verbundene Drucker, aktuelle und Zieltemperaturen, Webcam-Vorschauen und Ihre bevorzugten Materialien an einem Ort.",
        },
        {
          title: "Extrem effizient",
          description: "Auf einem **Raspberry Pi 3 Model B+** wurde eine **durchschnittliche CPU-Last von 40 %** gemessen, während eine große Datei gedruckt, von zwei Clients aus betrachtet und **in HD** aufgezeichnet wurde.",
        },
        {
          title: "Steuern Sie Ihren Drucker",
          description: "Steuern Sie Ihren Drucker mit einer einfachen und leicht zu bedienenden Oberfläche, wo immer Sie sind.",
        },
        {
          title: "G-code-Vorschau",
          description: "Zeigen Sie Ihre G-code-Datei während des Druckens in der Vorschau an.",
        },
      ],
    },
    plugins: {
      disabledTitle: "Plugins sind noch nicht verfügbar",
      disabledDescription: "Das Plugin-System ist derzeit hinter einem Feature-Flag verborgen, daher ist der Marketplace in diesem Build absichtlich deaktiviert.",
      backToHome: "Zurück zur Startseite",
      heroTitle: "WPrint 3D Plugins",
      heroDescription: "Entdecken Sie von der Community erstellte Erweiterungen, leichte deklarative Panels, isolierte WebView-Erlebnisse und fortgeschrittene Plugins mit benutzerdefinierten Bundles für WPrint 3D.",
      officialRegistry: "Offizielles Register",
      examplePlugin: "Beispiel-Plugin",
      searchPlaceholder: "Plugins nach Name, Kategorie oder Beschreibung suchen",
      unversioned: "ohne Version",
      downloadPackage: "Paket herunterladen",
      documentation: "Dokumentation",
      homepage: "Startseite",
    },
    bareMetal: {
      compatibility: "Kompatibel mit den folgenden Betriebssystemen in amd64- und arm64-Architekturen:",
      recommendedHeadline: "Diese Installationsmethode wird für Entwickler und fortgeschrittene Benutzer empfohlen.",
      recommendedBody: "Der Prozess besteht darin, den Quellcode herunterzuladen und auf der Zielmaschine zu kompilieren. Anschließend werden Container ausgeführt, die an das Netzwerk und den Speicher des Hosts gebunden sind, sodass Module und Komponenten in Echtzeit ein- und ausgesteckt werden können.",
      progressHint: "Klicken oder tippen Sie auf die Schritte, um Ihren Fortschritt zu verfolgen.",
      guideTitle: "Installationsanleitung folgen",
      guideDescription: "Laden Sie den Quellcode herunter, kompilieren Sie ihn und führen Sie die Container aus.",
    },
    docker: {
      copiedToClipboard: "In die Zwischenablage kopiert!",
      compatibility: "Kompatibel mit den folgenden Betriebssystemen in amd64- und arm64-Architekturen:",
      recommendedHeadline: "Diese Installationsmethode wird für Benutzer empfohlen, die das Host-Gerät weiterhin für andere Zwecke verwenden möchten.",
      recommendedBody: "Der Prozess besteht darin, die vorgefertigten Images herunterzuladen und sie mit Podman auf dem Host-Gerät auszuführen.",
      progressHint: "Klicken oder tippen Sie auf die Schritte, um Ihren Fortschritt zu verfolgen.",
      windowsSetupTitle: "Planen Sie die Nutzung von WSL 2?",
      windowsSetupDescription: "Eine zusätzliche Einrichtung ist erforderlich. Klicken oder tippen Sie auf diesen Schritt, um mehr zu erfahren.",
      connectTitle: "Mit der Zielmaschine verbinden",
      connectDescription: "Verbinden Sie sich mit dem Terminal der Zielmaschine.",
      installEngineTitle: "Podman installieren",
      installEngineDescription: "Installieren Sie Podman auf der Zielmaschine.",
      installReleaseTitle: "Die neueste Version installieren",
      installReleaseDescription: "Kopieren Sie den untenstehenden Befehl und führen Sie ihn im Terminal der Zielmaschine aus.",
      accessWebTitle: "Auf die Weboberfläche zugreifen",
      accessWebDescription: "Richten Sie Ihren Browser auf die IP-Adresse der Zielmaschine.",
      wslNextStepsTitle: "Unter WSL 2?",
      wslNextStepsDescription: "Zusätzliche Schritte sind erforderlich, um USB Plug and Play zu aktivieren. Klicken oder tippen Sie auf diesen Schritt, um mehr zu erfahren.",
      updaterWarningTitle: "Probleme mit dem integrierten Updater?",
      updaterWarningBody: "Wenn Sie Probleme beim Ausführen des integrierten Updaters haben, können Sie einfach den obigen Befehl erneut ausführen, um die Anwendung zu aktualisieren.",
      updaterWarningFootnote: "Diese Aktion wirkt sich nicht auf Ihre Daten oder Einstellungen aus.",
    },
    raspberryPi: {
      deviceLabel: "Raspberry Pi 3 (oder neuer)",
      compatibility: "Kompatibel mit den folgenden arm64-fähigen Geräten:",
      recommendedHeadline: "Diese Installationsmethode wird für die meisten Benutzer empfohlen.",
      recommendedBody: "Der Prozess besteht darin, ein vorgefertigtes Image herunterzuladen und auf eine SD-Karte zu flashen.",
      progressHint: "Klicken oder tippen Sie auf die Schritte, um Ihren Fortschritt zu verfolgen.",
      downloadTitle: "Neueste Version herunterladen",
      downloadDescription: "Klicken oder tippen Sie hier, um das neueste Image vom Remote-Server herunterzuladen.",
      downloadError: "Beim Abrufen der Image-URL ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
      unpackTitle: "ZIP-Archiv entpacken",
      unpackDescription: "Entpacken Sie das ZIP-Archiv, um die Image-Datei zu erhalten.",
      flashTitle: "Image auf eine SD-Karte flashen",
      flashDescription: "Verwenden Sie den offiziellen Raspberry Pi Imager, um das Image auf eine SD-Karte zu flashen. Wählen Sie die Option \"Custom\", um das Image zu flashen.",
      bootTitle: "Raspberry Pi starten",
      bootDescription: "Stecken Sie die SD-Karte in den Raspberry Pi und schalten Sie ihn ein. Warten Sie 5 bis 10 Minuten, bis das System zum ersten Mal gestartet ist.",
      accessWebTitle: "Auf die Weboberfläche zugreifen",
      accessWebLead: "Klicken oder tippen Sie hier, um zu Ihrem Raspberry Pi zu wechseln.",
      accessWebCredentials: "Der Standardbenutzername ist \"admin\" und das Standardpasswort ist \"admin\".",
      troubleTitle: "Probleme beim Zugriff auf die Weboberfläche?",
      troubleDescription: "Wenn Sie Probleme beim Zugriff auf die Weboberfläche haben, können Sie sich an der Weboberfläche Ihres Routers anmelden. Prüfen Sie anschließend, ob Ihr Raspberry Pi als Gerät aufgeführt ist, und öffnen Sie seine IP-Adresse.",
      detailedGuideLead: "Suchen Sie eine ausführlichere Anleitung?",
      detailedGuideLink: "Sehen Sie sich die vollständige Dokumentation an!",
    },
  },
  es_AR: {
    language: {
      label: "Idioma",
      autoDetect: "Detección automática",
      detectedLabel: "Detectado",
    },
    main: {
      heroDescription: "Mejorá tu experiencia de impresión 3D con un software web de control remoto rápido y confiable.",
      getStarted: "Primeros pasos",
      browsePlugins: "Explorá plugins",
      compatibleWith: "Compatible con:",
      windowsExperimental: "* La compatibilidad con Windows es experimental y requiere WSL\u00A02",
      gettingStartedTitle: "Primeros pasos",
      gettingStartedBody: "Para empezar, seguí las instrucciones correspondientes a la plataforma que elijas.",
      tabs: {
        raspberryPi: "Raspberry Pi",
        docker: "Podman (similar a Docker)",
        bareMetal: "Bare metal",
      },
      cards: [
        {
          title: "Un host, varias impresoras",
          description: "Conectá, administrá y usá varias impresoras desde una sola máquina.*",
          note: "Se ejecutan varios trabajos de impresión al mismo tiempo",
        },
        {
          title: "Grabá tus impresiones",
          description: "Una interfaz simple y fácil de usar para grabar timelapses.",
          note: "Requiere suficiente ancho de banda USB",
        },
        {
          title: "Todo en un solo lugar",
          description: "Impresoras conectadas, temperaturas actuales y objetivo, vistas previas de cámaras web y tus materiales preferidos en un solo lugar.",
        },
        {
          title: "Extremadamente eficiente",
          description: "En una **Raspberry Pi 3 Model B+** se midió una **carga promedio de CPU del 40%** mientras imprimía un archivo grande, mostraba la vista previa en dos clientes y grababa **en HD**.",
        },
        {
          title: "Controlá tu impresora",
          description: "Controlá tu impresora con una interfaz simple y fácil de usar, estés donde estés.",
        },
        {
          title: "Vista previa de G-code",
          description: "Previsualizá tu archivo G-code mientras se imprime.",
        },
      ],
    },
    plugins: {
      disabledTitle: "Los plugins todavía no están disponibles",
      disabledDescription: "El sistema de plugins está detrás de una feature flag por ahora, así que el marketplace está deshabilitado intencionalmente en esta build.",
      backToHome: "Volver al inicio",
      heroTitle: "Plugins de WPrint 3D",
      heroDescription: "Descubrí extensiones creadas por la comunidad, paneles declarativos livianos, experiencias aisladas con WebView y plugins avanzados con bundles personalizados para WPrint 3D.",
      officialRegistry: "Registro oficial",
      examplePlugin: "Plugin de ejemplo",
      searchPlaceholder: "Buscá plugins por nombre, categoría o descripción",
      unversioned: "sin versión",
      downloadPackage: "Descargar paquete",
      documentation: "Documentación",
      homepage: "Sitio web",
    },
    bareMetal: {
      compatibility: "Compatible con los siguientes sistemas operativos en arquitecturas amd64 y arm64:",
      recommendedHeadline: "Este método de instalación se recomienda para desarrolladores y usuarios avanzados.",
      recommendedBody: "El proceso consiste en descargar el código fuente y compilarlo en la máquina de destino. Después, se ejecutan contenedores vinculados a la red y al almacenamiento del host, lo que permite conectar y desconectar módulos y componentes en tiempo real.",
      progressHint: "Hacé clic o tocá los pasos para seguir tu progreso.",
      guideTitle: "Seguí la guía de instalación",
      guideDescription: "Descargá el código fuente, compilalo y ejecutá los contenedores.",
    },
    docker: {
      copiedToClipboard: "¡Copiado al portapapeles!",
      compatibility: "Compatible con los siguientes sistemas operativos en arquitecturas amd64 y arm64:",
      recommendedHeadline: "Este método de instalación se recomienda para usuarios que quieren seguir usando el dispositivo host para otros fines.",
      recommendedBody: "El proceso consiste en descargar las imágenes precompiladas y ejecutarlas con Podman en el dispositivo host.",
      progressHint: "Hacé clic o tocá los pasos para seguir tu progreso.",
      windowsSetupTitle: "¿Pensás usar WSL 2?",
      windowsSetupDescription: "Se requiere configuración adicional. Hacé clic o tocá este paso para obtener más información.",
      connectTitle: "Conectate a la máquina de destino",
      connectDescription: "Conectate a la terminal de la máquina de destino.",
      installEngineTitle: "Instalá Podman",
      installEngineDescription: "Instalá Podman en la máquina de destino.",
      installReleaseTitle: "Instalá la versión más reciente",
      installReleaseDescription: "Copiá el comando de abajo y ejecutalo en la terminal de la máquina de destino.",
      accessWebTitle: "Accedé a la interfaz web",
      accessWebDescription: "Apuntá tu navegador a la dirección IP de la máquina de destino.",
      wslNextStepsTitle: "¿En WSL 2?",
      wslNextStepsDescription: "Se necesitan pasos adicionales para habilitar USB plug and play. Hacé clic o tocá este paso para obtener más información.",
      updaterWarningTitle: "¿Tenés problemas con el actualizador integrado?",
      updaterWarningBody: "Si tenés problemas para ejecutar el actualizador integrado, podés volver a ejecutar el comando de arriba para actualizar la aplicación.",
      updaterWarningFootnote: "Esta acción no va a afectar tus datos ni tu configuración.",
    },
    raspberryPi: {
      deviceLabel: "Raspberry Pi 3 (o más reciente)",
      compatibility: "Compatible con los siguientes dispositivos preparados para arm64:",
      recommendedHeadline: "Este método de instalación se recomienda para la mayoría de los usuarios.",
      recommendedBody: "El proceso consiste en descargar una imagen precompilada y grabarla en una tarjeta SD.",
      progressHint: "Hacé clic o tocá los pasos para seguir tu progreso.",
      downloadTitle: "Descargá la versión más reciente",
      downloadDescription: "Hacé clic o tocá acá para descargar la imagen más reciente desde el servidor remoto.",
      downloadError: "Se produjo un error al obtener la URL de la imagen. Volvé a intentarlo más tarde.",
      unpackTitle: "Descomprimí el archivo ZIP",
      unpackDescription: "Descomprimí el archivo ZIP para obtener la imagen.",
      flashTitle: "Grabá la imagen en una tarjeta SD",
      flashDescription: "Usá la herramienta oficial Raspberry Pi Imager para grabar la imagen en una tarjeta SD. Seleccioná la opción \"Custom\" para grabar la imagen.",
      bootTitle: "Iniciá la Raspberry Pi",
      bootDescription: "Insertá la tarjeta SD en la Raspberry Pi y encendela. Esperá entre 5 y 10 minutos para que el sistema arranque por primera vez.",
      accessWebTitle: "Accedé a la interfaz web",
      accessWebLead: "Hacé clic o tocá acá para ir a tu Raspberry Pi.",
      accessWebCredentials: "El usuario por defecto es \"admin\" y la contraseña por defecto es \"admin\".",
      troubleTitle: "¿Tenés problemas para acceder a la interfaz web?",
      troubleDescription: "Si tenés problemas para acceder a la interfaz web, podés iniciar sesión en la interfaz web de tu router. Después, comprobá si tu Raspberry Pi aparece como dispositivo y accedé a su dirección IP.",
      detailedGuideLead: "¿Buscás una guía más detallada?",
      detailedGuideLink: "Consultá la documentación completa.",
    },
  },
};
