(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const state = () => window.CMHSession.read();
  const save = changes => window.CMHSession.update(changes);
  const baseUrl = '../data/pacientes.json?v=roles-2';
  let demoData = { pacientes: [], profesionalesAutorizados: [] }, loginRole = 'citizen', registerRole = 'citizen', dataReady = false;

  async function loadData() {
    try {
      const response = await fetch(baseUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      demoData = await response.json();
      if (!Array.isArray(demoData.pacientes)) throw new Error('JSON de pacientes inválido');
      dataReady = true;
      if (document.body.dataset.page === 'login') renderAccounts();
    } catch (error) {
      console.error('No se cargaron las cuentas de demostración:', error);
      const message = $('#login-message');
      if (message) message.textContent = 'No se pudieron cargar los perfiles. Abre el sitio desde un servidor HTTP local.';
      const submit = $('#login-submit'); if (submit) submit.disabled = true;
    }
  }
  const temporaryPatients = () => state().temporaryPatients || [];
  const temporaryProfessionals = () => state().temporaryProfessionals || [];
  function renderAccounts() {
    const select = $('#demo-account');
    if (!select) return;
    const saved = state();
    if (loginRole === 'citizen') {
      const options = [...demoData.pacientes, ...temporaryPatients()].map(patient => `<option value="${escapeHTML(patient.id)}">${escapeHTML(patient.nombres)} ${escapeHTML(patient.apellidos)} · Paciente · ${escapeHTML(patient.tipoDocumento)} ${escapeHTML(patient.numeroDocumento)}${patient.id.startsWith('P-TEMP-') ? ' · temporal' : ''}</option>`).join('');
      select.innerHTML = options || '<option value="">No hay cuentas de ciudadano disponibles</option>';
      select.disabled = !options;
      $('#account-help').textContent = 'La sesión solo permitirá acceder al perfil ficticio seleccionado.';
      $('#login-submit').disabled = !options;
      const previous = saved.authSession?.kind === 'citizen' ? saved.authSession.patientId : '';
      if (previous && select.querySelector(`option[value="${CSS.escape(previous)}"]`)) select.value = previous;
    } else {
      const approved = (demoData.profesionalesAutorizados || []).filter(prof => prof.assignments?.some(a => a.status === 'active'));
      const pending = temporaryProfessionals();
      select.innerHTML = `<optgroup label="Profesionales de demostración autorizados">${approved.map(prof => `<option value="${escapeHTML(prof.id)}">${escapeHTML(prof.name)} · Médico · ${escapeHTML(prof.institution)}</option>`).join('')}</optgroup>${pending.length ? `<optgroup label="Pendientes — sin acceso clínico">${pending.map((prof,index) => `<option value="pending-${index}" disabled>${escapeHTML(prof.nombre)} · PENDIENTE DE VERIFICACIÓN</option>`).join('')}</optgroup>` : ''}`;
      select.disabled = approved.length === 0;
      $('#account-help').textContent = 'Los perfiles recién registrados no se pueden utilizar para consultar historiales: requieren verificación y no tienen permisos.';
      $('#login-submit').disabled = approved.length === 0;
      const previous = saved.authSession?.kind === 'professional' ? saved.authSession.professionalId : '';
      if (previous && select.querySelector(`option[value="${CSS.escape(previous)}"]`)) select.value = previous;
    }
  }
  function setRole(role) {
    loginRole = role;
    $$('[data-login-role]').forEach(button => { const active = button.dataset.loginRole === role; button.classList.toggle('selected',active); button.setAttribute('aria-pressed',String(active)); });
    renderAccounts();
  }
  function renderRegistration() {
    registerRole = $$('[data-register-role]').find(button=>button.classList.contains('selected'))?.dataset.registerRole || 'citizen';
    const container = $('#registration-form-container');
    const patientForm = `<form id="register-form" novalidate><div class="form-grid"><label>Nombres<input name="nombres" required maxlength="60" autocomplete="given-name"></label><label>Apellidos<input name="apellidos" required maxlength="60" autocomplete="family-name"></label><label>Tipo de documento<select name="tipoDocumento"><option value="CC (DEMO)">Cédula de ciudadanía (DEMO)</option><option value="TI (DEMO)">Tarjeta de identidad (DEMO)</option><option value="CE (DEMO)">Cédula de extranjería (DEMO)</option></select></label><label>Identificación ficticia<input name="numeroDocumento" required pattern="DEMO-CC-[0-9]{4}" placeholder="DEMO-CC-0001" title="Usa el formato DEMO-CC-0001"><span class="field-hint">Código inequívocamente sintético.</span></label><label>Fecha de nacimiento<input name="fechaNacimiento" type="date" required max="${new Date().toISOString().slice(0,10)}"></label><label>Ciudad o información general<input name="ciudad" maxlength="80" placeholder="Dato ficticio opcional"></label></div><p class="message" id="form-message" role="status" aria-live="polite"></p><button class="button primary full" type="submit">Crear perfil ciudadano temporal</button></form>`;
    const professionalForm = `<form id="register-form" novalidate><div class="form-grid"><label class="wide">Nombre completo<input name="nombre" required maxlength="100" autocomplete="name"></label><label>Tipo y número de identificación ficticia<input name="identificacion" required pattern="DEMO-(CC|CE|TI)-[0-9]{4}" placeholder="DEMO-CC-9001" title="Formato DEMO-CC-9001"></label><label>Profesión<input name="profesion" required maxlength="80" placeholder="Medicina"></label><label>Especialidad<input name="especialidad" maxlength="80" placeholder="Opcional"></label><label>Institución ficticia<input name="institucion" required maxlength="100"></label><label>Correo de demostración<input name="correo" type="email" required placeholder="profesional@example.demo"></label><label>Número profesional ficticio<input name="numeroProfesional" maxlength="40" placeholder="DEMO-RM-001"></label></div><p class="message" id="form-message" role="status" aria-live="polite"></p><button class="button primary full" type="submit">Registrar perfil profesional</button><p class="field-hint">Este registro queda pendiente y no habilita consulta clínica.</p></form>`;
    container.innerHTML = registerRole === 'citizen' ? patientForm : professionalForm;
    $('#register-form').addEventListener('submit', submitRegistration);
  }
  function submitRegistration(event) {
    event.preventDefault();
    const form = event.currentTarget, values = Object.fromEntries(new FormData(form)), message = $('#form-message');
    if (!form.reportValidity()) return;
    if (!dataReady) { message.textContent = 'Cargando perfiles existentes; intenta de nuevo en un momento.'; return; }
    const saved = state();
    if (registerRole === 'citizen') {
      const duplicates = [...demoData.pacientes, ...temporaryPatients()].some(patient => patient.numeroDocumento.toLowerCase() === values.numeroDocumento.trim().toLowerCase());
      if (duplicates) { message.textContent = 'Ese identificador ya está registrado en los datos de prueba.'; return; }
      const today = new Date(), birth = new Date(`${values.fechaNacimiento}T00:00:00`);
      let age = today.getFullYear() - birth.getFullYear();
      if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
      const patient = { id:`P-TEMP-${Date.now()}`, tipoDocumento:values.tipoDocumento, numeroDocumento:values.numeroDocumento.trim().toUpperCase(), nombres:values.nombres.trim(), apellidos:values.apellidos.trim(), fechaNacimiento:values.fechaNacimiento, edad:age, ciudad:values.ciudad.trim() || 'No indicada (DEMO)', tipoSangre:'No registrado', alergias:[], antecedentes:[], diagnosticos:[], medicamentos:[], events:[] };
      const updated = [...temporaryPatients(), patient];
      if (!save({temporaryPatients:updated, authSession:null, confirmation:{kind:'citizen',patientId:patient.id}})) { message.textContent = 'El navegador no permitió guardar temporalmente. Habilita sessionStorage para continuar.'; return; }
      showConfirmation(`<h2>Perfil ciudadano creado</h2><p>${escapeHTML(patient.nombres)} ${escapeHTML(patient.apellidos)} · ${escapeHTML(patient.numeroDocumento)}</p><p>Se conservará al navegar dentro de esta pestaña. Su historial comienza vacío y es ficticio.</p><div class="confirmation-actions"><a class="button quiet" href="login.html">Ir a iniciar sesión</a><button class="button primary" type="button" data-enter-citizen="${escapeHTML(patient.id)}">Continuar al panel de demostración</button></div>`);
       $('[data-enter-citizen]').addEventListener('click',()=>{save({authSession:{kind:'citizen',patientId:patient.id}});location.href='../panel/ciudadano.html';});
      form.reset();
    } else {
      const id = values.identificacion.trim().toUpperCase();
      const duplicate = temporaryProfessionals().some(prof=>prof.identificacion.toUpperCase()===id);
      if (duplicate) { message.textContent = 'Ese identificador ficticio ya está registrado en esta sesión.'; return; }
      const professional = {...values,identificacion:id,id:`PROF-TEMP-${Date.now()}`,estado:'PENDIENTE DE VERIFICACIÓN — DEMOSTRACIÓN'};
      if (!save({temporaryProfessionals:[...temporaryProfessionals(),professional],authSession:null,confirmation:{kind:'professional',professionalId:professional.id}})) { message.textContent = 'El navegador no permitió guardar temporalmente. Habilita sessionStorage para continuar.'; return; }
      showConfirmation(`<h2>Registro recibido</h2><p>${escapeHTML(professional.nombre)} · ${escapeHTML(professional.profesion)}</p><p class="status-pending"><strong>PENDIENTE DE VERIFICACIÓN — DEMOSTRACIÓN</strong></p><p>No se habilitan permisos para consultar historiales. La validación profesional e institucional requeriría un sistema real.</p><div class="confirmation-actions"><a class="button quiet" href="login.html">Ir al inicio de sesión</a><a class="button primary" href="../index.html">Volver al inicio</a></div>`);
      form.reset();
    }
  }
  function showConfirmation(html) { const confirmation=$('#registration-confirmation');confirmation.innerHTML=html;confirmation.hidden=false;$('#registration-form-container').hidden=true;confirmation.scrollIntoView({behavior:'smooth',block:'nearest'}); }
  function resetDemo() {
    if (!window.confirm('¿Reiniciar la demostración y borrar sus perfiles temporales y sesión de esta pestaña?')) return;
    window.CMHSession.reset();
    location.href = document.body.dataset.page === 'login' ? 'login.html' : '../index.html';
  }
  $$('[data-login-role]').forEach(button=>button.addEventListener('click',()=>setRole(button.dataset.loginRole)));
  $('#login-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const id=$('#demo-account').value, message=$('#login-message');
    if(loginRole==='citizen'){
      const patient=[...demoData.pacientes,...temporaryPatients()].find(item=>item.id===id);
      if(!patient){message.textContent='No se encontró la cuenta ciudadana seleccionada.';return;}
      if(!save({authSession:{kind:'citizen',patientId:patient.id}})){message.textContent='No fue posible conservar la sesión en esta pestaña.';return;}
    } else {
      const professional=(demoData.profesionalesAutorizados||[]).find(item=>item.id===id);
      if(!professional){message.textContent='Los perfiles pendientes no pueden consultar historiales. Selecciona un profesional autorizado de prueba.';return;}
      if(!save({authSession:{kind:'professional',professionalId:professional.id}})){message.textContent='No fue posible conservar la sesión en esta pestaña.';return;}
    }
      message.textContent='Acceso de demostración confirmado. Abriendo tu panel…';
      const submit=$('#login-submit'); submit.disabled=true; submit.setAttribute('aria-busy','true');
     setTimeout(()=>{location.href=loginRole==='citizen'?'../panel/ciudadano.html':'../panel/profesional.html';},220);
  });
  $$('[data-register-role]').forEach(button=>button.addEventListener('click',()=>{registerRole=button.dataset.registerRole;$$('[data-register-role]').forEach(item=>{const active=item===button;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active));});$('#registration-confirmation').hidden=true;$('#registration-form-container').hidden=false;renderRegistration();}));
  $$('.reset-demo').forEach(button=>button.addEventListener('click',resetDemo));
  if(document.body.dataset.page==='register'){
    $$('[data-register-role]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.registerRole==='citizen')));
    renderRegistration();
    const confirmation=state().confirmation;
    if(confirmation?.kind==='citizen'){
      const patient=temporaryPatients().find(item=>item.id===confirmation.patientId);
      if(patient)showConfirmation(`<h2>Perfil ciudadano listo</h2><p>${escapeHTML(patient.nombres)} ${escapeHTML(patient.apellidos)} · ${escapeHTML(patient.numeroDocumento)}</p><div class="confirmation-actions"><a class="button primary" href="login.html">Iniciar sesión</a><a class="button quiet" href="../index.html">Volver a la consulta rápida</a></div>`);
    } else if(confirmation?.kind==='professional'){
      const prof=temporaryProfessionals().find(item=>item.id===confirmation.professionalId);
      if(prof)showConfirmation(`<h2>Registro profesional recibido</h2><p>${escapeHTML(prof.nombre)}</p><p class="status-pending"><strong>${escapeHTML(prof.estado)}</strong></p><p>No obtiene permisos clínicos.</p><a class="button quiet" href="login.html">Ir a iniciar sesión</a>`);
    }
  }
  if(document.body.dataset.page==='login'){
    $$('[data-login-role]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.loginRole==='citizen')));
    if(state().confirmation?.kind==='professional')$('#login-message').textContent='Tu registro profesional está pendiente de verificación y no permite acceso clínico.';
    const reason=new URLSearchParams(location.search).get('reason');
    if(reason==='session')$('#login-message').textContent='Inicia sesión con una cuenta de demostración para abrir el panel correspondiente.';
    if(reason==='logout')$('#login-message').textContent='Sesión de demostración cerrada.';
  }
  loadData();
})();
