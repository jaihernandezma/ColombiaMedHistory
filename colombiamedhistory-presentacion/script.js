(() => {
  const config = window.CMH_CONFIG || {};
  document.querySelectorAll('[data-link="demo"]').forEach((link) => {
    if (config.demoUrl) link.href = config.demoUrl;
  });
  const essayLink = document.getElementById('essay-final-link');
  if (essayLink && config.essayPdfUrl) {
    essayLink.href = config.essayPdfUrl;
    essayLink.hidden = false;
  }
  (config.team || []).forEach((member, index) => {
    const link = document.querySelector(`[data-team="${index}"]`);
    if (link && member.portfolioUrl) {
      link.href = member.portfolioUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Ver portafolio ↗';
    }
  });
  const video = document.getElementById('video-embed');
  if (video && config.youtubeUrl) {
    const match = config.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (match) {
      video.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${match[1]}" title="Video pitch de ColombiaMedHistory" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }
  }

  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    navLinks.classList.toggle('open', !isOpen);
  });

  navLinks?.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú');
      navLinks.classList.remove('open');
    }
  });

})();
