'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CarFront, MapPinned, Plus, Minus, Maximize2 } from 'lucide-react';
import type * as Leaflet from 'leaflet';
import { Button } from '@/components/ui/button';
import { routeGeometry, routePosition, routeStops, type Segment, type Stop } from './trip';

type Props={legs:Segment[];allLegs:Segment[];progress:number;overview:boolean;dayId:number;fallback:Stop;onOverview:()=>void};
export default function MapCanvas({legs,allLegs,progress,overview,dayId,fallback,onOverview}:Props) {
  const element=useRef<HTMLDivElement>(null), map=useRef<Leaflet.Map|null>(null),lib=useRef<typeof Leaflet|null>(null);
  const group=useRef<Leaflet.LayerGroup|null>(null),car=useRef<Leaflet.Marker|null>(null),trail=useRef<Leaflet.Polyline|null>(null);
  const [ready,setReady]=useState(false),[tileError,setTileError]=useState(false),[loadError,setLoadError]=useState(false);
  const geometry=useMemo(()=>routeGeometry(legs),[legs]);
  useEffect(()=>{
    let disposed=false;let observer:ResizeObserver|undefined;
    import('leaflet').then(L=>{
      if(disposed||!element.current)return;
      lib.current=L;
      const m=L.map(element.current,{zoomControl:false,attributionControl:true,scrollWheelZoom:true,minZoom:4,maxZoom:16,preferCanvas:false});
      map.current=m;
      m.attributionControl.setPrefix(false);
      m.setView([47.8,121.5],6);
      const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
        maxZoom:19,keepBuffer:1,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · 轨迹：百度地图',
      }).addTo(m);
      tiles.on('tileerror',()=>setTileError(true));
      tiles.on('tileload',()=>setTileError(false));
      L.control.scale({position:'bottomleft',imperial:false,maxWidth:85}).addTo(m);
      observer=new ResizeObserver(()=>m.invalidateSize({animate:false}));observer.observe(element.current);
      setReady(true);
    }).catch(()=>setLoadError(true));
    return()=>{disposed=true;observer?.disconnect();map.current?.remove();map.current=null;};
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
    if(fitting.length>1)m.fitBounds(L.latLngBounds(fitting),{paddingTopLeft:[55,85],paddingBottomRight:[55,140],maxZoom:11,animate:!reduce,duration:0.7});
    else m.setView(fallback.position,10,{animate:!reduce});
    return()=>{layer.remove();};
  },[ready,legs,allLegs,geometry,overview,dayId,fallback]);

  useEffect(()=>{
    if(!ready)return;
    const pos=routePosition(geometry,progress);
    if(pos){car.current?.setLatLng(pos.position);trail.current?.setLatLngs([...geometry.points.slice(0,pos.index),pos.position]);}
  },[ready,geometry,progress,overview,dayId,allLegs]);

  return <>
    <div ref={element} className="map-canvas" role="region" aria-label="可缩放拖动的道路地图；下方日期切换路段"/>
    {!ready&&<div className="map-loading"><MapPinned size={28}/><span>{loadError?'地图暂时未加载，可使用左侧百度导航':'正在载入道路地图'}</span></div>}
    {tileError&&<div className="map-network-note" role="status">底图连接不稳定；道路轨迹与分段导航仍可使用。</div>}
    <div className="map-tools"><Button variant="outline" size="icon" title="放大地图" aria-label="放大地图" onClick={()=>map.current?.zoomIn()}><Plus/></Button><Button variant="outline" size="icon" title="缩小地图" aria-label="缩小地图" onClick={()=>map.current?.zoomOut()}><Minus/></Button><Button variant="outline" size="icon" title={overview?'聚焦当天':'查看全程'} aria-label={overview?'聚焦当天':'查看全程'} onClick={onOverview}><Maximize2/></Button></div>
  </>;
}
