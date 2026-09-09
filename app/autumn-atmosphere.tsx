'use client';
/* oxlint-disable next/no-img-element -- decorative local PNG assets are statically shipped and no image-optimization server is present. */

import { useEffect, useRef } from 'react';

const LEAF_POOL_SIZE=5;

export function AutumnAtmosphere({enabled}:{enabled:boolean}) {
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
    const emit=(clientX:number,clientY:number,count:number,kind:'tap'|'scroll')=>{
      if(document.hidden||!leafPool.length)return;
      const leaves=leafPool.filter(Boolean),limit=Math.min(count,narrow.matches?2:3,leaves.length);
      for(let i=0;i<limit;i++) {
        const leaf=leaves[(serial+i)%leaves.length];
        if(leaf)wakeLeaf(leaf,clientX,clientY,i,kind);
      }
    };
    const pointerDown=(e:PointerEvent)=>{start={x:e.clientX,y:e.clientY};};
    const click=(e:MouseEvent)=>{
      if(e.detail>0&&start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>10)return;
      const now=performance.now();if(now-lastClick<220)return;lastClick=now;
      if(!(e.target instanceof Element)||!e.target.closest('.atlas')||e.target.closest('.atmosphere-button,button,a,input,select,textarea,[role="slider"],.leaflet-container'))return;
      const box=e.target.getBoundingClientRect();
      emit(e.detail?e.clientX:box.left+box.width/2,e.detail?e.clientY:box.top+box.height/2,narrow.matches?2:3,'tap');
    };
    const scroll=()=>{
      if(scrollTimer)window.clearTimeout(scrollTimer);
      scrollTimer=window.setTimeout(()=>{
        scrollTimer=undefined;
        const compact=narrow.matches;
        emit(window.innerWidth*(compact?.7:.72),Math.min(window.innerHeight*(compact?.34:.36),compact?246:290),compact?1:2,'scroll');
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
  },[enabled]);
  if(!enabled)return null;
  return <>
    <div className="autumn-atmosphere" aria-hidden="true">
      <div className="autumn-corner autumn-corner-one"><img src="/autumn-birch-384.png" alt=""/></div>
      <div className="autumn-corner autumn-corner-two"><img src="/autumn-birch-384.png" alt=""/></div>
      <div className="autumn-corner autumn-corner-three"><img src="/autumn-birch-384.png" alt=""/></div>
    </div>
    <div className="interaction-leaves" aria-hidden="true">{Array.from({length:LEAF_POOL_SIZE},(_,index)=><img key={index} className="interaction-leaf" src="/autumn-birch-384.png" alt="" decoding="async" ref={node=>{if(node)pool.current[index]=node;}}/>)}</div>
  </>;
}
