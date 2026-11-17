document.addEventListener('DOMContentLoaded', () => {

    const formRegistro = document.getElementById('formRegistro');
    const mensajeRegistro = document.getElementById('mensajeRegistro');

    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener valores del formulario
            const tipoDoc = document.getElementById('tipoDocumento').value;
            const numDoc = document.getElementById('numeroDocumento').value.trim();
            const nombres = document.getElementById('nombres').value.trim();
            const apellidos = document.getElementById('apellidos').value.trim();

            if (!numDoc || !nombres || !apellidos) {
                mensajeRegistro.innerHTML = `
                    <div class="mensaje-alerta">
                        Por favor completa todos los campos requeridos.
                    </div>
                `;
                return;
            }

            // Mensaje de éxito simulado para el prototipo
            mensajeRegistro.innerHTML = `
                <div class="mensaje-alerta info" style="background-color: #ecfdf5; border-color: #a7f3d0; color: #065f46;">
                    <i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 1.2rem;"></i>
                    <p style="margin-top: 6px;"><strong>¡Paciente registrado con éxito!</strong></p>
                    <p style="font-size: 0.85rem; margin-top: 4px;">
                        Los datos de <strong>${nombres} ${apellidos}</strong> (${tipoDoc} ${numDoc}) han sido añadidos al prototipo local.
                    </p>
                </div>
            `;

            // Limpiar formulario
            formRegistro.reset();
        });
    }

    // Menu responsive para la barra de navegacion
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarLinks = document.getElementById('navbarLinks');

    if (navbarToggle && navbarLinks) {
        navbarToggle.addEventListener('click', () => {
            navbarLinks.classList.toggle('show');
        });
    }

});
