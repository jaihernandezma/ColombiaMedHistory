(() => {
  const enabled = matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  const cards = '.panel,.how-grid article,.tarjeta-muestra,.rejilla article,.columnas article';
  let frame = 0;
  let pointer;

  function paint() {
    frame = 0;
    const {clientX: x, clientY: y, target} = pointer;
    document.body.style.setProperty('--px', `${x}px`);
    document.body.style.setProperty('--py', `${y}px`);
    document.body.classList.add('lighting');
    const card = target.closest(cards);
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--local-x', `${x - rect.left}px`);
      card.style.setProperty('--local-y', `${y - rect.top}px`);
    }
  }

  function move(event) {
    pointer = event;
    if (!frame) frame = requestAnimationFrame(paint);
  }

  function clear() {
    cancelAnimationFrame(frame);
    frame = 0;
    document.body.classList.remove('lighting');
  }

  function configure() {
    clear();
    document.removeEventListener('pointermove', move);
    if (enabled.matches) document.addEventListener('pointermove', move, {passive:true});
  }

  document.documentElement.addEventListener('pointerleave', clear);
  enabled.addEventListener('change', configure);
  configure();
})();
