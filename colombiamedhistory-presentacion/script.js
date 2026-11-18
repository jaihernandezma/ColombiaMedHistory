(() => {
  const config = window.CMH_CONFIG || {};
  document.querySelectorAll('[data-link="demo"]').forEach((link) => {
    if (config.demoUrl) link.href = config.demoUrl;
  });

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

  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const light = document.createElement('div');
    light.className = 'academic-light';
    light.setAttribute('aria-hidden', 'true');
    document.body.append(light);
    const targets = document.querySelectorAll('.info-card,.step-card,.feature-card,.clinical-card,.legal-grid article');
    targets.forEach((element) => element.classList.add('academic-glow'));
    let frame = 0, x = 0, y = 0;
    document.addEventListener('pointermove', (event) => {
      x = event.clientX;
      y = event.clientY;
      const target = event.target.closest('.academic-glow');
      if (target) {
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--local-x', `${x - rect.left}px`);
        target.style.setProperty('--local-y', `${y - rect.top}px`);
      }
      light.classList.add('visible');
      if (!frame) frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${x}px`);
        document.documentElement.style.setProperty('--pointer-y', `${y}px`);
        frame = 0;
      });
    }, { passive: true });
    document.addEventListener('pointerleave', () => light.classList.remove('visible'));
  }
})();
