'use client';
/* oxlint-disable next/no-img-element -- decorative local PNG assets are statically shipped and no image-optimization server is present. */

import { useEffect, useRef } from 'react';
import { foliageForDay, foliageForContext } from './regional-foliage';

const LEAF_POOL_SIZE=5;

export function AutumnAtmosphere({enabled,day=1}:{enabled:boolean;day?:number}) {
  const leaf=foliageForDay(day);
  const pool=useRef<HTMLImageElement[]>([]);
  useEffect(()=>{
    if(!enabled||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const narrow=window.matchMedia('(max-width: 760px)');
    const leafPool=pool.current;
    let lastClick=0,serial=0,scrollTimer:number|undefined;
    let start:{x:number;y:number}|null=null;
    const wakeLeaf=(leaf:HTMLImageElement,clientX:number,clientY:number,index:number,kind:'tap'|'scroll')=>{
      const seed=++serial,compact=narrow.matches,side=(seed+index)%2?1:-1;
      const drift=side*((compact?24:38)+(seed%3)*(compact?9:15));
      const lift=kind==='tap'?(compact?-27:-44):-8;
      const fall=kind==='tap'?(compact?70:94):(compact?76:118);
      const angle=(seed*67)%360;
      const token=String(seed);
      leaf.style.left=`${Math.round(clientX)}px`;
      leaf.style.top=`${Math.round(clientY)}px`;
      leaf.style.width=`${compact?25+(seed%3)*3:28+(seed%4)*4}px`;
      leaf.style.setProperty('--leaf-mid-x',`${Math.round(drift*.42)}px`);
      leaf.style.setProperty('--leaf-mid-y',`${lift}px`);
      leaf.style.setProperty('--leaf-end-x',`${drift}px`);
      leaf.style.setProperty('--leaf-end-y',`${fall}px`);
      leaf.style.setProperty('--leaf-start-rotation',`${angle}deg`);
      leaf.style.setProperty('--leaf-mid-rotation',`${angle+side*48}deg`);
      leaf.style.setProperty('--leaf-end-rotation',`${angle+side*136}deg`);
      leaf.style.setProperty('--leaf-duration',`${compact?(kind==='tap'?1120:960):(kind==='tap'?1480:1320)}ms`);
      leaf.style.setProperty('--leaf-delay',`${index*(compact?42:58)}ms`);
      leaf.dataset.leafToken=token;
      leaf.dataset.active='false';
      leaf.style.animation='none';
      void leaf.offsetWidth;
      leaf.style.animation='';
      leaf.dataset.active='true';
      leaf.onanimationend=()=>{
        if(leaf.dataset.leafToken===token)leaf.dataset.active='false';
      };
    };
    const emit=(clientX:number,clientY:number,count:number,kind:'tap'|'scroll',context:Element|null)=>{
      if(document.hidden||!leafPool.length)return;
      const motif=foliageForContext(context,day);
      const leaves=leafPool.filter(Boolean),limit=Math.min(count,narrow.matches?2:3,leaves.length);
      for(let i=0;i<limit;i++) {
        const leaf=leaves[(serial+i)%leaves.length];
        if(leaf){leaf.src=motif.image;leaf.dataset.foliage=motif.kind;wakeLeaf(leaf,clientX,clientY,i,kind);}
      }
    };
    const pointerDown=(e:PointerEvent)=>{start={x:e.clientX,y:e.clientY};};
    const click=(e:MouseEvent)=>{
      if(e.detail>0&&start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>10)return;
      const now=performance.now();if(now-lastClick<220)return;lastClick=now;
      if(!(e.target instanceof Element)||!e.target.closest('.atlas')||e.target.closest('.atmosphere-button,button,a,input,select,textarea,[role="slider"],.leaflet-container'))return;
      const box=e.target.getBoundingClientRect();
      emit(e.detail?e.clientX:box.left+box.width/2,e.detail?e.clientY:box.top+box.height/2,narrow.matches?2:3,'tap',e.target);
    };
    const scroll=(e:Event)=>{
      if(e.target instanceof Element&&(!e.target.closest('.atlas')||e.target.closest('.leaflet-container')))return;
      if(scrollTimer)window.clearTimeout(scrollTimer);
      scrollTimer=window.setTimeout(()=>{
        scrollTimer=undefined;
        const compact=narrow.matches;
        const atlas=document.querySelector('.atlas');if(!atlas)return;
        const box=atlas.getBoundingClientRect(),left=Math.max(0,box.left),right=Math.min(window.innerWidth,box.right);
        if(box.bottom<=0||box.top>=window.innerHeight||right<=left)return;
        const x=left+(right-left)*(compact?.7:.72),y=Math.min(window.innerHeight*(compact?.34:.36),compact?246:290);
        // Hit-test only after scrolling settles; never run a per-frame observer.
        const target=document.elementFromPoint(x,y);
        let context=target?.closest('[data-foliage]')??null;
        if(!context){
          // In the breathing space between chapters, use the nearest visible
          // chapter, not a day selected several screens earlier.
          let nearest=Infinity;
          atlas.querySelectorAll('section[data-foliage],article[data-foliage],aside[data-foliage]').forEach(node=>{
            const rect=node.getBoundingClientRect();
            if(rect.bottom<=0||rect.top>=window.innerHeight||rect.width<=0)return;
            const distance=Math.max(rect.top-y,y-rect.bottom,0);
            if(distance<nearest){nearest=distance;context=node;}
          });
        }
        emit(x,y,compact?1:2,'scroll',context);
      },narrow.matches?180:150);
    };
    window.addEventListener('pointerdown',pointerDown,{passive:true,capture:true});
    window.addEventListener('click',click,{passive:true,capture:true});
    window.addEventListener('scroll',scroll,{passive:true,capture:true});
    return()=>{
      window.removeEventListener('pointerdown',pointerDown,true);window.removeEventListener('click',click,true);window.removeEventListener('scroll',scroll,true);
      if(scrollTimer)window.clearTimeout(scrollTimer);
      leafPool.forEach(leaf=>{leaf.dataset.active='false';leaf.style.animation='';});
    };
  },[enabled,day]);
  if(!enabled)return null;
  return <>
    <div className="autumn-atmosphere" aria-hidden="true">
      <div className="autumn-corner autumn-corner-one"><img src={leaf.image} alt=""/></div>
      <div className="autumn-corner autumn-corner-two"><img src={leaf.image} alt=""/></div>
      <div className="autumn-corner autumn-corner-three"><img src={leaf.image} alt=""/></div>
    </div>
    <div className="interaction-leaves" aria-hidden="true">{Array.from({length:LEAF_POOL_SIZE},(_,index)=><img key={index} className="interaction-leaf" src={leaf.image} alt="" decoding="async" ref={node=>{if(node)pool.current[index]=node;}}/>)}</div>
  </>;
}
