(() => {
 const selectors='main h1, main h2, main h3, main p, main .island-caption, .harbor-heading, .release-heading, .character-copy, .harbor-letter-story, .postcard-world .caption, .map .place-label, .map .origin, .site-footer, .envelope-open-label, .work-steps, .work > .btn, .work > .social-links';
 document.querySelectorAll(selectors).forEach(node=>{
  if(node.closest('.letter-voyage,.letter-carousel,.bear-modal,.back,.card,.site-footer, .envelope-open-label, .work-steps, .work > .btn, .work > .social-links') && !node.matches('.site-footer, .envelope-open-label, .work-steps, .work > .btn, .work > .social-links'))return;
  if(node.closest('[aria-hidden="true"],[hidden]'))return;
  if(!node.parentElement.closest('.sea-text'))node.classList.add('sea-text');
 });
})();