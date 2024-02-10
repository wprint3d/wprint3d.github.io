Buenos días a todos, espero estén teniendo un excelente comienzo del día.

Como sabrán, no suelo publicar con frecuencia en esta red, pero esta es una ocasión especial ya que considero que este es un evento especial entre el abanico de pequeños desarrollos anteriores. Les comento que me encuentro en proceso de desarrollar uno de los proyectos de mi autoría de mayor complejidad y, posiblemente, utilidad para la comunidad open-source.

En este caso se trata de un proyecto denominado WPrint 3D: una aplicación que combina el control remoto, monitoreo por medio de cámaras USB o CSI, grabación y gestión de impresoras 3D, equipos CNC y similares que ejecuten el firmware Marlin 1.x, Marlin 2.x o derivados.

El sistema es capaz de controlar un alto número de equipos simultáneamente, dependiendo de los recursos disponibles en el equipo en que se aloja. De manera dinámica y automática, se determina una cantidad de equipos a controlar en paralelo mientras que, los demás, se encolan a fin de procesarlos de manera secuencial o a medida que se liberen espacios de procesamiento.

Una de las habilidades características de esta alternativa a otros conjuntos de software similares, además del soporte para manipular varios equipos al mismo tiempo, es la capacidad de recuperar trabajos perdidos: cada segundo, se realiza una copia de seguridad de la progresión de los trabajos en ejecución, lo que permite restaurarlos ante fallos de energía o errores del sistema o de la conectividad en serie hacia la impresora.

La configuración es muy sencilla, requiere menos de 10 minutos y un equipo que ejecute una distribución Linux moderna (sea Ubuntu, Debian, Arch Linux, etc.) que soporte la instalación de Docker. Actualmente cuenta con imágenes disponibles en Docker Hub para armv7 (de 32 bits), arm64 y amd64, por lo que la mayoría de equipos actuales no deberían presentar mayores obstáculos.

Sin más preámbulos, estaría encantado de que lo prueben y sepan que, como es de costumbre en mis repositorios, estoy completamente abierto a sugerencias, críticas, contribuciones, issues y cualquier otro tipo de feedback, no hay reglas estrictas ni maneras específicas, creo firmemente que la diversidad estimula la creatividad. Para más información acerca de informes de problemas de seguridad o para dialogar sobre diferentes temas que consideren no deban ser de público conocimiento, los invito a consultar el archivo README.md y la información de seguridad en el sidebar del repositorio.

Antes de finalizar, los invito a observar los ejemplos de UI del software a fin de que puedan observar una vista previa del mismo. Añado enlaces y otra información útil en los comentarios a fin de evitar ser marcado como spam.