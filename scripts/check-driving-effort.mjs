import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const componentPath = resolve(projectRoot, 'app/driving-effort.tsx');

// Execute the real component with the actual React and Lucide runtimes.
// Only the stylesheet is stubbed; no rendered content or component logic is mocked.
const compiled = ts.transpileModule(readFileSync(componentPath, 'utf8'), {
  fileName: componentPath,
  reportDiagnostics: true,
  compilerOptions: {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true,
  },
});
const diagnostics = (compiled.diagnostics ?? []).filter(
  (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
);
assert.equal(
  diagnostics.length,
  0,
  diagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')).join('\n'),
);

const componentModule = { exports: {} };
const requiredModules = new Set();
new Script(compiled.outputText, { filename: componentPath }).runInNewContext({
  module: componentModule,
  exports: componentModule.exports,
  require(specifier) {
    requiredModules.add(specifier);
    if (specifier === './driving-effort.css') return {};
    if (specifier === 'react/jsx-runtime' || specifier === 'lucide-react') {
      return require(specifier);
    }
    throw new Error(`Unexpected component dependency: ${specifier}`);
  },
});
const { DrivingEffort } = componentModule.exports;
assert.equal(typeof DrivingEffort, 'function', 'DrivingEffort must be a named component export');

function plainText(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null;
}

function renderedField(html, className) {
  const match = html.match(new RegExp(`<([a-z][a-z0-9]*)\\b[^>]*class="${className}"[^>]*>([\\s\\S]*?)<\\/\\1>`));
  assert.ok(match, `Missing rendered .${className}`);
  return plainText(match[2]);
}

function render(props) {
  const html = renderToStaticMarkup(React.createElement(DrivingEffort, props));
  return {
    props,
    html,
    text: plainText(html),
    burden: renderedField(html, 'driving-effort-burden'),
    baseline: renderedField(html, 'driving-effort-baseline'),
  };
}

const dayMinutes = [348, 327, 340, 385, 95, 498, 0];
const dayBurdens = ['中高', '中高', '高', '高', '驾驶低 · 体力中高'];
const results = [];
for (let dayId = 1; dayId <= 7; dayId += 1) {
  for (const overnight of [false, true]) {
    const minutes = overnight && dayId === 6 ? 390 : overnight && dayId === 7 ? 147 : dayMinutes[dayId - 1];
    results.push(render({ dayId, overnight, minutes }));
  }
}
const westReturn = render({ dayId: 6, overnight: false, minutes: 486 });
const westMorning = render({ dayId: 7, overnight: true, minutes: 128 });
const allResults = [...results, westReturn, westMorning];
const resultFor = (dayId, overnight) => results.find((result) => result.props.dayId === dayId && result.props.overnight === overnight);

let passed = 0;
const failures = [];
function check(name, verify) {
  try {
    verify();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push({ name, message: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

check('actual JSX runtime, Lucide SVG and default closed details', () => {
  assert.ok(requiredModules.has('react/jsx-runtime'));
  assert.ok(requiredModules.has('lucide-react'));
  assert.ok(requiredModules.has('./driving-effort.css'));
  for (const { html } of allResults) {
    assert.match(html, /<svg\b[^>]*class="[^"]*lucide/);
    const details = html.match(/<details\b[^>]*>/);
    assert.ok(details, 'Advice must be available through native details');
    assert.doesNotMatch(details[0], /\bopen(?:\s|=|>)/, 'Advice should begin collapsed');
    assert.match(html, /<summary\b/);
  }
});

check('D1–D7 and both overnight states preserve daily burden', () => {
  assert.equal(results.length, 14);
  for (const result of results) {
    const { dayId, overnight } = result.props;
    const expected = dayId <= 5
      ? dayBurdens[dayId - 1]
      : dayId === 6
        ? overnight ? '高 · 松原仍是长途' : '全程最高'
        : overnight ? '中 · 另有还车时限' : '低 · 门店接驳';
    assert.ok(result.burden.startsWith(expected), `D${dayId}, overnight=${overnight}: ${result.burden}`);
    assert.match(result.text, /按单人驾驶/);
    assert.match(result.text, /操作减负/);
    assert.match(result.text, /全天负担/);
  }
  for (let dayId = 1; dayId <= 5; dayId += 1) {
    assert.equal(resultFor(dayId, false).html, resultFor(dayId, true).html,
      `The D6 overnight decision must not change D${dayId}'s advice`);
  }
});

check('D6 direct return stays highest at 498 and 486 minutes; Songyuan remains high at 390', () => {
  const airportReturn = resultFor(6, false);
  const songyuan = resultFor(6, true);
  assert.match(airportReturn.baseline, /8 小时 18 分钟/);
  assert.match(westReturn.baseline, /8 小时 6 分钟/);
  assert.match(songyuan.baseline, /6 小时 30 分钟/);
  for (const direct of [airportReturn, westReturn]) {
    assert.match(direct.burden, /全程最高/);
    assert.match(direct.html, /data-highest-burden="true"/);
    assert.match(direct.text, /不可因开启 NOA 而延长连续驾驶时间/);
    assert.match(direct.text, /两名.*司机轮换.*松原住宿/);
  }
  assert.match(songyuan.burden, /^高/);
  assert.doesNotMatch(songyuan.html, /data-highest-burden=/);
  assert.match(songyuan.text, /分散了两天的驾驶时长/);
});

check('D5 distinguishes short external driving from the full day of physical activity', () => {
  for (const overnight of [false, true]) {
    const result = resultFor(5, overnight);
    assert.equal(result.burden, '驾驶低 · 体力中高');
    assert.equal(result.baseline, '外部自驾基线 · 1 小时 35 分钟');
    assert.match(result.text, /步行、换乘和排队另计/);
    assert.match(result.text, /不能当作司机的完整休息日/);
    assert.match(result.text, /不把车辆回放理解为核心景区内可自驾/);
  }
});

check('D7 local transfer stays unestimated; Songyuan return includes travel and the deadline', () => {
  const local = resultFor(7, false);
  assert.match(local.baseline, /待实际还车门店确定/);
  assert.doesNotMatch(local.baseline, /0 小时|0 分钟/);
  assert.match(local.text, /不再安排跨城长途/);
  assert.match(local.text, /10:00 到店/);
  assert.match(local.text, /11:00 前完成还车/);
  assert.match(resultFor(7, true).baseline, /2 小时 27 分钟/);
  assert.match(westMorning.baseline, /2 小时 8 分钟/);
  for (const result of [resultFor(7, true), westMorning]) {
    assert.match(result.burden, /^中/);
    assert.match(result.text, /松原至长春仍是一段跨城驾驶/);
    assert.match(result.text, /途中预留休息和拥堵时间/);
    assert.match(result.text, /10:00 到店/);
  }
});

check('every rendered state requires supervision and rest without numerical fatigue scores', () => {
  for (const { text, html } of allResults) {
    assert.equal(renderedField(html, 'driving-effort-boundary'), '辅助驾驶须全程监督，不替代休息。');
    assert.match(text, /观察与接管/);
    assert.match(text, /休息安排/);
    assert.match(text, /手扶方向盘.*随时接管/);
    assert.match(text, /未实测个人疲劳/);
    assert.match(text, /困倦时应提前停车/);
    assert.match(text, /两人轮换仍需分别休息/);
    assert.doesNotMatch(text, /\d+(?:\.\d+)?\s*[%％]|疲劳(?:评分|得分)\s*[:：]?\s*\d/);
  }
});

check('2024 AD Pro hardware is explicit and Max/newer-city capabilities are not promised', () => {
  for (const { text } of allResults) {
    assert.match(text, /2024 款理想 L9 Pro 搭载 AD Pro、地平线征程 5/);
    assert.match(text, /(?:不是|并非|非|不属于|不套用)\s*AD Max/, 'An explicit non-AD-Max statement is required');
    assert.match(text, /不套用 AD Max 或 2025 智能焕新版的能力/);
    assert.match(text, /LCC 能力随 OTA 更新/);
    assert.match(text, /不把城市 NOA 或路口自动通行计入减负/);
    assert.doesNotMatch(text, /支持城市 NOA|(?:红绿灯|路口)(?:均可|都可|可自动|全自动)/);
  }
});

check('rental availability is conditional and the pickup checklist renders', () => {
  for (const { text, html } of allResults) {
    assert.match(text, /取车时待确认/);
    assert.match(text, /当前 OTA 版本/);
    assert.match(text, /租车授权、驾驶人账号及功能学习考试/);
    assert.match(text, /摄像头、雷达及挡风玻璃无遮挡/);
    assert.match(text, /按车机显示确认沿途可用路段/);
    assert.match(text, /型号支持不代表这辆租车已开通，也不保证沿途可用/);
    const checklist = html.match(/<ul\b[^>]*class="driving-effort-checks"[^>]*>([\s\S]*?)<\/ul>/);
    assert.ok(checklist);
    assert.equal((checklist[1].match(/<li\b/g) ?? []).length, 3);
  }
});

check('official evidence links are present, labelled and safely open a new tab', () => {
  const expectedUrls = [
    'https://www.horizon.auto/news/mass-production/42',
    'https://www.lixiang.com/community/detail/article/1244987.html',
    'https://manuals.lixiang.com/zh-cn/X012024PRO/20260310132511/index.html?content=topic-2023-9B468273-010.html',
    'https://gaj.wuhan.gov.cn/jmzx/gayw/202602/t20260214_2730239.html',
  ];
  for (const { html } of allResults) {
    const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
    for (const expected of expectedUrls) {
      const link = links.find((match) => attribute(match[1], 'href') === expected);
      assert.ok(link, `Missing official source: ${expected}`);
      assert.ok(plainText(link[2]).length > 4, 'Source links must have a meaningful visible label');
      assert.equal(attribute(link[1], 'target'), '_blank');
      const rel = (attribute(link[1], 'rel') ?? '').split(/\s+/);
      assert.ok(rel.includes('noopener') && rel.includes('noreferrer'));
    }
    assert.equal(links.length, expectedUrls.length, 'Sources should contain only the four verified official links');
  }
});

console.log(`\nDrivingEffort: ${allResults.length} real component renders; ${passed} checks passed; ${failures.length} failed.`);
if (failures.length) process.exitCode = 1;
