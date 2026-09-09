import { sceneKindLabels, type RoadScene } from './road-experience';

// Leaflet accepts actual DOM nodes. Do not ship react-dom/server to the browser
// just to serialize a few icons and popups. All data is assigned as textContent.
function node<K extends keyof HTMLElementTagNameMap>(tag:K, className='', text?:string) {
  const element=document.createElement(tag);
  if(className)element.className=className;
  if(text!==undefined)element.textContent=text;
  return element;
}
function externalLink(text:string, href:string, className='') {
  const link=node('a',className,text);
  const url=new URL(href);
  if(url.protocol!=='https:')throw new Error('Map links must use HTTPS');
  link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';
  return link;
}

export function carSymbol() {
  const symbol=node('span','car-symbol');
  // Lucide's existing CarFront icon geometry, ISC license; not custom artwork.
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  for(const [key,value] of Object.entries({width:'20',height:'20',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(key,value);
  const shapes:[string,Record<string,string>][]=[
    ['path',{d:'m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8'}],
    ['path',{d:'M7 14h.01'}],['path',{d:'M17 14h.01'}],
    ['rect',{width:'18',height:'8',x:'3',y:'10',rx:'2'}],
    ['path',{d:'M5 18v2'}],['path',{d:'M19 18v2'}],
  ];
  for(const [tag,attributes] of shapes){const shape=document.createElementNS(ns,tag);for(const [key,value] of Object.entries(attributes))shape.setAttribute(key,value);svg.appendChild(shape);}
  symbol.appendChild(svg);return symbol;
}

export function scenerySymbol(isWindow:boolean, ordinal:number) {
  const symbol=node('span','scenery-symbol');
  if(isWindow){const leaf=node('img');leaf.src='/autumn-birch-384.webp';leaf.alt='';symbol.appendChild(leaf);}
  symbol.appendChild(node('b','',isWindow?String(ordinal).padStart(2,'0'):'P'));
  return symbol;
}

export function sceneryPopup(scene:RoadScene) {
  const article=node('article','scenery-popup-content');
  const paragraphs=[
    node('span','scenery-popup-kicker',`D${String(scene.day).padStart(2,'0')} · ${sceneKindLabels[scene.kind]}`),
    node('h3','',scene.title),node('p','',scene.description),
    node('p','scenery-popup-timing',scene.timing),node('p','scenery-popup-caution',scene.caution),
  ];
  for(const paragraph of paragraphs)article.appendChild(paragraph);
  if(scene.kind==='window')article.appendChild(node('small','','位置及短线为景观路段示意，不是停车点。'));
  if(scene.navigationHref)article.appendChild(externalLink('打开前一站至停车入口的百度导航 ↗',scene.navigationHref,'scenery-popup-navigation'));
  const sources=node('div','scenery-popup-sources','地理依据：');
  for(const source of scene.sources)sources.appendChild(externalLink(`${source.label} ↗`,source.url));
  article.appendChild(sources);return article;
}
