/* Boat navigation only; the existing island interactions, styles and artwork are unchanged. */
(() => {
  'use strict';
  const map=document.querySelector('[data-world-shell="v2"]');
  if(!map)return;
  const stage=map.querySelector('.world-stage'),boat=map.querySelector('.map-boat');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const params=new URLSearchParams(location.search);
  const simulateReduced=params.get('motion')==='reduce';
  const reduced=()=>reduce.matches||simulateReduced;
  map.classList.toggle('reduced-motion-preview',simulateReduced);
  const focus=params.get('focus');
  if(['yakumo','harbor','shop','china'].includes(focus))map.dataset.focus=focus;
  if(params.get('hover'))map.querySelector('.place--'+params.get('hover'))?.classList.add('review-hover');
  let paused=params.has('pause-world')||Boolean(focus);
  map.classList.toggle('motion-paused',paused);
  map.addEventListener('world-motion-toggle',()=>{paused=!paused;map.classList.toggle('motion-paused',paused);});
  const places=[...map.querySelectorAll('.place')],ids=places.map(p=>p.dataset.place);
  const key='kitaSoraBoatDockV1',route=window.KSWorldRoute;
  const ns='http://www.w3.org/2000/svg';
  const wake=document.createElementNS(ns,'svg');wake.classList.add('boat-wake');wake.setAttribute('aria-hidden','true');stage.prepend(wake);
  const strands=Array.from({length:36},()=>{const p=document.createElementNS(ns,'path');wake.append(p);return p;});
  let docked='china',bounds,trip=null,raf=0,deadline=0,trail=[],lastSample=0,yaw=0;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function readDock(){try{const saved=sessionStorage.getItem(key);if(ids.includes(saved))docked=saved;}catch{}}
  function saveDock(id){docked=id;try{sessionStorage.setItem(key,id);}catch{}}
  function measure(){
    bounds={width:stage.clientWidth,height:stage.clientHeight,places:{}};
    for(const place of places){
      const art=place.querySelector('.place-art');
      // Layout dimensions deliberately exclude hover scale and the decorative float transform.
      bounds.places[place.dataset.place]={x:place.offsetLeft-place.offsetWidth/2,y:place.offsetTop-place.offsetHeight/2,w:art.offsetWidth,h:art.offsetHeight};
    }
    wake.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
  }
  function dockPoint(id){return route.dock(bounds,id,boat.offsetWidth);}
  function drawBoat(p,angle=0){
    boat.style.left=`${p.x}px`;boat.style.top=`${p.y}px`;
    boat.style.transform=`translate(-50%, -76%) rotate(${angle}deg)`;
    boat.dataset.position=`${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }
  function clearWake(){trail=[];lastSample=0;strands.forEach(p=>p.setAttribute('d',''));}
  function drawWake(now){
    trail=trail.filter(p=>now-p.time<700);
    strands.forEach((line,i)=>{
      const a=trail[i],b=trail[i+1];
      if(!a||!b){line.setAttribute('d','');return;}
      line.setAttribute('d',`M${a.x.toFixed(2)} ${a.y.toFixed(2)} L${b.x.toFixed(2)} ${b.y.toFixed(2)}`);
      line.setAttribute('stroke',i%3?'#edf5ed':'#cce5e9');
      line.setAttribute('opacity',String(Math.pow(1-(now-a.time)/700,1.8)*.32));
      line.setAttribute('stroke-width','1.4');
    });
  }
  function rest(){measure();yaw=0;drawBoat(dockPoint(docked));boat.dataset.dock=docked;boat.dataset.state='docked';map.dataset.motion='docked';clearWake();}
  function openDestination(){
    if(!trip||trip.opened)return;
    trip.opened=true;clearTimeout(deadline);cancelAnimationFrame(raf);
    saveDock(trip.id);drawBoat(dockPoint(docked));boat.dataset.dock=docked;boat.dataset.state='docked';
    location.assign(trip.href);
  }
  function tick(now){
    if(!trip||trip.opened)return;
    const progress=clamp((now-trip.started)/trip.duration,0,1);
    const eased=progress*progress*(3-2*progress);
    const from=dockPoint(trip.from),to=dockPoint(trip.id);
    const p=route.point(bounds,from,to,eased),next=route.point(bounds,from,to,Math.min(1,eased+.002));
    const dx=next.x-p.x,dy=next.y-p.y,length=Math.hypot(dx,dy);
    if(length>.0001){
      const target=clamp(Math.atan2(dy,Math.abs(dx))*180/Math.PI*.12,-12,12);
      yaw+=(target-yaw)*.16;
      if(now-lastSample>25){
        // The hull anchor trails in the opposite direction of actual travel.
        trail.push({x:p.x-dx/length*boat.offsetWidth*.20,y:p.y-dy/length*boat.offsetWidth*.20,time:now});lastSample=now;
      }
    }
    drawBoat(p,yaw);drawWake(now);
    if(progress===1){openDestination();return;}
    raf=requestAnimationFrame(tick);
  }
  function sail(link,event){
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    saveDock(link.dataset.place);
    return; // V1: native navigation; boat remains docked in the world.
    if(trip){event.preventDefault();return;}
    const id=link.dataset.place;
    if(reduced()){saveDock(id);return;}
    event.preventDefault();measure();
    link.classList.add('is-arriving');
    trip={id,from:docked,href:link.href,started:performance.now(),duration:0,opened:false};
    if(id===docked){
      // Retain the existing brief island entry interaction, without inventing a voyage.
      link.classList.add('is-arriving');map.classList.add('is-departing');
      deadline=setTimeout(openDestination,480);return;
    }
    trip.duration=route.duration(bounds,dockPoint(docked),dockPoint(id));
    boat.dataset.state='sailing';boat.dataset.destination=id;map.dataset.motion='sailing';
    clearWake();raf=requestAnimationFrame(tick);
    // A throttled/background animation must not strand navigation beyond the maximum wait.
    deadline=setTimeout(openDestination,Math.min(2300,trip.duration+100));
  }
  places.forEach(link=>link.addEventListener('click',e=>sail(link,e)));
  // Remember normal utility links to these worlds too, without changing their navigation.
  document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    if(trip){e.preventDefault();return;}
    const place=places.find(p=>p.href===link.href);if(place)saveDock(place.dataset.place);
  }));
  function reset(){
    cancelAnimationFrame(raf);clearTimeout(deadline);trip=null;
    map.classList.remove('is-departing');places.forEach(p=>p.classList.remove('is-arriving'));
    readDock();rest();delete boat.dataset.destination;
  }
  new ResizeObserver(()=>{measure();clearWake();if(!trip)rest();}).observe(stage);
  reduce.addEventListener('change',()=>{if(reduced()&&trip)openDestination();else if(!trip)rest();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!trip)rest();});
  addEventListener('pagehide',()=>{cancelAnimationFrame(raf);clearTimeout(deadline);});
  addEventListener('pageshow',reset);
  // A direct return from an inner world identifies its dock, including normal back links.
  readDock();
  try{const ref=new URL(document.referrer);if(ref.origin===location.origin){const place=places.find(p=>new URL(p.href).pathname===ref.pathname);if(place)saveDock(place.dataset.place);}}catch{}
  rest();
})();
