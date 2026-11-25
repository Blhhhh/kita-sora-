(() => {
 const selectors='.map-heading h1, .map-heading p, main h1, main h2, main h3, main p, main .island-caption, .harbor-heading, .release-heading, .character-copy, .harbor-letter-story, .postcard-world .caption, .map .place-label, .map .origin, .site-footer, .envelope-open-label, .work-steps, .work > .btn, .work > .social-links';
 document.querySelectorAll(selectors).forEach(node=>{
  if(node.closest('.letter-voyage,.letter-carousel,.bear-modal,.back,.card,.site-footer, .envelope-open-label, .work-steps, .work > .btn, .work > .social-links') && !node.matches('.site-footer, .envelope-open-label, .work-steps, .work > .btn, .work > .social-links'))return;
  if(node.closest('[aria-hidden="true"],[hidden]'))return;
  if(!node.parentElement.closest('.sea-text'))node.classList.add('sea-text');
 });
 // Only the opening title and one key passage get atmospheric mist.
 const title=document.querySelector('main h1, .map-heading h1, .map .origin, .harbor-heading h1, .crate-header h1');
 if(title)title.classList.add('sea-mist','mist-title');
 const emphasis={work:'.service-featured .service-copy',market:'.stall-copy article:first-child',about:'.about-story p:first-child',crochet:'.release-heading',ithaca:'.postcard-world .caption'};
 const key=document.querySelector(emphasis[document.body.dataset.page]||'[data-no-mist]');
 if(key)key.classList.add('sea-mist','mist-passage');
})();