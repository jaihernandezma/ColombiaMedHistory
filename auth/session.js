(() => {
  'use strict';
  const KEY = 'cmh-demo-state-v1';
  const NAVIGATION = performance.getEntriesByType?.('navigation')?.[0]?.type;
  // sessionStorage vive entre documentos de la misma pestaña. Una recarga se reconoce
  // con Navigation Timing; si el navegador no lo informa, el botón Reiniciar queda disponible.
  if (NAVIGATION === 'reload') {
    try { sessionStorage.removeItem(KEY); } catch { /* almacenamiento restringido */ }
  }
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
