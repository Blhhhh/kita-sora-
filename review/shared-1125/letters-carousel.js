(() => {
  const root = document.querySelector('.letter-carousel');
  const stage = root.querySelector('.letter-stage');
  const cards = [...root.querySelectorAll('.letter-card')];
  const previous = root.querySelector('[data-previous]');
  const next = root.querySelector('[data-next]');
  const dots = root.querySelector('.letter-dots');
  let active = 2;
  let startX = null;
  let dragged = false;
  let lastWheel = 0;

  function layout() {
    const width = Math.min(stage.clientWidth * (stage.clientWidth < 700 ? .76 : .49), 600);
    stage.style.setProperty('--letter-width', width + 'px');
    cards.forEach((card, index) => {
      const offset = index - active;
      const side = Math.sign(offset);
      const depth = Math.abs(offset);
      const x = side * (width * .46 + width * .18 * (depth - 1));
      card.style.transform = offset === 0
        ? 'translate3d(0,0,120px) rotateY(0deg)'
        : `translate3d(${x}px,20px,${-depth * 120}px) scale(.90) rotateY(${-side * 58}deg)`;
      card.style.zIndex = 20 - depth;
      card.style.filter = offset === 0 ? 'none' : 'brightness(.70) saturate(.75)';
      card.tabIndex = offset === 0 ? 0 : -1;
      card.draggable = false;
      card.setAttribute('aria-current', String(offset === 0));
      card.setAttribute('aria-label', card.dataset.title + (offset === 0 ? ' · read on Substack' : ' · select letter'));
    });
    const card = cards[active];
    const title = root.querySelector('.letter-title');
    title.textContent = card.dataset.title;
    title.href = card.href;
    title.target = '_blank';
    title.rel = 'noopener noreferrer';
    root.querySelector('.letter-copy').textContent = card.dataset.copy;
    [...dots.children].forEach((dot, index) => {
      dot.setAttribute('aria-pressed', String(index === active));
      dot.classList.toggle('is-active', index === active);
    });
    previous.disabled = active === 0;
    next.disabled = active === cards.length - 1;
  }
  function go(index) {
    active = Math.max(0, Math.min(cards.length - 1, index));
    layout();
  }
  cards.forEach((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'letter-dot';
    dot.setAttribute('aria-label', 'Select letter ' + (index + 1) + ': ' + card.dataset.title);
    dot.addEventListener('click', () => go(index));
    dots.append(dot);
    card.addEventListener('click', event => {
      if (index !== active) {
        event.preventDefault();
        go(index);
      }
    });
  });
  previous.addEventListener('click', () => go(active - 1));
  next.addEventListener('click', () => go(active + 1));
  root.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    go(active + (event.key === 'ArrowRight' ? 1 : -1));
    cards[active].focus({preventScroll:true});
  });
  stage.addEventListener('pointerdown', event => {
    startX = event.clientX;
    dragged = false;
  });
  stage.addEventListener('pointerup', event => {
    if (startX === null) return;
    const distance = event.clientX - startX;
    startX = null;
    if (Math.abs(distance) > 35) {
      dragged = true;
      go(active + (distance < 0 ? 1 : -1));
    }
  });
  stage.addEventListener('pointercancel', () => { startX = null; });
  stage.addEventListener('click', event => {
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
    dragged = false;
  }, true);
  stage.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) < 10 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    const now = performance.now();
    if (now - lastWheel < 350) return;
    lastWheel = now;
    go(active + (event.deltaX > 0 ? 1 : -1));
  }, {passive:false});
  new ResizeObserver(layout).observe(stage);
  layout();
})();
