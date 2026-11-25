# ColombiaMedHistory

Entrega académica de un prototipo web estático para explorar un historial clínico **ficticio** desde una sola interfaz. El problema atacado es localizar y organizar antecedentes, diagnósticos, tratamientos, consultas y resultados que pueden estar distribuidos distintos medios.

## Componentes de la entrega

- **Inicio público:** `index.html` — consulta rápida limitada y acceso a los recorridos de demostración.
- **Paneles independientes:** `panel/ciudadano.html` y `panel/profesional.html`, con estructura, estilos y lógica compartidos en `panel/panel.css` y `panel/panel.js`.
- **Acceso y registro:** `auth/login.html` y `auth/registro.html` — el login direcciona según rol; `auth/session.js` coordina sesión y registros temporales entre documentos de una pestaña.
- **Centro académico:** `colombiamedhistory-presentacion/index.html` — caso de Perfil Azul en tres pasos, capturas, ensayo, materiales de sustentación y equipo.
- **Datos de prueba:** `data/pacientes.json` — 20 perfiles clínicos y cuatro profesionales de prueba con asignaciones y alcances de permiso explícitos (incluye escenarios de un paciente y cero pacientes).
- **Privacidad:** `CAMBIOS_PRIVACIDAD.md` — arquitectura, matriz de permisos, Habeas Data, documentos y limitaciones.
- **Ensayo editable:** `../../02 Ensayo/Ensayo final.docx`; versión web en `colombiamedhistory-presentacion/materiales/ensayo.pdf`.
- **Guiones y diapositivas:** `../../04 Pitch y Video/Pitch.docx`, `../../04 Pitch y Video/Exposición.docx` y `../../04 Pitch y Video/Sustentación.pptx`.
- **Publicación:** `../../05 Página web/LEEME.md` y paquete de distribución `../../05 Página web/ColombiaMedHistory-web.zip`.
- **Índice, rúbrica y estado de entrega:** `../../ENTREGA.md`.

## Alcance y limitaciones

HTML, CSS y JavaScript nativos, sin backend, servidor Node, base de datos, claves API ni dependencia de pago. Los registros se descargan desde JSON con `fetch`, por lo que debe abrirse desde un servidor HTTP o HTTPS; abrir `index.html` con `file://` no carga JSON de forma fiable. Las cuentas, roles, asignaciones y solicitudes son simulaciones frontend, no autenticación o autorización seguras: el JSON completo también se publica como contenido legible del sitio. La sesión, las cuentas temporales, preferencias y solicitudes usan `sessionStorage` para navegar y recargar dentro de la misma pestaña; el cierre de sesión elimina la sesión activa y cerrar la pestaña termina su almacenamiento. **sessionStorage no es un mecanismo de autenticación ni protege los datos.** Archivos agregados por el ciudadano viven solo en memoria mientras ese documento permanezca abierto; al navegar a otra página o recargar se pierden. No se usa `localStorage` ni se envían datos a un servidor. No ingresar información real ni usar la aplicación para atención, diagnóstico o decisiones de salud.

### Recorridos de demostración

- Ciudadano: `auth/login.html` → elegir Ciudadano y una cuenta → `panel/ciudadano.html`.
- Profesional: elegir Profesional de salud → seleccionar perfil autorizado → `panel/profesional.html`.
- Un perfil profesional recién registrado se conserva temporalmente como pendiente, no aparece como autorizado ni adquiere asignaciones clínicas.
- Los paneles validan en el navegador el tipo de sesión y el identificador antes de cargar el perfil. Esto solo ordena la navegación demostrativa y no es una barrera de seguridad.
- `data/pacientes.json` incluye asignaciones estables por profesional y permisos (`read_history`, `read_results`, `read_shared_documents`, `record_visit`). El panel no concede acceso a pacientes fuera de esas asignaciones.

Los resúmenes de muestra se generan como TXT en el navegador. Los PDF antiguos y la carpeta `copia/` siguen en el directorio de trabajo; el paquete publicable los excluye mediante una lista explícita de archivos.

## Ejecutar localmente

Requiere Python 3 instalado en el equipo. Desde la carpeta `ColombiaMedHistory`:

```bash
python3 -m http.server 8000
```

Abrir `http://localhost:8000/` para la aplicación y `http://localhost:8000/colombiamedhistory-presentacion/` para la entrega académica. En Windows, puede usarse `py -m http.server 8000`. No se instalan dependencias.
