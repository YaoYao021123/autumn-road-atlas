'use client';

import { useSyncExternalStore } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { minutesText, type Segment } from './trip';
import { navigationPlatform, routeNavigationLinks, type NavigationPlatform } from './navigation-links';

const subscribePlatform=()=>()=>{};
const clientPlatform=()=>navigationPlatform(navigator.userAgent,navigator.maxTouchPoints);
const serverPlatform=():NavigationPlatform=>'desktop';
export function RouteNavigation({legs}:{legs:Segment[]}){
  const platform=useSyncExternalStore(subscribePlatform,clientPlatform,serverPlatform);
  const mobile=platform!=='desktop';
  return <nav id="navigation-links" className="navigation-links" aria-label="百度或高德分段驾车导航">
    <p>按顺序打开各段，保留草原途经点。App 会按实时路况重新算路。</p>
    {legs.map((leg,i)=>{
      const links=routeNavigationLinks(leg,platform);
      return <section key={leg.id} className="navigation-leg" aria-labelledby={`navigation-${leg.id}`}>
        <h3 id={`navigation-${leg.id}`}>{i+1}. {leg.origin.name} → {leg.destination.name}</h3>
        <small>{Math.round(leg.km)} km · {minutesText(leg.minutes)} · 规划参考</small>
        <div className="navigation-providers">{(['baidu','amap'] as const).map(provider=>{
          const name=provider==='baidu'?'百度':'高德',urls=links[provider];
          return <div key={provider}>
            <a className="navigation-provider" href={mobile?urls.app:urls.web} target={mobile?undefined:'_blank'} rel="noopener noreferrer" aria-label={`${mobile?'尝试打开':'打开'}${name}${mobile?' App':'地图'}：${leg.origin.name}至${leg.destination.name}`}>{name}{mobile?' App':'地图'}<ArrowUpRight size={14}/></a>
            {mobile&&<a className="navigation-web" href={urls.web} target="_blank" rel="noopener noreferrer" aria-label={`${name}网页版：${leg.origin.name}至${leg.destination.name}`}>网页版</a>}
          </div>;
        })}</div>
      </section>;
    })}
    <p className="navigation-help">{mobile?'需已安装对应 App。若未唤起，可用网页版，或在 Safari / 系统浏览器中打开本站。':'手机打开本站，可尝试唤起百度或高德 App；电脑使用网页版。'}</p>
  </nav>;
}
