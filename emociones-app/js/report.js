/* Generador de relatos narrativos a partir de los registros.
   No usa IA en la nube: arma un texto clínico variado combinando
   bancos de frases, 100% local y editable después por la psicóloga. */

const Report = (() => {
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function pick(arr, seed) {
    return arr[hash(seed) % arr.length];
  }

  function pronoun(sex) {
    if (sex === 'M') return { suj: 'él', art: 'el', o: 'o' };
    if (sex === 'F') return { suj: 'ella', art: 'la', o: 'a' };
    return { suj: 'elle', art: 'le', o: 'e' };
  }

  const OPENERS = [
    'En esta sesión, {name} llegó expresando {emotionArt} {emotion}.',
    '{name} comenzó el registro identificando que sentía {emotion}.',
    'Durante el encuentro, {name} reconoció sentir {emotion}.',
  ];

  const INTENSITY_PHRASES = {
    1: ['con una intensidad baja, algo leve.', 'de forma muy suave.'],
    2: ['con una intensidad moderada-baja.', 'de manera todavía manejable.'],
    3: ['con una intensidad considerable.', 'de forma bastante marcada.'],
    4: ['con una intensidad alta.', 'de manera intensa.'],
    5: ['con una intensidad muy alta, la máxima de la escala propuesta.', 'de forma abrumadora.'],
  };

  const BODY_PHRASES = {
    cabeza: ['Ubicó la sensación en la cabeza.', 'Refirió percibirla principalmente en la cabeza.'],
    pecho: ['Localizó la emoción en el pecho, cerca del corazón.', 'La sintió en el pecho.'],
    panza: ['Dijo sentirla en la panza.', 'Ubicó la sensación en el estómago.'],
    manos: ['Refirió sentirla en las manos y los brazos.', 'La localizó en manos y brazos.'],
    piernas: ['La ubicó en las piernas.', 'Dijo sentirla en las piernas.'],
    todo: ['Expresó sentirla en todo el cuerpo.', 'Refirió una sensación corporal generalizada.'],
  };

  const TRIGGER_PHRASES = {
    familia: ['Situó el desencadenante en el ámbito familiar.', 'Relacionó lo sucedido con una situación familiar.'],
    escuela: ['Vinculó lo sucedido con el ámbito escolar.', 'Ubicó el disparador en la escuela.'],
    amigos: ['Relacionó la emoción con una situación con amigos/as.', 'Lo vinculó a un intercambio con pares.'],
    solo: ['Señaló que estaba solo/a en ese momento.', 'Refirió encontrarse en soledad cuando surgió la emoción.'],
    no_se: ['No pudo identificar con claridad qué lo/la disparó.', 'No logró reconocer un disparador puntual.'],
    otro: ['Describió una situación particular como disparador: "{triggerText}".'],
  };

  const THOUGHT_PHRASES = {
    default: ['El pensamiento asociado fue: "{thoughtLabel}".', 'Refirió haber pensado que {thoughtLabel_lower}.'],
    nada: ['No identificó un pensamiento asociado; refirió únicamente la sensación.'],
    otro: ['Compartió un pensamiento propio: "{thoughtText}".'],
  };

  const COPING_PHRASES = {
    respirar: ['Como estrategia, utilizó la respiración profunda.'],
    hablar: ['Buscó hablar con alguien para sentirse mejor.'],
    abrazar: ['Recurrió a un abrazo (a una persona o a un objeto) como forma de contención.'],
    jugar: ['Se distrajo jugando o dibujando.'],
    llorar: ['Expresó la emoción a través del llanto.'],
    quieto: ['Optó por quedarse quieto/a un momento.'],
    nada_ayudo: ['Al momento del registro, aún no había implementado ninguna estrategia.'],
    otro: ['Mencionó una estrategia propia: "{copingText}".'],
  };

  const CLOSERS = [
    'Este registro se incorpora al seguimiento emocional de {name}.',
    'La información quedó registrada para el seguimiento longitudinal de {name}.',
    'Se sugiere retomar esta situación en la próxima sesión con {name}.',
  ];

  function fill(str, vars) {
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
  }

  function generateNarrative(patient, record) {
    const emotion = getEmotion(record.emotion);
    const p = pronoun(patient.sex);
    const vars = {
      name: patient.name,
      emotion: emotion.label.toLowerCase(),
      emotionArt: emotion.gender === 'f' ? 'una' : 'un',
      triggerText: record.triggerText || '',
      thoughtText: record.thoughtText || '',
      copingText: record.copingText || '',
    };

    const parts = [];
    parts.push(fill(pick(OPENERS, record.id + 'o'), vars));

    const intensityLine = pick(INTENSITY_PHRASES[record.intensity] || INTENSITY_PHRASES[3], record.id + 'i');
    parts[0] = parts[0].replace(/\.$/, ',') + ' ' + intensityLine;

    parts.push(pick(BODY_PHRASES[record.bodyPart] || [], record.id + 'b'));

    const triggerBank = TRIGGER_PHRASES[record.trigger] || [];
    parts.push(fill(pick(triggerBank, record.id + 't'), vars));

    let thoughtLine;
    if (record.thought === 'otro') {
      thoughtLine = fill(pick(THOUGHT_PHRASES.otro, record.id + 'th'), vars);
    } else if (record.thought === 'nada') {
      thoughtLine = pick(THOUGHT_PHRASES.nada, record.id + 'th');
    } else {
      const opt = (emotion.thoughts || []).find((t) => t.id === record.thought);
      const label = opt ? opt.label : '';
      thoughtLine = fill(pick(THOUGHT_PHRASES.default, record.id + 'th'), {
        thoughtLabel: label,
        thoughtLabel_lower: label.toLowerCase(),
      });
    }
    parts.push(thoughtLine);

    const copingBank = COPINGS && record.coping === 'otro' ? COPING_PHRASES.otro : COPING_PHRASES[record.coping];
    parts.push(fill(pick(copingBank || [], record.id + 'c'), vars));

    if (record.freeText) {
      parts.push(`Además, agregó espontáneamente: "${record.freeText}".`);
    }

    parts.push(fill(pick(CLOSERS, record.id + 'z'), vars));

    return parts.filter(Boolean).join(' ');
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  return { generateNarrative, formatDate, pronoun };
})();
