/* Ilustraciones vectoriales (SVG) de las mascotas y de las caritas de
   emociones. Todo dibujado en código: no depende de imágenes externas,
   así que funciona 100% offline en el iPad. */

const Mascots = {
  dog(mood = 'idle') {
    return `
    <svg viewBox="0 0 200 200" class="mascot mascot-dog mood-${mood}" xmlns="http://www.w3.org/2000/svg" aria-label="Perro">
      <ellipse cx="60" cy="70" rx="26" ry="34" fill="#C8894F" transform="rotate(-18 60 70)"/>
      <ellipse cx="140" cy="70" rx="26" ry="34" fill="#C8894F" transform="rotate(18 140 70)"/>
      <circle cx="100" cy="105" r="72" fill="#E9B475"/>
      <ellipse cx="100" cy="130" rx="34" ry="26" fill="#FBEBD5"/>
      <g class="eyes">
        <circle cx="76" cy="95" r="11" fill="#3A2A1E"/>
        <circle cx="124" cy="95" r="11" fill="#3A2A1E"/>
        <circle cx="79" cy="91" r="3.5" fill="#fff"/>
        <circle cx="127" cy="91" r="3.5" fill="#fff"/>
      </g>
      <ellipse cx="100" cy="118" rx="10" ry="8" fill="#3A2A1E"/>
      <path class="mouth mouth-closed" d="M100 126 Q100 138 84 136 M100 126 Q100 138 116 136" stroke="#3A2A1E" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path class="mouth mouth-open" d="M84 128 Q100 150 116 128 Q100 138 84 128 Z" fill="#8B4B3B" style="display:none"/>
      <ellipse class="tongue" cx="100" cy="140" rx="7" ry="10" fill="#F08080" style="display:none"/>
      <circle cx="72" cy="112" r="7" fill="#F3A6A6" opacity="0.6"/>
      <circle cx="128" cy="112" r="7" fill="#F3A6A6" opacity="0.6"/>
    </svg>`;
  },

  cat(mood = 'idle') {
    return `
    <svg viewBox="0 0 200 200" class="mascot mascot-cat mood-${mood}" xmlns="http://www.w3.org/2000/svg" aria-label="Gato">
      <path d="M45 70 L65 20 L85 68 Z" fill="#B7B7C6"/>
      <path d="M155 70 L135 20 L115 68 Z" fill="#B7B7C6"/>
      <path d="M52 66 L66 34 L78 65 Z" fill="#F4C7D6"/>
      <path d="M148 66 L134 34 L122 65 Z" fill="#F4C7D6"/>
      <circle cx="100" cy="108" r="70" fill="#D6D6E4"/>
      <g class="eyes">
        <ellipse cx="78" cy="100" rx="10" ry="12" fill="#3A2A1E"/>
        <ellipse cx="122" cy="100" rx="10" ry="12" fill="#3A2A1E"/>
        <circle cx="81" cy="95" r="3" fill="#fff"/>
        <circle cx="125" cy="95" r="3" fill="#fff"/>
      </g>
      <path d="M100 112 L94 122 L106 122 Z" fill="#E38FA0"/>
      <path class="mouth mouth-closed" d="M100 122 Q92 132 82 126 M100 122 Q108 132 118 126" stroke="#3A2A1E" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path class="mouth mouth-open" d="M84 124 Q100 144 116 124 Q100 132 84 124 Z" fill="#8B4B3B" style="display:none"/>
      <g class="whiskers" stroke="#8C8C9E" stroke-width="2.5" stroke-linecap="round">
        <path d="M40 108 L10 102 M40 116 L8 116 M40 124 L10 130"/>
        <path d="M160 108 L190 102 M160 116 L192 116 M160 124 L190 130"/>
      </g>
    </svg>`;
  },

  bySpecies(species, mood = 'idle') {
    return species === 'cat' ? Mascots.cat(mood) : Mascots.dog(mood);
  },

  /* Carita de emoción para la pantalla de selección. */
  emotionFace(emotion) {
    const { color, dark, face } = emotion;
    const eyesMap = {
      happy: `<path d="M62 90 Q72 76 82 90" stroke="${dark}" stroke-width="6" fill="none" stroke-linecap="round"/>
              <path d="M118 90 Q128 76 138 90" stroke="${dark}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      sad: `<circle cx="72" cy="92" r="9" fill="${dark}"/><circle cx="128" cy="92" r="9" fill="${dark}"/>
            <path d="M58 78 Q72 70 84 80" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M142 78 Q128 70 116 80" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      angry: `<circle cx="72" cy="94" r="8" fill="${dark}"/><circle cx="128" cy="94" r="8" fill="${dark}"/>
              <path d="M56 76 L86 88" stroke="${dark}" stroke-width="6" stroke-linecap="round"/>
              <path d="M144 76 L114 88" stroke="${dark}" stroke-width="6" stroke-linecap="round"/>`,
      scared: `<circle cx="72" cy="92" r="12" fill="#fff" stroke="${dark}" stroke-width="3"/>
               <circle cx="128" cy="92" r="12" fill="#fff" stroke="${dark}" stroke-width="3"/>
               <circle cx="72" cy="92" r="5" fill="${dark}"/><circle cx="128" cy="92" r="5" fill="${dark}"/>
               <path d="M58 74 Q72 64 82 74" stroke="${dark}" stroke-width="4" fill="none" stroke-linecap="round"/>
               <path d="M142 74 Q128 64 118 74" stroke="${dark}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      wide: `<circle cx="72" cy="92" r="13" fill="#fff" stroke="${dark}" stroke-width="3"/>
             <circle cx="128" cy="92" r="13" fill="#fff" stroke="${dark}" stroke-width="3"/>
             <circle cx="72" cy="92" r="6" fill="${dark}"/><circle cx="128" cy="92" r="6" fill="${dark}"/>`,
      squint: `<path d="M62 92 Q72 84 82 92" stroke="${dark}" stroke-width="6" fill="none" stroke-linecap="round"/>
               <path d="M118 92 Q128 84 138 92" stroke="${dark}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    };
    const mouthMap = {
      'smile-big': `<path d="M70 118 Q100 148 130 118 Q100 132 70 118 Z" fill="${dark}"/>`,
      frown: `<path d="M74 132 Q100 112 126 132" stroke="${dark}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      grit: `<rect x="76" y="120" width="48" height="12" rx="3" fill="${dark}"/>`,
      'o-small': `<circle cx="100" cy="124" r="8" fill="${dark}"/>`,
      'o-big': `<circle cx="100" cy="126" r="16" fill="${dark}"/>`,
      zigzag: `<path d="M72 122 L88 132 L104 118 L120 132 L136 122" stroke="${dark}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    };
    const extraMap = {
      cheeks: `<circle cx="60" cy="112" r="9" fill="#fff" opacity="0.5"/><circle cx="140" cy="112" r="9" fill="#fff" opacity="0.5"/>`,
      tear: `<path d="M136 100 Q142 112 136 120 Q130 112 136 100 Z" fill="#4C9AFF"/>`,
      sweat: `<path d="M148 76 Q154 86 148 94 Q142 86 148 76 Z" fill="#9BD3F0"/>`,
    };
    return `
    <svg viewBox="0 0 200 200" class="emotion-face" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="105" r="88" fill="${color}"/>
      ${eyesMap[face.eyes] || ''}
      ${mouthMap[face.mouth] || ''}
      ${face.extra ? extraMap[face.extra] || '' : ''}
    </svg>`;
  },

  /* Silueta simple de cuerpo para la pantalla "¿dónde lo sentís?" */
  bodyMap(selected) {
    const sel = (part) => (selected === part ? 'selected' : '');
    return `
    <svg viewBox="0 0 220 320" class="body-map" xmlns="http://www.w3.org/2000/svg">
      <circle class="zone ${sel('cabeza')}" data-part="cabeza" cx="110" cy="45" r="38"/>
      <rect class="zone ${sel('pecho')}" data-part="pecho" x="72" y="90" width="76" height="55" rx="18"/>
      <rect class="zone ${sel('panza')}" data-part="panza" x="76" y="150" width="68" height="55" rx="18"/>
      <rect class="zone ${sel('manos')}" data-part="manos" x="10" y="95" width="50" height="110" rx="22"/>
      <rect class="zone ${sel('manos')}" data-part="manos" x="160" y="95" width="50" height="110" rx="22"/>
      <rect class="zone ${sel('piernas')}" data-part="piernas" x="78" y="210" width="26" height="100" rx="13"/>
      <rect class="zone ${sel('piernas')}" data-part="piernas" x="116" y="210" width="26" height="100" rx="13"/>
    </svg>`;
  },
};
