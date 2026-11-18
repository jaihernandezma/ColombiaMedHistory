(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    navLinks.classList.toggle('open', !isOpen);
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú');
      navLinks.classList.remove('open');
    }
  });

  const tabs = [...document.querySelectorAll('.clinical-tab')];
  const selectTab = (tab) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      tabs[nextIndex].focus();
      selectTab(tabs[nextIndex]);
    });
  });

  const filters = [...document.querySelectorAll('.filter-button')];
  const featureCards = [...document.querySelectorAll('.feature-card')];
  const emptyMessage = document.querySelector('.filter-empty');
  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const value = filter.dataset.filter;
      filters.forEach((button) => {
        const active = button === filter;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      let visible = 0;
      featureCards.forEach((card) => {
        const show = value === 'all' || card.dataset.status === value;
        card.hidden = !show;
        if (show) visible += 1;
      });
      emptyMessage.hidden = visible !== 0;
    });
  });
})();
