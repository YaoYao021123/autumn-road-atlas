'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, TreeDeciduous } from 'lucide-react';
import './day-landscape.css';

export type DailyScene = {
  day: number;
  image: string;
  title: string;
  alt: string;
  source: string;
  dateLabel: string;
  credit: string;
  author?: string;
  licenseLabel?: string;
  licenseUrl?: string;
  position?: string;
};

// The parent keys this by the selected scene, so a failed request never hides other days.
export function DayLandscape({scene}:{scene:DailyScene}) {
  const [failed,setFailed]=useState(false);
  const [ready,setReady]=useState(false);
  const imageRef=useRef<HTMLImageElement>(null);
  useEffect(()=>{
    // SSR/preloaded images can finish before hydration attaches event handlers.
    const image=imageRef.current;
    if(image?.complete){
      setReady(image.naturalWidth>0);
      setFailed(image.naturalWidth===0);
    }
  },[]);
  return <figure className="autumn-window daily-window" data-day={scene.day} data-ready={ready}>
    <div className="daily-image-surface">
      {failed
        ? <div className="daily-image-fallback" role="status"><TreeDeciduous size={27} strokeWidth={1.3}/><span>{scene.title}<small>图片暂未载入，可打开原图出处</small></span></div>
        : <img ref={imageRef} src={scene.image} alt={scene.alt} width={800} height={450} style={{objectPosition:scene.position??'center'}} loading="eager" fetchPriority="high" decoding="async" onLoad={()=>setReady(true)} onError={()=>setFailed(true)}/>}
    </div>
    <figcaption>
      <span>{scene.title}<small>{scene.dateLabel} · 非今年实况</small>{scene.licenseUrl&&<small className="daily-photo-license">{scene.author} · <a href={scene.licenseUrl} target="_blank" rel="noopener noreferrer">{scene.licenseLabel}</a></small>}</span>
      <a href={scene.source} target="_blank" rel="noopener noreferrer" title={scene.credit} aria-label={`查看${scene.title}照片出处：${scene.credit}`}>出处<ArrowUpRight size={12}/></a>
    </figcaption>
  </figure>;
}
