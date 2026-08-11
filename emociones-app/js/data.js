/* Datos de configuración de la app: emociones, partes del cuerpo,
   disparadores y estrategias. Pensado para que una psicóloga pueda
   editar textos y opciones sin tocar el resto del código. */

const EMOTIONS = [
  {
    id: 'alegria',
    label: 'Alegría',
    gender: 'f',
    color: '#FFC93C',
    dark: '#C98B00',
    thoughts: [
      { id: 'genial', label: 'Que todo está genial' },
      { id: 'orgulloso', label: 'Que hice algo bien' },
      { id: 'querido', label: 'Que alguien me quiere mucho' },
      { id: 'nada', label: 'No pensé nada en especial, ¡solo la sentí!' },
    ],
  },
  {
    id: 'tristeza',
    label: 'Tristeza',
    gender: 'f',
    color: '#4C9AFF',
    dark: '#1F5FBF',
    thoughts: [
      { id: 'solo', label: 'Que estoy solo/a' },
      { id: 'perdi', label: 'Que perdí algo importante' },
      { id: 'nadie_entiende', label: 'Que nadie me entiende' },
      { id: 'nada', label: 'No pensé nada, solo me sentí triste' },
    ],
  },
  {
    id: 'enojo',
    label: 'Enojo',
    gender: 'm',
    color: '#FF5C5C',
    dark: '#B72A2A',
    thoughts: [
      { id: 'injusto', label: 'Que fue injusto' },
      { id: 'no_escuchan', label: 'Que no me escuchan' },
      { id: 'no_quiero', label: 'Que no quiero hacer algo' },
      { id: 'nada', label: 'No pensé nada, solo exploté' },
    ],
  },
  {
    id: 'miedo',
    label: 'Miedo',
    gender: 'm',
    color: '#9B7EDE',
    dark: '#5B3FA0',
    thoughts: [
      { id: 'algo_malo', label: 'Que iba a pasar algo malo' },
      { id: 'me_lastimo', label: 'Que me podía lastimar' },
      { id: 'quedar_solo', label: 'Que me iban a dejar solo/a' },
      { id: 'nada', label: 'No pensé nada, solo tuve miedo' },
    ],
  },
  {
    id: 'sorpresa',
    label: 'Sorpresa',
    gender: 'f',
    color: '#FF9F45',
    dark: '#C4600A',
    thoughts: [
      { id: 'no_esperaba', label: 'Que no me lo esperaba para nada' },
      { id: 'raro', label: 'Que fue algo raro' },
      { id: 'lindo', label: 'Que fue una sorpresa linda' },
      { id: 'nada', label: 'No pensé nada, ¡me quedé helado/a!' },
    ],
  },
  {
    id: 'asco',
    label: 'Rechazo / Asco',
    gender: 'm',
    color: '#7BC96F',
    dark: '#3C7A32',
    thoughts: [
      { id: 'feo', label: 'Que algo estaba feo o mal' },
      { id: 'no_quiero_cerca', label: 'Que no quería eso cerca mío' },
      { id: 'raro', label: 'Que algo se sentía muy raro' },
      { id: 'nada', label: 'No pensé nada, solo lo sentí' },
    ],
  },
  {
    id: 'verguenza',
    label: 'Vergüenza',
    gender: 'f',
    color: '#F49AC2',
    dark: '#B84A78',
    thoughts: [
      { id: 'todos_mirando', label: 'Que todos me estaban mirando' },
      { id: 'hice_ridiculo', label: 'Que hice el ridículo' },
      { id: 'quiero_esconderme', label: 'Que quería esconderme' },
      { id: 'nada', label: 'No pensé nada, solo me dio vergüenza' },
    ],
  },
  {
    id: 'ansiedad',
    label: 'Ansiedad',
    gender: 'f',
    color: '#E0A93E',
    dark: '#8C6A1B',
    thoughts: [
      { id: 'algo_va_a_pasar', label: 'Que algo malo iba a pasar' },
      { id: 'no_puedo_esperar', label: 'Que no podía esperar más' },
      { id: 'demasiadas_cosas', label: 'Que tenía demasiadas cosas en la cabeza' },
      { id: 'nada', label: 'No pensé nada en especial, solo me sentí inquieto/a' },
    ],
  },
  {
    id: 'envidia',
    label: 'Envidia',
    gender: 'f',
    color: '#6FBF8B',
    dark: '#2E7A4F',
    thoughts: [
      { id: 'quiero_lo_mismo', label: 'Que yo también quería eso' },
      { id: 'no_es_justo', label: 'Que no es justo que lo tenga otro/a' },
      { id: 'quiero_ser_como', label: 'Que quiero ser como esa persona' },
      { id: 'nada', label: 'No pensé nada, solo lo sentí' },
    ],
  },
  {
    id: 'timidez',
    label: 'Timidez',
    gender: 'f',
    color: '#C9A6E0',
    dark: '#7A4FA0',
    thoughts: [
      { id: 'me_van_a_mirar', label: 'Que me iban a mirar' },
      { id: 'no_se_que_decir', label: 'Que no iba a saber qué decir' },
      { id: 'mejor_no_hablar', label: 'Que era mejor quedarme calladito/a' },
      { id: 'nada', label: 'No pensé nada, solo me dio timidez' },
    ],
  },
];

const MASCOT_SPECIES = [
  { id: 'dog', name: 'Firulais', emoji: '🐶', hasNeutral: true },
  { id: 'cat', name: 'Michi', emoji: '🐱', hasNeutral: false },
  { id: 'bear', name: 'Osín', emoji: '🐻', hasNeutral: true },
  { id: 'rabbit', name: 'Coni', emoji: '🐰', hasNeutral: false },
];

function getMascotSpecies(id) {
  return MASCOT_SPECIES.find((m) => m.id === id);
}

/* Actividades de calma (HTML autónomo, embebido en iframe) por emoción.
   Las que no están acá simplemente no muestran este paso extra. */
const ACTIVITIES = {
  enojo: 'activities/enojo.html',
  miedo: 'activities/miedo.html',
  tristeza: 'activities/tristeza.html',
  envidia: 'activities/envidia.html',
  alegria: 'activities/alegria.html',
  asco: 'activities/asco.html',
};

function getActivity(emotionId) {
  return ACTIVITIES[emotionId] || null;
}

const TRIGGERS = [
  { id: 'familia', label: 'Con mi familia', icon: '🏠' },
  { id: 'escuela', label: 'En la escuela', icon: '🎒' },
  { id: 'amigos', label: 'Con mis amigos/as', icon: '🧑‍🤝‍🧑' },
  { id: 'solo', label: 'Estaba solo/a', icon: '🌙' },
  { id: 'no_se', label: 'No lo sé', icon: '🤷' },
  { id: 'otro', label: 'Otra cosa...', icon: '✏️' },
];

const COPINGS = [
  { id: 'respirar', label: 'Respiré profundo', icon: '🌬️' },
  { id: 'hablar', label: 'Hablé con alguien', icon: '💬' },
  { id: 'abrazar', label: 'Abracé a alguien o algo', icon: '🤗' },
  { id: 'jugar', label: 'Jugué o me distraje', icon: '🎨' },
  { id: 'llorar', label: 'Lloré', icon: '💧' },
  { id: 'quieto', label: 'Me quedé quieto/a', icon: '🧘' },
  { id: 'nada_ayudo', label: 'Nada de esto pasó todavía', icon: '⏳' },
  { id: 'otro', label: 'Otra cosa...', icon: '✏️' },
];

const INTENSITY_LEVELS = [
  { value: 1, label: 'Poquito' },
  { value: 2, label: 'Un poco' },
  { value: 3, label: 'Bastante' },
  { value: 4, label: 'Mucho' },
  { value: 5, label: 'Muchísimo' },
];

function getEmotion(id) {
  return EMOTIONS.find((e) => e.id === id);
}
