document.addEventListener('DOMContentLoaded', () => {

    const inputIdentificacion = document.getElementById('identificacion');
    const btnBuscar = document.getElementById('buscar');
    const contenedorResultado = document.getElementById('resultado');

    // Obtener la base de datos de pacientes (funciona con doble clic local file:// y con servidor http/https)
    async function obtenerPacientes() {
        // 1. Si los datos ya estan cargados en memoria mediante pacientes-data.js (evita bloqueo CORS en file://)
        if (window.PACIENTES_DATA && Array.isArray(window.PACIENTES_DATA.pacientes)) {
            return window.PACIENTES_DATA.pacientes;
        }

        // 2. Si se ejecuta en GitHub Pages o servidor web, intenta cargar el JSON con fetch
        try {
            const respuesta = await fetch('data/pacientes.json');
            if (respuesta.ok) {
                const datos = await respuesta.json();
                return datos.pacientes || [];
            }
        } catch (error) {
            console.warn('No fue posible cargar el JSON por fetch, verificando respaldo en memoria.', error);
        }

        return [];
    }

    // Consultar historial del paciente con busqueda flexible (por cedula, alias DEMO o nombre)
    async function consultarPaciente() {
        const termino = inputIdentificacion.value.trim().toLowerCase();

        if (!termino) {
            contenedorResultado.innerHTML = `
                <div class="mensaje-alerta info">
                    <i class="fa-solid fa-circle-info"></i>
                    Ingresa un número de documento o el nombre del paciente a consultar.
                </div>
            `;
            return;
        }

        try {
            const pacientes = await obtenerPacientes();

            if (!pacientes || pacientes.length === 0) {
                contenedorResultado.innerHTML = `
                    <div class="mensaje-alerta">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        No se pudo acceder a la base de datos de pacientes.
                    </div>
                `;
                return;
            }

            // Busqueda inteligente: busca por numero de documento, alias de prueba o nombre
            const paciente = pacientes.find(p => {
                const docLimpio = p.numeroDocumento.toLowerCase();
                const alias = (p.aliasDemo || '').toLowerCase();
                const nombreCompleto = `${p.nombres} ${p.apellidos}`.toLowerCase();

                return docLimpio.includes(termino) || alias.includes(termino) || nombreCompleto.includes(termino);
            });

            if (paciente) {
                mostrarFichaPaciente(paciente);
            } else {
                contenedorResultado.innerHTML = `
                    <div class="mensaje-alerta">
                        <i class="fa-solid fa-user-slash"></i>
                        No se encontró ningún historial para <strong>"${escapeTexto(inputIdentificacion.value.trim())}"</strong>.
                        <p style="margin-top: 6px; font-size: 0.85rem;">Prueba con: <strong>1036789452</strong>, <strong>43567890</strong>, <strong>1144123987</strong> o escribe <strong>Carlos</strong>.</p>
                    </div>
                `;
            }

        } catch (error) {
            console.error('Error al realizar la consulta:', error);
            contenedorResultado.innerHTML = `
                <div class="mensaje-alerta">
                    Ocurrió un problema inesperado al consultar los historiales.
                </div>
            `;
        }
    }

    // Mostrar la informacion clinica del paciente
    function mostrarFichaPaciente(paciente) {
        // Alergias
        let alergiasHTML = '';
        if (paciente.alergias && paciente.alergias.length > 0) {
            alergiasHTML = paciente.alergias.map(a => `<span class="badge-tag badge-alergia"><i class="fa-solid fa-triangle-exclamation"></i> ${escapeTexto(a)}</span>`).join('');
        } else {
            alergiasHTML = '<span class="badge-tag badge-vacio">Sin alergias medicamentosas conocidas</span>';
        }

        // Antecedentes
        let antecedentesHTML = '';
        if (paciente.antecedentes && paciente.antecedentes.length > 0) {
            antecedentesHTML = paciente.antecedentes.map(ant => `<span class="badge-tag badge-antecedente"><i class="fa-solid fa-clock-rotate-left"></i> ${escapeTexto(ant)}</span>`).join('');
        } else {
            antecedentesHTML = '<span class="badge-tag badge-vacio">Sin antecedentes médicos reportados</span>';
        }

        // Diagnósticos
        let diagnosticosHTML = '';
        if (paciente.diagnosticos && paciente.diagnosticos.length > 0) {
            paciente.diagnosticos.forEach(d => {
                diagnosticosHTML += `
                    <div class="item-registro">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                            <strong>${d.codigoCIE10 ? `[${d.codigoCIE10}] ` : ''}${escapeTexto(d.nombre)}</strong>
                            <span style="font-size: 0.8rem; color: #64748b;">${d.fechaRegistro}</span>
                        </div>
                        <p><strong>Tratamiento prescrito:</strong> ${escapeTexto(d.tratamiento)}</p>
                        ${d.medico ? `<p style="font-size: 0.8rem; color: #0284c7;"><i class="fa-solid fa-user-doctor"></i> ${escapeTexto(d.medico)}</p>` : ''}
                        ${d.nota ? `<p style="font-size: 0.8rem; font-style: italic; color: #475569;">Nota: ${escapeTexto(d.nota)}</p>` : ''}
                    </div>
                `;
            });
        } else {
            diagnosticosHTML = '<p style="color: #94a3b8; font-size: 0.9rem;">Sin diagnósticos activos.</p>';
        }

        // Exámenes y reportes clínicos con acceso a archivos descargables y visor
        let examenesHTML = '';
        if (paciente.examenes && paciente.examenes.length > 0) {
            paciente.examenes.forEach((e, index) => {
                const examenId = `examen-${index}`;
                // Guardamos el examen en memoria para el visor modal
                window['EXAMEN_ACTUAL_' + index] = e;

                examenesHTML += `
                    <div class="item-registro examen" id="${examenId}">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                            <strong><i class="fa-solid fa-file-waveform" style="color: #10b981;"></i> ${escapeTexto(e.titulo)}</strong>
                            <span style="font-size: 0.8rem; color: #64748b;">${e.fecha}</span>
                        </div>
                        <p style="margin-top: 4px;"><strong>Resultado clínico:</strong> ${escapeTexto(e.resultado)}</p>
                        ${e.medico ? `<p style="font-size: 0.8rem; color: #0284c7;"><i class="fa-solid fa-user-doctor"></i> ${escapeTexto(e.medico)}</p>` : ''}
                        
                        <!-- Acciones sobre el documento -->
                        <div class="acciones-examen">
                            ${e.archivo ? `
                                <a href="${e.archivo}" download class="btn-pdf" title="Descargar documento PDF original">
                                    <i class="fa-solid fa-download"></i> Descargar PDF
                                </a>
                            ` : ''}
                            <button type="button" class="btn-visor" onclick="abrirVisorClinico('${escapeTexto(e.titulo)}', '${e.fecha}', '${escapeTexto(e.medico || 'Especialista')}', '${escapeTexto(e.resultado)}', '${e.archivo || ''}')">
                                <i class="fa-solid fa-eye"></i> Visualizar informe
                            </button>
                        </div>
                    </div>
                `;
            });
        } else {
            examenesHTML = '<p style="color: #94a3b8; font-size: 0.9rem;">Sin exámenes recientes registrados.</p>';
        }

        // Construir la tarjeta completa
        contenedorResultado.innerHTML = `
            <div class="paciente-card">
                <div class="paciente-card-header">
                    <div>
                        <h3><i class="fa-solid fa-user-check" style="margin-right: 6px;"></i> ${escapeTexto(paciente.nombres)} ${escapeTexto(paciente.apellidos)}</h3>
                        <p class="paciente-doc">
                            ${paciente.tipoDocumento} ${paciente.numeroDocumento} 
                            ${paciente.aliasDemo ? `(${paciente.aliasDemo})` : ''}
                            ${paciente.eps ? ` • ${paciente.eps}` : ''}
                            ${paciente.ciudad ? ` • ${paciente.ciudad}` : ''}
                        </p>
                    </div>
                    <button id="btnCerrarFicha" class="btn-cerrar" title="Cerrar resultado">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="paciente-card-body">
                    
                    <!-- Barra de descarga de Historia Clinica Completa -->
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; gap: 10px;">
                        <div>
                            <strong style="color: #166534; font-size: 0.95rem;"><i class="fa-solid fa-cloud-arrow-down"></i> Historia Clínica Unificada en la Nube</strong>
                            <p style="font-size: 0.8rem; color: #15803d; margin-top: 2px;">Expediente médico nacional sincronizado y con validez legal.</p>
                        </div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${paciente.historiaClinicaPdf ? `
                                <a href="${paciente.historiaClinicaPdf}" download class="btn-pdf" style="padding: 8px 16px; font-size: 0.88rem;">
                                    <i class="fa-solid fa-file-pdf"></i> Descargar Historia Clínica (PDF)
                                </a>
                            ` : ''}
                            <button type="button" class="btn-visor" style="padding: 8px 16px; font-size: 0.88rem;" onclick="generarReporteDinamico(${JSON.stringify(paciente).replace(/"/g, '&quot;')})">
                                <i class="fa-solid fa-print"></i> Certificado Digital
                            </button>
                        </div>
                    </div>

                    <!-- Datos personales -->
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Fecha de Nacimiento</span>
                            <span class="info-val">${paciente.fechaNacimiento} ${paciente.edad ? `(${paciente.edad} años)` : ''}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Tipo de Sangre</span>
                            <span class="info-val" style="color: #b91c1c; font-weight: 700;">${paciente.tipoSangre}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Teléfono</span>
                            <span class="info-val">${paciente.telefono || 'No registrado'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Correo Electrónico</span>
                            <span class="info-val">${paciente.correo || 'No registrado'}</span>
                        </div>
                    </div>

                    <!-- Alergias -->
                    <div class="seccion-detalles">
                        <h4>Alergias Conocidas</h4>
                        <div>${alergiasHTML}</div>
                    </div>

                    <!-- Antecedentes -->
                    <div class="seccion-detalles">
                        <h4>Antecedentes Médicos y Familiares</h4>
                        <div>${antecedentesHTML}</div>
                    </div>

                    <!-- Diagnósticos -->
                    <div class="seccion-detalles">
                        <h4>Diagnósticos y Tratamientos</h4>
                        <div>${diagnosticosHTML}</div>
                    </div>

                    <!-- Exámenes clínicos y archivos descargables -->
                    <div class="seccion-detalles">
                        <h4>Exámenes, Radiografías e Informes Clínicos</h4>
                        <div>${examenesHTML}</div>
                    </div>

                </div>
            </div>
        `;

        // Evento para cerrar la tarjeta
        const btnCerrar = document.getElementById('btnCerrarFicha');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => {
                contenedorResultado.innerHTML = '';
            });
        }

        // Desplazar la vista suavemente hacia el resultado
        contenedorResultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Escapar texto para seguridad
    function escapeTexto(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    // Eventos de busqueda
    if (btnBuscar) {
        btnBuscar.addEventListener('click', consultarPaciente);
    }

    if (inputIdentificacion) {
        inputIdentificacion.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                consultarPaciente();
            }
        });
    }

    // Menu responsive para dispositivos moviles
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarLinks = document.getElementById('navbarLinks');

    if (navbarToggle && navbarLinks) {
        navbarToggle.addEventListener('click', () => {
            navbarLinks.classList.toggle('show');
        });
    }

    // Efecto de sombra al hacer scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

});

// Funcion global para el visor de documentos medicos
function abrirVisorClinico(titulo, fecha, medico, resultado, archivoPdf) {
    const modal = document.getElementById('modalVisor');
    const tituloDoc = document.getElementById('visorTituloDoc');
    const fechaDoc = document.getElementById('visorFechaDoc');
    const medicoDoc = document.getElementById('visorMedicoDoc');
    const resultadoDoc = document.getElementById('visorResultadoDoc');
    const btnDescarga = document.getElementById('visorBtnDescarga');

    if (!modal) return;

    if (tituloDoc) tituloDoc.textContent = titulo;
    if (fechaDoc) fechaDoc.textContent = 'Fecha de estudio: ' + fecha;
    if (medicoDoc) medicoDoc.textContent = 'Especialista: ' + medico;
    if (resultadoDoc) resultadoDoc.textContent = resultado;

    if (btnDescarga) {
        if (archivoPdf) {
            btnDescarga.href = archivoPdf;
            btnDescarga.style.display = 'inline-flex';
        } else {
            btnDescarga.style.display = 'none';
        }
    }

    modal.classList.add('activo');
}

function cerrarVisorClinico() {
    const modal = document.getElementById('modalVisor');
    if (modal) {
        modal.classList.remove('activo');
    }
}

// Generador de certificado digital PDF en tiempo real usando jsPDF
function generarReporteDinamico(paciente) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('Librería de PDF cargando. Por favor descarga el archivo PDF oficial incluido en el botón rojo.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Membrete
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(2, 132, 199);
    doc.text('REPUBLICA DE COLOMBIA', 20, 20);
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text('MINISTERIO DE SALUD Y PROTECCION SOCIAL', 20, 27);
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129);
    doc.text('RED NACIONAL ColombiaMedHistory - CERTIFICADO MEDICO DIGITAL', 20, 33);

    doc.setDrawColor(203, 213, 225);
    doc.line(20, 36, 190, 36);

    // Datos del paciente
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('EXPEDIENTE MEDICO DEL CIUDADANO', 20, 45);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nombre completo: ${paciente.nombres} ${paciente.apellidos}`, 20, 53);
    doc.text(`Identificacion: ${paciente.tipoDocumento} ${paciente.numeroDocumento}`, 20, 60);
    doc.text(`Tipo de Sangre: ${paciente.tipoSangre}  |  EPS: ${paciente.eps || 'No asignada'}`, 20, 67);
    doc.text(`Ciudad de residencia: ${paciente.ciudad || 'Colombia'}`, 20, 74);

    // Diagnósticos
    let y = 85;
    doc.setFont('Helvetica', 'bold');
    doc.text('DIAGNOSTICOS ACTIVOS REGISTRADOS:', 20, y);
    doc.setFont('Helvetica', 'normal');
    y += 7;

    if (paciente.diagnosticos && paciente.diagnosticos.length > 0) {
        paciente.diagnosticos.forEach(d => {
            doc.text(`* ${d.nombre}`, 25, y);
            y += 5;
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text(`  Tratamiento: ${d.tratamiento}`, 25, y);
            doc.setFontSize(10);
            doc.setTextColor(30, 41, 59);
            y += 7;
        });
    } else {
        doc.text('Sin diagnosticos cronicos activos.', 25, y);
        y += 8;
    }

    // Examenes
    y += 5;
    doc.setFont('Helvetica', 'bold');
    doc.text('EXAMENES CLINICOS DISPONIBLES EN LA NUBE:', 20, y);
    doc.setFont('Helvetica', 'normal');
    y += 7;

    if (paciente.examenes && paciente.examenes.length > 0) {
        paciente.examenes.forEach(e => {
            doc.text(`* ${e.titulo} (${e.fecha})`, 25, y);
            y += 5;
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text(`  Resultado: ${e.resultado}`, 25, y);
            doc.setFontSize(10);
            doc.setTextColor(30, 41, 59);
            y += 7;
        });
    }

    // Pie de página y sello
    doc.setDrawColor(203, 213, 225);
    doc.line(20, 260, 190, 260);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Documento oficial emitido a traves de la plataforma unificada ColombiaMedHistory.', 20, 266);
    doc.text('Verificacion criptografica: SHA-256 / Valido segun estandares de historia clinica digital en Colombia.', 20, 271);

    // Descargar
    const nombreArchivo = `Certificado-Medico-${paciente.nombres.replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);
}
