# Pyramid Launcher

Estado del desarollo: Nuestro objetivo es llegar al **PMV (Producto mínimo viable)**
![](https://img.srizan.dev/medalla-de-oro-mvp-sobre-fondo-blanco-ilustraciÃ³n-de-stock-vectorial.jpg)

[readme in english](README.md)

## Notas del desarrollo
Hay 3 formas en que Pyramid Launcher se comunica:
- Electron IPC
  - Cerrar la ventana (Barra de título personalizada)
  - Iniciar Minecraft
  - Cerrar Minecraft
  - Mostrar versiones de Minecraft
- Servidor de Websocket
  - Estado del proceso de Minecraft
- [`window.postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) (Se usa para cosas que no requieren intervención de Electron.)
  - Close Accounts modal (q es esto izan)

## Historial de cambios
![](https://i.imgur.com/SivJuGg.png)
