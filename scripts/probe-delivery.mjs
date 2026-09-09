// Small HTTP probes for the actual published pages and one current-view map tile.
// No browser automation, tile prefetch, cache bypass, or credentials.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run=promisify(execFile);
const origins=['https://yaoyao021123.github.io/autumn-road-atlas/','https://autumn-road-atlas.lzscsy666.chatgpt.site/'];
const agent='AutumnRoadAtlas/1.0 (+https://github.com/YaoYao021123/autumn-road-atlas)';
async function request(url,{body=false,referer=origins[0]}={}){
  const args=['--location','--silent','--show-error','--compressed','--connect-timeout','10','--max-time','25','--user-agent',agent,'--referer',referer];
  if(!body)args.push('--output','/dev/null');
  args.push('--write-out','\n__METRICS__%{json}',url);
  try{
    const {stdout}=await run('curl',args,{maxBuffer:12000000});
    const index=stdout.lastIndexOf('\n__METRICS__'),meta=JSON.parse(stdout.slice(index+12));
    return {url,status:meta.http_code,type:meta.content_type,bytes:meta.size_download,dns:meta.time_namelookup,connect:meta.time_connect,tls:meta.time_appconnect,ttfb:meta.time_starttransfer,total:meta.time_total,http:meta.http_version,body:body?stdout.slice(0,index):undefined};
  }catch(error){return {url,error:error.stderr?.trim()??error.message};}
}
for(const origin of origins){
  const page=await request(origin,{body:true,referer:origin});
  const html=page.body??'';delete page.body;console.log(JSON.stringify(page));
  const scripts=[...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(match=>new URL(match[1],origin).href);
  const images=[...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(match=>new URL(match[1],origin).href);
  console.log(JSON.stringify({origin,scripts:[...new Set(scripts)],images:[...new Set(images)]}));
  const candidates=[...new Set([...scripts.filter(url=>url.includes('/page-')).slice(0,1),...images.filter(url=>url.startsWith(origin)).slice(0,1)])];
  for(const url of candidates)console.log(JSON.stringify(await request(url,{referer:origin})));
}
const images=[
 'https://tile.openstreetmap.org/6/53/22.png',
 'https://www.news.cn/20250706/951aba1fb28f4e3f9932d6de2c5c4a16/UXJ934mkJpgIwN5p.jpg',
 'https://xczx.news.cn/2023-10/13/1212288386_16971850126181n.jpg',
 'https://upload.wikimedia.org/wikipedia/commons/c/c2/%E6%96%B0%E5%B7%B4%E5%B0%94%E8%99%8E%E5%8F%B3%E6%97%97_%E8%8D%89%E5%8E%9F_-_panoramio.jpg',
];
await Promise.all(images.map(async url=>console.log(JSON.stringify(await request(url)))));
