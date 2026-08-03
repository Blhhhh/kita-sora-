/* Kita-Sora dynamic island: swap only the PNG when a later place needs its own companion. */
(() => {
  const currentScript = document.currentScript;
  const assetUrl = new URL('xiao-ba-3d-v2.png', currentScript.src).href;
  const style = document.createElement('style');
  style.textContent = `
    .dynamic-island{position:fixed;right:clamp(18px,3vw,42px);bottom:clamp(16px,3vw,36px);z-index:2000;width:clamp(158px,16vw,232px);aspect-ratio:2/3;border:0;padding:0;background:none;cursor:pointer;isolation:isolate;filter:drop-shadow(0 14px 24px rgba(31,52,75,.19));animation:ks-xiaoba-float 4.7s ease-in-out infinite;transition:filter .3s ease}
    .dynamic-island:hover{filter:drop-shadow(0 18px 30px rgba(31,52,75,.25))}
    .dynamic-island:focus-visible{outline:2px solid #ff8ca0;outline-offset:6px;border-radius:30px}
    .dynamic-island img{width:100%;height:100%;object-fit:contain;display:block;user-select:none;pointer-events:none}
    .dynamic-island__eye{position:absolute;left:21.4%;top:58.85%;width:7.1%;height:5.6%;border-radius:50%;background:#a66e45;opacity:0;transform:scaleY(.1);transform-origin:center;pointer-events:none}
    .dynamic-island__eye::after{content:'';position:absolute;left:18%;right:14%;top:36%;height:38%;border-bottom:2px solid #46362c;border-radius:0 0 50% 50%}
    .dynamic-island.is-blinking .dynamic-island__eye{animation:ks-xiaoba-blink .34s ease-in-out 1}
    .dynamic-island.is-playing{filter:drop-shadow(0 0 16px rgba(166,220,253,.75)) drop-shadow(0 14px 24px rgba(31,52,75,.19))}
    @keyframes ks-xiaoba-float{0%,100%{transform:translate3d(0,0,0) rotate(-1.8deg)}50%{transform:translate3d(-5px,-16px,0) rotate(1.8deg)}}
    @keyframes ks-xiaoba-blink{0%,100%{opacity:0;transform:scaleY(.1)}30%,65%{opacity:1;transform:scaleY(1)}45%{opacity:1;transform:scaleY(.28)}}
    @media(max-width:680px){.dynamic-island{width:clamp(122px,34vw,156px);right:8px;bottom:8px}}
    @media(prefers-reduced-motion:reduce){.dynamic-island{animation:ks-xiaoba-float 6.8s ease-in-out infinite!important}.dynamic-island.is-blinking .dynamic-island__eye{animation:ks-xiaoba-blink .34s ease-in-out 1!important}}
  `;
  document.head.appendChild(style);
  const island = document.createElement('button');
  island.className = 'dynamic-island';
  island.type = 'button';
  island.setAttribute('aria-label', 'Say hello to Xiao Ba');
  island.innerHTML = `<img src="${assetUrl}" alt="Xiao Ba, the Kita-Sora companion"><span class="dynamic-island__eye" aria-hidden="true"></span>`;
  document.body.appendChild(island);
  const music = new Audio('https://res.cloudinary.com/ul3gr1pn/video/upload/v1783928351/%E5%B0%8F%E5%85%AB%E9%9F%B3%E4%B9%90%E7%9B%92_copy_ur1x4v.m4a');
  music.loop = true;
  music.preload = 'none';
  let isPlaying = false;
  island.addEventListener('click', () => {
    island.classList.remove('is-blinking');
    void island.offsetWidth;
    island.classList.add('is-blinking');
    window.setTimeout(() => island.classList.remove('is-blinking'), 380);
  });
  island.addEventListener('dblclick', async (event) => {
    event.preventDefault();
    if (isPlaying) {
      music.pause();
      isPlaying = false;
      island.classList.remove('is-playing');
      island.setAttribute('aria-label', 'Play Xiao Ba music');
      return;
    }
    try {
      await music.play();
      isPlaying = true;
      island.classList.add('is-playing');
      island.setAttribute('aria-label', 'Pause Xiao Ba music');
    } catch (_) {}
  });
})();
