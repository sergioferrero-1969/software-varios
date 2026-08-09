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
    face: { eyes: 'happy', mouth: 'smile-big', extra: 'cheeks' },
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
    face: { eyes: 'sad', mouth: 'frown', extra: 'tear' },
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
    face: { eyes: 'angry', mouth: 'grit', extra: null },
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
    face: { eyes: 'scared', mouth: 'o-small', extra: 'sweat' },
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
    face: { eyes: 'wide', mouth: 'o-big', extra: null },
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
    face: { eyes: 'squint', mouth: 'zigzag', extra: null },
    thoughts: [
      { id: 'feo', label: 'Que algo estaba feo o mal' },
      { id: 'no_quiero_cerca', label: 'Que no quería eso cerca mío' },
      { id: 'raro', label: 'Que algo se sentía muy raro' },
      { id: 'nada', label: 'No pensé nada, solo lo sentí' },
    ],
  },
];

const BODY_PARTS = [
  { id: 'cabeza', label: 'Cabeza' },
  { id: 'pecho', label: 'Pecho / Corazón' },
  { id: 'panza', label: 'Panza' },
  { id: 'manos', label: 'Manos / Brazos' },
  { id: 'piernas', label: 'Piernas' },
  { id: 'todo', label: 'Todo el cuerpo' },
];

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
