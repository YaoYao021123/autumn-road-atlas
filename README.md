# 北纬秋行 · 动态路线

2026 年 9 月 27 日至 10 月 3 日大兴安岭自驾旅行路线原型。路线、取还车位置、酒店和天气仍需出发前核对。

## 本地预览

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 4173
```

## 验证与静态构建

```sh
npx tsc --noEmit
node scripts/check-data.mjs
node scripts/check-literary.mjs
node scripts/check-day-visuals.mjs
node scripts/check-road-experience.mjs
node scripts/check-driving-effort.mjs
npm run build
```

静态产物位于 `dist/client`。地图使用 OpenStreetMap 底图；路线为百度地图查询快照，展示前由 BD09 转换至 WGS84。外部导航使用原始 BD09 坐标。每天的路线、小车播放、进度条、机场／长春西站和松原住宿方案可以联动切换。

叶片仅响应滚动或点击，自动消失，静止时不循环播放。可通过“秋意”关闭，并遵循系统减少动态效果偏好。

地图前的七天行程采用白桦枝干与叶片时间轴；地图后新增《额尔古纳河右岸》文学插页。三幅氛围图可切换阅读，短引附原文出处，其余配文标为原创旁白。图像不是沿途实景，场景按钮可以回到关联日期的路线。

每天独立的头图和来源记录保存在 `app/day-scenes.json`；叶片地域色板位于 `app/season-palette.ts`。七天各用一张不同的历史照片，夏季图片明确标注。配色只是地域与景观的季节氛围示意，不代表 2026 年入秋程度的实测或预报。切换取还车点、松原住宿选项不改变 D6 从阿尔山市区出发的照片含义。

沿途美景数据在 `app/road-scenes.json`，位置解析在 `app/road-experience.ts`。地图与下方当日美景列表联动；金叶及短线只示意景观路段，不提供停车导航，P 标才对应已核验的停车入口。入口开放及停车规则尚待出发前核对。全部标记沿用现有路线；D6 会随机场／西站／松原方案匹配实际轨迹，不增加观景绕行。

`DrivingEffort` 按单人、白天正常路况区分“AD Pro 操作减负”和“全天驾驶／体力负担”，随日期及松原方案变化。它是定性行程判断，不是疲劳实测或车辆已开通能力的保证；未用百分比、减少休息次数或等效驾驶小时夸大辅助驾驶收益。D6 直返保持全程最高负担提示。展开可查官方依据与取车核对清单。

素材来源及生成提示词见 [ASSETS.md](ASSETS.md)，验证记录及范围限制见 [VALIDATION.md](VALIDATION.md)。不要在此项目中保存地图 MCP 或 JavaScript API 密钥。
