(() => {
  const map = document.querySelector('.journey-map');
  const route = map.querySelector('.journey-route');
  const sailed = route.querySelector('.sailed-route');
  const future = route.querySelector('.future-route');
  const boat = map.querySelector('.journey-boat');
  const toggle = map.querySelector('.sailing-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  let elapsed = 0;
  let previousTime = null;
  let length = 0;

  function curve(points) {
    return points.slice(1).reduce((path, point, index) => {
      const previous = points[index];
      const middleY = (previous.y + point.y) / 2;
      return path + ` C ${previous.x} ${middleY}, ${point.x} ${middleY}, ${point.x} ${point.y}`;
    }, `M ${points[0].x} ${points[0].y}`);
  }

  function placeBoat(distance) {
    if (!length) return;
    const point = sailed.getPointAtLength(distance);
    boat.style.transform = `translate(${point.x - boat.offsetWidth / 2}px,${point.y - boat.offsetHeight / 2}px)`;
  }

  function resize() {
    const bounds = map.getBoundingClientRect();
    const points = [...map.querySelectorAll('.station-dot')].map(dot => {
      const rect = dot.getBoundingClientRect();
      return {x: rect.left - bounds.left + rect.width / 2, y: rect.top - bounds.top + rect.height / 2};
    });
    route.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    sailed.setAttribute('d', curve(points.slice(0, 3)));
    future.setAttribute('d', curve(points.slice(2)));
    length = sailed.getTotalLength();
    placeBoat((elapsed % 90000) / 90000 * length);
  }

  function updateToggle() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Let the boat sail' : 'Pause the boat';
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    updateToggle();
  });
  reduced.addEventListener('change', event => {
    paused = event.matches;
    updateToggle();
  });
  function frame(now) {
    if (previousTime !== null && !paused && !document.hidden) {
      elapsed += Math.min(now - previousTime, 100);
    }
    previousTime = now;
    placeBoat(elapsed % 90000 / 90000 * length);
    requestAnimationFrame(frame);
  }
  new ResizeObserver(resize).observe(map);
  resize();
  updateToggle();
  requestAnimationFrame(frame);
})();
