'use client';

import { useEffect, useRef } from 'react';

export function AutumnAtmosphere({enabled}:{enabled:boolean}) {
  const layer=useRef<HTMLDivElement>(null),particles=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!enabled||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const animations=new Set<Animation>();
    let lastScroll=0,lastClick=0,serial=0;
    let start:{x:number;y:number}|null=null;
    const emit=(clientX:number,clientY:number,count:number,kind:'click'|'scroll')=>{
      const root=particles.current;
      if(!root||document.hidden||root.childElementCount>8)return;
      const bounds=root.getBoundingClientRect();
      for(let i=0;i<count;i++) {
        const seed=++serial,leaf=document.createElement('img');
        leaf.src='/autumn-birch.png';leaf.alt='';leaf.className='interaction-leaf';
        leaf.style.left=`${clientX-bounds.left}px`;leaf.style.top=`${clientY-bounds.top}px`;
        leaf.style.width=`${25+(seed%4)*5}px`;
        root.appendChild(leaf);
        const side=(i%2?1:-1),drift=side*(38+(seed%3)*20),angle=(seed*73)%360;
        const lift=kind==='click'?-45:-10,fall=kind==='click'?92:128;
        const animation=leaf.animate([
          {transform:`translate3d(-50%,-50%,0) rotate(${angle}deg) scale(.65)`,opacity:0,offset:0},
          {transform:`translate3d(calc(-50% + ${drift*.45}px),${lift}px,0) rotate(${angle+side*50}deg) scale(1)`,opacity:.8,offset:.24},
          {transform:`translate3d(calc(-50% + ${drift}px),${fall}px,0) rotate(${angle+side*150}deg) scale(.8)`,opacity:0,offset:1},
        ],{duration:kind==='click'?1800:2100,delay:i*55,easing:'cubic-bezier(.22,.46,.58,1)',fill:'both',iterations:1});
        animations.add(animation);
        const finish=()=>{animations.delete(animation);leaf.remove();};
        void animation.finished.then(finish,finish);
      }
    };
    const pointerDown=(e:PointerEvent)=>{start={x:e.clientX,y:e.clientY};};
    const click=(e:MouseEvent)=>{
      if(e.detail>0&&start&&Math.hypot(e.clientX-start.x,e.clientY-start.y)>8)return;
      const now=performance.now();if(now-lastClick<220)return;lastClick=now;
      if(!(e.target instanceof Element)||!e.target.closest('.atlas')||e.target.closest('.atmosphere-button'))return;
      const box=e.target.getBoundingClientRect();
      emit(e.detail?e.clientX:box.left+box.width/2,e.detail?e.clientY:box.top+box.height/2,3,'click');
    };
    const scroll=()=>{
      const now=performance.now();if(now-lastScroll<700)return;lastScroll=now;
      emit(window.innerWidth*.72,Math.min(window.innerHeight*.36,290),2,'scroll');
    };
    window.addEventListener('pointerdown',pointerDown,{passive:true,capture:true});
    window.addEventListener('click',click,{passive:true,capture:true});
    window.addEventListener('scroll',scroll,{passive:true,capture:true});
    return()=>{
      window.removeEventListener('pointerdown',pointerDown,true);window.removeEventListener('click',click,true);window.removeEventListener('scroll',scroll,true);
      animations.forEach(animation=>animation.cancel());particles.current?.replaceChildren();
    };
  },[enabled]);
  if(!enabled)return null;
  return <div className="autumn-atmosphere" aria-hidden="true" ref={layer}>
    <div className="autumn-corner autumn-corner-one"><img src="/autumn-birch.png" alt=""/></div>
    <div className="autumn-corner autumn-corner-two"><img src="/autumn-birch.png" alt=""/></div>
    <div className="autumn-corner autumn-corner-three"><img src="/autumn-birch.png" alt=""/></div>
    <div className="interaction-leaves" ref={particles}/>
  </div>;
}
