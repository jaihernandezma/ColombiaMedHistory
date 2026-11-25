# ColombiaMedHistory

Prototipo académico estático sobre una pregunta de consulta: ¿dónde quedó el examen anterior? La portada permite buscar datos generales. Los paneles muestran un historial diferente según la cuenta seleccionada. Los 20 pacientes y los cuatro médicos del catálogo son ficticios.

## Ejecutar y exponer

Desde esta carpeta, ejecuta `python3 -m http.server 8000` y abre <http://localhost:8000/>. No hay compilación ni dependencias de la aplicación. El catálogo se carga con `fetch`, por lo que abrir el HTML como archivo local no basta.

1. **Paciente:** elige Inés Ríos en **Iniciar sesión → Paciente**. En **Mi historial clínico**, filtra por **Resultado**, abre el perfil lipídico del 18 de abril y descarga el PDF. Los valores y referencias son ilustrativos.
2. **Intercambio entre roles:** en **Mis documentos**, agrega un TXT de prueba; en **Privacidad**, selecciona **Profesionales autorizados**. Crea una solicitud de revisión y cierra sesión. En la misma pestaña, entra como **Médico → Aurora Ledesma**. En **Documentos** podrás descargar el adjunto y en **Solicitudes** marcar la revisión como resuelta. Al volver a Inés, verás el nuevo estado.
3. **Atención:** desde **Mis pacientes**, Aurora puede registrar una atención para Inés. Se añade tanto a su historial como a **Consultas clínicas**.

La [página académica](colombiamedhistory-presentacion/index.html) reúne el recorrido ilustrado, la matriz «Quién ve qué», el ensayo y las diapositivas.

## Datos y duración

`data/pacientes.json` es público. Los permisos por asignación simulan decisiones de interfaz, no autenticación ni protección clínica. El registro de un médico nuevo no le concede acceso. Usa solo información inventada.

`auth/session.js` conserva en `sessionStorage` las cuentas temporales, solicitudes, preferencias, adjuntos y atenciones. Cerrar sesión permite cambiar de rol sin perderlos. Reiniciar la demostración elimina esos cambios. Los adjuntos admiten hasta 1 MB cada uno y 2 MB en conjunto; no se envían a un servidor. El PDF de laboratorio está en `assets/documentos/`.
