// Fixed 3x-density paint layers, feathered in both axes: no hard tile edges.
(() => {
 const media=matchMedia('(max-width:700px)');
 let sea;
 function update(){
  if(media.matches&&!sea){
   sea=document.createElement('div');sea.className='mobile-sea';sea.setAttribute('aria-hidden','true');
   for(const phase of ['11','01','10','00']){const layer=document.createElement('span');layer.className='sea-phase sea-phase-'+phase;sea.append(layer)}
   document.body.prepend(sea);document.body.classList.add('sea-ready');
  }else if(!media.matches&&sea){sea.remove();sea=null;document.body.classList.remove('sea-ready')}
 }
 media.addEventListener('change',update);update();
})();
