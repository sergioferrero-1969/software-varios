/* Controlador principal: máquina de estados simple que dibuja pantallas
   dentro de #app. Sin frameworks, para poder correr como HTML suelto. */

const App = (() => {
  const root = () => document.getElementById('app');

  const state = {
    screen: 'welcome',
    session: null, // { patientId, mascot, answers: {...} }
    lastEditedPatientId: null,
    reportFilterEmotion: 'all',
  };

  function showFatalError(err) {
    console.error(err);
    const msg = (err && err.message) || String(err);
    root().innerHTML = `
      <div class="screen" style="align-items:center;text-align:center;justify-content:center;">
        <h2>Ups, algo salió mal</h2>
        <p>Se produjo un error técnico. Mandale este mensaje a quien te dio la app:</p>
        <pre style="background:#fff;border-radius:12px;padding:14px;white-space:pre-wrap;text-align:left;max-width:600px;">${msg}</pre>
        <button class="btn btn-primary" onclick="location.reload()">Reintentar</button>
      </div>`;
  }

  function checkStorageAvailable() {
    try {
      const k = '__emotia_test__';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  function go(screen, extra = {}) {
    try {
      Object.assign(state, extra);
      state.screen = screen;
      render();
      window.scrollTo(0, 0);
    } catch (err) {
      showFatalError(err);
    }
  }

  function render() {
    if (!checkStorageAvailable()) {
      root().innerHTML = `
        <div class="screen" style="align-items:center;text-align:center;justify-content:center;">
          <h2>Este navegador no permite guardar datos</h2>
          <p>La app necesita "almacenamiento local" (localStorage) para guardar pacientes y registros,
          y este navegador/modo lo está bloqueando (pasa a veces al abrir el archivo directamente,
          en modo incógnito, o dentro de otra app).</p>
          <p><b>Solución recomendada:</b> subí la carpeta a un hosting simple (GitHub Pages, Netlify)
          y abrí esa dirección con https:// en Chrome o Safari normal, en vez de abrir el archivo local.</p>
        </div>`;
      return;
    }
    const screens = {
      welcome: Screens.welcome,
      pin: Screens.pin,
      patientList: Screens.patientList,
      patientForm: Screens.patientForm,
      patientDetail: Screens.patientDetail,
      reportPreview: Screens.reportPreview,
      childMascotSelect: Screens.childMascotSelect,
      childEmotion: Screens.childEmotion,
      childIntensity: Screens.childIntensity,
      childBody: Screens.childBody,
      childTrigger: Screens.childTrigger,
      childThought: Screens.childThought,
      childCoping: Screens.childCoping,
      childFreeText: Screens.childFreeText,
      childThanks: Screens.childThanks,
    };
    const fn = screens[state.screen] || Screens.welcome;
    document.body.className = state.screen.startsWith('child') ? 'theme-child' :
      (state.screen === 'welcome' || state.screen === 'pin') ? 'theme-neutral' : 'theme-pro';
    root().innerHTML = fn(state);
    wireScreen(state.screen);
  }

  function wireScreen(screen) {
    try {
      if (Screens.wire && Screens.wire[screen]) {
        Screens.wire[screen](state, { go, saveAnswerAndNext });
      }
    } catch (err) {
      showFatalError(err);
    }
  }

  function startSession(patientId) {
    const patient = Store.getPatient(patientId);
    state.session = {
      patientId,
      mascot: patient.mascotPref || null,
      answers: {},
    };
    if (!patient.mascotPref) {
      go('childMascotSelect');
    } else {
      go('childEmotion');
    }
  }

  function saveAnswerAndNext(key, value, nextScreen) {
    if (!state.session) return;
    state.session.answers[key] = value;
    go(nextScreen);
  }

  function finishSession() {
    const { patientId, mascot, answers } = state.session;
    Store.addRecord({
      patientId,
      emotion: answers.emotion,
      intensity: answers.intensity,
      bodyPart: answers.bodyPart,
      trigger: answers.trigger,
      triggerText: answers.triggerText || '',
      thought: answers.thought,
      thoughtText: answers.thoughtText || '',
      coping: answers.coping,
      copingText: answers.copingText || '',
      freeText: answers.freeText || '',
    });
    if (mascot) {
      const patient = Store.getPatient(patientId);
      if (patient && !patient.mascotPref) {
        patient.mascotPref = mascot;
        Store.savePatient(patient);
      }
    }
    state.session = null;
    go('welcome');
  }

  document.addEventListener('DOMContentLoaded', () => {
    try {
      render();
    } catch (err) {
      showFatalError(err);
    }
  });

  window.addEventListener('error', (e) => showFatalError(e.error || e.message));

  return { go, startSession, saveAnswerAndNext, finishSession, state, showFatalError };
})();
