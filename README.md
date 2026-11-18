# ColombiaMedHistory

Entrega académica de un prototipo web estático para explorar un historial clínico **enteramente ficticio** desde una sola interfaz. El problema priorizado es localizar y organizar antecedentes, diagnósticos, tratamientos, consultas y resultados que pueden estar distribuidos. No se implementa una red de interoperabilidad nacional.

## Componentes de la entrega

- **Aplicación clínica:** `index.html` — consulta rápida limitada, sesiones de ciudadano/profesional simuladas, perfiles asignados, registro temporal, historial, documentos y solicitudes de privacidad.
- **Acceso y registro:** `auth/login.html` y `auth/registro.html` — accesos separados; `auth/session.js` coordina registros/sesiones temporales entre documentos de una pestaña.
- **Centro académico:** `colombiamedhistory-presentacion/index.html` — problema, seis flujos funcionales, alcance, referencias, ensayo, pitch, evaluación, equipo y enlaces.
- **Datos de prueba:** `data/pacientes.json` — 20 perfiles clínicos completamente ficticios y dos profesionales de prueba con asignaciones explícitas.
- **Privacidad:** `CAMBIOS_PRIVACIDAD.md` — arquitectura, matriz de permisos, Habeas Data, documentos y limitaciones.
- **Ensayo editable:** `docs/ensayo/BORRADOR_ENSAYO_COLOMBIAMEDHISTORY.md`.
- **Guion pitch:** `docs/pitch/GUION_VIDEO_PITCH.md`.
- **Arquitectura y validación:** `docs/ARQUITECTURA.md`, `docs/PROTOCOLO_USABILIDAD.md`.
- **Estado de entrega:** `ESTADO_ENTREGA.md`.

## Alcance y limitaciones

HTML, CSS y JavaScript nativos, sin backend, servidor Node, base de datos, claves API ni dependencia de pago. Los registros se descargan desde JSON con `fetch`, por lo que debe abrirse desde un servidor HTTP o HTTPS; abrir `index.html` con `file://` no carga JSON de forma fiable. Las cuentas, roles, asignaciones y solicitudes son simulaciones frontend, no autenticación o autorización seguras. Registro y sesión usan `sessionStorage` para navegar entre las páginas en la misma pestaña; `auth/session.js` intenta reiniciarlos al detectar recarga y hay un botón **Reiniciar demostración** como control manual. No se usa `localStorage` ni se envían datos a un servidor. No ingresar información real ni usar la aplicación para atención, diagnóstico o decisiones de salud.

Los archivos de muestra se generan como TXT en el navegador para no publicar antiguos PDFs que aparentaban ser historias clínicas oficiales, contenían identificadores plausibles y afirmaban validez legal no comprobada.

## Ejecutar localmente

Requiere Python 3 instalado en el equipo. Desde la carpeta `ColombiaMedHistory`:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/` para la aplicación y `http://localhost:8000/colombiamedhistory-presentacion/` para la entrega académica. En Windows, puede usarse `py -m http.server 8000`. No se instalan dependencias.
