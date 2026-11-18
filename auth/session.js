(() => {
  'use strict';
  const KEY = 'cmh-demo-state-v1';
  // sessionStorage conserva la sesión al navegar y recargar en esta pestaña.
  // No es autenticación segura; se elimina al cerrar sesión, reiniciar o cerrar la pestaña.
  const read = () => {
    try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); }
    catch { return {}; }
  };
  const write = (state) => {
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch { return false; }
  };
  const update = (changes) => write({ ...read(), ...changes });
  const reset = () => {
    try { sessionStorage.removeItem(KEY); } catch { /* almacenamiento restringido */ }
  };
  window.CMHSession = Object.freeze({ read, write, update, reset });
})();
