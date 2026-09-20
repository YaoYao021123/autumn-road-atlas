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

const dayMinutes=[325,295,340,389,296,285,47];
const expected=['中高','中高','高','高','高 · 游园后长途驾驶','中高','低'];
for(let dayId=1;dayId<=7;dayId++){
 const r=render({dayId,minutes:dayMinutes[dayId-1]});
 assert(r.burden.startsWith(expected[dayId-1]));
 assert.match(r.text,/4 人同行/);
 assert.match(r.text,/辅助驾驶须全程监督，不替代休息/);
 assert.match(r.text,/轮换仍需分别休息/);
 assert.match(r.text,/2024 款理想 L9 Pro 搭载 AD Pro/);
 assert.doesNotMatch(r.text,/按单人驾驶|松原住宿|全程最高 · 全天返程/);
 if(dayId===5){assert.match(r.text,/乌兰浩特/);assert.match(r.text,/13:00–14:00/);assert.match(r.html,/data-highest-burden="true"/);}
 if(dayId===6){assert.match(r.text,/4 小时 45 分钟/);assert.match(r.text,/净月丽芮/);}
 if(dayId===7){assert.match(r.text,/42 km/);assert.match(r.text,/11:00 前交车/);}
}
console.log('PASS: seven real rendered driving assessments; D5 park plus long drive; D6 hotel transfer; D7 deadline; supervision and rest retained.');
