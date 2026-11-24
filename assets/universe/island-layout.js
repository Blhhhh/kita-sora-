(() => {
  const script = document.currentScript;
  const layoutURL = new URL('island-layout.json', script.src);
  const ids = {ithaca:'yakumo', harbor:'harbor', workshop:'china', market:'shop'};
  const stage = document.querySelector('.world-stage');
  const editable = new URLSearchParams(location.search).get('layoutEditor') === '1';
  const media = matchMedia('(max-width: 700px)');
  let layout;
  const variant = () => media.matches ? 'mobile' : 'desktop';

  function route() {
    const order = ['workshop', 'market', 'harbor', 'ithaca'];
    const points = order.map(id => layout[variant()][id]);
    const path = points.slice(1).reduce((d, point, i) => {
      const previous = points[i];
      return d + ` C ${previous.x} ${(point.y + previous.y) / 2}, ${point.x} ${(point.y + previous.y) / 2}, ${point.x} ${point.y}`;
    }, `M ${points[0].x} ${points[0].y}`);
    stage.querySelector('.sailing-trace').setAttribute('d', path);
  }
  function apply() {
    for (const [id, place] of Object.entries(ids)) {
      const node = stage.querySelector(`[data-place="${place}"]`);
      const values = layout[variant()][id];
      node.style.setProperty('--x', values.x + '%');
      node.style.setProperty('--y', values.y + '%');
      node.style.setProperty('--w', values.width + '%');
    }
    route();
  }
  function notify() {
    window.parent.postMessage({type:'kita-islands-state', layout}, location.origin);
  }
  function valid(input) {
    return input?.version === 1 && ['desktop','mobile'].every(mode =>
      Object.keys(ids).every(id => {
        const value = input[mode]?.[id];
        return value && ['x','y','width'].every(key => Number.isFinite(value[key])) &&
          value.x >= 0 && value.x <= 100 && value.y >= 0 && value.y <= 100 &&
          value.width >= 10 && value.width <= 80;
      }));
  }
  function edit() {
    document.body.classList.add('island-editing');
    for (const [id, place] of Object.entries(ids)) {
      const node = stage.querySelector(`[data-place="${place}"]`);
      node.addEventListener('click', event => event.preventDefault());
      node.tabIndex = 0;
      node.setAttribute('aria-label', `拖动 ${id}，方向键移动，加减键缩放`);
      const handle = document.createElement('button');
      handle.className = 'island-resize';
      handle.type = 'button';
      handle.setAttribute('aria-label', `缩放 ${id}`);
      handle.textContent = '↘';
      node.append(handle);
      node.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        event.preventDefault();
        const bounds = stage.getBoundingClientRect();
        const initial = {...layout[variant()][id]};
        const originX = event.clientX;
        const originY = event.clientY;
        const resizing = event.target === handle;
        node.setPointerCapture(event.pointerId);
        const move = next => {
          const dx = (next.clientX - originX) / bounds.width * 100;
          const dy = (next.clientY - originY) / bounds.height * 100;
          const value = layout[variant()][id];
          if (resizing) value.width = Math.max(10, Math.min(80, initial.width + dx * 2));
          else {
            value.x = Math.max(0, Math.min(100, initial.x + dx));
            value.y = Math.max(0, Math.min(100, initial.y + dy));
          }
          apply();
          notify();
        };
        const end = () => {
          node.removeEventListener('pointermove', move);
          node.removeEventListener('pointerup', end);
          node.removeEventListener('pointercancel', end);
          notify();
        };
        node.addEventListener('pointermove', move);
        node.addEventListener('pointerup', end);
        node.addEventListener('pointercancel', end);
      });
      node.addEventListener('keydown', event => {
        const value = layout[variant()][id];
        const amount = event.shiftKey ? 2 : .5;
        const actions = {
          ArrowLeft: () => value.x = Math.max(0,value.x-amount),
          ArrowRight: () => value.x = Math.min(100,value.x+amount),
          ArrowUp: () => value.y = Math.max(0,value.y-amount),
          ArrowDown: () => value.y = Math.min(100,value.y+amount),
          '+': () => value.width = Math.min(80,value.width+amount),
          '-': () => value.width = Math.max(10,value.width-amount)
        };
        if (actions[event.key]) {
          event.preventDefault();
          actions[event.key]();
          apply();
          notify();
        }
      });
    }
    window.addEventListener('message', event => {
      if (event.origin !== location.origin || event.source !== window.parent ||
          event.data?.type !== 'kita-islands-load' || !valid(event.data.layout)) return;
      layout = structuredClone(event.data.layout);
      apply();
      notify();
    });
    notify();
  }
  fetch(layoutURL).then(response => {
    if (!response.ok) throw new Error('Layout could not be loaded');
    return response.json();
  }).then(data => {
    if (!valid(data)) throw new Error('Invalid island layout');
    layout = data;
    apply();
    media.addEventListener('change', apply);
    if (editable) edit();
  }).catch(error => console.error(error));
})();
