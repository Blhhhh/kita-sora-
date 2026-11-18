'use strict';
const details = {
 bookmark: {href:'https://ko-fi.com/s/f57e0dce88',label:'Buy the bookmark on Ko-fi ↗',status:'Available on Ko-fi. See the bookmark listing for current price and shipping.',title:'Under the North Sky',copy:'A film bookmark made from Lynn’s photographs of Yakumo. A little northern sky to keep between the pages.',images:[['bookmark-under-the-north-sky.jpg.webp','The bookmark photographed in an open book'],['unboxing-bookmark.jpg.webp','The original bookmark and paper goods'],['postcard-back.jpg.webp','The Kita-Sora postcard back']]},
 stickers: {href:'shop/ithaca.html',label:'Explore the postcards ↗',status:'On display · sticker ordering is not available here yet.',title:'Five little things to carry',copy:'Winter Traveler · Home, Blooming · The Bear · The Swing Tree · A World Inside. Five real sticker designs from the To Ithaca collection.',images:[['sticker-winter-traveler.jpg.webp','Winter Traveler'],['sticker-home-blooming.jpg.webp','Home, Blooming'],['sticker-the-bear.jpg.webp','The Bear'],['sticker-the-swing-tree.jpg.webp','The Swing Tree'],['sticker-a-world-inside.jpg.webp','A World Inside']]}
};
const dialog=document.querySelector('#object-details');
let previousFocus;
document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>{
 const item=details[button.dataset.detail];previousFocus=button;
 document.querySelector('#detail-title').textContent=item.title;
 document.querySelector('#detail-copy').textContent=item.copy;
 document.querySelector('.detail-images').replaceChildren(...item.images.map(([file,alt])=>{const img=new Image();img.src='assets/ithaca/'+file;img.alt=alt;img.decoding='async';return img}));
 const action=dialog.querySelector('a');
 action.href=item.href;action.textContent=item.label;
 action.target=button.dataset.detail==='bookmark'?'_blank':'_self';
 action.rel='noopener';
 dialog.querySelector('.detail-status').textContent=item.status;
 dialog.showModal();
}));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>previousFocus?.focus());
