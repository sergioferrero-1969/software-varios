# Mis Emociones

App para iPad (o cualquier navegador) que ayuda a niños de 6 a 12 años a
reconocer y expresar sus emociones, pensada para uso en consultorio de
psicología infantil.

No requiere instalación, servidor, ni conexión a internet: es HTML, CSS y
JavaScript puro. Todos los datos se guardan **en el propio dispositivo**
(localStorage del navegador) — nada se envía a internet.

## Cómo usarla en el iPad

**Opción recomendada — como "app" en la pantalla de inicio:**

1. Subí la carpeta `emociones-app` a algún hosting estático gratuito
   (por ejemplo [GitHub Pages](https://pages.github.com/), Netlify o
   Vercel). Al ser archivos estáticos, cualquiera de estos sirve.
2. Abrí esa URL en Safari en el iPad.
3. Tocá el botón de compartir → **"Agregar a pantalla de inicio"**.
4. A partir de ahí, el ícono abre la app a pantalla completa, sin las
   barras de Safari, como si fuera nativa.

**Opción simple para probarla ya:** abrir `index.html` directamente con
Safari (arrastrando la carpeta a la app Archivos del iPad y tocando el
archivo) o sirviéndola con cualquier servidor local (`python3 -m
http.server` desde una computadora en la misma red, y abriendo esa
dirección desde el iPad).

> **Importante:** los datos quedan guardados en el navegador de *ese*
> iPad específico. Si se borra el historial/datos de Safari, se pierde
> la información. Se recomienda exportar los reportes a Word
> periódicamente como respaldo.

## Uso general

- Al abrir la app, tocar **"Ingresar"** y cargar el PIN de modo
  profesional (**PIN inicial: `1234`**, se puede cambiar desde
  "⚙️ Ajustes" en la lista de pacientes).
- Desde "Modo profesional" se cargan fichas de pacientes (nombre, edad,
  sexo, escolaridad, historia breve, autorización familiar).
- Al tocar **"Iniciar sesión con [nombre]"**, la app pasa a "Modo niño":
  el chico elige una mascota (perro o gato), y esta lo va guiando por
  las emociones, la intensidad, dónde la siente en el cuerpo, qué la
  disparó, qué pensó y qué hizo o le ayudaría.
- Al terminar, el registro queda guardado en el historial del paciente y
  la app vuelve a pedir el PIN (para que el chico no pueda ver los datos
  de otros pacientes).
- Desde la ficha del paciente se puede generar un **reporte narrativo**
  (texto armado automáticamente a partir de las respuestas) y
  **descargarlo como archivo Word (.doc)**, editable, para preparar el
  material que se comparte con la familia.

## Estructura del proyecto

```
emociones-app/
  index.html          punto de entrada
  css/styles.css       estilos (tema profesional + tema para niños)
  js/data.js           emociones, partes del cuerpo, opciones de preguntas
  js/mascots.js        ilustraciones SVG (perro, gato, caritas de emociones, mapa corporal)
  js/storage.js        persistencia en localStorage
  js/report.js         generador del relato narrativo (plantillas locales, sin IA externa)
  js/wordExport.js     exportación a .doc
  js/screens.js        pantallas y su lógica
  js/app.js            controlador / máquina de estados
```

Los textos de preguntas y opciones están todos en `js/data.js`, pensado
para que se puedan ajustar fácil sin tocar el resto del código.

## Ideas para más adelante

- Editar el texto del relato directamente en la app antes de exportarlo.
- Filtros de historial por fecha / emoción.
- Gráficos de evolución emocional por paciente.
- Exportar/importar todos los datos (para pasar de un iPad a otro o
  hacer backup).
- Reemplazar las mascotas SVG por ilustraciones generadas con IA, si se
  prefiere ese estilo visual.
