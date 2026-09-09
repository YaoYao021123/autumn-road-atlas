'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapPinned, Plus, Minus, Maximize2 } from 'lucide-react';
import type * as Leaflet from 'leaflet';
import type { GeoJsonObject } from 'geojson';
import { Button } from '@/components/ui/button';
import { routeGeometry, routePosition, routeStops, type Segment, type Stop } from './trip';
import { sceneKindLabels, type RoadScene } from './road-experience';
import { carSymbol, scenerySymbol, sceneryPopup } from './map-markup';
import regionalWater from './regional-water.generated.json';

type Props={legs:Segment[];allLegs:Segment[];progress:number;overview:boolean;dayId:number;fallback:Stop;onOverview:()=>void;scenes:RoadScene[];showScenery:boolean;selectedSceneId:string|null;sceneSelectionKey:number;onSceneSelect:(id:string)=>void};
export default function MapCanvas({legs,allLegs,progress,overview,dayId,fallback,onOverview,scenes,showScenery,selectedSceneId,sceneSelectionKey,onSceneSelect}:Props) {
  const element=useRef<HTMLElement>(null), map=useRef<Leaflet.Map|null>(null),lib=useRef<typeof Leaflet|null>(null);
  const group=useRef<Leaflet.LayerGroup|null>(null),car=useRef<Leaflet.Marker|null>(null),trail=useRef<Leaflet.Polyline|null>(null);
  const sceneryMarkers=useRef(new Map<string,Leaflet.Marker>()),sceneSelect=useRef(onSceneSelect);
  useEffect(()=>{sceneSelect.current=onSceneSelect;},[onSceneSelect]);
  // A generation counter redraws layers after Fast Refresh recreates the map.
  const [ready,setReady]=useState(0),[loadError,setLoadError]=useState(false);
  const [detailed,setDetailed]=useState(false),[tileStatus,setTileStatus]=useState<'idle'|'loading'|'ready'|'slow'|'error'>('idle');
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
      // Tiny local physical context makes routes usable without a tile request.
      // Deliberately no administrative boundaries or invented local roads.
      const waterPane=m.createPane('water-context');waterPane.style.zIndex='190';waterPane.style.pointerEvents='none';
      L.geoJSON(regionalWater as unknown as GeoJsonObject,{pane:'water-context',interactive:false,style:feature=>({color:'#b4bca9',weight:feature?.properties.kind==='lake'?.8:1.3,opacity:.7,fillColor:'#e6e9df',fillOpacity:.8})}).addTo(m);
      m.attributionControl.addAttribution('河湖简图：<a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener">Natural Earth</a> · 轨迹：百度地图');
      L.control.scale({position:'bottomleft',imperial:false,maxWidth:85}).addTo(m);
      observer=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>m.invalidateSize({animate:false}));});observer.observe(element.current);
      setReady(version=>version+1);
    }).catch(()=>setLoadError(true));
    return()=>{disposed=true;observer?.disconnect();cancelAnimationFrame(resizeFrame);map.current?.remove();map.current=null;};
  },[]);

  useEffect(()=>{
    if(!ready||!detailed||!map.current||!lib.current)return;
    let timer:ReturnType<typeof setTimeout>|undefined,errors=0,disposed=false;
    const tiles=lib.current.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,keepBuffer:1,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    });
    tiles.on('loading',()=>{
      errors=0;clearTimeout(timer);setTileStatus('loading');
      timer=setTimeout(()=>{if(!disposed)setTileStatus('slow');},9000);
    });
    tiles.on('tileerror',()=>{errors++;setTileStatus('error');});
    tiles.on('load',()=>{clearTimeout(timer);setTileStatus(errors?'error':'ready');});
    tiles.addTo(map.current);
    return()=>{disposed=true;clearTimeout(timer);tiles.off();tiles.remove();};
  },[ready,detailed]);

  useEffect(()=>{
    if(!ready||!map.current||!lib.current)return;
    const L=lib.current,m=map.current;
    group.current?.remove();
    const layer=L.layerGroup().addTo(m);group.current=layer;
    const allPoints=overview?allLegs.flatMap(s=>s.points):[];
    if(overview)allLegs.forEach(s=>L.polyline(s.points,{color:'#778272',weight:2,opacity:0.4,dashArray:'3 6',interactive:false}).addTo(layer));
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
      const icon=L.divIcon({className:'car-marker',html:carSymbol(),iconSize:[38,38],iconAnchor:[19,19]});
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
      const icon=L.divIcon({className:`scenery-marker ${isWindow?'window-marker':'parking-marker'}`,html:scenerySymbol(isWindow,ordinal),iconSize:isWindow?[38,43]:[29,29],iconAnchor:isWindow?[19,39]:[14,36],popupAnchor:[0,-33]});
      const marker=L.marker(scene.position,{icon,zIndexOffset:650,keyboard:true,title:`D${scene.day} · ${scene.title} · ${sceneKindLabels[scene.kind]}`,alt:`${scene.title}，${sceneKindLabels[scene.kind]}`}).addTo(layer);
      const label=document.createElement('span');label.textContent=scene.title;
      marker.bindTooltip(label,{direction:'top',offset:[0,-35],className:'scenery-tooltip'});
      marker.bindPopup(sceneryPopup(scene),{className:'scenery-popup',maxWidth:290,minWidth:210,maxHeight:220,autoPanPaddingTopLeft:L.point(24,60),autoPanPaddingBottomRight:L.point(24,125)});
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
    <fieldset className="map-basemap-switch" aria-label="底图精细度">
      <button type="button" aria-pressed={!detailed} onClick={()=>setDetailed(false)}>河湖简图</button>
      <button type="button" aria-pressed={detailed} onClick={()=>setDetailed(true)} title="按需连接 OpenStreetMap，加载道路与地名">详细底图</button>
    </fieldset>
    {detailed&&tileStatus!=='ready'&&<output className="map-network-note" aria-live="polite">{tileStatus==='error'?'部分底图未能载入；可切回简图，百度导航不受影响。':tileStatus==='slow'?'详细底图连接较慢，路线已可用；可切回河湖简图。':'正在连接详细底图；路线与美景标记已可用。'}</output>}
    <div className="map-tools"><Button variant="outline" size="icon" title="放大地图" aria-label="放大地图" onClick={()=>map.current?.zoomIn()}><Plus/></Button><Button variant="outline" size="icon" title="缩小地图" aria-label="缩小地图" onClick={()=>map.current?.zoomOut()}><Minus/></Button><Button variant="outline" size="icon" title={overview?'聚焦当天':'查看全程'} aria-label={overview?'聚焦当天':'查看全程'} onClick={onOverview}><Maximize2/></Button></div>
  </>;
}
