'use client';
/* oxlint-disable next/no-img-element -- Reuse the small local botanical texture directly; this static export has no image-optimization server. */

import { ArrowUpRight, Leaf, ParkingCircle, TreeDeciduous } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sceneKindLabels, type RoadScene } from './road-experience';
import './road-scenery.css';

export function RoadScenery({dayId,scenes,selectedSceneId,onSelect}:{dayId:number;scenes:RoadScene[];selectedSceneId:string|null;onSelect:(id:string)=>void}) {
  return <section className="road-scenery" aria-labelledby="road-scenery-title">
    <div className="road-scenery-heading"><div><span className="eyebrow"><Leaf size={14}/>风景，不只在目的地</span><h2 id="road-scenery-title">D{String(dayId).padStart(2,'0')} · 车窗外的秋天</h2></div><p>点选一处，在地图上展开。<br/><span>只标现有路线，不额外绕行。</span></p></div>
    {scenes.length?<div className="road-scene-list">{scenes.map((scene,i)=><article className={`road-scene-item ${selectedSceneId===scene.id?'is-selected':''}`} key={scene.id}>
    <Button variant="ghost" className="road-scene-select" aria-pressed={selectedSceneId===scene.id} aria-label={`在地图查看${scene.title}，${sceneKindLabels[scene.kind]}`} onClick={()=>onSelect(scene.id)}><span className={`road-scene-index ${scene.kind!=='window'?'is-parking':''}`}>{scene.kind==='window'?<><img src="/autumn-birch-384.png" alt=""/><b>{String(i+1).padStart(2,'0')}</b></>:<ParkingCircle size={23}/>}</span><span><small>{scene.road} · {sceneKindLabels[scene.kind]}</small><strong>{scene.title}</strong></span><ArrowUpRight size={18}/></Button>
      <p>{scene.description}</p><small className="road-scene-timing">{scene.timing}</small>
    </article>)}</div>:<div className="road-scenery-empty"><TreeDeciduous size={22}/><p>{dayId===1?'今天先好好出发。取车、熟悉车辆与转场已经足够，不额外插入景点。':'把最后一早留给从容还车。不为追景压缩 10:00 到店的缓冲。'}</p></div>}
    <p className="road-scenery-footnote"><Leaf size={13}/><span>叶标 / 金色短线：景观路段示意，由乘客观景拍摄。<strong>P：已核验停车入口位置，开放与规则待复核。</strong>勿在应急车道、桥面或路肩停留，勿驶入草场；秋色以临行实况为准。</span></p>
  </section>;
}
