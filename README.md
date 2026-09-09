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
npm run build
```

静态产物位于 `dist/client`。地图使用 OpenStreetMap 底图；路线为百度地图查询快照，展示前由 BD09 转换至 WGS84。外部导航使用原始 BD09 坐标。每天的路线、小车播放、进度条、机场／长春西站和松原住宿方案可以联动切换。

叶片仅响应滚动或点击，自动消失，静止时不循环播放。可通过“秋意”关闭，并遵循系统减少动态效果偏好。

素材来源及生成提示词见 [ASSETS.md](ASSETS.md)，验证记录及范围限制见 [VALIDATION.md](VALIDATION.md)。不要在此项目中保存地图 MCP 或 JavaScript API 密钥。
