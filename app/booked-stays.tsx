import {ArrowUpRight,Hotel} from 'lucide-react';
import {stays,stayUrl,accommodationTotal} from './stays';
import './booked-stays.css';

export function DailyStay({dayId}:{dayId:number}){
  const origin=stays[dayId-1],destination=stays[dayId];
  return <section className="daily-stay" aria-label="当天酒店衔接">
    <span className="stay-kicker"><Hotel size={14}/>酒店到酒店 · 4 人 / 2 间双床</span>
    <p><small>早上出发</small><a href={stayUrl(origin)} target="_blank" rel="noopener noreferrer">{origin.name}<ArrowUpRight size={12}/></a></p>
    {destination?<p><small>今晚入住 · {destination.breakfast}</small><a href={stayUrl(destination)} target="_blank" rel="noopener noreferrer">{destination.name}<ArrowUpRight size={12}/></a></p>:<p><small>当天终点</small><span>龙嘉机场还车 · 实际门店待确认</span></p>}
    {dayId===1&&<small className="stay-warning">地图暂示市区取车后的酒店出发线；若需机场取车，接驳与路线须调整。</small>}
    {dayId===5&&<small className="stay-warning">今晚不回阿尔山。退房后带齐行李；公园换乘游览不计入地图驾驶时长。</small>}
  </section>;
}

export function BookedStays({onDaySelect}:{onDaySelect:(day:number)=>void}){
  return <section className="booked-stays" aria-labelledby="stays-title">
    <div className="stays-heading"><div><span className="eyebrow"><Hotel size={14}/>每一晚，都有落点</span><h2 id="stays-title">今晚抵达，明早出发。</h2></div><p>4 人同行 · 2 间双床<br/>住宿已选定 · 价格按每晚两间合计</p></div>
    <div className="stay-list">{stays.map((stay,i)=><article key={stay.id} className="stay-row">
      <button className="stay-date" onClick={()=>onDaySelect(Math.max(1,i))} aria-label={`查看${stay.date} ${stay.city}的行程`}><span>{stay.date}</span><small>{i===0?'出发前夜':`DAY ${String(i).padStart(2,'0')}`}</small></button>
      <div className="stay-details"><span className="stay-city">{stay.city} · {stay.breakfast}</span><h3><a href={stayUrl(stay)} target="_blank" rel="noopener noreferrer">{stay.name}<ArrowUpRight size={14}/></a></h3><p>{stay.address}</p><small>{stay.note}</small></div>
      <div className="stay-price">¥{stay.amount.toLocaleString()}<small>2 间 / 1 晚</small></div>
    </article>)}</div>
    <div className="stay-totals"><span>7 晚住宿 <strong>¥{accommodationTotal.toLocaleString()}</strong></span><span>租车 <strong>¥4,927</strong></span><span>合计 <strong>¥{(accommodationTotal+4927).toLocaleString()}</strong></span><small>4 人均摊 ¥2,782.75 · 积分抵扣单列，不下调房价；未含餐饮、油电、过路费和门票。</small></div>
  </section>;
}
