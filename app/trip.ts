import raw from './routes.compact.json';
import { decodeRoute } from './route-codec';

export type Position=[number,number];
export type Stop={name:string;bd09:[number,number];position:Position};
export type Segment={id:string;origin:Stop;destination:Stop;km:number;minutes:number;points:Position[]};
// The generator validates every coordinate pair before emitting this JSON.
export const segments=Object.fromEntries(Object.entries(raw.segments).map(([id,segment])=>{
  const {path,...metadata}=segment;
  return [id,{...metadata,points:decodeRoute(path)}];
})) as Record<string,Segment>;
export type Endpoint='airport'|'west';
export type Day={id:number;date:string;weekday:string;short:string;title:string;subtitle:string;road:string;budget:string;note:string;stops:string[];legs:string[]};
export function getDays():Day[] {
  return [
    {id:1,date:'09.27',weekday:'星期日',short:'长春 → 齐齐哈尔',title:'长春 → 齐齐哈尔',subtitle:'从美仑出发，第一晚落脚万达嘉华，晚餐留给烤肉。',road:'酒店到酒店 · 长途转场',budget:'暂留 7–8 小时，取车手续另计',note:'9/26 已住美仑。暂以市区取到车后从酒店出发算路；若仍需龙嘉取车，需另计机场接驳并调整首段。实际租车门店待确认，不加扎龙半日游。',stops:['美仑出发 · 取车方式待确认','入住嘉华 · 晚饭与休息'],legs:['meilun_wanda']},
    {id:2,date:'09.28',weekday:'星期一',short:'齐齐哈尔 → 海拉尔',title:'齐齐哈尔 → 海拉尔',subtitle:'从嘉华北上，山林与草原在车窗外交替，晚上住古城希岸。',road:'G10 绥满高速',budget:'约 7–8 小时，含午餐与正式休息',note:'约 08:00 出发，不绕扎兰屯、牙克石市中心。入住后古城或广场择一短逛，补水和食品；提前问次晨早餐能否打包。',stops:['嘉华早餐后出发','希岸入住 · 晚饭与次日补给'],legs:['wanda_xana']},
    {id:3,date:'09.29',weekday:'星期二',short:'额尔古纳 · 满洲里',title:'海拉尔 → 满洲里',subtitle:'早上看城边湿地，下午经黑山头南下，夜宿中苏金街。',road:'城边湿地 → 黑山头 → G331',budget:'约 10–11 小时，湿地与公路分配时间',note:'约 07:00 从希岸出发，城边湿地留 1.5–2 小时，争取 11:00 离开。黑山头午餐后南下；186 为可选短停，不叠加深游。不骑马，不等黑山头日落；若延误，削减下午项目。',stops:['希岸早出发','湿地南门 · 游览 1.5–2 小时','午餐休息 · 不骑马、不等日落','可选正规短停 · 开放待核验','维也纳智好入住 · 夜逛金街'],legs:['xana_wetland','wetland_heishantou','heishantou_186_parking','caidai_vienna']},
    {id:4,date:'09.30',weekday:'星期三',short:'满洲里 → 伊尔施',title:'满洲里 → 伊尔施',subtitle:'穿过两旗草原，进入秋林，晚上在伊尔施镇上的林苑落脚。',road:'G331 · 保留右旗、左旗途经点',budget:'约 9–10 小时，白天完成林区段',note:'约 07:00 从维也纳出发，保留右旗、左旗。补给和拍照只用正规停车点，不加国门、套娃或湖岸绕行。林苑在伊尔施镇区，不是温泉市区，也不在公园里。',stops:['维也纳早出发','右旗补给 · 正规停车','左旗休息 · 继续向秋林','林苑入住 · 无早，备次晨食品'],legs:['vienna_right','right_left_banner','left_linyuan']},
    {id:5,date:'10.01',weekday:'星期四',short:'阿尔山 → 乌兰浩特',title:'伊尔施 → 乌兰浩特',subtitle:'退房进公园，精简游览后南下，今晚住兴安盟政府全季。',road:'林苑 → 公园停车入口 → 全季',budget:'约 5 小时外部驾驶，游览和休息另计',note:'按开园时间倒推林苑出发，退房带齐行李。驼峰岭天池优先，杜鹃湖视换乘与排队决定，不默认加石塘林。争取 13:00–14:00 回停车场出发；去全季仍约 4 小时 20 分钟，含休息更长，可能夜行。若延误或疲劳须缩减游览、调整住宿，不硬赶。',stops:['林苑退房 · 带齐行李','停车换乘 · 精简游览，13–14 点离开为目标','全季入住 · 预计抵达时间告知前台'],legs:['linyuan_park','park_ji']},
    {id:6,date:'10.02',weekday:'星期五',short:'乌兰浩特 → 长春',title:'乌兰浩特 → 长春',subtitle:'从全季出发，把长途留在白天，晚上回到净月丽芮。',road:'酒店到酒店 · 长春返程',budget:'约 6–7 小时，含用餐与休息',note:'早餐后从全季出发，驾驶基线约 4 小时 45 分钟，不再是阿尔山出发的 8 小时长途。休息、拥堵另留时间，不加远距离景区。入住丽芮后确认次日租车门店、油电要求。',stops:['全季早餐后出发','净月丽芮入住 · 整理行李、核对还车'],legs:['ji_red']},
    {id:7,date:'10.03',weekday:'星期六',short:'丽芮 → 龙嘉还车',title:'长春 → 龙嘉还车',subtitle:'从丽芮出发，目标 10:00 到店，11:00 前完成还车。',road:'丽芮 → 龙嘉机场 T2 代表点',budget:'暂按 08:30 离店，实际门店确定后复核',note:'机场 T2 仅为代表点，不是已确认的还车门店。酒店到 T2 约 42 km，实时路况可能变化；补能、验车、行李搬运另留时间。今天不加景点。',stops:['丽芮早餐后出发 · 预留补能','龙嘉 T2 代表点 · 实际还车门店待确认'],legs:['red_airport']},
  ];
}
export const minutesText=(minutes:number)=>{const m=Math.round(minutes);return `${Math.floor(m/60)} 小时 ${String(m%60).padStart(2,'0')} 分`;};
export function navigationUrl(segment:Segment) {
  const value=(s:Stop)=>`name:${s.name}|latlng:${s.bd09[1]},${s.bd09[0]}`;
  return 'https://api.map.baidu.com/direction?'+new URLSearchParams({origin:value(segment.origin),destination:value(segment.destination),mode:'driving',coord_type:'bd09ll',output:'html',src:'webapp.yaoyao.autumntrip'});
}
export function routeStops(legs:Segment[]):Stop[] {return legs.length?[legs[0].origin,...legs.map(s=>s.destination)]:[];}
export function routeGeometry(legs:Segment[]) {
  const points=legs.flatMap(s=>s.points),cumulative=[0];
  for(let i=1;i<points.length;i++) {
    const a=points[i-1],b=points[i],cos=Math.cos((a[0]+b[0])*Math.PI/360);
    cumulative.push(cumulative[i-1]+Math.hypot((b[1]-a[1])*cos,b[0]-a[0]));
  }
  return {points,cumulative,total:cumulative.at(-1)??0};
}
export function routePosition(geometry:ReturnType<typeof routeGeometry>,progress:number) {
  if(!geometry.points.length)return null;
  const target=geometry.total*Math.max(0,Math.min(1,progress));
  let low=0,high=geometry.points.length-1;
  while(low<high){const mid=Math.floor((low+high)/2);if(geometry.cumulative[mid]<target)low=mid+1;else high=mid;}
  const end=Math.max(1,low),a=geometry.points[end-1],b=geometry.points[end]??a;
  const span=geometry.cumulative[end]-geometry.cumulative[end-1];
  const t=span?(target-geometry.cumulative[end-1])/span:0;
  return {position:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t] as Position,index:end};
}
