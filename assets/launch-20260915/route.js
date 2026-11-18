/* Boat-only dock coordinates and short curved passages, in the island stage's coordinates. */
(function(root){'use strict';
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function dock(bounds,id,boatWidth){
    const a=bounds.places[id], mobile=bounds.width<600;
    const left=id==='yakumo'||id==='china';
    const shore=mobile?{yakumo:.78,china:.79,harbor:.78,shop:.80}:{yakumo:.79,china:.80,harbor:.76,shop:.79};
    return {x:a.x+a.w*(left?.92:.08)+(left?1:-1)*boatWidth*.22,y:a.y+a.h*shore[id]};
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
