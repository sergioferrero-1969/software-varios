/* Definición de todas las pantallas (HTML) y su "cableado" de eventos.
   Screens.<nombre>(state) -> string HTML
   Screens.wire.<nombre>(state, {go, saveAnswerAndNext}) -> agrega listeners */

const Screens = {};
Screens.wire = {};

/* ---------- Bienvenida ---------- */
Screens.welcome = () => `
  <div class="screen screen-welcome">
    <div class="mascot-duo">${MASCOT_SPECIES.map((s) => Mascots.guideMood(s.id, 'idle')).join('')}</div>
    <h1>Mis Emociones</h1>
    <p class="subtitle">Un espacio para hablar de cómo nos sentimos</p>
    <button class="btn btn-primary btn-lg" id="btn-enter">Ingresar</button>
  </div>`;
Screens.wire.welcome = (state, { go }) => {
  document.getElementById('btn-enter').onclick = () => go('pin');
};

/* ---------- PIN profesional ---------- */
Screens.pin = () => {
  const settings = Store.getSettings();
  const hint = settings.pin === '1234' ? '<p class="hint">PIN inicial: 1234 (podés cambiarlo en Ajustes)</p>' : '';
  return `
  <div class="screen screen-pin">
    <h2>Modo profesional</h2>
    <p>Ingresá el PIN para ver los pacientes</p>
    <input type="password" inputmode="numeric" maxlength="8" id="pin-input" class="pin-input" autofocus />
    <div id="pin-error" class="error"></div>
    ${hint}
    <div class="row">
      <button class="btn" id="btn-back">Volver</button>
      <button class="btn btn-primary" id="btn-submit-pin">Entrar</button>
    </div>
  </div>`;
};
Screens.wire.pin = (state, { go }) => {
  const input = document.getElementById('pin-input');
  const tryEnter = () => {
    const settings = Store.getSettings();
    if (input.value === settings.pin) {
      go('patientList');
    } else {
      document.getElementById('pin-error').textContent = 'PIN incorrecto';
    }
  };
  document.getElementById('btn-submit-pin').onclick = tryEnter;
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryEnter(); });
  document.getElementById('btn-back').onclick = () => go('welcome');
};

/* ---------- Lista de pacientes ---------- */
Screens.patientList = () => {
  const patients = Store.getPatients().sort((a, b) => a.name.localeCompare(b.name));
  const items = patients.map((p) => {
    const mascot = p.mascotPref ? getMascotSpecies(p.mascotPref) : null;
    return `
    <div class="patient-card" data-id="${p.id}">
      <div class="patient-card-info">
        <strong>${p.name}</strong>
        <span>${p.age ? p.age + ' años' : ''} ${mascot ? '· ' + mascot.emoji : ''}</span>
      </div>
      <button class="btn btn-sm view-patient" data-id="${p.id}">Ver ficha</button>
    </div>`;
  }).join('') || '<p class="empty">Todavía no hay pacientes cargados.</p>';

  return `
  <div class="screen screen-pro">
    <div class="pro-header">
      <h2>Pacientes</h2>
      <div class="row">
        <button class="btn btn-sm" id="btn-settings">⚙️ Ajustes</button>
        <button class="btn btn-sm" id="btn-logout">Salir</button>
      </div>
    </div>
    <button class="btn btn-primary" id="btn-new-patient">+ Nuevo paciente</button>
    <div class="patient-list">${items}</div>
  </div>`;
};
Screens.wire.patientList = (state, { go }) => {
  document.getElementById('btn-new-patient').onclick = () => go('patientForm', { editId: null });
  document.getElementById('btn-logout').onclick = () => go('welcome');
  document.getElementById('btn-settings').onclick = () => {
    const settings = Store.getSettings();
    const nuevo = prompt('Nuevo PIN (4 a 8 dígitos):', settings.pin);
    if (nuevo && /^\d{4,8}$/.test(nuevo)) {
      Store.saveSettings({ pin: nuevo });
      alert('PIN actualizado');
    } else if (nuevo !== null) {
      alert('El PIN debe tener entre 4 y 8 números.');
    }
  };
  document.querySelectorAll('.view-patient').forEach((btn) => {
    btn.onclick = () => go('patientDetail', { detailId: btn.dataset.id });
  });
};

/* ---------- Formulario de paciente ---------- */
Screens.patientForm = (state) => {
  const p = state.editId ? Store.getPatient(state.editId) : null;
  const today = new Date().toISOString().slice(0, 10);
  return `
  <div class="screen screen-pro">
    <h2>${p ? 'Editar paciente' : 'Nuevo paciente'}</h2>
    <form id="patient-form" class="form">
      <label>Nombre completo
        <input type="text" name="name" required value="${p ? p.name : ''}" />
      </label>
      <div class="form-row">
        <label>Edad
          <input type="number" name="age" min="0" max="18" value="${p ? p.age : ''}" />
        </label>
        <label>Sexo
          <select name="sex">
            <option value="">-</option>
            <option value="F" ${p && p.sex === 'F' ? 'selected' : ''}>Femenino</option>
            <option value="M" ${p && p.sex === 'M' ? 'selected' : ''}>Masculino</option>
            <option value="X" ${p && p.sex === 'X' ? 'selected' : ''}>Otro / prefiere no decir</option>
          </select>
        </label>
      </div>
      <label>Escolaridad
        <input type="text" name="schooling" placeholder="Ej: 4to grado" value="${p ? p.schooling || '' : ''}" />
      </label>
      <label>Historia breve
        <textarea name="briefHistory" rows="4" placeholder="Motivo de consulta, contexto relevante...">${p ? p.briefHistory || '' : ''}</textarea>
      </label>
      <fieldset class="consent">
        <legend>Autorización familiar</legend>
        <label class="checkbox">
          <input type="checkbox" name="consentAccepted" ${p && p.consent && p.consent.accepted ? 'checked' : ''} />
          Autorizo el uso de la app y el registro de datos emocionales de mi hijo/a con fines terapéuticos.
        </label>
        <div class="form-row">
          <label>Nombre del adulto responsable
            <input type="text" name="guardianName" value="${p && p.consent ? p.consent.guardianName || '' : ''}" />
          </label>
          <label>Fecha
            <input type="date" name="consentDate" value="${p && p.consent ? p.consent.date || today : today}" />
          </label>
        </div>
      </fieldset>
      <div class="row">
        <button type="button" class="btn" id="btn-cancel">Cancelar</button>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </div>
    </form>
  </div>`;
};
Screens.wire.patientForm = (state, { go }) => {
  document.getElementById('btn-cancel').onclick = () => go('patientList');
  document.getElementById('patient-form').onsubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    const existing = state.editId ? Store.getPatient(state.editId) : {};
    const patient = {
      ...existing,
      id: state.editId || null,
      name: f.name.value.trim(),
      age: f.age.value ? Number(f.age.value) : null,
      sex: f.sex.value,
      schooling: f.schooling.value.trim(),
      briefHistory: f.briefHistory.value.trim(),
      mascotPref: existing.mascotPref || null,
      consent: {
        accepted: f.consentAccepted.checked,
        guardianName: f.guardianName.value.trim(),
        date: f.consentDate.value,
      },
    };
    if (!patient.name) { alert('El nombre es obligatorio'); return; }
    const saved = Store.savePatient(patient);
    go('patientDetail', { detailId: saved.id });
  };
};

/* ---------- Ficha del paciente ---------- */
Screens.patientDetail = (state) => {
  const patient = Store.getPatient(state.detailId);
  if (!patient) return `<div class="screen screen-pro"><p>Paciente no encontrado.</p></div>`;
  const records = Store.getRecords(patient.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const rows = records.map((r) => {
    const emotion = getEmotion(r.emotion);
    return `
    <details class="record-item">
      <summary>
        <span class="dot" style="background:${emotion.color}"></span>
        <strong>${emotion.label}</strong> (${r.intensity}/5)
        <span class="record-date">${Report.formatDate(r.timestamp)}</span>
      </summary>
      <p>${Report.generateNarrative(patient, r)}</p>
      <button class="btn btn-sm danger delete-record" data-id="${r.id}">Eliminar registro</button>
    </details>`;
  }).join('') || '<p class="empty">Todavía no hay registros de este paciente.</p>';

  return `
  <div class="screen screen-pro">
    <button class="btn btn-sm" id="btn-back">← Pacientes</button>
    <h2>${patient.name}</h2>
    <p class="muted">${patient.age ? patient.age + ' años · ' : ''}${patient.schooling || ''}</p>
    ${patient.briefHistory ? `<p><b>Historia breve:</b> ${patient.briefHistory}</p>` : ''}
    <p class="muted">Autorización familiar: ${patient.consent && patient.consent.accepted ? '✅ ' + (patient.consent.guardianName || '') : '⚠️ No registrada'}</p>
    <div class="row">
      <button class="btn" id="btn-edit-patient">Editar ficha</button>
      <button class="btn danger" id="btn-delete-patient">Eliminar paciente</button>
    </div>
    <button class="btn btn-primary btn-lg" id="btn-start-session">▶ Iniciar sesión con ${patient.name.split(' ')[0]}</button>
    <div class="pro-header">
      <h3>Historial (${records.length})</h3>
      <button class="btn btn-sm" id="btn-report">📄 Generar reporte</button>
    </div>
    <div class="record-list">${rows}</div>
  </div>`;
};
Screens.wire.patientDetail = (state, { go }) => {
  document.getElementById('btn-back').onclick = () => go('patientList');
  document.getElementById('btn-edit-patient').onclick = () => go('patientForm', { editId: state.detailId });
  document.getElementById('btn-delete-patient').onclick = () => {
    if (confirm('¿Eliminar este paciente y todo su historial? Esta acción no se puede deshacer.')) {
      Store.deletePatient(state.detailId);
      go('patientList');
    }
  };
  document.getElementById('btn-start-session').onclick = () => App.startSession(state.detailId);
  document.getElementById('btn-report').onclick = () => go('reportPreview', { detailId: state.detailId, reportFrom: null, reportTo: null });
  document.querySelectorAll('.delete-record').forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      if (confirm('¿Eliminar este registro?')) {
        Store.deleteRecord(btn.dataset.id);
        go('patientDetail', { detailId: state.detailId });
      }
    };
  });
};

/* ---------- Vista previa de reporte ---------- */
function filteredReportRecords(state) {
  const patient = Store.getPatient(state.detailId);
  let records = Store.getRecords(patient.id);
  if (state.reportFrom) {
    const from = new Date(state.reportFrom + 'T00:00:00');
    records = records.filter((r) => new Date(r.timestamp) >= from);
  }
  if (state.reportTo) {
    const to = new Date(state.reportTo + 'T23:59:59');
    records = records.filter((r) => new Date(r.timestamp) <= to);
  }
  return records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

Screens.reportPreview = (state) => {
  const patient = Store.getPatient(state.detailId);
  const allPatients = Store.getPatients().sort((a, b) => a.name.localeCompare(b.name));
  const records = filteredReportRecords(state);
  const text = records.map((r) => `${Report.formatDate(r.timestamp)} — ${getEmotion(r.emotion).label}\n${Report.generateNarrative(patient, r)}`).join('\n\n');
  const totalCount = Store.getRecords(patient.id).length;
  return `
  <div class="screen screen-pro">
    <button class="btn btn-sm" id="btn-back">← Ficha de ${patient.name}</button>
    <h2>Reporte</h2>
    <div class="form-row">
      <label>Paciente
        <select id="filter-patient">
          ${allPatients.map((p) => `<option value="${p.id}" ${p.id === patient.id ? 'selected' : ''}>${p.name}</option>`).join('')}
        </select>
      </label>
      <label>Desde
        <input type="date" id="filter-from" value="${state.reportFrom || ''}" />
      </label>
      <label>Hasta
        <input type="date" id="filter-to" value="${state.reportTo || ''}" />
      </label>
    </div>
    ${(state.reportFrom || state.reportTo) ? `<div class="row"><button class="btn btn-sm" id="btn-clear-filter">Quitar filtro de fecha</button></div>` : ''}
    <p class="muted">Mostrando ${records.length} de ${totalCount} registro(s). Revisá y editá el texto en Word antes de compartirlo con la familia.</p>
    <pre class="report-preview">${text || 'No hay registros para este filtro.'}</pre>
    <button class="btn btn-primary btn-lg" id="btn-export-word" ${records.length ? '' : 'disabled'}>⬇ Descargar como Word</button>
  </div>`;
};
Screens.wire.reportPreview = (state, { go }) => {
  document.getElementById('btn-back').onclick = () => go('patientDetail', { detailId: state.detailId });
  document.getElementById('filter-patient').onchange = (e) => go('reportPreview', { detailId: e.target.value });
  document.getElementById('filter-from').onchange = (e) => go('reportPreview', { reportFrom: e.target.value || null });
  document.getElementById('filter-to').onchange = (e) => go('reportPreview', { reportTo: e.target.value || null });
  const clearBtn = document.getElementById('btn-clear-filter');
  if (clearBtn) clearBtn.onclick = () => go('reportPreview', { reportFrom: null, reportTo: null });
  const exportBtn = document.getElementById('btn-export-word');
  if (exportBtn) {
    exportBtn.onclick = () => {
      const patient = Store.getPatient(state.detailId);
      const records = filteredReportRecords(state);
      WordExport.exportPatientReport(patient, records);
    };
  }
};

/* ---------- Selección de mascota (modo niño) ---------- */
Screens.childMascotSelect = () => `
  <div class="screen screen-child">
    <h2>¿Con quién querés jugar hoy?</h2>
    <div class="mascot-choice">
      ${MASCOT_SPECIES.map((s) => `
        <button class="mascot-card" data-mascot="${s.id}">${Mascots.guideMood(s.id, 'idle')}<span>${s.name}</span></button>`).join('')}
    </div>
  </div>`;
Screens.wire.childMascotSelect = (state, { go }) => {
  document.querySelectorAll('.mascot-card').forEach((btn) => {
    btn.onclick = () => {
      state.session.mascot = btn.dataset.mascot;
      go('childEmotion');
    };
  });
};

function speechBubble(state, text) {
  return `
  <div class="speech-row">
    <div class="mascot-small">${Mascots.guideMood(state.session.mascot, 'talking')}</div>
    <div class="bubble">${text}</div>
  </div>`;
}

/* ---------- Selección de emoción ---------- */
Screens.childEmotion = (state) => `
  <div class="screen screen-child">
    ${speechBubble(state, '¿Cómo te sentís hoy?')}
    <div class="emotion-grid">
      ${EMOTIONS.map((e) => `
        <button class="emotion-btn" data-id="${e.id}">
          ${Mascots.moodPhoto(state.session.mascot, e.id, e.label)}
          <span>${e.label}</span>
        </button>`).join('')}
    </div>
  </div>`;
Screens.wire.childEmotion = (state, { saveAnswerAndNext }) => {
  document.querySelectorAll('.emotion-btn').forEach((btn) => {
    btn.onclick = () => saveAnswerAndNext('emotion', btn.dataset.id, 'childIntensity');
  });
};

/* ---------- Intensidad ---------- */
Screens.childIntensity = (state) => {
  const emotion = getEmotion(state.session.answers.emotion);
  return `
  <div class="screen screen-child">
    ${speechBubble(state, `¿Qué tan grande sentís esta ${emotion.label.toLowerCase()}?`)}
    <div class="intensity-row">
      ${INTENSITY_LEVELS.map((lvl) => `
        <button class="intensity-btn" data-value="${lvl.value}" style="--size:${40 + lvl.value * 14}px;--c:${emotion.color}">
          <span class="circle"></span>
          <span>${lvl.label}</span>
        </button>`).join('')}
    </div>
  </div>`;
};
Screens.wire.childIntensity = (state, { saveAnswerAndNext }) => {
  document.querySelectorAll('.intensity-btn').forEach((btn) => {
    btn.onclick = () => saveAnswerAndNext('intensity', Number(btn.dataset.value), 'childBody');
  });
};

/* ---------- Mapa corporal ---------- */
Screens.childBody = (state) => `
  <div class="screen screen-child">
    ${speechBubble(state, '¿En qué parte de tu cuerpo la sentís? Tocá el dibujo.')}
    <div class="body-map-wrap">${Mascots.bodyMap(null)}</div>
    <button class="link-btn" id="btn-cuerpo-entero">Cuerpo entero</button>
  </div>`;
Screens.wire.childBody = (state, { saveAnswerAndNext }) => {
  document.querySelectorAll('.zone').forEach((zone) => {
    zone.addEventListener('click', () => saveAnswerAndNext('bodyPart', zone.dataset.part, 'childTrigger'));
  });
  document.getElementById('btn-cuerpo-entero').onclick = () => saveAnswerAndNext('bodyPart', 'todo', 'childTrigger');
};

/* ---------- Disparador ---------- */
Screens.childTrigger = (state) => `
  <div class="screen screen-child">
    ${speechBubble(state, '¿Qué pasó justo antes de sentirte así?')}
    <div class="option-grid">
      ${TRIGGERS.map((t) => `<button class="option-btn" data-id="${t.id}"><span class="emoji">${t.icon}</span>${t.label}</button>`).join('')}
    </div>
    <div class="other-input hidden" id="other-input">
      <textarea id="other-text" rows="2" placeholder="Contame con tus palabras..."></textarea>
      <button class="btn btn-primary" id="btn-other-continue">Continuar</button>
    </div>
  </div>`;
Screens.wire.childTrigger = (state, { saveAnswerAndNext }) => {
  document.querySelectorAll('.option-btn').forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.id === 'otro') {
        document.getElementById('other-input').classList.remove('hidden');
        document.getElementById('other-text').focus();
      } else {
        saveAnswerAndNext('trigger', btn.dataset.id, 'childThought');
      }
    };
  });
  const cont = document.getElementById('btn-other-continue');
  if (cont) cont.onclick = () => {
    state.session.answers.triggerText = document.getElementById('other-text').value.trim();
    saveAnswerAndNext('trigger', 'otro', 'childThought');
  };
};

/* ---------- Pensamiento ---------- */
Screens.childThought = (state) => {
  const emotion = getEmotion(state.session.answers.emotion);
  const options = [...emotion.thoughts, { id: 'otro', label: 'Otra cosa...' }];
  return `
  <div class="screen screen-child">
    ${speechBubble(state, '¿Qué pensaste en ese momento?')}
    <div class="option-grid">
      ${options.map((t) => `<button class="option-btn" data-id="${t.id}">${t.label}</button>`).join('')}
    </div>
    <div class="other-input hidden" id="other-input">
      <textarea id="other-text" rows="2" placeholder="Contame con tus palabras..."></textarea>
      <button class="btn btn-primary" id="btn-other-continue">Continuar</button>
    </div>
  </div>`;
};
Screens.wire.childThought = (state, { saveAnswerAndNext }) => {
  document.querySelectorAll('.option-btn').forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.id === 'otro') {
        document.getElementById('other-input').classList.remove('hidden');
        document.getElementById('other-text').focus();
      } else {
        saveAnswerAndNext('thought', btn.dataset.id, 'childCoping');
      }
    };
  });
  const cont = document.getElementById('btn-other-continue');
  if (cont) cont.onclick = () => {
    state.session.answers.thoughtText = document.getElementById('other-text').value.trim();
    saveAnswerAndNext('thought', 'otro', 'childCoping');
  };
};

/* ---------- Estrategia / afrontamiento ---------- */
Screens.childCoping = (state) => `
  <div class="screen screen-child">
    ${speechBubble(state, '¿Qué hiciste, o qué te ayudaría a sentirte mejor?')}
    <div class="option-grid">
      ${COPINGS.map((c) => `<button class="option-btn" data-id="${c.id}"><span class="emoji">${c.icon}</span>${c.label}</button>`).join('')}
    </div>
    <div class="other-input hidden" id="other-input">
      <textarea id="other-text" rows="2" placeholder="Contame con tus palabras..."></textarea>
      <button class="btn btn-primary" id="btn-other-continue">Continuar</button>
    </div>
  </div>`;
Screens.wire.childCoping = (state, { saveAnswerAndNext }) => {
  document.querySelectorAll('.option-btn').forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.id === 'otro') {
        document.getElementById('other-input').classList.remove('hidden');
        document.getElementById('other-text').focus();
      } else {
        saveAnswerAndNext('coping', btn.dataset.id, 'childFreeText');
      }
    };
  });
  const cont = document.getElementById('btn-other-continue');
  if (cont) cont.onclick = () => {
    state.session.answers.copingText = document.getElementById('other-text').value.trim();
    saveAnswerAndNext('coping', 'otro', 'childFreeText');
  };
};

/* ---------- Texto libre opcional ---------- */
Screens.childFreeText = (state) => `
  <div class="screen screen-child">
    ${speechBubble(state, '¿Querés contarme algo más? (si no, ¡también está bien!)')}
    <textarea id="free-text" rows="3" class="free-text" placeholder="Escribí acá si querés..."></textarea>
    <button class="btn btn-primary btn-lg" id="btn-finish-flow">Listo</button>
  </div>`;
Screens.wire.childFreeText = (state) => {
  document.getElementById('btn-finish-flow').onclick = () => {
    state.session.answers.freeText = document.getElementById('free-text').value.trim();
    App.completeQuestionnaire();
  };
};

/* ---------- Cierre ---------- */
Screens.childThanks = (state) => `
  <div class="screen screen-child screen-thanks">
    <div class="mascot-big">${Mascots.guideMood(state.session.mascot, 'happy')}</div>
    <h2>¡Gracias por contarme cómo te sentís!</h2>
    ${state.hasFollowUpActivity
      ? '<button class="btn-followup" id="btn-followup">¡Ahora vamos a trabajar juntos sobre eso!</button>'
      : '<p>Nos vemos la próxima 💛</p><button class="btn btn-primary btn-lg" id="btn-end">Terminar</button>'}
  </div>`;
Screens.wire.childThanks = (state, { go }) => {
  if (state.hasFollowUpActivity) {
    document.getElementById('btn-followup').onclick = () => go('childActivity');
  } else {
    document.getElementById('btn-end').onclick = () => App.endSession();
  }
};

/* ---------- Actividad de calma (HTML autónomo en iframe) ---------- */
Screens.childActivity = (state) => {
  const patient = Store.getPatient(state.session.patientId);
  const sex = (patient && patient.sex) || '';
  const base = getActivity(state.session.answers.emotion);
  const src = base + (sex ? '?sex=' + encodeURIComponent(sex) : '');
  return `
  <div class="screen screen-child screen-activity">
    <iframe class="activity-frame" src="${src}" title="Actividad de calma"></iframe>
  </div>`;
};
Screens.wire.childActivity = () => {
  const onMessage = (e) => {
    if (e.data && e.data.type === 'activity-complete') {
      window.removeEventListener('message', onMessage);
      setTimeout(() => App.endSession(), 4000);
    }
  };
  window.addEventListener('message', onMessage);
};
