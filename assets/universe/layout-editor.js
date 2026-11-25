(() => {
  const canvas = document.getElementById('canvas');
  const status = document.getElementById('status');
  const download = document.getElementById('download');
  let layout = null;
  let pending = null;
  let mode = 'desktop';
  function fit() {
    const available = document.querySelector('main').clientWidth - 40;
    const scale = Math.min(1, available / Number(canvas.width));
    const wrap = document.getElementById('canvas-wrap');
    canvas.style.transform = 'scale(' + scale + ')';
    wrap.style.width = Number(canvas.width) * scale + 'px';
    wrap.style.height = Number(canvas.height) * scale + 'px';
  }
  new ResizeObserver(fit).observe(document.querySelector('main'));
  fit();
  const valid = input => input?.version === 1 && ['desktop','mobile'].every(board =>
    ['ithaca','harbor','market','workshop'].every(id => {
      const value = input[board]?.[id];
      return value && ['x','y','width'].every(key => Number.isFinite(value[key])) &&
        value.x >= 0 && value.x <= 100 && value.y >= 0 && value.y <= 100 &&
        value.width >= 10 && value.width <= 80;
    }));
  function send(value) {
    canvas.contentWindow.postMessage({type:'kita-islands-load',layout:value},location.origin);
  }
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== canvas.contentWindow ||
        event.data?.type !== 'kita-islands-state' || !valid(event.data.layout)) return;
    if (pending) {
      const value = pending;
      pending = null;
      send(value);
      return;
    }
    layout = event.data.layout;
    try { localStorage.setItem('kita-sora-islands-v1',JSON.stringify(layout)); } catch {}
    download.disabled = false;
    status.textContent = '布局已暂存在这台浏览器。完成后请导出 JSON。';
  });
  try {
    const draft = JSON.parse(localStorage.getItem('kita-sora-islands-v1'));
    if (valid(draft)) pending = draft;
  } catch {}
  for (const board of ['desktop','mobile']) {
    document.getElementById(board).addEventListener('click', () => {
      mode = board;
      canvas.width = mode === 'desktop' ? 1440 : 390;
      canvas.height = mode === 'desktop' ? 900 : 844;
      fit();
      for (const id of ['desktop','mobile']) document.getElementById(id).setAttribute('aria-pressed',String(id===mode));
    });
  }
  download.addEventListener('click', () => {
    if (!layout) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(layout,null,2)+'\n'],{type:'application/json'}));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Kita-Sora.island-layout.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
    status.textContent = '布局 JSON 已导出。把这个文件交给 Codex 即可应用到官网。';
  });
  document.getElementById('import').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const value = JSON.parse(await file.text());
      if (!valid(value)) throw new Error('请使用本编辑器导出的四岛布局 JSON。');
      send(value);
    } catch(error) { status.textContent = '导入失败 · '+error.message; }
    event.target.value = '';
  });
})();
