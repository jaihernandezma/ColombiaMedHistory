# ColombiaMedHistory

Entrega académica de un prototipo web estático para explorar un historial clínico **enteramente ficticio** desde una sola interfaz. El problema priorizado es localizar y organizar antecedentes, diagnósticos, tratamientos, consultas y resultados que pueden estar distribuidos. No se implementa una red de interoperabilidad nacional.

## Componentes de la entrega

- **Aplicación clínica:** `index.html` — consulta rápida limitada, sesiones de ciudadano/profesional simuladas, perfiles asignados, registro temporal, historial, documentos y solicitudes de privacidad.
- **Centro académico:** `colombiamedhistory-presentacion/index.html` — problema, seis flujos funcionales, alcance, referencias, ensayo, pitch, evaluación, equipo y enlaces.
- **Datos de prueba:** `data/pacientes.json` — 20 perfiles clínicos completamente ficticios y dos profesionales de prueba con asignaciones explícitas.
- **Privacidad:** `CAMBIOS_PRIVACIDAD.md` — arquitectura, matriz de permisos, Habeas Data, documentos y limitaciones.
- **Ensayo editable:** `docs/ensayo/BORRADOR_ENSAYO_COLOMBIAMEDHISTORY.md`.
- **Guion pitch:** `docs/pitch/GUION_VIDEO_PITCH.md`.
- **Arquitectura y validación:** `docs/ARQUITECTURA.md`, `docs/PROTOCOLO_USABILIDAD.md`.
- **Estado de entrega:** `ESTADO_ENTREGA.md`.

## Alcance y limitaciones

HTML, CSS y JavaScript nativos, sin backend, servidor Node, base de datos, claves API ni dependencia de pago. Los registros se descargan desde JSON con `fetch`, por lo que debe abrirse desde un servidor HTTP o HTTPS; abrir `index.html` con `file://` no carga JSON de forma fiable. Las cuentas, roles, asignaciones y solicitudes son simulaciones frontend, no autenticación o autorización seguras. Los archivos agregados por el usuario y los formularios temporales viven solo en memoria local durante esa sesión, no se suben a servidor. No ingresar información real ni usar la aplicación para atención, diagnóstico o decisiones de salud.

Los archivos de muestra se generan como TXT en el navegador para no publicar antiguos PDFs que aparentaban ser historias clínicas oficiales, contenían identificadores plausibles y afirmaban validez legal no comprobada.

## Ejecutar localmente

Requiere Python 3 instalado en el equipo. Desde la carpeta `ColombiaMedHistory`:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/` para la aplicación y `http://localhost:8000/colombiamedhistory-presentacion/` para la entrega académica. En Windows, puede usarse `py -m http.server 8000`. No se instalan dependencias.

## Prueba manual rápida

1. Abrir la presentación y activar “Probar demostración”.
2. En Consulta rápida, consultar `900000000001` y verificar que solo aparecen datos generales.
3. Ingresar como ciudadano y comprobar el historial; gestionar un archivo temporal y una solicitud.
4. Como profesional, consultar un paciente asignado y comprobar la actividad de sesión.
5. Filtrar historial, abrir detalles y descargar ejemplos que indiquen que son ficticios.
6. Crear un paciente y un profesional temporal; comprobar que el profesional queda pendiente y no adquiere permisos.
7. Recargar y comprobar que lo temporal desaparece pero los 20 perfiles JSON permanecen.
8. Reducir ancho, navegar con teclado y verificar foco, menú, diálogos y enlaces académicos.

## Publicar en GitHub Pages

1. Subir el contenido de esta carpeta a la rama configurada para Pages (la estructura actual asume publicación desde la raíz del repositorio `ColombiaMedHistory`).
2. En **Settings → Pages**, seleccionar la rama y carpeta que correspondan al repositorio; guardar y esperar el despliegue.
3. Verificar la aplicación en `https://<usuario>.github.io/ColombiaMedHistory/`.
4. Verificar la página académica en `https://<usuario>.github.io/ColombiaMedHistory/colombiamedhistory-presentacion/`.
5. Confirmar en DevTools que `data/pacientes.json` responde correctamente, que no hay errores JS y que los enlaces a documentos de ejemplo descargan.
6. Completar los enlaces editables en `colombiamedhistory-presentacion/config.js`, publicar video/PDF y actualizar el estado de entrega.
7. Copiar la URL pública de la página académica a los portafolios de cada integrante. No marcar el despliegue como completo antes de probar enlaces desde una ventana privada.

## Enlaces editables

`colombiamedhistory-presentacion/config.js` centraliza URL de demo, enlace de YouTube y portafolios. Los archivos PDF definitivos no se crean artificialmente: el espacio previsto está documentado en `docs/ensayo/README.md`.

## Equipo

- Blandón Zapata
- Hincapié Amaya
- Hernández Martínez

Completar nombres, funciones confirmadas, portafolios, URL final de presentación y enlaces institucionales antes de la entrega.
