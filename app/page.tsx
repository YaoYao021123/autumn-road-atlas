'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, ArrowRight, Compass, Navigation, Route, Clock3, Play, Pause, RotateCcw, ChevronDown, Info, MapPinned, Hotel, Check, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import MapCanvas from './map-canvas';
import { AutumnAtmosphere } from './autumn-atmosphere';
import './autumn.css';
import { getDays, segments, routeStops, navigationUrl, minutesText, type Endpoint } from './trip';

export default function Home() {
  const [dayId,setDayId]=useState(4),[endpoint,setEndpoint]=useState<Endpoint>('airport'),[overnight,setOvernight]=useState(false);
  const [playing,setPlaying]=useState(false),[progress,setProgress]=useState(0),[overview,setOverview]=useState(false),[navOpen,setNavOpen]=useState(false),[imageFailed,setImageFailed]=useState(false);
  const [atmosphere,setAtmosphere]=useState(true);
  const days=useMemo(()=>getDays(endpoint,overnight),[endpoint,overnight]),day=days[dayId-1];
  const legs=useMemo(()=>day.legs.map(id=>segments[id]),[day]);
  const allLegs=useMemo(()=>Array.from(new Set(days.flatMap(d=>d.legs))).map(id=>segments[id]),[days]);
  const stops=useMemo(()=>routeStops(legs),[legs]);
  const km=legs.reduce((sum,s)=>sum+s.km,0),minutes=Math.round(legs.reduce((sum,s)=>sum+s.minutes,0));
  const fallback=segments[endpoint==='airport'?'arxan_longjia':'arxan_changchun_west'].destination;
  const last=useRef<number|null>(null);
  const totalKm=allLegs.reduce((sum,s)=>sum+s.km,0);
  const titleParts=day.title.split(' → ');
  let segmentDistance=0;
  const selectedLeg=legs.find(leg=>{segmentDistance+=leg.km;return segmentDistance>=km*progress;})??legs.at(-1);

  const selectDay=(value:number)=>{setDayId(value);setPlaying(false);setProgress(0);setNavOpen(false);setOverview(false);};
  const stopPlayback=()=>{setPlaying(false);setProgress(0);};
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const handle=()=>{if(media.matches)setAtmosphere(false);};handle();
    media.addEventListener('change',handle);return()=>media.removeEventListener('change',handle);
  },[]);
  useEffect(()=>{
    type Tool={name:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>unknown};
    const context=(document as Document&{modelContext?:{registerTool:(tool:Tool,options:{signal:AbortSignal})=>unknown}}).modelContext;
    if(!context?.registerTool)return;
    const lifecycle=new AbortController();
    const tool:Tool={name:'configure_trip_preview',description:'Select a day and return option in the roadtrip preview. Only changes the displayed plan; does not book or navigate a car.',inputSchema:{type:'object',properties:{day:{type:'integer',minimum:1,maximum:7},endpoint:{type:'string',enum:['airport','west']},songyuanOvernight:{type:'boolean'}},required:['day'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){
      if(!input||typeof input!=='object')throw new Error('Expected an object');
      const value=input as Record<string,unknown>;
      if(Object.keys(value).some(k=>!['day','endpoint','songyuanOvernight'].includes(k))||!Number.isInteger(value.day)||Number(value.day)<1||Number(value.day)>7)throw new Error('day must be an integer from 1 to 7');
      if(value.endpoint!==undefined&&!['airport','west'].includes(String(value.endpoint)))throw new Error('Invalid endpoint');
      if(value.songyuanOvernight!==undefined&&typeof value.songyuanOvernight!=='boolean')throw new Error('songyuanOvernight must be boolean');
      flushSync(()=>{setDayId(Number(value.day));if(value.endpoint!==undefined)setEndpoint(value.endpoint as Endpoint);if(value.songyuanOvernight!==undefined)setOvernight(value.songyuanOvernight as boolean);setPlaying(false);setProgress(0);setNavOpen(false);setOverview(false);});
      return {day:Number(value.day),state:'preview_updated',...(value.endpoint!==undefined?{endpoint:value.endpoint}:{}),...(value.songyuanOvernight!==undefined?{songyuanOvernight:value.songyuanOvernight}:{})};
    }};
    try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
    return()=>lifecycle.abort();
  },[]);
  useEffect(()=>{
    if(!playing||!legs.length){last.current=null;return;}
    let frame:number;
    const animate=(now:number)=>{
      if(last.current!==null){const delta=Math.min(now-last.current,80)/32000;setProgress(p=>Math.min(1,p+delta));}
      last.current=now;frame=requestAnimationFrame(animate);
    };
    frame=requestAnimationFrame(animate);
    return()=>{cancelAnimationFrame(frame);last.current=null;};
  },[playing,legs]);
  useEffect(()=>{if(progress>=1)setPlaying(false);},[progress]);
  useEffect(()=>{
    const pause=()=>{if(document.hidden)setPlaying(false);};
    document.addEventListener('visibilitychange',pause);return()=>document.removeEventListener('visibilitychange',pause);
  },[]);

  return <main className="atlas">
    <AutumnAtmosphere enabled={atmosphere}/>
    <header className="site-header"><a className="brand" href="/" aria-label="北纬秋行首页"><Compass size={28}/><span>北纬秋行<small>AUTUMN ROAD ATLAS</small></span></a><span className="trip-date">2026.09.27 — 10.03</span><div className="header-meta"><Button variant="ghost" className="atmosphere-button" aria-label={atmosphere?'关闭交互叶片与秋日装饰':'开启交互叶片与秋日装饰'} aria-pressed={atmosphere} onClick={()=>setAtmosphere(v=>!v)} title={atmosphere?'关闭秋日氛围':'开启秋日氛围'}><Leaf/><span>秋意</span></Button><span className="return-deadline"><Clock3 size={15}/>10.03 · 11:00 长春还车</span></div></header>
    <div className="page-heading"><div><span className="eyebrow">大兴安岭 · 自驾路线</span><h1>沿着秋天，向北。</h1></div><div className="heading-note"><span className="verified-dot"/>百度路线已核验<small>09.09 导航基线 · 非国庆实时路况</small></div></div>
    <section className="workspace" aria-label="逐日地图与导航">
      <aside className="day-panel" aria-label="当天路线详情">
        {!imageFailed&&<figure className="autumn-window"><img src="https://xczx.news.cn/2023-10/13/1212288386_16971850126181n.jpg" alt="白色车辆驶过阿尔山雾中的金黄秋林公路，2023年历史照片" onError={()=>setImageFailed(true)}/><figcaption><span>阿尔山 · 秋色长廊</span><a href="https://xczx.news.cn/2023-10/13/c_1212288386.htm" target="_blank" rel="noopener noreferrer">2023 历史参考 <ArrowUpRight size={11}/></a></figcaption></figure>}
        <div className="day-content" key={`${dayId}-${endpoint}-${overnight}`}>
          <div className="chapter">DAY {String(day.id).padStart(2,'0')}<span>{day.date} / {day.weekday}</span></div>
          <h2>{titleParts[0]}{titleParts[1]&&<><ArrowRight/>{titleParts[1]}</>}</h2><p className="day-intro">{day.subtitle}</p>
          <div className="day-metrics"><div><Route size={15}/><strong>{legs.length?Math.round(km):'—'}<span>km</span></strong><small>{dayId===5?'外部自驾接驳':'规划里程'}</small></div><div><Clock3 size={15}/><strong>{legs.length?<>{Math.floor(minutes/60)}<span>h</span>{String(minutes%60).padStart(2,'0')}<span>min</span></>:'待定'}</strong><small>{legs.length?'当前驾驶基线':'实际门店尚未确定'}</small></div></div>
          <p className="budget"><Clock3 size={14}/>{day.budget}</p>
          <ol className="stops">{(stops.length?stops:[fallback]).map((stop,i)=><li key={`${stop.name}-${i}`}><span>{String(i+1).padStart(2,'0')}</span><div>{stop.name}<small>{day.stops[i]??'按实际进度安排短停'}</small></div>{i<legs.length&&<a className="stop-navigation" href={navigationUrl(legs[i])} target="_blank" rel="noopener noreferrer" title={`百度导航：${legs[i].origin.name}至${legs[i].destination.name}`} aria-label={`打开百度导航第${i+1}段，${legs[i].origin.name}至${legs[i].destination.name}`}><ArrowUpRight size={15}/></a>}</li>)}</ol>
          <Button className="navigate-button" disabled={!legs.length} onClick={()=>setNavOpen(!navOpen)} aria-expanded={navOpen} aria-controls="navigation-links"><Navigation size={16}/>{legs.length?'百度导航 · 分段打开':'还车门店待确认'}<ChevronDown size={16} className={navOpen?'rotate-180':''}/></Button>
          {navOpen&&<nav id="navigation-links" className="navigation-links" aria-label="百度分段驾车导航"><p>按顺序打开各段，保留草原途经点。</p>{legs.map((leg,i)=><a key={leg.id} href={navigationUrl(leg)} target="_blank" rel="noopener noreferrer"><span>{i+1}. {leg.origin.name} → {leg.destination.name}<small>{Math.round(leg.km)} km · {minutesText(leg.minutes)}</small></span><ArrowUpRight size={15}/></a>)}</nav>}
          <details className="day-note"><summary><Info size={14}/>当天提醒<ChevronDown size={14}/></summary><p>{day.note}</p></details>
        </div>
      </aside>
      <div className="map-stage">
        <MapCanvas legs={legs} allLegs={allLegs} progress={progress} overview={overview} dayId={dayId} fallback={fallback} onOverview={()=>setOverview(v=>!v)}/>
        <div className="map-top-label"><span className="verified-dot"/>{overview?'长春出发 · 全程路线':day.road}</div>
        <div className="map-view-switch"><Button variant="ghost" className={!overview?'selected':''} onClick={()=>setOverview(false)}>当日</Button><Button variant="ghost" className={overview?'selected':''} onClick={()=>setOverview(true)}>全程</Button></div>
        <div className="playback">
          <Button className="play-button" disabled={!legs.length} onClick={()=>{if(progress===1)setProgress(0);setPlaying(!playing);}} aria-label={playing?'暂停行车回放':'播放行车回放'} title={playing?'暂停行车回放':'播放行车回放'}>{playing?<Pause size={19} fill="currentColor"/>:<Play size={19} fill="currentColor"/>}</Button>
          <div className="playback-track"><div className="playback-heading"><strong>{progress===1?'当日回放结束':playing?'沿规划轨迹行进':legs.length?'预览这段公路':'还车日上午'}<span>{legs.length?`${Math.round(km*progress)} / ${Math.round(km)} km`:'10:00 到店'}</span></strong><small>{selectedLeg?`${selectedLeg.origin.name} → ${selectedLeg.destination.name}`:'具体门店未确认，不绘制虚构接驳路线'}</small></div><Slider aria-label="行车回放进度" value={[progress*100]} max={100} min={0} step={0.1} disabled={!legs.length} onValueChange={v=>{setPlaying(false);setProgress((Array.isArray(v)?v[0]:v)/100);}} className="route-slider"/></div>
          <Button variant="ghost" size="icon" className="replay-button" disabled={!legs.length} aria-label="重置回放" title="重置回放" onClick={stopPlayback}><RotateCcw size={17}/></Button>
          <span className="simulation-label">路线演示<br/>非实时定位</span>
        </div>
      </div>
    </section>
    <Tabs value={dayId} onValueChange={v=>selectDay(Number(v))} className="days-navigation"><TabsList aria-label="选择行程日期" className="days-list">{days.map(d=><TabsTrigger key={d.id} value={d.id} className="day-tab"><span>D{String(d.id).padStart(2,'0')}<small>{d.date}</small></span><strong>{d.short}</strong></TabsTrigger>)}</TabsList></Tabs>
    <section className="trip-settings" aria-label="取还车与返程方案"><div className="settings-title"><MapPinned size={17}/><div>路线条件<small>门店与驾驶人数尚待确认</small></div></div><div className="endpoint-field"><span id="endpoint-label">取还车代表点</span><Select value={endpoint} onValueChange={v=>{if(v==='airport'||v==='west'){setEndpoint(v);stopPlayback();}}}><SelectTrigger aria-labelledby="endpoint-label"><SelectValue>{endpoint==='airport'?'龙嘉机场 T2（暂定）':'长春西站（暂定）'}</SelectValue></SelectTrigger><SelectContent><SelectItem value="airport">龙嘉机场 T2（暂定）</SelectItem><SelectItem value="west">长春西站（暂定）</SelectItem></SelectContent></Select></div><label className="overnight-control" htmlFor="songyuan-overnight"><Hotel size={16}/><span>10 月 2 日住松原</span><Switch id="songyuan-overnight" checked={overnight} onCheckedChange={v=>{setOvernight(v);stopPlayback();if(dayId<6)setDayId(6);}}/></label><div className="total-distance"><strong>{Math.round(totalKm).toLocaleString()}<span>km</span></strong><small>当前路线合计 · 不含游览绕行</small></div></section>
    <footer className="page-footer"><span><Check size={13}/>实际规划轨迹 · 6 个行车游览日 + 还车日上午</span><span>2024 理想 L9 Pro · 辅助驾驶不抵消疲劳</span></footer>
    <details className="data-note"><summary>地图与数据说明</summary><p>驾车轨迹来自 2026 年 9 月 9 日百度地图 MCP 查询。底图为 OpenStreetMap；显示坐标从百度 BD-09 转为 WGS84，导航链接仍使用原始 BD-09。此页用于路线讨论，不替代行驶中的实时导航。时间不含休息、游览、补给及节假日额外拥堵，租车门店和住宿入口确定后需重新核算。</p><p>阿尔山照片来源：<a href="https://xczx.news.cn/2023-10/13/c_1212288386.htm" target="_blank" rel="noopener noreferrer">新华网 / 兴安日报，2023</a>，仅为历史景观参考，不代表 2026 年实时叶色。满洲里到伊尔施按右旗、左旗锁定；直接在百度重新规划全段可能返回另一条路线。</p></details>
  </main>;
}
