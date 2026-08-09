/* Exporta el reporte de un paciente a un archivo .doc que se abre y
   edita directamente en Microsoft Word / Google Docs. No requiere
   librerías externas ni conexión a internet. */

const WordExport = (() => {
  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function buildHtml(patient, records) {
    const sorted = [...records].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const rows = sorted.map((r) => {
      const emotion = getEmotion(r.emotion);
      const narrative = Report.generateNarrative(patient, r);
      return `
        <tr>
          <td style="padding:8px;border:1px solid #ccc;white-space:nowrap;">${Report.formatDate(r.timestamp)}</td>
          <td style="padding:8px;border:1px solid #ccc;white-space:nowrap;">${escapeHtml(emotion.label)} (${r.intensity}/5)</td>
          <td style="padding:8px;border:1px solid #ccc;">${escapeHtml(narrative)}</td>
        </tr>`;
    }).join('');

    return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>Reporte - ${escapeHtml(patient.name)}</title></head>
    <body style="font-family:Calibri, Arial, sans-serif; color:#222;">
      <h1 style="color:#2b3a55;">Reporte de seguimiento emocional</h1>
      <h2 style="color:#2b3a55;">${escapeHtml(patient.name)}</h2>
      <table style="border-collapse:collapse;margin-bottom:16px;">
        <tr><td style="padding:4px 12px 4px 0;"><b>Edad:</b></td><td>${escapeHtml(patient.age)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;"><b>Sexo:</b></td><td>${escapeHtml(patient.sex || '-')}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;"><b>Escolaridad:</b></td><td>${escapeHtml(patient.schooling || '-')}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;"><b>Fecha del reporte:</b></td><td>${new Date().toLocaleDateString('es-AR')}</td></tr>
      </table>
      ${patient.briefHistory ? `<p><b>Historia breve:</b> ${escapeHtml(patient.briefHistory)}</p>` : ''}
      <h3 style="color:#2b3a55;">Registro de sesiones (${sorted.length})</h3>
      <table style="border-collapse:collapse;width:100%;">
        <tr style="background:#eef1f7;">
          <th style="padding:8px;border:1px solid #ccc;">Fecha</th>
          <th style="padding:8px;border:1px solid #ccc;">Emoción</th>
          <th style="padding:8px;border:1px solid #ccc;">Relato</th>
        </tr>
        ${rows}
      </table>
      <p style="margin-top:24px;font-size:11px;color:#888;">
        Documento generado automáticamente por la app de seguimiento emocional. El relato es una
        primera redacción orientativa: revisar y editar antes de compartir con la familia.
      </p>
    </body>
    </html>`;
  }

  function exportPatientReport(patient, records) {
    const html = buildHtml(patient, records);
    const blob = new Blob(['﻿', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = patient.name.replace(/[^\w\-]+/g, '_');
    a.href = url;
    a.download = `Reporte_${safeName}_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  return { exportPatientReport };
})();
