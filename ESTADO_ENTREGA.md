# Estado de entrega académica — ColombiaMedHistory

**Fecha de revisión del proyecto:** 17 de noviembre de 2026.  
**Fecha de entrega indicada:** 23 de noviembre de 2026.  
**Nota importante:** la carpeta actual no es un repositorio Git y no se ha publicado desde este entorno. Los enlaces externos, video, PDF final, Drive y evidencia de usuarios requieren acciones del equipo.

## Estado por rúbrica

| Componente de rúbrica | Peso | Estado | Evidencia actual / acción pendiente |
|---|---:|---|---|
| Avance y seguimiento | 15 % | PARCIAL | Cronograma original recibido (PDF). Actualizar bitácora con contribuciones reales, evidencia y fechas; confirmar con docente cómo se valora seguimiento. |
| Ensayo académico | 25 % | PARCIAL | Borrador Markdown con cuatro partes, IA y referencias preliminares. Llevar a Google Docs, revisión colaborativa, verificar normativa y citas APA 7, completar fuentes comparativas/evidencias, exportar PDF final. |
| Prototipo funcional | 15 % | PARCIAL | Aplicación estática implementada con 20 perfiles JSON sintéticos, búsqueda, filtros, timeline y descargas TXT. Completar pruebas manuales/usabilidad y confirmar despliegue público; no hay backend/auth real. |
| Página web académica | 20 % | PARCIAL | Centro académico implementado con problema, alcance, solución, comparación, ensayo, pitch, equipo, legislación, protocolo y enlaces internos. Completar datos configurables, publicar y validar URL; completar análisis de dos portales concretos. |
| Video pitch | 25 % | PARCIAL | Guion de máximo cuatro minutos para tres integrantes. Pendiente grabar, editar, publicar en YouTube y configurar URL en la página. |
| Bonificación funcional (hasta 0,5) | Hasta 0,5 | PARCIAL | Flujo demostrativo y protocolo de evaluación implementados. No se ha realizado la sesión con participantes; no afirmar mediciones hasta ejecutarlas. |

## Estado detallado de requisitos

| Requisito | Estado | Nota |
|---|---|---|
| Aplicación principal separada del centro académico | COMPLETO | `index.html` conserva la aplicación; presentación está en su subcarpeta. |
| Inicio, roles de demostración y aviso de simulación | COMPLETO | Perfil paciente/profesional no autentica ni concede permisos. |
| Búsqueda validada por tipo e ID sintético | COMPLETO | Validación de 12 dígitos, estados sin resultado y error de carga. |
| Datos JSON y 20 pacientes ficticios | COMPLETO | `data/pacientes.json`, IDs de serie `900000000001`–`900000000020`. |
| Perfil, antecedentes, alergias, diagnósticos, tratamientos | COMPLETO | Campos mostrados en perfil de demostración. |
| Línea de tiempo, categorías, fechas y origen | COMPLETO | Categoría, rango desde/hasta y fuente institucional ficticia. |
| Detalles y documentos descargables | COMPLETO | Detalles y TXT generados localmente; no son documentos oficiales. |
| Registro/edición persistente de perfiles | PENDIENTE | Fuera del alcance; el registro se deshabilitó y no usa almacenamiento local. |
| Centro académico único con accesos a componentes | PARCIAL | Implementado, falta publicación y pruebas de URL pública/portafolios. |
| Problema y prioridad inicial delimitada | COMPLETO | Prioridad: localizar y comprender información clínica distribuida. |
| Evidencia de entrevistas/estadísticas | PENDIENTE | No se inventaron entrevistas ni cifras. Agregar resultados reales con método. |
| Comparación con IHCE | COMPLETO | Contexto oficial enlazado; se aclara que el proyecto no reemplaza IHCE. |
| Comparación con al menos dos soluciones existentes | COMPLETO | IHCE de MinSalud y servicios en línea del portal oficial EPS SURA, con enlaces y fecha de revisión; no se atribuyen capacidades no observadas. Una segunda IPS sería ampliación útil, no condición para los dos referentes citados. |
| Legislación y límites de producción | PARCIAL | Ley 1581, Ley 2015, historia clínica y requisitos descritos; referencias/alcance legal deben verificarse por el equipo. |
| Borrador de ensayo de cuatro partes | COMPLETO | Archivo editable, con marcas de evidencia pendiente. |
| Ensayo colaborativo Google Docs | PENDIENTE | Aún no creado/compartido por el equipo. |
| Ensayo final PDF | PENDIENTE | Ruta reservada `docs/ensayo/ENSAYO_FINAL.pdf`; no existe PDF final. |
| Guion de video pitch (máximo cuatro minutos) | COMPLETO | Incluye tiempos, tres voces, escenas, capturas, edición y YouTube. |
| Video final publicado / reproductor real | PENDIENTE | No se grabó ni publicó; `youtubeUrl` permanece vacío. |
| Métrica y protocolo de usabilidad | COMPLETO | Tarea, tiempo, éxito, muestra y dificultades definidos; tabla vacía. |
| Ejecución con participantes | PENDIENTE | Participantes y medidas reales: 0. |
| Arquitectura y README | COMPLETO | Documentados bajo `docs/ARQUITECTURA.md` y `README.md`. |
| Compatibilidad estática y subruta Pages | PARCIAL | Enlaces locales relativos preparados; falta probar URL pública bajo el repositorio desplegado. |
| Carpeta y cinco secciones de Google Drive | PENDIENTE | Checklist disponible en `docs/CHECKLIST_GOOGLE_DRIVE.md`; equipo debe crear carpeta y cargar archivos. |
| Enlaces de portafolio de los integrantes | PENDIENTE | Configurables en `colombiamedhistory-presentacion/config.js`. |
| Publicación del sitio en GitHub Pages | PENDIENTE | Despliegue externo no realizado desde este entorno. |
| Enlace público único desde portafolios | PENDIENTE | Requiere confirmar URL final y actualizar cada portafolio. |

## Requisitos manuales antes de entregar

- [ ] Confirmar que los nombres de integrantes están completos/correctos, acordar roles y agregar portafolios reales en `colombiamedhistory-presentacion/config.js`.
- [ ] Revisar el borrador en Google Docs con aportes visibles del equipo; completar referencias APA 7 y exportar el ensayo definitivo a `docs/ensayo/ENSAYO_FINAL.pdf`.
- [ ] Verificar en fuente oficial el texto vigente de Ley 2015 de 2020, Resolución 1995 de 1999 y normas relacionadas; completar referencias bibliográficas.
- [ ] Si el docente requiere dos portales institucionales además de IHCE, elegir otra IPS/portal y documentar evidencia y fecha; la página ya compara IHCE y servicios en línea de EPS SURA como dos referentes distintos.
- [ ] Si el grupo incorpora entrevistas o métricas, obtener consentimiento, anonimizar y registrar método real; no inventar resultados.
- [ ] Grabar y editar el pitch con tres participantes, máximo 4 minutos, publicar en YouTube y completar `youtubeUrl`.
- [ ] Probar manualmente aplicación y presentación mediante HTTP y en teléfono; verificar rutas JSON, filtros, descargas y enlaces.
- [ ] Publicar GitHub Pages; validar los dos URLs públicos desde ventana privada y registrar URL/fecha aquí.
- [ ] Añadir URL de la página académica a los portafolios y probar que desde ella se accede al problema, ensayo, pitch y prototipo.
- [ ] Crear carpeta compartida Google Drive con problema, ensayo, prototipo, pitch/video y página web; revisar permisos.
- [ ] Confirmar que no se reintroduzcan IDs, documentos o información clínica real ni archivos antiguos.

## Pruebas registradas

| Prueba | Resultado | Fecha / observación |
|---|---|---|
| Inspección de estructura y material original | COMPLETADO | 17-11-2026; se identificó cronograma PDF, aplicación y presentación preexistente. |
| Revisión de PDFs clínicos antiguos | COMPLETADO | 17-11-2026; archivos retirados por incluir identificadores plausibles, detalles clínicos y sellos oficiales no sustentados. |
| JSON válido, sintaxis JS, rutas HTTP y enlaces locales | COMPLETADO | JSON válido; 20 IDs únicos y 80 eventos con institución; `node --check`; HTTP 200 para app, presentación, JSON, JS, CSS, ensayo y guion; enlaces locales existentes; probado bajo prefijo simulado `/ColombiaMedHistory/`. |
| Prueba manual de formulario, filtros y descargas | PENDIENTE | No se pudo ejecutar interacción de navegador; no se encontró Chromium/Chrome/Playwright instalado en el entorno. |
| Prueba visual responsive y lector/teclado | PENDIENTE | Registrar después de ejecutar. |
| GitHub Pages y enlaces externos | PENDIENTE | Depende de publicación externa. |

## Entregables generados

- Prototipo estático y centro académico.
- Dataset sintético con veinte perfiles.
- Borrador de ensayo y guion de pitch.
- Arquitectura, README, protocolo de usabilidad y checklist de Drive.
- Esta matriz de estado.
