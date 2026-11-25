(() => {
 const dialog=document.querySelector('.product-preview');
 const image=dialog.querySelector('img');
 const title=dialog.querySelector('h2');
 document.querySelectorAll('[data-product-preview]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();image.src=link.href;image.alt=link.dataset.productTitle;title.textContent=link.dataset.productTitle;dialog.showModal();
 }));
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
})();