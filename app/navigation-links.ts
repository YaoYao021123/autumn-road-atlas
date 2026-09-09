import gcoord from 'gcoord';
import type { Segment, Stop } from './trip';

export type NavigationPlatform='ios'|'android'|'desktop';
export function navigationPlatform(userAgent:string,maxTouchPoints=0):NavigationPlatform {
  if(/iPhone|iPad|iPod/i.test(userAgent)||(/Macintosh/i.test(userAgent)&&maxTouchPoints>1))return 'ios';
  if(/Android|HarmonyOS/i.test(userAgent))return 'android';
  return 'desktop';
}

// Official URI contracts: coordinates are BD09 for Baidu and GCJ02 for Amap.
// https://lbsyun.baidu.com/docs/webapi?title=mapadjustment/uri/andriod
// https://lbsyun.baidu.com/docs/webapi?title=mapadjustment/uri/ios
// https://lbs.amap.com/api/uri-api/guide/travel/route
export function routeNavigationLinks(segment:Pick<Segment,'origin'|'destination'>,platform:NavigationPlatform){
  const baiduPoint=(stop:Stop)=>`name:${stop.name}|latlng:${stop.bd09[1]},${stop.bd09[0]}`;
  const baidu=new URLSearchParams({origin:baiduPoint(segment.origin),destination:baiduPoint(segment.destination),mode:'driving',coord_type:'bd09ll',src:'webapp.yaoyao.autumntrip'});
  const amapPoint=(stop:Stop)=>{
    const [lng,lat]=gcoord.transform([...stop.bd09],gcoord.BD09,gcoord.GCJ02);
    return `${lng.toFixed(6)},${lat.toFixed(6)},${stop.name}`;
  };
  const amap=new URLSearchParams({from:amapPoint(segment.origin),to:amapPoint(segment.destination),mode:'car',coordinate:'gaode',src:'autumn-road-atlas'});
  return {
    baidu:{web:`https://api.map.baidu.com/direction?${baidu}&output=html`,app:`${platform==='ios'?'baidumap':'bdapp'}://map/direction?${baidu}`},
    amap:{web:`https://uri.amap.com/navigation?${amap}&callnative=0`,app:`https://uri.amap.com/navigation?${amap}&callnative=1`},
  };
}
