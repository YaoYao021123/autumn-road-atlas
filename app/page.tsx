'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, ArrowRight, TreeDeciduous, Navigation, Route, Clock3, Play, Pause, RotateCcw, ChevronDown, ChevronLeft, ChevronRight, Info, MapPinned, Hotel, Check, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import MapCanvas from './map-canvas';
import { AutumnAtmosphere } from './autumn-atmosphere';
import { LiteraryInterlude } from './literary-interlude';
import './autumn.css';
import './birch-timeline.css';
import './editorial-type.css';
import { getDays, segments, routeStops, type Endpoint } from './trip';
import { RouteNavigation } from './route-navigation';
import { leafVariables, seasonPalette } from './season-palette';
import { foliageForDay, foliageForPlace } from './regional-foliage';
import { DayLandscape } from './day-landscape';
import dayScenes from './day-scenes.json';
import { getRoadScenes } from './road-experience';
import { RoadScenery } from './road-scenery';
import { DrivingEffort } from './driving-effort';
import { ForestDrive } from './forest-drive';

export default function Home() {
  const [dayId,setDayId]=useState(1),[endpoint,setEndpoint]=useState<Endpoint>('airport'),[overnight,setOvernight]=useState(false);
  const [playing,setPlaying]=useState(false),[progress,setProgress]=useState(0),[overview,setOverview]=useState(false),[navOpen,setNavOpen]=useState(false);
  const [atmosphere,setAtmosphere]=useState(true);
  const [showScenery,setShowScenery]=useState(true),[selectedSceneId,setSelectedSceneId]=useState<string|null>(null),[sceneSelectionKey,setSceneSelectionKey]=useState(0);
  const days=useMemo(()=>getDays(endpoint,overnight),[endpoint,overnight]),day=days[dayId-1];
  const legs=useMemo(()=>day.legs.map(id=>segments[id]),[day]);
  const allLegs=useMemo(()=>Array.from(new Set(days.flatMap(d=>d.legs))).map(id=>segments[id]),[days]);
  const allScenes=useMemo(()=>getRoadScenes(days),[days]);
  const dayRoadScenes=useMemo(()=>allScenes.filter(scene=>scene.day===dayId),[allScenes,dayId]);
  const mapScenes=overview?allScenes:dayRoadScenes;
  const stops=useMemo(()=>routeStops(legs),[legs]);
  const km=legs.reduce((sum,s)=>sum+s.km,0),minutes=Math.round(legs.reduce((sum,s)=>sum+s.minutes,0));
  const fallback=segments[endpoint==='airport'?'arxan_longjia':'arxan_changchun_west'].destination;
  const last=useRef<number|null>(null);
  const totalKm=allLegs.reduce((sum,s)=>sum+s.km,0);
  const titleParts=day.title.split(' → ');
  const dayScene=dayScenes[dayId-1];
  let segmentDistance=0;
  const selectedLeg=legs.find(leg=>{segmentDistance+=leg.km;return segmentDistance>=km*progress;})??legs.at(-1);

  const selectDay=(value:number)=>{setDayId(value);setPlaying(false);setProgress(0);setNavOpen(false);setOverview(false);setSelectedSceneId(null);};
  const selectRoadScene=(id:string)=>{
    const scene=allScenes.find(s=>s.id===id);if(!scene)return;
    selectDay(scene.day);setShowScenery(true);setSelectedSceneId(id);setSceneSelectionKey(key=>key+1);
    // The marker should remain discoverable when this list has scrolled past the map.
    const workspace=document.getElementById('route-workspace');
    if(window.matchMedia('(max-width: 760px)').matches||(workspace&&workspace.getBoundingClientRect().top<0))workspace?.scrollIntoView({block:'start',behavior:atmosphere&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});
  };
  const changeOverview=(value:boolean)=>{setOverview(value);setSelectedSceneId(null);};
  const selectLiteraryRoute=(value:number)=>{
    selectDay(value);
    const mapSection=document.getElementById('route-workspace');
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mapSection?.scrollIntoView({behavior:atmosphere&&!reduced?'smooth':'instant',block:'start'});
    mapSection?.focus({preventScroll:true});
  };
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
      flushSync(()=>{setDayId(Number(value.day));if(value.endpoint!==undefined)setEndpoint(value.endpoint as Endpoint);if(value.songyuanOvernight!==undefined)setOvernight(value.songyuanOvernight as boolean);setPlaying(false);setProgress(0);setNavOpen(false);setOverview(false);setSelectedSceneId(null);});
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
    <AutumnAtmosphere enabled={atmosphere} day={dayId}/>
    <header className="site-header"><a className="brand" href="/" aria-label="北纬秋行首页"><TreeDeciduous size={32}/><span>北纬秋行<small>AUTUMN ROAD ATLAS</small></span></a><span className="trip-date">2026.09.27 — 10.03</span><div className="header-meta"><Button variant="ghost" className="atmosphere-button" aria-label={atmosphere?'关闭交互叶片与秋日装饰':'开启交互叶片与秋日装饰'} aria-pressed={atmosphere} onClick={()=>setAtmosphere(v=>!v)} title={atmosphere?'关闭秋日氛围':'开启秋日氛围'}><Leaf/><span>秋意</span></Button><span className="return-deadline"><Clock3 size={15}/>10.03 · 11:00 长春还车</span></div></header>
    <div className="page-heading"><div><span className="eyebrow">大兴安岭 · 自驾路线</span><h1>沿着秋天，向北。</h1></div><div className="heading-note"><span className="verified-dot"/>百度路线已核验<small>09.09 导航基线 · 非国庆实时路况</small></div></div>
    <Tabs value={dayId} onValueChange={v=>selectDay(Number(v))} className="days-navigation birch-days desktop-day-strip"><TabsList aria-label="地域植物时间轴：选择行程日期" className="days-list birch-days-list"><span className="birch-spine" aria-hidden="true"/>{days.map(d=><TabsTrigger key={d.id} value={d.id} className="day-tab leaf-day" style={leafVariables(d.id) as CSSProperties} aria-label={`D${d.id}，${d.date}，${d.short}，${foliageForDay(d.id).label}，${seasonPalette[d.id].label}氛围示意`} title={`${foliageForDay(d.id).landscape} · 沿途植物意象，非实时叶色`}><span className="leaf-day-date">{d.date}<small>D{String(d.id).padStart(2,'0')}</small></span><span className="leaf-day-node" aria-hidden="true"><img src={foliageForDay(d.id).image} alt=""/><i/></span><strong>{d.short}</strong><small className="leaf-day-species">{foliageForDay(d.id).label}</small></TabsTrigger>)}</TabsList><p className="season-palette-note"><Leaf size={12}/><span>杨叶过平原 · 桦叶入山林 · 秋草连松针</span><small>叶色为地域氛围示意，非今年实况</small></p></Tabs>
    <nav className="mobile-day-switcher" aria-label="切换行程日期" style={leafVariables(dayId) as CSSProperties}>
      <Button variant="outline" size="icon" className="mobile-day-arrow" disabled={dayId===1} aria-label={`切换到前一天${dayId>1?`：${days[dayId-2].short}`:''}`} onClick={()=>selectDay(dayId-1)}><ChevronLeft/></Button>
      <div className="mobile-day-current" aria-live="polite"><span className="mobile-day-meta"><span className="mobile-day-leaf" aria-hidden="true"><img src={foliageForDay(dayId).image} alt=""/></span><span>DAY {String(day.id).padStart(2,'0')} · {day.date} · {foliageForDay(dayId).label}</span></span><strong>{day.short}</strong></div>
      <Button variant="outline" size="icon" className="mobile-day-arrow" disabled={dayId===days.length} aria-label={`切换到后一天${dayId<days.length?`：${days[dayId].short}`:''}`} onClick={()=>selectDay(dayId+1)}><ChevronRight/></Button>
    </nav>
    <section id="route-workspace" className="workspace" data-foliage={foliageForDay(dayId).kind} tabIndex={-1} aria-label="逐日地图与导航">
      <aside className="day-panel" aria-label="当天路线详情" style={leafVariables(dayId) as CSSProperties}>
        <DayLandscape key={dayScene.image} scene={dayScene}/>
        <div className="day-content" key={`${dayId}-${endpoint}-${overnight}`}>
          <div className="chapter"><span className="chapter-leaf"><Leaf size={14}/>DAY {String(day.id).padStart(2,'0')}</span><span>{day.date} / {day.weekday}</span></div>
          <h2>{titleParts[0]}{titleParts[1]&&<><ArrowRight/>{titleParts[1]}</>}</h2><p className="day-intro">{day.subtitle}</p>
          <div className="day-metrics"><div><Route size={15}/><strong>{legs.length?Math.round(km):'—'}<span>km</span></strong><small>{dayId===5?'外部自驾接驳':'规划里程'}</small></div><div><Clock3 size={15}/><strong>{legs.length?<>{Math.floor(minutes/60)}<span>h</span>{String(minutes%60).padStart(2,'0')}<span>min</span></>:'待定'}</strong><small>{legs.length?'当前驾驶基线':'实际门店尚未确定'}</small></div></div>
          <p className="budget"><Clock3 size={14}/>{day.budget}</p>
          <DrivingEffort dayId={dayId} overnight={overnight} minutes={minutes}/>
          <ol className="stops botanical-stops">{(stops.length?stops:[fallback]).map((stop,i)=><li key={`${stop.name}-${i}`} data-foliage={foliageForPlace(stop.name,dayId).kind}><span className="stop-leaf" title={`${foliageForPlace(stop.name,dayId).label} · 地域植物意象`}><img src={foliageForPlace(stop.name,dayId).image} alt=""/><b>{String(i+1).padStart(2,'0')}</b></span><div>{stop.name}<small>{day.stops[i]??'按实际进度安排短停'}</small></div>{i<legs.length&&<Button variant="ghost" size="icon" className="stop-navigation" onClick={()=>{setNavOpen(true);window.setTimeout(()=>document.getElementById(`navigation-${legs[i].id}`)?.scrollIntoView({block:'nearest'}),0);}} title="选择百度或高德导航" aria-label={`选择第${i+1}段导航，${legs[i].origin.name}至${legs[i].destination.name}`}><ArrowUpRight size={15}/></Button>}</li>)}</ol>
          <Button className="navigate-button" disabled={!legs.length} onClick={()=>setNavOpen(!navOpen)} aria-expanded={navOpen} aria-controls="navigation-links"><Navigation size={16}/>{legs.length?'地图导航 · 百度 / 高德':'还车门店待确认'}<ChevronDown size={16} className={navOpen?'rotate-180':''}/></Button>
          {navOpen&&<RouteNavigation legs={legs}/>}
          <details className="day-note"><summary><Info size={14}/>当天提醒<ChevronDown size={14}/></summary><p>{day.note}</p></details>
        </div>
      </aside>
      <div className="map-stage">
        <MapCanvas legs={legs} allLegs={allLegs} progress={progress} overview={overview} dayId={dayId} fallback={fallback} onOverview={()=>changeOverview(!overview)} scenes={mapScenes} showScenery={showScenery} selectedSceneId={selectedSceneId} sceneSelectionKey={sceneSelectionKey} onSceneSelect={selectRoadScene}/>
        <div className="map-top-label"><span className="verified-dot"/>{overview?'长春出发 · 全程路线':day.road}</div>
        <Button variant="outline" className="map-scenery-toggle" aria-label={showScenery?'隐藏沿途美景标记':'显示沿途美景标记'} aria-pressed={showScenery} onClick={()=>setShowScenery(v=>!v)}><Leaf/>{showScenery?'沿途美景':'显示美景'} · {mapScenes.length}</Button>
        <div className="map-view-switch"><Button variant="ghost" className={!overview?'selected':''} onClick={()=>changeOverview(false)}>当日</Button><Button variant="ghost" className={overview?'selected':''} onClick={()=>changeOverview(true)}>全程</Button></div>
        <div className="playback">
          <Button className="play-button" disabled={!legs.length} onClick={()=>{if(progress===1)setProgress(0);setPlaying(!playing);}} aria-label={playing?'暂停行车回放':'播放行车回放'} title={playing?'暂停行车回放':'播放行车回放'}>{playing?<Pause size={19} fill="currentColor"/>:<Play size={19} fill="currentColor"/>}</Button>
          <div className="playback-track"><div className="playback-heading"><strong>{progress===1?'当日回放结束':playing?'沿规划轨迹行进':legs.length?'预览这段公路':'还车日上午'}<span>{legs.length?`${Math.round(km*progress)} / ${Math.round(km)} km`:'10:00 到店'}</span></strong><small>{selectedLeg?`${selectedLeg.origin.name} → ${selectedLeg.destination.name}`:'具体门店未确认，不绘制虚构接驳路线'}</small></div><Slider aria-label="行车回放进度" value={[progress*100]} max={100} min={0} step={0.1} disabled={!legs.length} onValueChange={v=>{setPlaying(false);setProgress((Array.isArray(v)?v[0]:v)/100);}} className="route-slider"/></div>
          <Button variant="ghost" size="icon" className="replay-button" disabled={!legs.length} aria-label="重置回放" title="重置回放" onClick={stopPlayback}><RotateCcw size={17}/></Button>
          <span className="simulation-label">路线演示<br/>非实时定位</span>
        </div>
      </div>
    </section>
    <RoadScenery dayId={dayId} scenes={dayRoadScenes} selectedSceneId={selectedSceneId} onSelect={selectRoadScene}/>
    <section className="trip-settings" aria-label="取还车与返程方案"><div className="settings-title"><MapPinned size={17}/><div>路线条件<small>门店与驾驶人数尚待确认</small></div></div><div className="endpoint-field"><span id="endpoint-label">取还车代表点</span><Select value={endpoint} onValueChange={v=>{if(v==='airport'||v==='west'){setEndpoint(v);stopPlayback();}}}><SelectTrigger aria-labelledby="endpoint-label"><SelectValue>{endpoint==='airport'?'龙嘉机场 T2（暂定）':'长春西站（暂定）'}</SelectValue></SelectTrigger><SelectContent><SelectItem value="airport">龙嘉机场 T2（暂定）</SelectItem><SelectItem value="west">长春西站（暂定）</SelectItem></SelectContent></Select></div><label className="overnight-control" htmlFor="songyuan-overnight"><Hotel size={16}/><span>10 月 2 日住松原</span><Switch id="songyuan-overnight" checked={overnight} onCheckedChange={v=>{setOvernight(v);stopPlayback();if(dayId<6)setDayId(6);}}/></label><div className="total-distance"><strong>{Math.round(totalKm).toLocaleString()}<span>km</span></strong><small>当前路线合计 · 不含游览绕行</small></div></section>
    <ForestDrive onRouteSelect={selectLiteraryRoute}/>
    <LiteraryInterlude motionEnabled={atmosphere} onRouteSelect={selectLiteraryRoute}/>
    <footer className="page-footer"><span><Check size={13}/>实际规划轨迹 · 6 个行车游览日 + 还车日上午</span><span>2024 理想 L9 Pro · 辅助驾驶不抵消疲劳</span></footer>
<details className="data-note"><summary>地图与数据说明</summary><p>驾车轨迹来自 2026 年 9 月 9 日百度地图 MCP 查询。默认连接 OpenStreetMap 详细底图，保留道路与地名，高分屏按像素密度加载更细瓦片。网络较慢时，随页面提供的 Natural Earth 河湖简图作为备用地理背景；它不含完整道路与行政边界。显示坐标从百度 BD-09 转为 WGS84，导航链接仍使用原始 BD-09。此页用于路线讨论，不替代行驶中的实时导航。时间不含休息、游览、补给及节假日额外拥堵，租车门店和住宿入口确定后需重新核算。</p><p>每日头图按当日沿线区域或出发、到达城市切换。每张图附独立出处与历史时间，夏季照片会单独标明；照片不意味着已安排相应景点入园。第六天采用返程出发地阿尔山市区，机场／西站与是否住松原都不改变这一出发地。</p><p>植物图形依据沿途景观选用杨叶、白桦叶、草原秋草和落叶松针簇，采用原创生成意象，不是各城市的专属标志或植物鉴定图。叶片颜色是依据区域景观设计的季节氛围，不是物候观测值、今年红叶预报或最佳观赏期保证；未把“入秋推迟”作为已核实的全线结论。草原、白桦、落叶松的变化不能用单一红叶百分比概括。满洲里到伊尔施按右旗、左旗锁定；直接在百度重新规划全段可能返回另一条路线。</p></details>
  </main>;
}
