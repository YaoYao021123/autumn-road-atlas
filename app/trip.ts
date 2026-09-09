import raw from './routes.generated.json';

export type Position=[number,number];
export type Stop={name:string;bd09:[number,number];position:Position};
export type Segment={id:string;origin:Stop;destination:Stop;km:number;minutes:number;points:Position[]};
// The generator validates every coordinate pair before emitting this JSON.
export const segments=raw.segments as unknown as Record<string,Segment>;
export type Endpoint='airport'|'west';
export type Day={id:number;date:string;weekday:string;short:string;title:string;subtitle:string;road:string;budget:string;note:string;stops:string[];legs:string[]};
export function getDays(endpoint:Endpoint,overnight:boolean):Day[] {
  return [
    {id:1,date:'09.27',weekday:'星期日',short:'长春 → 齐齐哈尔',title:'长春 → 齐齐哈尔',subtitle:'从松嫩平原出发，先把城市留在身后。',road:'珲乌高速 · 大广高速 · G10',budget:'转场日，取车与休息另计',note:'机场或西站仅作取车代表点；实际门店未确定。今天不额外塞进扎龙半日游。',stops:['上午取车 · 检查油电与轮胎','抵达后休息，为北上留足睡眠'],legs:[endpoint==='airport'?'longjia_qiqihar':'changchun_west_qiqihar']},
    {id:2,date:'09.28',weekday:'星期一',short:'齐齐哈尔 → 海拉尔',title:'齐齐哈尔 → 海拉尔',subtitle:'平原渐远，山林与草原在车窗外交替。',road:'G10 绥满高速',budget:'整段转场，停靠服务区休息',note:'不强制绕入扎兰屯、牙克石市中心。高速沿途景观以车窗观赏为主，不在应急车道拍照。',stops:['早出发 · 进入林草过渡地带','傍晚抵达 · 为次日草原公路补给'],legs:['qiqihar_hailaer']},
    {id:3,date:'09.29',weekday:'星期二',short:'额尔古纳 · 满洲里',title:'海拉尔 → 满洲里',subtitle:'沿河谷与边境草原南下，晚间留给满洲里。',road:'G332 → G331 → G10',budget:'约 8–9 小时，含用餐与短停',note:'不加五卡、七卡北向折返，不在黑山头等日落。186 停车入口用于锁定路线，景区可不入园。',stops:['约 07:00 出发','草原向湿地过渡 · 短停','南下边境公路 · 不等日落','河谷草原 · 仅正规停车位','晚上城市散步 · 住满洲里'],legs:['hailaer_erguna','erguna_heishantou','heishantou_186_parking','186_parking_manzhouli']},
    {id:4,date:'09.30',weekday:'星期三',short:'满洲里 → 伊尔施',title:'满洲里 → 伊尔施',subtitle:'穿过新巴尔虎草原，进入大兴安岭的秋林。',road:'G331 新巴尔虎草原线',budget:'约 8–10 小时，日间完成林区段',note:'必须保留右旗、左旗两个途经点。满洲里至右旗有约 40.6 km 未标路名段，临行需复核路面与管制。',stops:['早出发，把白天留给草原','草原腹地 · 加油与补给','沿 G331 继续 · 林草过渡','入夜前抵达 · 住伊尔施'],legs:['manzhouli_right_banner','right_left_banner','left_banner_iershi']},
    {id:5,date:'10.01',weekday:'星期四',short:'阿尔山森林公园',title:'伊尔施 → 阿尔山',subtitle:'把白天交给秋林与火山湖，晚上回到市区。',road:'游客中心停车场 · 外部自驾接驳',budget:'公园全天；仅展示外部自驾路段',note:'图中不含景区内换乘、步行和排队；天池、杜鹃湖等选 2–3 个，不追全景点。不要把车辆回放理解为可自驾进入核心景区。',stops:['早出发前往游客中心','停车换乘 · 游览与排队另计','控制最后景点时间 · 晚住市区'],legs:['iershi_park_parking','park_parking_city']},
    {id:6,date:'10.02',weekday:'星期五',short:overnight?'阿尔山 → 松原':'阿尔山 → 长春',title:overnight?'阿尔山 → 松原':'阿尔山 → 长春',subtitle:overnight?'今天在松原收车，给最后一早留一段高速。':'白天驶出山地，后半程沿高速返回长春。',road:overnight||endpoint==='airport'?'G302 → 珲乌高速':'G302 → 双嫩高速 → 长太高速',budget:overnight?'仍是长途驾驶日，休息时间另计':'暂留 10–12 小时，拥堵仍可能超出',note:overnight?'松原是住宿备选，不等到疲劳才作决定。机场还车次日暂按 06:30 出发，西站方案按实际门店重算。':'07:00–07:30 从阿尔山市区出发，整天返程；状态不佳则在途中休息。若住公园内，还需另外计入出山时间。',stops:['07:00–07:30 出发 · 白天通过山地',overnight?'住宿松原 · 提前安排油电补给':'状态允许当晚到长春 · 住门店附近'],legs:[overnight?'arxan_songyuan':endpoint==='airport'?'arxan_longjia':'arxan_changchun_west']},
    {id:7,date:'10.03',weekday:'星期六',short:overnight?'松原 → 长春还车':'长春 · 还车',title:overnight?'松原 → 长春':'长春 · 还车',subtitle:'10:00 到实际门店，11:00 前完成还车。',road:overnight?'珲乌高速 · 长春还车':'市内短接驳 · 门店位置待定',budget:overnight?(endpoint==='airport'?'暂按 06:30 出发，另留假日机动':'暂按 06:30–07:00 出发，门店确定后重算'):'不再安排跨城长途',note:'地图终点为机场 T2 或长春西站，不是已确认门店。还车油电、行李整理及验车均需留时间；辅助驾驶不抵消疲劳。',stops:overnight?['清晨出发 · 按实际导航提前','10:00 到店目标 · 11:00 硬截止']:['具体还车门店待确认'],legs:overnight?[endpoint==='airport'?'songyuan_longjia':'songyuan_changchun_west']:[]},
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
