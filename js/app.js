(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const form = $('#search-form'), input = $('#doc-number'), result = $('#result'), message = $('#search-message');
  const persisted = window.CMHSession?.read() || {};
  let patients = [], temporaryPatients = persisted.temporaryPatients || [];
  let dataLoaded = false, queryState = 'idle', querySequence = 0;
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const fullName = patient => `${patient.nombres} ${patient.apellidos}`;
  const allPatients = () => [...patients, ...temporaryPatients];
  const showMessage = (text, error = true) => { message.textContent = text; message.style.color = error ? '#ffb3aa' : 'var(--green)'; };

  async function loadPatients() {
    try {
      const response = await fetch('data/pacientes.json?v=roles-2');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.pacientes)) throw new Error('Formato no válido');
      patients = data.pacientes;
      dataLoaded = true;
      renderSamples();
      // La página raíz es el portal público; las sesiones solo se representan en /panel.
    } catch (error) {
      console.error('No fue posible cargar los datos de demostración:', error);
      setQueryState('error');
      showMessage('No se pudieron cargar los datos de prueba. Ejecuta la aplicación desde un servidor HTTP local.');
      form.querySelector('button[type="submit"]').disabled = true;
    }
  }
  function renderPatient(patient) {
    result.innerHTML=`<div class="result-toolbar"><div><span class="step-label">CONSULTA RÁPIDA · DATOS GENERALES</span><h2>Resultado de consulta</h2></div><button type="button" class="button secondary" id="new-consult">Nueva consulta</button></div><div class="quick-result-head"><div class="avatar">${escapeHTML(patient.nombres.slice(0,1))}</div><div><h3>${escapeHTML(fullName(patient))}</h3><div class="patient-meta">${escapeHTML(patient.tipoDocumento)} · ${escapeHTML(patient.numeroDocumento)}</div></div><span class="demo-tag">DEMOSTRACIÓN</span></div><div class="quick-result-grid"><article class="quick-info-card"><span class="step-label">INFORMACIÓN GENERAL</span><h3>Datos básicos</h3><dl><div><dt>Nombre</dt><dd>${escapeHTML(fullName(patient))}</dd></div><div><dt>Ciudad de demostración</dt><dd>${escapeHTML(patient.ciudad||'No indicada')}</dd></div><div><dt>Perfil</dt><dd>Paciente</dd></div></dl></article><article class="quick-info-card"><span class="step-label">IDENTIFICACIÓN DEL REGISTRO</span><h3>Datos de prueba</h3><dl><div><dt>Tipo de documento</dt><dd>${escapeHTML(patient.tipoDocumento)}</dd></div><div><dt>Identificador sintético</dt><dd>${escapeHTML(patient.numeroDocumento)}</dd></div><div><dt>Identificador interno</dt><dd>${escapeHTML(patient.id)}</dd></div></dl></article></div><p class="privacy-warning">La consulta pública no muestra diagnósticos, tratamientos, alergias, historial ni documentos clínicos.</p><div class="clinical-access-note"><span>¿Necesitas consultar tu información clínica?</span><a class="button primary" href="auth/login.html">Iniciar sesión</a></div>`;$('#new-consult').addEventListener('click',resetQuickConsult);
  }
  const sampleMenu=$('#sample-menu'), sampleHome=sampleMenu?.parentElement;
  function closeSamples(){if(!sampleMenu)return;sampleMenu.hidden=true;sampleMenu.classList.remove('sample-menu-floating');sampleHome?.append(sampleMenu);$('#sample-toggle').setAttribute('aria-expanded','false');}
  function openSamples(){const toggle=$('#sample-toggle'),rect=toggle.getBoundingClientRect();document.body.append(sampleMenu);sampleMenu.classList.add('sample-menu-floating');sampleMenu.style.left=`${Math.max(12,Math.min(rect.left,innerWidth-370))}px`;sampleMenu.style.top=`${Math.min(rect.bottom+8,innerHeight-300)}px`;sampleMenu.style.width=`${Math.min(Math.max(rect.width,300),innerWidth-24)}px`;sampleMenu.hidden=false;toggle.setAttribute('aria-expanded','true');renderSamples($('#sample-filter').value);$('#sample-filter').focus();}
  function renderSamples(filter='') {
    const list=$('#sample-list'); if(!list)return;
    const documentType=$('#doc-type'), selectedType=documentType.value;
    const documentTypes=[...new Set(allPatients().map(patient=>patient.tipoDocumento).filter(Boolean))];
    documentType.innerHTML=documentTypes.map(type=>`<option value="${escapeHTML(type)}">Identificación sintética ${escapeHTML(type)}</option>`).join('');
    documentType.value=documentTypes.includes(selectedType)?selectedType:(documentTypes[0]||'DEMO');
    const term=filter.trim().toLocaleLowerCase('es');
    const matching=allPatients().filter(p=>`${fullName(p)} ${p.numeroDocumento}`.toLocaleLowerCase('es').includes(term));
    list.innerHTML=matching.length?matching.map(p=>`<li><div class="sample-entry"><button type="button" data-sample="${escapeHTML(p.numeroDocumento)}" data-type="${escapeHTML(p.tipoDocumento)}"><b>${escapeHTML(fullName(p))}</b><span>${escapeHTML(p.tipoDocumento)} ${escapeHTML(p.numeroDocumento)}</span></button><button type="button" data-copy="${escapeHTML(p.numeroDocumento)}" aria-label="Copiar documento de ${escapeHTML(fullName(p))}">Copiar ID</button></div></li>`).join(''):'<li class="help">No hay coincidencias.</li>';
    $$('[data-sample]',list).forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.sample;documentType.value=button.dataset.type;closeSamples();input.focus();}));
    $$('[data-copy]',list).forEach(copy=>{const perform=async e=>{e.stopPropagation();try{await navigator.clipboard.writeText(copy.dataset.copy);$('#copy-message').textContent='Documento copiado.';}catch{$('#copy-message').textContent=`ID: ${copy.dataset.copy}`;}};copy.addEventListener('click',perform);copy.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();perform(e);}});});
  }
  function setQueryState(nextState) {
    queryState = nextState;
    const workspace = $('#consulta'), searchPanel = $('.search-panel', workspace);
    workspace.dataset.queryState = nextState;
    workspace.classList.toggle('is-success', nextState === 'success');
    searchPanel.inert = nextState === 'success';
    searchPanel.setAttribute('aria-hidden', String(nextState === 'success'));
  }
  function resetQuickConsult() {
    querySequence++;
    form.reset();
    $('#sample-filter').value = '';
    $('#sample-menu').hidden = true;
    $('#sample-toggle').setAttribute('aria-expanded', 'false');
    $('#copy-message').textContent = '';
    message.textContent = '';
    message.style.color = '';
    result.innerHTML = '<div class="empty-state"><h2>Busca un perfil de demostración</h2><p>La consulta rápida muestra solo datos generales ficticios. Para ingresar a un panel de demostración usa los accesos de la barra superior.</p></div>';
    setQueryState('idle');
    input.focus();
  }
  form.addEventListener('submit',event=>{event.preventDefault();const requestId=++querySequence;if(!dataLoaded){setQueryState('error');showMessage('Los perfiles de prueba todavía se están cargando. Intenta de nuevo en un momento.');return;}const raw=input.value.trim();if(!raw){setQueryState('error');showMessage('Escribe o selecciona un identificador ficticio.');input.focus();return;}setQueryState('loading');const patient=allPatients().find(item=>item.tipoDocumento===document.querySelector('#doc-type').value&&item.numeroDocumento.toLowerCase()===raw.toLowerCase());if(requestId!==querySequence)return;if(!patient){setQueryState('error');showMessage('Paciente no encontrado. Verifica el identificador o elige un paciente de prueba.');input.focus();return;}renderPatient(patient);setQueryState('success');$('#new-consult').focus({preventScroll:true});if(matchMedia('(max-width:760px)').matches)result.scrollIntoView({block:'start'});});
  $('#fill-demo').addEventListener('click',()=>{input.value=patients[0]?.numeroDocumento||'900000000001';if(patients[0])$('#doc-type').value=patients[0].tipoDocumento;input.focus();});
  $('#sample-toggle').addEventListener('click',()=>sampleMenu.hidden?openSamples():closeSamples());
  $('#sample-filter').addEventListener('input',e=>renderSamples(e.target.value));
  document.addEventListener('click',event=>{if(event.target.closest('#sample-toggle'))return;if(!$('.sample-picker').contains(event.target)&&!sampleMenu.contains(event.target))closeSamples();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!sampleMenu.hidden){closeSamples();$('#sample-toggle').focus();}});
  $('#reset-demo-main')?.addEventListener('click',()=>{if(window.confirm('¿Borrar perfiles temporales y cerrar la sesión de demostración?')){window.CMHSession?.reset();location.href='index.html';}});
  loadPatients();
})();
