export const stays = [
  {id:'meilun',date:'09.26',city:'长春',name:'长春人民广场万象城美仑酒店',hotelId:103229085,amount:634,breakfast:'每间双早',address:'西安大路568号国际大厦C座十楼',note:'出发前一晚；次晨取车接驳待确认。'},
  {id:'wanda',date:'09.27',city:'齐齐哈尔',name:'齐齐哈尔富力万达嘉华酒店',hotelId:19582367,amount:816,breakfast:'每间双早',address:'建华区新江路1号',note:'入住后吃烤肉，次晨从酒店北上。'},
  {id:'xana',date:'09.28',city:'海拉尔',name:'希岸酒店（呼伦贝尔海拉尔古城店）',hotelId:121877706,amount:898,breakfast:'每间双早',address:'中央大街3号',note:'晚饭、补给；次日早出发，早餐能否打包需问前台。'},
  {id:'vienna',date:'09.29',city:'满洲里',name:'维也纳智好酒店（满洲里中苏金街店）',hotelId:454570,amount:876,breakfast:'每间双早',address:'二道街中苏步行街116号',note:'中苏金街晚间散步；不是同楼的维也纳国际酒店。'},
  {id:'linyuan',date:'09.30',city:'伊尔施',name:'阿尔山林苑宾馆',hotelId:1225811,amount:700,breakfast:'无早',address:'伊尔施镇新城街火车站道口西侧',note:'住宿记账 ¥700；积分抵扣 ¥12，现金支付 ¥688。次晨退房带齐行李。'},
  {id:'ji',date:'10.01',city:'乌兰浩特',name:'全季酒店（乌兰浩特兴安盟政府店）',hotelId:96405609,amount:976,breakfast:'每间双早',address:'罕山街与铁西北大路交汇处金泽时代大厦',note:'公园游览后长途抵达；提前告知预计到店时间。'},
  {id:'red',date:'10.02',city:'长春',name:'长春净月丽芮酒店 Radisson RED',hotelId:132240816,amount:1304,breakfast:'每间双早',address:'净月开发区天勤路1666号',note:'次晨驶向龙嘉还车，实际门店入口待确认。'},
] as const;
export const stayById=(id:string)=>stays.find(s=>s.id===id)!;
export const stayUrl=(stay:typeof stays[number])=>'https://m.ctrip.com/webapp/hotels/detail?'+new URLSearchParams({hotelid:String(stay.hotelId),atime:'2026'+stay.date.replace('.',''),days:'1'});
export const accommodationTotal=stays.reduce((sum,s)=>sum+s.amount,0);
