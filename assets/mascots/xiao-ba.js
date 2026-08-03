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
    .dynamic-island__eye{position:absolute;left:22.5%;top:59.7%;width:5.2%;height:3.25%;border-radius:50%;background:#48352b;opacity:0;transform:scaleY(.05);transform-origin:center;pointer-events:none}
    .dynamic-island.is-blinking .dynamic-island__eye{animation:ks-xiaoba-blink .42s ease-in-out 1}
    @keyframes ks-xiaoba-float{0%,100%{transform:translate3d(0,0,0) rotate(-1.8deg)}50%{transform:translate3d(-5px,-16px,0) rotate(1.8deg)}}
    @keyframes ks-xiaoba-blink{0%,100%{opacity:0;transform:scaleY(.05)}18%,55%{opacity:1;transform:scaleY(1.25)}35%{opacity:0;transform:scaleY(.05)}}
    @media(max-width:680px){.dynamic-island{width:clamp(122px,34vw,156px);right:8px;bottom:8px}}
    @media(prefers-reduced-motion:reduce){.dynamic-island{animation:ks-xiaoba-float 6.8s ease-in-out infinite!important}.dynamic-island.is-blinking .dynamic-island__eye{animation:ks-xiaoba-blink .42s ease-in-out 1!important}}
  `;
  document.head.appendChild(style);
  const island = document.createElement('button');
  island.className = 'dynamic-island';
  island.type = 'button';
  island.setAttribute('aria-label', 'Say hello to Xiao Ba');
  island.innerHTML = `<img src="${assetUrl}" alt="Xiao Ba, the Kita-Sora companion"><span class="dynamic-island__eye" aria-hidden="true"></span>`;
  document.body.appendChild(island);
  island.addEventListener('click', () => {
    island.classList.remove('is-blinking');
    void island.offsetWidth;
    island.classList.add('is-blinking');
    window.setTimeout(() => island.classList.remove('is-blinking'), 460);
  });
})();
