'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, Camera, ChevronDown, Film, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import content from './literary-scenes.json';
import works from './cultural-works.json';
import dayScenes from './day-scenes.json';
import './literary.css';

type Props = { motionEnabled: boolean; onRouteSelect: (day: number) => void };
type Work = { title:string; boundary:string; sources:{label:string;url:string}[] };

function WorkSources({work}:{work:Work}) {
  return <details className="culture-provenance"><summary>作品与这段路的关系<ChevronDown size={14}/></summary><p>{work.boundary}</p><div>{work.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<ArrowUpRight size={12}/></a>)}</div></details>;
}

export function LiteraryInterlude({ motionEnabled, onRouteSelect }: Props) {
  const section = useRef<HTMLElement>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const failed=(id:string)=>setFailedImages(ids=>ids.includes(id)?ids:[...ids,id]);
  const river=content.scenes[0],forest=content.scenes[1],city=dayScenes[6];

  useEffect(()=>{
    const element=section.current;
    if(!element||!motionEnabled||!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:.12});
    element.querySelectorAll('[data-culture-scene]').forEach(scene=>observer.observe(scene));
    return()=>observer.disconnect();
  },[motionEnabled]);

  return <section ref={section} id="right-bank" className="literary-interlude culture-story" aria-labelledby="literary-heading" data-motion={motionEnabled}>
    <header className="culture-heading">
      <div><span className="culture-eyebrow"><BookOpen size={15}/>北方的另一种地图</span><h2 id="literary-heading">路上，<em>读到北方。</em></h2></div>
      <nav aria-label="沿途文化篇章"><a href="#culture-river">河流</a><a href="#culture-grassland">草原</a><a href="#culture-cinema">远方</a><a href="#culture-homecoming">归途</a></nav>
    </header>

    <article id="culture-river" className="culture-river culture-scene" data-culture-scene aria-labelledby="river-work-title">
      <figure className="culture-river-art">
        {!failedImages.includes('river')&&<img src={river.image} alt={river.alt} width={1536} height={1024} loading="lazy" decoding="async" onError={()=>failed('river')}/>}
        <figcaption>{failedImages.includes('river')?'画面暂未载入 · ':''}原创 AI 氛围图 · 非沿途实景</figcaption>
      </figure>
      <div className="culture-copy culture-river-copy">
        <span className="culture-location">01 / 河流与时间 <i>额尔古纳方向</i></span>
        <h3 id="river-work-title">额尔古纳河<br/><em>右岸</em></h3>
        <p className="culture-work-meta">{works.book.creator} · {works.book.year} · {works.book.recognition}</p>
        <figure className="culture-quotation"><blockquote cite={content.quoteSource}>{content.quote}</blockquote><figcaption><a href={content.quoteSource} target="_blank" rel="noopener noreferrer">小说短引 · 原文出处<ArrowUpRight size={12}/></a></figcaption></figure>
        <p className="culture-body">{works.book.description}</p>
        <Button variant="ghost" className="culture-route-link" onClick={()=>onRouteSelect(works.book.routeDay)}>回到 D03 · 额尔古纳方向<ArrowUpRight size={16}/></Button>
        <WorkSources work={works.book}/>
      </div>
      <span className="culture-sideword" aria-hidden="true">河流不赶路</span>
    </article>

    <aside className="culture-photography culture-scene" data-culture-scene aria-labelledby="photography-title">
      <figure className="culture-forest-art">
        {!failedImages.includes('forest')&&<img src={forest.image} alt={forest.alt} width={1536} height={1024} loading="lazy" decoding="async" onError={()=>failed('forest')}/>}
        <figcaption>原创 AI 森林意象<br/>不是王伟摄影原作，亦非观鹿地点</figcaption>
      </figure>
      <div className="culture-copy culture-photo-copy"><span className="culture-eyebrow"><Camera size={15}/>把目光从树木移向人</span><h3 id="photography-title">森林里，<br/>有人生活。</h3><p className="culture-work-meta">王伟 ·《{works.photography.title}》摄影系列</p><p className="culture-body">{works.photography.description}</p><p className="culture-photo-recognition">{works.photography.recognition}。</p><a className="culture-text-link" href={works.photography.sources[0].url} target="_blank" rel="noopener noreferrer">去看摄影原作<ArrowUpRight size={17}/></a><p className="culture-margin-note">根河敖鲁古雅 · 区域延伸阅读，不在本次路线<br/>摄影原图未确认转载许可，仅提供原作入口。</p></div>
    </aside>

    <article id="culture-grassland" className="culture-grassland culture-scene" data-culture-scene aria-labelledby="grassland-work-title">
      <span className="culture-grassland-word" aria-hidden="true">旷</span>
      <div className="culture-copy culture-grassland-title"><span className="culture-location">02 / 草原与记忆 <i>海拉尔周边</i></span><h3 id="grassland-work-title">课本里的<span>《草原》</span><br/>这次，在车窗外。</h3><p className="culture-work-meta">老舍 · 1961 ·《内蒙风光》节选</p><p className="culture-verse">在出发以前，<br/>我们已经在文字里，来过一次。</p></div>
      <div className="culture-copy culture-grassland-copy"><span className="culture-small-title">熟悉的文字，有了方向</span><p className="culture-body">{works.grassland.description}</p><p className="culture-season-note">把课本里的碧色留给记忆，<br/>把今年的秋色留给车窗。</p><Button variant="ghost" className="culture-route-link" onClick={()=>onRouteSelect(works.grassland.routeDay)}>回到 D03 · 海拉尔出发<ArrowUpRight size={16}/></Button><WorkSources work={works.grassland}/></div>
    </article>

    <article id="culture-cinema" className="culture-cinema culture-scene" data-culture-scene aria-labelledby="cinema-work-title">
      <figure className="culture-cinema-art">{!failedImages.includes('film')&&<img src={works.film.image} alt={works.film.imageAlt} width={1074} height={670} loading="lazy" decoding="async" onError={()=>failed('film')}/>}<figcaption><a href={works.film.sources[0].url} target="_blank" rel="noopener noreferrer">{works.film.imageCredit}<ArrowUpRight size={12}/></a></figcaption></figure>
      <div className="culture-cinema-body culture-copy"><span className="culture-location">03 / 城市与远方 <i>满洲里</i></span><span className="culture-medium"><Film size={15}/>电影 · {works.film.year}</span><h3 id="cinema-work-title">大象<br/>席地而坐</h3><p className="culture-work-meta">胡波导演 · {works.film.recognition}</p><p className="culture-cinema-line">不是所有远方，<br/>都为了看风景。</p><p className="culture-body">{works.film.description}</p><p className="culture-cinema-boundary">叙事中的目的地，不是满洲里取景纪录。<br/>冷峻而沉重的长片，适合出发前静下来观看。</p><div className="culture-cinema-actions"><a className="culture-text-link" href={works.film.watchUrl} target="_blank" rel="noopener noreferrer"><Play size={16}/>{works.film.watchLabel}<ArrowUpRight size={16}/></a><Button variant="ghost" className="culture-route-link" onClick={()=>onRouteSelect(works.film.routeDay)}>回到 D03 · 满洲里<ArrowUpRight size={16}/></Button></div><WorkSources work={works.film}/></div>
      <span className="culture-cinema-place" aria-hidden="true">满洲里</span>
    </article>

    <article id="culture-homecoming" className="culture-homecoming culture-scene" data-culture-scene aria-labelledby="homecoming-work-title">
      <figure className="culture-city-art">{!failedImages.includes('city')&&<img src={city.image} alt="长春新民广场周边秋日航拍，2023年10月24日新华社历史照片，用于城市氛围；不是《人世间》剧照或已安排的取景地" width={1000} height={667} loading="lazy" decoding="async" onError={()=>failed('city')}/>}<figcaption><a href={city.source} target="_blank" rel="noopener noreferrer">长春新民广场 · 2023.10.24 · 新华社颜麟蕴摄<ArrowUpRight size={12}/></a><span>历史城市影像 · 非剧照</span></figcaption></figure>
      <div className="culture-copy culture-homecoming-copy"><span className="culture-location">04 / 回到日常 <i>长春</i></span><h3 id="homecoming-work-title">走过山河，<br/>回到<span>人世间。</span></h3><p className="culture-work-meta">电视剧《人世间》· 2022 · 李路导演 / 梁晓声原著</p><p className="culture-body">{works.homecoming.description}</p><a className="culture-text-link" href={works.homecoming.watchUrl} target="_blank" rel="noopener noreferrer"><Play size={15}/>{works.homecoming.watchLabel}<ArrowUpRight size={16}/></a><Button variant="ghost" className="culture-route-link" onClick={()=>onRouteSelect(works.homecoming.routeDay)}>回到 D07 · 10:00 到店还车<ArrowUpRight size={16}/></Button><WorkSources work={works.homecoming}/></div>
    </article>

    <footer className="culture-colophon"><p>除标注的小说短引外，串联文字均为原创旁白。文学意象、电影叙事、真实取景地与摄影拍摄地分别标明；作品不等于旅行打卡清单。</p><span>让作品改变观看，<br/>不让故事催促赶路。</span></footer>
  </section>;
}
