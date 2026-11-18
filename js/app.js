(() => {
  'use strict';
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#doc-number');
  const result = document.querySelector('#result');
  const message = document.querySelector('#search-message');
  const roleButtons = [...document.querySelectorAll('.role-button')];
  let patients = [];
  let selectedPatient = null;

  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const dateLabel = (value) => new Intl.DateTimeFormat('es-CO', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T00:00:00Z`));
  const showMessage = (text, error = true) => { message.textContent = text; message.style.color = error ? '#ffb3aa' : 'var(--green)'; };

  async function loadPatients() {
    try {
      const response = await fetch('data/pacientes.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.pacientes)) throw new Error('Formato de datos no válido');
      patients = data.pacientes;
    } catch (error) {
      console.error('No fue posible cargar los datos de demostración:', error);
      showMessage('No se pudieron cargar los datos. Abre esta aplicación mediante un servidor HTTP local.');
      form.querySelector('button[type="submit"]').disabled = true;
    }
  }

  function downloadText(filename, content) {
    const blob = new Blob([content], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function recordText(patient, event) {
    return `ColombiaMedHistory — DOCUMENTO DE DEMOSTRACIÓN\nContenido enteramente ficticio; no es historia clínica real.\n\nPaciente: ${patient.nombres} ${patient.apellidos}\nIdentificador sintético: ${patient.tipoDocumento} ${patient.numeroDocumento}\nFecha: ${dateLabel(event.date)}\nTipo de evento: ${event.category}\nEvento: ${event.title}\nDetalle: ${event.detail}\nInstitución de origen ficticia: ${event.institution}\nProfesional ficticio: ${event.provider}\n\nEste archivo de texto se genera localmente para la demostración académica. No constituye un documento médico, legal ni asistencial.`;
  }

  function showDetails(event) {
    const dialog = document.createElement('div');
    dialog.className = 'modal-backdrop';
    dialog.innerHTML = `<section class="modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><span class="step-label">DETALLE DE ATENCIÓN · FICTICIO</span><h2 id="detail-title">${escapeHTML(event.title)}</h2><p><b>Fecha:</b> ${escapeHTML(dateLabel(event.date))}<br><b>Tipo:</b> ${escapeHTML(event.category)}<br><b>Origen:</b> ${escapeHTML(event.institution)}<br><b>Profesional:</b> ${escapeHTML(event.provider)}</p><p>${escapeHTML(event.detail)}</p><div class="modal-actions"><button type="button" data-close>Cerrar</button><button type="button" class="primary" data-download>Descargar ejemplo .txt</button></div></section>`;
    document.body.append(dialog);
    dialog.querySelector('[data-close]').focus();
    dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target.closest('[data-close]')) dialog.remove(); });
    dialog.querySelector('[data-download]').addEventListener('click', () => downloadText(`resultado-${event.date}.txt`, recordText(selectedPatient, event)));
    dialog.addEventListener('keydown', (e) => { if (e.key === 'Escape') dialog.remove(); });
  }

  function buildTimeline(patient) {
    const events = [...patient.events].sort((a,b) => b.date.localeCompare(a.date));
    const category = document.querySelector('#filter-category')?.value || 'Todos';
    const from = document.querySelector('#filter-from')?.value || '';
    const to = document.querySelector('#filter-to')?.value || '';
    const filtered = events.filter((event) => (category === 'Todos' || event.category === category) && (!from || event.date >= from) && (!to || event.date <= to));
    const container = document.querySelector('#timeline');
    if (!filtered.length) { container.innerHTML = '<p class="empty-filter">No hay eventos para los filtros seleccionados.</p>'; return; }
    container.innerHTML = filtered.map((event) => `<article class="event"><div class="event-card"><div class="event-top"><b>${escapeHTML(event.title)}</b><time datetime="${escapeHTML(event.date)}">${escapeHTML(dateLabel(event.date))}</time></div><p>${escapeHTML(event.detail)}</p><div class="event-tags"><span class="category-tag">${escapeHTML(event.category)}</span><span class="clinical-origin"><i></i>${escapeHTML(event.institution)}</span></div><div class="event-actions"><button type="button" data-detail="${escapeHTML(event.id || `${event.date}-${event.category}`)}">Ver detalle</button>${event.category === 'Resultado' ? `<button type="button" data-event="${escapeHTML(events.indexOf(event))}">Descargar ejemplo</button>` : ''}</div></div></article>`).join('');
    container.querySelectorAll('[data-detail]').forEach((button) => button.addEventListener('click', () => showDetails(events.find(e => (e.id || `${e.date}-${e.category}`) === button.dataset.detail))));
    container.querySelectorAll('[data-event]').forEach((button) => button.addEventListener('click', () => downloadText(`resultado-${events[button.dataset.event].date}.txt`, recordText(patient, events[button.dataset.event]))));
  }

  function renderPatient(patient) {
    selectedPatient = patient;
    const counts = {Consultas:patient.events.filter(e => e.category === 'Consulta').length,Diagnósticos:patient.diagnosticos.length,Resultados:patient.events.filter(e => e.category === 'Resultado').length};
    result.innerHTML = `<div class="patient-head"><div class="avatar" aria-hidden="true">${patient.id.slice(-2)}</div><div><span class="step-label">PERFIL DE DEMOSTRACIÓN</span><h2>${escapeHTML(patient.nombres)} ${escapeHTML(patient.apellidos)}</h2><div class="patient-meta">${escapeHTML(patient.tipoDocumento)} · ${escapeHTML(patient.numeroDocumento)} · ${escapeHTML(patient.edad)} años · ${escapeHTML(patient.ciudad)}</div></div><span class="demo-tag">FICTICIO</span></div><div class="record-counts">${Object.entries(counts).map(([label,count])=>`<div class="count-card"><b>${count}</b><span>${label}</span></div>`).join('')}</div><div class="summary-grid"><div class="summary-item"><span>Grupo sanguíneo ilustrativo</span><b>${escapeHTML(patient.tipoSangre)}</b></div><div class="summary-item"><span>Medicamentos</span><b>${patient.medicamentos.map(escapeHTML).join(', ')}</b></div></div><h3 class="section-title">Antecedentes</h3><div class="chip-list">${patient.antecedentes.map(item=>`<span class="chip">${escapeHTML(item)}</span>`).join('') || '<span class="chip">Sin antecedentes registrados</span>'}</div><h3 class="section-title">Alergias</h3><div class="chip-list">${patient.alergias.length ? patient.alergias.map(item=>`<span class="chip alert">${escapeHTML(item)}</span>`).join('') : '<span class="chip">Ninguna registrada en esta simulación</span>'}</div><h3 class="section-title">Historial clínico</h3><div class="filter-row"><label>Categoría<select id="filter-category"><option>Todos</option>${['Consulta','Diagnóstico','Tratamiento','Procedimiento','Resultado'].map(c=>`<option>${c}</option>`).join('')}</select></label><label>Desde<input id="filter-from" type="date" aria-label="Fecha desde"></label><label>Hasta<input id="filter-to" type="date" aria-label="Fecha hasta"></label><button type="button" id="clear-filters">Limpiar</button></div><div class="timeline" id="timeline"></div><p class="help">Cada institución y profesional señalados son ficticios. Los archivos descargables se generan como texto local.</p><button type="button" class="button primary" id="download-summary">Descargar resumen ficticio</button>`;
    ['filter-category','filter-from','filter-to'].forEach(id => document.getElementById(id).addEventListener('change', () => buildTimeline(patient)));
    document.getElementById('clear-filters').addEventListener('click', () => { document.getElementById('filter-category').value='Todos'; document.getElementById('filter-from').value=''; document.getElementById('filter-to').value=''; buildTimeline(patient); });
    document.getElementById('download-summary').addEventListener('click', () => downloadText(`${patient.id}-resumen.txt`, `ColombiaMedHistory — RESUMEN DE DEMOSTRACIÓN\nDatos completamente ficticios.\n\n${patient.nombres} ${patient.apellidos}\nID sintético: ${patient.numeroDocumento}\nAntecedentes: ${patient.antecedentes.join('; ')}\nAlergias: ${patient.alergias.join('; ') || 'Ninguna registrada'}\nDiagnósticos: ${patient.diagnosticos.join('; ')}\nMedicamentos: ${patient.medicamentos.join('; ')}\nEventos en el historial: ${patient.events.length}\n\nNo es una historia clínica real ni documento asistencial.`));
    buildTimeline(patient);
    showMessage('Perfil ficticio encontrado. Explora los filtros y el detalle de los resultados.', false);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const raw = input.value.trim();
    const normalized = raw.replace(/\s/g, '');
    if (!/^\d{12}$/.test(normalized)) { showMessage('Escribe un identificador DEMO de 12 dígitos. No uses tu documento personal.'); input.focus(); return; }
    const patient = patients.find(item => item.tipoDocumento === document.querySelector('#doc-type').value && item.numeroDocumento === normalized);
    if (!patient) { result.innerHTML = '<div class="empty-state"><span class="empty-icon">⌕</span><h2>Sin resultados</h2><p>No existe un paciente con ese identificador sintético. Prueba 900000000001.</p></div>'; showMessage('No encontramos coincidencias en los 20 perfiles ficticios.'); return; }
    renderPatient(patient);
  });

  document.querySelector('#fill-demo').addEventListener('click', () => { input.value='900000000001'; input.focus(); });
  roleButtons.forEach(button => button.addEventListener('click', () => {
    roleButtons.forEach(item => { const active = item === button; item.classList.toggle('selected', active); item.setAttribute('aria-pressed', String(active)); });
    document.querySelector('#role-help').textContent = button.dataset.role === 'patient' ? 'Vista de consulta para un paciente ficticio. La elección solo cambia la demostración.' : 'Vista ilustrativa para un profesional ficticio. No otorga permisos ni autentica usuarios reales.';
  }));

  loadPatients();
})();
