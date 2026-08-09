/* Imágenes de las mascotas (fotos reales, provistas para cada una de las
   10 emociones + cara neutral cuando existe) y silueta de cuerpo dibujada
   en código para la pantalla "¿dónde lo sentís?". */

const Mascots = {
  assetPath(species, mood) {
    return `assets/mascots/${species}-${mood}.png`;
  },

  /* Cara "guía" de la mascota: neutral si el set la tiene, si no la de
     alegría (que funciona bien como cara de reposo/contenta). */
  guideMood(species, mood = 'idle') {
    const sp = getMascotSpecies(species) || MASCOT_SPECIES[0];
    const file = mood === 'happy' || !sp.hasNeutral ? 'alegria' : 'neutral';
    const cls = mood === 'talking' ? 'mascot-bounce' : '';
    return `<img class="mascot ${cls}" src="${this.assetPath(sp.id, file)}" alt="${sp.name}" />`;
  },

  /* Foto de la mascota elegida mostrando una emoción puntual (pantalla de selección). */
  moodPhoto(species, moodId, altLabel) {
    return `<img class="emotion-face" src="${this.assetPath(species, moodId)}" alt="${altLabel || moodId}" />`;
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
