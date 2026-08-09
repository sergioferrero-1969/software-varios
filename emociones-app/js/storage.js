/* Capa de almacenamiento. Todo vive en localStorage, en el propio iPad.
   Nada se envía a internet. */

const Store = (() => {
  const KEYS = {
    patients: 'emotia_patients',
    records: 'emotia_records',
    settings: 'emotia_settings',
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error('Error leyendo', key, e);
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  return {
    // ---- Ajustes (PIN) ----
    getSettings() {
      return read(KEYS.settings, { pin: '1234' });
    },
    saveSettings(settings) {
      write(KEYS.settings, settings);
    },

    // ---- Pacientes ----
    getPatients() {
      return read(KEYS.patients, []);
    },
    getPatient(id) {
      return this.getPatients().find((p) => p.id === id) || null;
    },
    savePatient(patient) {
      const patients = this.getPatients();
      if (!patient.id) {
        patient.id = uid();
        patient.createdAt = new Date().toISOString();
        patients.push(patient);
      } else {
        const idx = patients.findIndex((p) => p.id === patient.id);
        if (idx >= 0) patients[idx] = patient;
        else patients.push(patient);
      }
      write(KEYS.patients, patients);
      return patient;
    },
    deletePatient(id) {
      write(KEYS.patients, this.getPatients().filter((p) => p.id !== id));
      write(KEYS.records, this.getRecords().filter((r) => r.patientId !== id));
    },

    // ---- Registros emocionales ----
    getRecords(patientId) {
      const all = read(KEYS.records, []);
      return patientId ? all.filter((r) => r.patientId === patientId) : all;
    },
    addRecord(record) {
      const records = read(KEYS.records, []);
      record.id = uid();
      record.timestamp = new Date().toISOString();
      records.push(record);
      write(KEYS.records, records);
      return record;
    },
    deleteRecord(id) {
      write(KEYS.records, read(KEYS.records, []).filter((r) => r.id !== id));
    },
  };
})();
