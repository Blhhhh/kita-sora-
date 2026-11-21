/* V1 operational behavior. No new content or world geometry. */
(() => {
 const page=document.body.dataset.page;
 // Custom details use the same keyboard/return contract as native dialogs.
 const shells=[...document.querySelectorAll('.bear-modal,.china-story-shell')];
 shells.forEach(shell=>{
  let trigger=null,priorOverflow='';
  const close=shell.querySelector('button');
  const update=()=>{
   const open=shell.getAttribute('aria-hidden')==='false';
   // Details must be interactive before focus can leave the page behind them.
   shell.inert=!open;
   if(open&&!shell.dataset.v1Open){
    shell.dataset.v1Open='true';trigger=page==='china'?document.activeElement:null;
    priorOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    // Allow an opening visibility transition to reach its visible state first.
    requestAnimationFrame(()=>{
     if(shell.getAttribute('aria-hidden')==='false')close?.focus();
    });
   }else if(!open&&shell.dataset.v1Open){
    delete shell.dataset.v1Open;document.body.style.overflow=priorOverflow;trigger?.focus();
   }
  };
  new MutationObserver(update).observe(shell,{attributes:true,attributeFilter:['aria-hidden']});update();
  shell.addEventListener('keydown',e=>{
   if(e.key!=='Tab')return;
   const items=[...shell.querySelectorAll('a[href],button,[tabindex="0"]')].filter(x=>x.checkVisibility());
   if(!items.length)return;
   const first=items[0],last=items.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
 });
})();
