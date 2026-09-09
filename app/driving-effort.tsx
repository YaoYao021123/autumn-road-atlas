import { ArrowUpRight, CarFront, ChevronDown } from 'lucide-react';
import './driving-effort.css';

type DrivingEffortProps = {
  dayId: number;
  overnight: boolean;
  minutes: number;
};

type EffortAssessment = {
  relief: string;
  burden: string;
  context: string;
  supervision: string;
  rest: string;
};

const dailyAssessments: Record<number, EffortAssessment> = {
  1: {
    relief: '较明显 · 高速段',
    burden: '中高 · 长途转场',
    context: '高速跟车、车道保持可减少重复操作；取车手续和熟悉这辆车的时间需另留。',
    supervision: '先熟悉启用、退出和接管方式，再在满足条件的路段使用。留意变道、匝道和收费站。',
    rest: '约每 1.5–2 小时安排一次安全停靠，休息约 20 分钟；到齐齐哈尔后留足睡眠。',
  },
  2: {
    relief: '较明显 · 高速段',
    burden: '中高 · 持续驾驶',
    context: '连续高速更能发挥操作减负作用，但长时间观察路况和车辆行为仍需保持注意力。',
    supervision: '留意大车、并线和施工。长直路容易困倦，不能把系统稳定运行当作放松警觉的理由。',
    rest: '提前选好服务区，约每 1.5–2 小时休息约 20 分钟。若有两名熟悉车辆的驾驶员，可轮换。',
  },
  3: {
    relief: '有限 · 国道与短高速',
    burden: '高 · 驾驶与多次停靠',
    context: '国道、景点进出和多次停车使辅助驾驶不连续；游览与用餐还会拉长当天时程。',
    supervision: '路口、转弯、混合交通和观景点入口主动驾驶。不要预设国道全程能用 NOA。',
    rest: '把正式休息与拍照短停分开安排；约每 1.5–2 小时检查状态，安全停车休息约 20 分钟。',
  },
  4: {
    relief: '有限 · 草原与林区',
    burden: '高 · 国道长途',
    context: 'G331 与未标路名段按主动驾驶安排；长途、弯道和陌生路况共同增加当天负担。',
    supervision: '关注路面、会车、路口及可能横穿道路的动物；急弯、差标线或湿滑路段不依赖辅助驾驶。',
    rest: '提前安排旗县补给和正规停车点，约每 1.5–2 小时休息。保留白天行驶时间，不追赶日落。',
  },
  5: {
    relief: '较少 · 外部接驳',
    burden: '驾驶低 · 体力中高',
    context: '驾驶基线只含景区外接驳；全天步行、换乘和排队另计，不能当作司机的完整休息日。',
    supervision: '景区入口、停车场及出园接驳自行观察和操控，不把车辆回放理解为核心景区内可自驾。',
    rest: '午间安排坐下休息，控制最后一个景点的时间；出园前确认司机状态，为次日返程留足睡眠。',
  },
};

function assessmentFor(dayId: number, overnight: boolean): EffortAssessment {
  if (dayId === 6) {
    return overnight
      ? {
          relief: '出山后高速段较明显',
          burden: '高 · 松原仍是长途',
          context: '住松原分散了两天的驾驶时长，但今天出山与高速仍占据较长时间。',
          supervision: '白天主动驾驶出山；高速可用路段也须全程监督，重点留意匝道、施工和车流变化。',
          rest: '提前确认松原住宿，约每 1.5–2 小时休息约 20 分钟。两名熟悉车辆的司机可轮换，勿等疲劳才决定停留。',
        }
      : {
          relief: '出山后高速段较明显',
          burden: '全程最高 · 全天返程',
          context: '约 8 小时以上的驾驶基线，还要增加休息、用餐和拥堵；高速操作减负不改变这一天的最高负担。',
          supervision: '出山段主动驾驶，高速段持续观察和准备接管。不可因开启 NOA 而延长连续驾驶时间。',
          rest: '优先两名熟悉车辆的司机轮换，或提前选定松原住宿。约每 1.5–2 小时休息；困倦时就近安全停靠，不为当晚抵达硬撑。',
        };
  }

  if (dayId === 7) {
    return overnight
      ? {
          relief: '高速段较明显',
          burden: '中 · 另有还车时限',
          context: '松原至长春仍是一段跨城驾驶；导航终点尚非已确认的还车门店。',
          supervision: '清晨确认精神状态，高速持续监督，进城和门店接驳主动驾驶。',
          rest: '按实际门店提前出发，途中预留休息和拥堵时间；以 10:00 到店为目标，另留验车、补能及行李整理时间。',
        }
      : {
          relief: '较少 · 市内短接驳',
          burden: '低 · 门店接驳',
          context: '已在长春住宿时，不再安排跨城长途；实际接驳时长待门店确定。',
          supervision: '关注城市路口、行人和停车场，短接驳以主动驾驶为主。',
          rest: '正常休息后出发，以 10:00 到店为目标；油电、验车和行李整理另留时间，11:00 前完成还车。',
        };
  }

  return dailyAssessments[dayId] ?? dailyAssessments[1];
}

function durationText(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) return '待实际还车门店确定';
  const total = Math.round(minutes);
  const hours = Math.floor(total / 60);
  const remainder = total % 60;
  return `${hours ? `${hours} 小时` : ''}${remainder ? ` ${remainder} 分钟` : ''}`.trim();
}

/** Route-planning judgement, not a measured fatigue score or a vehicle entitlement check. */
export function DrivingEffort({ dayId, overnight, minutes }: DrivingEffortProps) {
  const assessment = assessmentFor(dayId, overnight);
  const highestBurden = dayId === 6 && !overnight;

  return (
    <section className="driving-effort" aria-label="当天驾驶与体力负担" data-highest-burden={highestBurden || undefined}>
      <div className="driving-effort-heading">
        <span><CarFront size={14} aria-hidden="true" />驾驶与体力</span>
        <small>按单人驾驶</small>
      </div>
      <dl className="driving-effort-overview">
        <div><dt>操作减负</dt><dd><span className="driving-effort-system">AD Pro</span>{assessment.relief}</dd></div>
        <div><dt>全天负担</dt><dd className="driving-effort-burden">{assessment.burden}</dd></div>
      </dl>
      <p className="driving-effort-boundary">辅助驾驶须全程监督，不替代休息。</p>
      <details className="driving-effort-details" key={`${dayId}-${overnight}`}>
        <summary>当天建议与车型依据<ChevronDown size={14} aria-hidden="true" /></summary>
        <div className="driving-effort-expanded">
          <p className="driving-effort-baseline">{dayId === 5 ? '外部自驾基线' : '当前驾驶基线'} · {durationText(minutes)}</p>
          <p>{assessment.context}</p>
          <dl className="driving-effort-advice">
            <div><dt>观察与接管</dt><dd>{assessment.supervision}</dd></div>
            <div><dt>休息安排</dt><dd>{assessment.rest}</dd></div>
          </dl>
          <p className="driving-effort-assumption">以上为白天正常路况下的定性规划，未实测个人疲劳；休息间隔是行程建议，困倦时应提前停车。两人轮换仍需分别休息。</p>

          <h3>这辆车能帮到哪里</h3>
          <p>此评估按 2024 L9 Pro 的 AD Pro 配置，不套用 AD Max 或 2025 智能焕新版的能力。</p>
          <p>2024 款理想 L9 Pro 搭载 AD Pro、地平线征程 5。满足条件时，高速 NOA 可辅助跟车、变道和进出匝道；全程需手扶方向盘、观察路况并随时接管。</p>
          <p>AD Pro 3.0 的 LCC 能力随 OTA 更新。本行程不把城市 NOA 或路口自动通行计入减负，国道与林区按主动驾驶安排。</p>
          <div className="driving-effort-sources" aria-label="官方车型与安全依据">
            <a href="https://www.horizon.auto/news/mass-production/42" target="_blank" rel="noopener noreferrer">地平线 · L9 Pro／2024.09.12<ArrowUpRight size={12} aria-hidden="true" /></a>
            <a href="https://www.lixiang.com/community/detail/article/1244987.html" target="_blank" rel="noopener noreferrer">理想 · AD Pro 3.0／2024.05.11<ArrowUpRight size={12} aria-hidden="true" /></a>
            <a href="https://manuals.lixiang.com/zh-cn/X012024PRO/20260310132511/index.html?content=topic-2023-9B468273-010.html" target="_blank" rel="noopener noreferrer">理想 · 2024 L9 Pro 用户手册<ArrowUpRight size={12} aria-hidden="true" /></a>
            <a href="https://gaj.wuhan.gov.cn/jmzx/gayw/202602/t20260214_2730239.html" target="_blank" rel="noopener noreferrer">公安交管提示／2026.02.14<ArrowUpRight size={12} aria-hidden="true" /></a>
          </div>

          <h3>取车时待确认</h3>
          <ul className="driving-effort-checks">
            <li>实车为 2024 L9 Pro，核对 AD Pro 菜单和当前 OTA 版本。</li>
            <li>确认租车授权、驾驶人账号及功能学习考试，熟悉启用和退出方式。</li>
            <li>检查摄像头、雷达及挡风玻璃无遮挡，按车机显示确认沿途可用路段。</li>
          </ul>
          <p className="driving-effort-assumption">型号支持不代表这辆租车已开通，也不保证沿途可用；以实车状态、道路环境及当前用户手册为准。</p>
        </div>
      </details>
    </section>
  );
}
