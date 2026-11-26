// Only destinations reached from the isolated motion study opt into this fade.
(() => {
 if(new URLSearchParams(location.search).get('motionStudy')!=='1')return;
 document.body.classList.add('motion-page-enter');
 for(const link of document.querySelectorAll('a[href]')){
  const url=new URL(link.href);
  if(url.origin===location.origin&&/\/(index\.html)?$/.test(url.pathname)){
   link.href=new URL('review/map-motion-1126/',location.origin+'/').href;
  }
 }
})();
