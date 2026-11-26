(() => {
 const body=document.body, map=document.querySelector('.map'), places=[...map.querySelectorAll('.place')];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const ns='http://www.w3.org/2000/svg';
 places.forEach(place=>{
  const art=place.querySelector('.world-float');
  const wrapper=document.createElement('span');wrapper.className='motion-art';
  art.before(wrapper);wrapper.append(art);
  const ripple=document.createElement('span');ripple.className='motion-ripple';ripple.setAttribute('aria-hidden','true');art.append(ripple);
 });
 const snow=map.querySelector('.place--yakumo .place-art');
 const smoke=document.createElementNS(ns,'svg');smoke.setAttribute('viewBox','0 0 30 60');smoke.setAttribute('class','snow-smoke');smoke.setAttribute('aria-hidden','true');
 const wisp=document.createElementNS(ns,'path');wisp.setAttribute('d','M12 57 C3 46 24 40 15 29 S8 17 18 5');smoke.append(wisp);snow.append(smoke);
 const lamp=document.createElement('span');lamp.className='harbor-lamp';lamp.setAttribute('aria-hidden','true');map.querySelector('.place--harbor .place-art').append(lamp);
 const work=map.querySelector('.place--china .place-art');
 [['motion-mailbox','assets/universe/objects-1125/mailbox.webp'],['motion-envelope','assets/world-map-v1/envelope.webp']].forEach(([className,src])=>{const img=new Image();img.className=className;img.src=src;img.alt='';work.append(img)});
 const route=map.querySelector('.map-route'), trace=route.querySelector('.sailing-trace');
 const mask=document.createElementNS(ns,'mask');mask.id='motion-route-mask';mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('x','-10');mask.setAttribute('y','-10');mask.setAttribute('width','120');mask.setAttribute('height','120');
 const reveal=document.createElementNS(ns,'path');reveal.setAttribute('fill','none');reveal.setAttribute('stroke','white');reveal.setAttribute('stroke-width','5');reveal.setAttribute('pathLength','100');reveal.setAttribute('class','motion-route-reveal');mask.append(reveal);route.querySelector('defs').append(mask);trace.setAttribute('mask','url(#motion-route-mask)');
 const syncRoute=()=>reveal.setAttribute('d',trace.getAttribute('d'));syncRoute();new MutationObserver(syncRoute).observe(trace,{attributes:true,attributeFilter:['d']});
 const boat=document.createElement('div');boat.className='motion-boat';boat.setAttribute('aria-hidden','true');boat.append(map.querySelector('.map-boat svg').cloneNode(true));body.append(boat);
 const replay=document.createElement('button');replay.type='button';replay.className='motion-replay';replay.textContent='Replay arrival';replay.addEventListener('click',()=>location.reload());body.append(replay);
 let leaving=false, ready=false;
 function homePoint(){
  if(innerWidth<=700){const gap=map.querySelector('.mobile-island-connection').getBoundingClientRect();return{x:gap.x,y:gap.y+gap.height*.6}}
  const bounds=map.querySelector('.world-stage').getBoundingClientRect();return{x:bounds.x+bounds.width*.50,y:bounds.y+bounds.height*.69};
 }
 function setBoat(p){boat.style.transform=`translate(${p.x-boat.offsetWidth/2}px,${p.y-20}px)`}
 function rest(){if(!leaving){boat.getAnimations().forEach(a=>a.cancel());const p=homePoint();setBoat(p);if(ready&&!reduced.matches)boat.animate(innerWidth<=700?[{translate:'0 16px'},{translate:'0 -16px'}]:[{translate:'-65px 0'},{translate:'65px 0'}],{duration:10000,iterations:Infinity,direction:'alternate',easing:'linear'});}}
 setTimeout(()=>{ready=true;body.classList.add('motion-entered');rest()},reduced.matches?150:1650);
 reduced.addEventListener('change',rest);
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&entry.target.classList.contains('motion-offscreen')){entry.target.classList.remove('motion-offscreen');entry.target.classList.add('motion-scroll-arrival');observer.unobserve(entry.target)}}),{threshold:.2});
 if(innerWidth<=700)places.forEach(place=>{if(place.getBoundingClientRect().top>=innerHeight){place.classList.add('motion-offscreen');observer.observe(place)}});
 function returnFromIsland(){
  let id;try{id=sessionStorage.getItem('ksMotionReturn');sessionStorage.removeItem('ksMotionReturn')}catch{}
  if(!id)return;
  leaving=false;ready=true;body.classList.remove('is-sailing-away');body.classList.add('motion-entered','is-returning');
  const place=places.find(p=>p.dataset.place===id);if(!place)return;
  const art=place.querySelector('.place-art').getBoundingClientRect(),to=homePoint();
  boat.getAnimations().forEach(a=>a.cancel());setBoat(to);
  if(!reduced.matches)boat.animate([{transform:`translate(${art.x+art.width/2-18}px,${art.bottom-35}px)`},{transform:`translate(${to.x-boat.offsetWidth/2}px,${to.y-20}px)`}],{duration:450,easing:'ease-in-out'});
  setTimeout(rest,460);
 }
 returnFromIsland();
 addEventListener('resize',rest);addEventListener('scroll',()=>{if(innerWidth<=700&&!leaving)setBoat(homePoint())},{passive:true});
 places.forEach(place=>place.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();event.stopImmediatePropagation();if(leaving)return;leaving=true;
  place.classList.add('is-tapped');body.classList.add('is-sailing-away');
  const art=place.querySelector('.place-art').getBoundingClientRect(), from=boat.getBoundingClientRect();
  boat.getAnimations().forEach(a=>a.cancel());boat.style.opacity='1';
  if(!reduced.matches)boat.animate([{transform:`translate(${from.x}px,${from.y}px)`},{transform:`translate(${art.x+art.width*.5-18}px,${art.bottom-35}px)`}],{duration:490,easing:'ease-in-out',fill:'forwards'});
  try{sessionStorage.setItem('ksMotionReturn',place.dataset.place)}catch{}
  const url=new URL(place.href);url.searchParams.set('motionStudy','1');
  setTimeout(()=>location.assign(url.href),reduced.matches?150:520);
 },true));
 addEventListener('pageshow',event=>{if(event.persisted)returnFromIsland()});
})();
