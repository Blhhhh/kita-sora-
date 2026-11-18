(() => {
 const page=document.body.dataset.page;
 const menu=document.querySelector('.universe-menu');
 const nav=document.querySelector('.universe-nav');
 const close=()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-menu-open')};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-menu-open',open)});
 nav.addEventListener('keydown',e=>{if(e.key==='Escape'){close();menu.focus()}});
 document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});
 matchMedia('(min-width: 1001px)').addEventListener('change',close);
 document.querySelectorAll('.harbor-photo-card').forEach(x=>x.removeAttribute('tabindex'));
})();
