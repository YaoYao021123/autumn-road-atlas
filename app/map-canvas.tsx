'use client';
/* oxlint-disable next/no-img-element -- Leaflet icons are static markup using the existing local PNG; this static site ships no image-optimization server. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CarFront, MapPinned, Plus, Minus, Maximize2 } from 'lucide-react';
import type * as Leaflet from 'leaflet';
import { Button } from '@/components/ui/button';
import { routeGeometry, routePosition, routeStops, type Segment, type Stop } from './trip';
import { sceneKindLabels, type RoadScene } from './road-experience';

type Props={legs:Segment[];allLegs:Segment[];progress:number;overview:boolean;dayId:number;fallback:Stop;onOverview:()=>void;scenes:RoadScene[];showScenery:boolean;selectedSceneId:string|null;sceneSelectionKey:number;onSceneSelect:(id:string)=>void};
export default function MapCanvas({legs,allLegs,progress,overview,dayId,fallback,onOverview,scenes,showScenery,selectedSceneId,sceneSelectionKey,onSceneSelect}:Props) {
  const element=useRef<HTMLElement>(null), map=useRef<Leaflet.Map|null>(null),lib=useRef<typeof Leaflet|null>(null);
  const group=useRef<Leaflet.LayerGroup|null>(null),car=useRef<Leaflet.Marker|null>(null),trail=useRef<Leaflet.Polyline|null>(null);
  const sceneryMarkers=useRef(new Map<string,Leaflet.Marker>()),sceneSelect=useRef(onSceneSelect);
  useEffect(()=>{sceneSelect.current=onSceneSelect;},[onSceneSelect]);
  const [ready,setReady]=useState(false),[tileError,setTileError]=useState(false),[loadError,setLoadError]=useState(false);
  const geometry=useMemo(()=>routeGeometry(legs),[legs]);
  useEffect(()=>{
    let disposed=false;let observer:ResizeObserver|undefined,resizeFrame=0;
    import('leaflet').then(L=>{
      if(disposed||!element.current)return;
      lib.current=L;
      const compact=window.matchMedia('(max-width: 760px)').matches;
      const m=L.map(element.current,{zoomControl:false,attributionControl:true,scrollWheelZoom:!compact,minZoom:4,maxZoom:16,preferCanvas:compact,inertia:!compact,zoomAnimation:!compact,fadeAnimation:!compact,markerZoomAnimation:!compact});
      map.current=m;
      m.attributionControl.setPrefix(false);
      m.setView([47.8,121.5],6);
      const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
        maxZoom:19,keepBuffer:1,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · 轨迹：百度地图',
      }).addTo(m);
      tiles.on('tileerror',()=>setTileError(true));
      tiles.on('tileload',()=>setTileError(false));
      L.control.scale({position:'bottomleft',imperial:false,maxWidth:85}).addTo(m);
      observer=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>m.invalidateSize({animate:false}));});observer.observe(element.current);
      setReady(true);
    }).catch(()=>setLoadError(true));
    return()=>{disposed=true;observer?.disconnect();cancelAnimationFrame(resizeFrame);map.current?.remove();map.current=null;};
  },[]);

  useEffect(()=>{
    if(!ready||!map.current||!lib.current)return;
    const L=lib.current,m=map.current;
    group.current?.remove();
    const layer=L.layerGroup().addTo(m);group.current=layer;
    const allPoints=allLegs.flatMap(s=>s.points);
    allLegs.forEach(s=>L.polyline(s.points,{color:'#778272',weight:2,opacity:0.4,dashArray:'3 6',interactive:false}).addTo(layer));
    if(geometry.points.length) {
      L.polyline(geometry.points,{color:'#fff',weight:8,opacity:0.92,interactive:false}).addTo(layer);
      L.polyline(geometry.points,{color:'#c6653a',weight:4,opacity:0.65,interactive:false}).addTo(layer);
      trail.current=L.polyline([],{color:'#b44a24',weight:4.5,opacity:1,interactive:false}).addTo(layer);
    } else {trail.current=null;}
    const stops=routeStops(legs);
    const displayed=overview?Array.from(new Map(allLegs.flatMap(s=>[s.origin,s.destination]).map(s=>[s.name,s])).values()):stops.length?stops:[fallback];
    displayed.forEach((stop,i)=>{
      const active=stops.some(s=>s.name===stop.name);
      const marker=L.circleMarker(stop.position,{radius:active?5:3.5,color:'#fff',weight:2,fillColor:active?'#ad4724':'#788371',fillOpacity:1}).addTo(layer);
      const label=document.createElement('span');label.textContent=stop.name;
      marker.bindTooltip(label,{permanent:true,direction:overview?'top':i%2?'right':'left',offset:overview?[0,-7]:[i%2?8:-8,0],className:active?'place-label active':'place-label',opacity:1});
    });
    if(geometry.points.length) {
      const icon=L.divIcon({className:'car-marker',html:renderToStaticMarkup(<span className="car-symbol"><CarFront size={20} strokeWidth={1.8}/></span>),iconSize:[38,38],iconAnchor:[19,19]});
      car.current=L.marker(geometry.points[0],{icon,zIndexOffset:1000,interactive:false}).addTo(layer);
    } else car.current=null;
    const fitting=overview?allPoints:geometry.points;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact=window.matchMedia('(max-width: 760px)').matches;
    if(fitting.length>1)m.fitBounds(L.latLngBounds(fitting),{paddingTopLeft:[55,85],paddingBottomRight:[55,140],maxZoom:11,animate:!reduce&&!compact,duration:compact?0:.7});
    else m.setView(fallback.position,10,{animate:!reduce&&!compact});
    return()=>{layer.remove();};
  },[ready,legs,allLegs,geometry,overview,dayId,fallback]);

  useEffect(()=>{
    if(!ready)return;
    const pos=routePosition(geometry,progress);
    if(pos){car.current?.setLatLng(pos.position);trail.current?.setLatLngs([...geometry.points.slice(0,pos.index),pos.position]);}
  },[ready,geometry,progress,overview,dayId,allLegs]);

  useEffect(()=>{
    if(!ready||!map.current||!lib.current)return;
    const L=lib.current,layer=L.layerGroup().addTo(map.current);
    const markers=sceneryMarkers.current;markers.clear();
    if(showScenery)scenes.forEach(scene=>{
      if(scene.highlight.length>1)L.polyline(scene.highlight,{color:'#bb623d',weight:8,opacity:.52,lineCap:'round',interactive:false}).addTo(layer);
      const isWindow=scene.kind==='window';
      const ordinal=scenes.filter(s=>s.day===scene.day).findIndex(s=>s.id===scene.id)+1;
      const icon=L.divIcon({className:`scenery-marker ${isWindow?'window-marker':'parking-marker'}`,html:renderToStaticMarkup(<span className="scenery-symbol">{isWindow?<><img src="/autumn-birch.png" alt=""/><b>{String(ordinal).padStart(2,'0')}</b></>:<b>P</b>}</span>),iconSize:isWindow?[38,43]:[29,29],iconAnchor:isWindow?[19,39]:[14,36],popupAnchor:[0,-33]});
      const marker=L.marker(scene.position,{icon,zIndexOffset:650,keyboard:true,title:`D${scene.day} · ${scene.title} · ${sceneKindLabels[scene.kind]}`,alt:`${scene.title}，${sceneKindLabels[scene.kind]}`}).addTo(layer);
      const label=document.createElement('span');label.textContent=scene.title;
      marker.bindTooltip(label,{direction:'top',offset:[0,-35],className:'scenery-tooltip'});
      marker.bindPopup(renderToStaticMarkup(<article className="scenery-popup-content"><span className="scenery-popup-kicker">D{String(scene.day).padStart(2,'0')} · {sceneKindLabels[scene.kind]}</span><h3>{scene.title}</h3><p>{scene.description}</p><p className="scenery-popup-timing">{scene.timing}</p><p className="scenery-popup-caution">{scene.caution}</p>{isWindow&&<small>位置及金色短线为景观路段示意，不是停车点。</small>}{scene.navigationHref&&<a className="scenery-popup-navigation" href={scene.navigationHref} target="_blank" rel="noopener noreferrer">打开前一站至停车入口的百度导航 ↗</a>}<div className="scenery-popup-sources">地理依据：{scene.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div></article>),{className:'scenery-popup',maxWidth:290,minWidth:210,maxHeight:220,autoPanPaddingTopLeft:L.point(24,60),autoPanPaddingBottomRight:L.point(24,125)});
      marker.on('click',()=>sceneSelect.current(scene.id));
      markers.set(scene.id,marker);
    });
    return()=>{layer.remove();markers.clear();};
  },[ready,scenes,showScenery]);

  useEffect(()=>{
    sceneryMarkers.current.forEach((marker,id)=>marker.getElement()?.classList.toggle('is-selected',id===selectedSceneId));
    if(!showScenery||!selectedSceneId)return;
    const marker=sceneryMarkers.current.get(selectedSceneId);
    if(marker)marker.openPopup();
  },[ready,scenes,selectedSceneId,sceneSelectionKey,showScenery]);

  return <>
    <section ref={element} className="map-canvas" aria-label="可缩放拖动的道路地图；上方日期切换路段，叶标查看沿途美景，P 标为停车入口"/>
    {!ready&&<div className="map-loading"><MapPinned size={28}/><span>{loadError?'地图暂时未加载，可使用左侧百度导航':'正在载入道路地图'}</span></div>}
    {tileError&&<output className="map-network-note">底图连接不稳定；道路轨迹与分段导航仍可使用。</output>}
    <div className="map-tools"><Button variant="outline" size="icon" title="放大地图" aria-label="放大地图" onClick={()=>map.current?.zoomIn()}><Plus/></Button><Button variant="outline" size="icon" title="缩小地图" aria-label="缩小地图" onClick={()=>map.current?.zoomOut()}><Minus/></Button><Button variant="outline" size="icon" title={overview?'聚焦当天':'查看全程'} aria-label={overview?'聚焦当天':'查看全程'} onClick={onOverview}><Maximize2/></Button></div>
  </>;
}
