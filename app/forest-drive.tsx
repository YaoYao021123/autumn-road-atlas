'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './forest-drive.css';

export function ForestDrive({onRouteSelect}:{onRouteSelect:(day:number)=>void}) {
  const [failed,setFailed]=useState(false);
  return <section className="forest-drive" data-foliage="larch" aria-labelledby="forest-drive-title">
    <div className="forest-drive-stage">
      {!failed&&<picture className="forest-drive-art">
        <source media="(max-width: 760px)" srcSet="/forest-drive-960.webp"/>
        {/* oxlint-disable-next-line next/no-img-element -- Pre-optimized responsive WebP; static export has no image transformation service. */}
        <img src="/forest-drive.webp" width="1440" height="960" loading="lazy" decoding="async" fetchPriority="low" alt="金黄白桦与落叶松环抱一条安静的弯曲公路，原创生成的秋林意象，非具体路段实拍" onError={()=>setFailed(true)}/>
      </picture>}
      <div className="forest-drive-shade" aria-hidden="true"/>
      <div className="forest-drive-copy"><span className="forest-drive-eyebrow">一段路，也是一幕秋天</span><h2 id="forest-drive-title">把秋天，<br/>开成一部电影。</h2><p>林间有光，路上有我们。<br/>这一小段，只管慢慢看。</p></div>
      <span className="forest-drive-margin" aria-hidden="true">穿林而过</span>
    </div>
    <div className="forest-drive-caption"><p>{failed?'画面暂未载入 · ':''}原创 AI 秋林意象 · 非沿途实拍，非实时路况。</p><Button variant="ghost" onClick={()=>onRouteSelect(4)}>回到 D04 · 林草过渡段<ArrowUpRight size={15}/></Button></div>
  </section>;
}
