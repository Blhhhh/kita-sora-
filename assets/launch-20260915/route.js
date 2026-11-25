/* Boat-only dock coordinates and short curved passages, in the island stage's coordinates. */
(function(root){'use strict';
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function dock(bounds,id,boatWidth){
    const a=bounds.places[id],left=id==='yakumo'||id==='china';
    const height=boatWidth*490/360,margin=8;
    const preferred={x:left?a.x+a.w+boatWidth*.65+8:a.x-boatWidth*.65-8,y:a.y+a.h*.45};
    const fits=p=>{
      const r={left:p.x-boatWidth/2,right:p.x+boatWidth/2,top:p.y-height*.76,bottom:p.y+height*.24};
      return r.left>=6&&r.right<=bounds.width-6&&r.top>=6&&r.bottom<=bounds.height-6&&
        Object.values(bounds.places).every(b=>r.right<b.x-margin||r.left>b.x+b.w+margin||r.bottom<b.y-margin||r.top>b.y+(b.totalH||b.h)+margin);
    };
    const candidates=[preferred];
    for(const fraction of [.15,.7,.95])candidates.push({x:preferred.x,y:a.y+a.h*fraction});
    for(let y=.12;y<.96;y+=.06)for(let x=.1;x<.94;x+=.04)candidates.push({x:bounds.width*x,y:bounds.height*y});
    return candidates.filter(fits).sort((p,q)=>Math.hypot(p.x-preferred.x,p.y-preferred.y)-Math.hypot(q.x-preferred.x,q.y-preferred.y))[0]||preferred;
  }
  function point(bounds,from,to,t){
    const u=clamp(t,0,1),v=1-u,channel=bounds.width*.5;
    return {x:v*v*v*from.x+3*v*v*u*channel+3*v*u*u*channel+u*u*u*to.x,
      y:v*v*v*from.y+3*v*v*u*from.y+3*v*u*u*to.y+u*u*u*to.y};
  }
  function duration(bounds,from,to){return 1200+800*clamp(Math.hypot(to.x-from.x,to.y-from.y)/Math.hypot(bounds.width*.65,bounds.height*.75),0,1);}
  const api={dock,point,duration};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.KSWorldRoute=api;
})(typeof window==='object'?window:globalThis);
