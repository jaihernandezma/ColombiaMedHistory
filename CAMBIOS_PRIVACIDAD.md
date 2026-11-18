# Arquitectura de demostración y privacidad

> ColombiaMedHistory es un prototipo académico estático. Todos los perfiles y eventos clínicos son ficticios. No ingresar datos personales o médicos reales ni utilizarlo para atención o decisiones de salud.

## Arquitectura

- `index.html`, `css/styles.css` y `js/app.js`: interfaz y reglas de sesión ejecutadas en el navegador.
- `data/pacientes.json`: veinte perfiles ficticios, registros clínicos sintéticos y la lista explícita de profesionales autorizados y pacientes asignados.
- `colombiamedhistory-presentacion/`: presentación académica, enlaces, ensayo, pitch y explicación de alcance.
- GitHub Pages entrega los archivos estáticos públicamente. El JSON y el código JavaScript no son secretos ni una base de datos privada.

No hay backend, envío de datos, almacenamiento remoto, autenticación robusta ni comunicación con entidades prestadoras. La sesión y registros temporales se guardan únicamente en `sessionStorage` para conservarlos al navegar o recargar entre el inicio, autenticación y los paneles dentro de la pestaña actual. Cerrar sesión elimina la sesión activa; cerrar la pestaña termina su almacenamiento. Este comportamiento de navegador es solo continuidad de la demo: no protege los datos ni constituye autenticación. El botón **Reiniciar demostración** elimina todos los registros temporales.

## Perfiles y matriz de permisos

| Función | Consulta rápida (público) | Ciudadano de prueba | Profesional autorizado de prueba | Profesional registrado durante sesión |
|---|---:|---:|---:|---:|
| Buscar perfil sintético | Sí | Solo su cuenta | Solo pacientes asignados | No |
| Nombre, tipo/ID sintético e información general | Sí | Sí | Sí, asignados | No |
| Diagnósticos, alergias, tratamientos e historial | No | Sí, solo su perfil | Sí, solo asignados | No |
| Descargar ejemplos clínicos | No | Sí, de su historial ficticio | Sí, de pacientes asignados | No |
| Gestionar archivos personales temporales | No | Sí, solo propios | No; solo lectura de compartidos | No |
| Ver documentos adicionales compartidos | No | Sí, propios | Solo si el paciente los comparte en sesión | No |
| Crear solicitudes de rectificación/supresión | No | Sí; quedan pendientes | No | No |
| Crear un perfil profesional | No | No | No | Sí, queda **PENDIENTE DE VERIFICACIÓN — DEMOSTRACIÓN** |
| Auditoría demostrativa | No | No | Sí, consultas en memoria | No |

Elegir un rol no equivale a autenticar ni autorizar a una persona real. La interfaz y los controles de cliente se pueden modificar; no protegen datos frente a un atacante.

## Consulta rápida y ciudadano

La consulta rápida busca identificadores de demostración y enseña exclusivamente nombre ficticio, tipo y número sintético y ciudad de muestra. En un sistema real, una búsqueda pública por documento no debe revelar datos personales sin autenticación, autorización, finalidad y controles apropiados.

El inicio ciudadano permite elegir una cuenta ficticia y abre `panel/ciudadano.html`; el profesional abre `panel/profesional.html`. Cada página comprueba en JavaScript el rol y el ID de sesión, como control de navegación de una demo. La asociación se mantiene en el navegador y el dataset completo es público; esto no es inicio de sesión seguro ni protección de información clínica.

## Profesionales y autorización

Los únicos profesionales habilitados para la simulación se declaran en `data/pacientes.json`, junto con las listas limitadas de identificadores asignados. Se anota en memoria qué profesional consultó qué perfil. Un profesional registrado durante la sesión no entra en esa lista y no recibe permisos. Un sistema real requeriría verificar título/registro profesional, identidad e institución, establecer autorizaciones y finalidades, minimizar datos y producir auditoría protegida e íntegra.

## Archivos y datos temporales

- Los perfiles de registro, sesión, solicitudes, preferencias y actividad simulada se conservan en `sessionStorage` durante la navegación/recarga en la pestaña; los archivos seleccionados por un ciudadano solo viven en memoria del documento abierto y se pierden al navegar o recargar. El JSON publicado no se altera.
- Los perfiles profesionales nuevos quedan pendientes y no reciben una asignación automáticamente. Una integración real necesitaría verificar credenciales en fuentes institucionales, como ReTHUS cuando corresponda, y autorizar según contexto asistencial.
- Los archivos personales aceptados son PDF, JPG, PNG o TXT de hasta 5 MB cada uno. Se conservan como objetos `File` y URL `Blob` locales; no se cargan a servidor, nube ni repositorio. Al eliminar, se revoca la URL temporal. Al recargar se pierden.
- PDF e imágenes pueden abrirse para previsualización; TXT se descarga y no se inserta como HTML.
- Los ejemplos clínicos oficiales son registros ficticios del historial y no son archivos personales borrables. Descargas TXT se generan en el navegador.
- Las preferencias de compartición solo cambian qué archivos adicionales ve el profesional simulado dentro de la sesión. Los registros clínicos oficiales no se ocultan con un interruptor.

## Habeas data y solicitudes clínicas

La experiencia recoge conceptualmente derechos de consulta, descarga y solicitud de corrección o supresión. Las solicitudes generan un ID, guardan registro seleccionado y motivo, y quedan como **Pendiente de revisión** en memoria. No se altera ni elimina el evento clínico original.

El tratamiento real de información clínica exige valorar, entre otras disposiciones vigentes, la Ley 1581 de 2012 (protección de datos), la Ley 2015 de 2020 (interoperabilidad de historia clínica electrónica), la Resolución 1995 de 1999 (manejo de historia clínica) y la Resolución 839 de 2017 (custodia, conservación y disposición). Una petición de supresión no implica borrado automático: debe revisarla el responsable y considerar obligaciones legales de conservación, reserva, integridad y derechos de terceros. Este prototipo no es asesoría jurídica ni acredita cumplimiento normativo.

## Eliminar archivo personal vs. solicitar supresión clínica

El ciudadano sí puede eliminar de esta sesión el archivo personal adicional que él adjuntó: se elimina la referencia local y se libera su URL temporal. Un documento oficial simulado pertenece al historial de muestra y no puede ser eliminado desde la interfaz. Para este último, el ciudadano puede registrar una solicitud de revisión/supresión; el historial original permanece íntegro. En un sistema real, el canal, responsable, verificación, análisis de procedencia y respuesta deben cumplir las reglas aplicables.

## Qué requeriría una versión real

Servicio backend y almacenamiento con controles, autenticación robusta, autorización del lado servidor, verificación profesional e institucional, gestión de consentimiento/finalidad, cifrado en tránsito y reposo, auditoría resistente a alteraciones, gestión de incidentes, copias/continuidad, conservación y eliminación reguladas, interoperabilidad conforme a estándares colombianos, evaluación de seguridad y privacidad, acuerdos de tratamiento, operación y revisión clínica/jurídica. GitHub Pages por sí solo no puede ofrecer estos controles.

## Verificación funcional manual

1. Ejecutar `python3 -m http.server 8000` y abrir `http://localhost:8000/`.
2. Buscar un paciente con el modo Consulta rápida y comprobar que no se muestran diagnósticos ni alergias.
3. Usar el menú de pacientes, seleccionar y copiar un identificador.
4. Entrar como ciudadano de prueba, recorrer historial, cargar/eliminar un archivo y crear una solicitud; recargar y comprobar que lo temporal desapareció.
5. Entrar como profesional, probar pacientes asignados y actividad. Registrar un nuevo profesional y confirmar que no puede iniciar sesión con permisos.
6. Revisar presentación en `/colombiamedhistory-presentacion/`, animación con mouse y navegación desde móvil/teclado.
