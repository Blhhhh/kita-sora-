(() => {
 const page=document.body.dataset.page;
 const menu=document.querySelector('.universe-menu');
 const nav=document.querySelector('.universe-nav');
 const close=()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-menu-open')};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-menu-open',open)});
 nav.addEventListener('keydown',e=>{if(e.key==='Escape'){close();menu.focus()}});
 document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});
 matchMedia('(min-width: 1001px)').addEventListener('change',close);
 let lastY=window.scrollY;
 const updateScroll=()=>{
  const y=window.scrollY,delta=y-lastY;
  nav.classList.toggle('is-scrolled',y>16);
  if(y<96||delta<-3||nav.classList.contains('is-menu-open'))nav.classList.remove('is-nav-hidden');
  else if(delta>3)nav.classList.add('is-nav-hidden');
  lastY=y;
 };
 window.addEventListener('scroll',updateScroll,{passive:true});
 nav.addEventListener('focusin',()=>nav.classList.remove('is-nav-hidden'));
 updateScroll();
 document.querySelectorAll('.harbor-photo-card').forEach(x=>x.removeAttribute('tabindex'));
})();
