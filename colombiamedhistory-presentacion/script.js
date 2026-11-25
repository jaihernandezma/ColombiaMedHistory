(() => {
  const config = window.CMH_CONFIG || {};
  document.querySelectorAll('[data-link="demo"]').forEach((link) => {
    if (config.demoUrl) link.href = config.demoUrl;
  });
  const essay = document.querySelector('[data-link="essay"]');
  if (essay && config.essayPdfUrl) essay.href = config.essayPdfUrl;
  function httpsUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url : null;
    } catch { return null; }
  }
  const slides = document.querySelector('#diapositivas');
  const expand = document.querySelector('#ampliar');
  if (document.fullscreenEnabled && slides.requestFullscreen) {
    expand.hidden = false;
    expand.addEventListener('click', async () => {
      const status = document.querySelector('#aviso-presentacion');
      status.textContent = '';
      try {
        await slides.requestFullscreen();
        slides.focus();
      } catch {
        status.textContent = 'No se pudo activar la pantalla completa. Puedes abrir la presentación en OneDrive.';
      }
    });
  }
  for (const person of config.team || []) {
    const card = document.createElement('article'), name = document.createElement('h3'), role = document.createElement('p');
    name.textContent = person.name; role.textContent = person.role; card.append(name,role);
    const url = httpsUrl(person.portfolioUrl);
    if (url) {
      const link = document.createElement('a'); link.href = url.href;
      link.textContent = 'Portafolio de ' + person.name.split(' ')[0] + ' ↗'; card.append(link);
    } else {
      const status = document.createElement('small'); status.textContent = 'Portafolio pendiente de enlace'; card.append(status);
    }
    document.querySelector('#integrantes').append(card);
  }

  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    navLinks?.classList.toggle('open', !isOpen);
  });

  navLinks?.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Abrir menú');
      navLinks.classList.remove('open');
    }
  });

})();
