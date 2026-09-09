# Asset provenance

## Day-specific landscape photographs — 2026-09-09

The exact image URLs, source URLs, credit strings and historical date labels are in `app/day-scenes.json`. Images are loaded from their original hosts without copying third-party files into this project. D1, D2 and D4 are explicitly labelled summer references. D3, D5, D6 and D7 are historical autumn references. No photo is represented as 2026 conditions or as proof that a specific viewpoint is included in this route.

| Day | Landscape | Source and timing | Reuse status |
| --- | --- | --- | --- |
| D1 | 齐齐哈尔城市 | [新华网](https://www.news.cn/20250706/951aba1fb28f4e3f9932d6de2c5c4a16/c.html), 2025-07-06 publication; 中共齐齐哈尔市委宣传部供图 | Open licence not established |
| D2 | 海拉尔河 | [新华网](https://www.news.cn/photo/20250730/2be19939dd0945f582ef52a79218b2e8/c.html?page=4), 2025-07-29 photograph; 新华社贾立君 | Open licence not established |
| D3 | 额尔古纳湿地 | [新华网](https://www.news.cn/photo/20250917/f2b42b6142b34babb56b169dce6f1ee9/c.html?page=2), 2025-09-16 photograph; 新华社马金瑞 | Open licence not established |
| D4 | 新巴尔虎右旗草原 | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E6%96%B0%E5%B7%B4%E5%B0%94%E8%99%8E%E5%8F%B3%E6%97%97_%E8%8D%89%E5%8E%9F_-_panoramio.jpg), 2012-08-10 photograph; mayanming | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/); in-page author/licence credit; display crop only |
| D5 | 阿尔山秋色长廊 | [新华网 / 兴安日报](https://xczx.news.cn/2023-10/13/c_1212288386.htm), 2023-10-13 publication; individual photo author/date not supplied | Open licence not established |
| D6 | 阿尔山市区，返程出发地 | [新华网 / 兴安日报](https://xczx.news.cn/2023-10/25/c_1212293743.htm), 2023-10-25 publication; article reporter 毕力格, individual photographer not separately supplied | Open licence not established |
| D7 | 长春新民广场周边 | [新华网](https://www.news.cn/photo/2023-10/25/c_1129937308_9.htm), 2023-10-24 photograph; 新华社颜麟蕴 | Open licence not established |

D6 deliberately shows the shared departure city, not Songyuan: the default Changchun West return does not necessarily pass Songyuan. Source and failure state switch together with the day. Do not publish the unlicensed photos publicly without a separate rights review.

## Regional leaf palette

The existing generated leaf texture is styled using CSS hue/saturation/brightness per day. No raster asset is edited or newly generated in this change. Unselected leaves retain their regional colours; selection uses size, type emphasis and shadow instead of replacing the colour with generic gold. Following the user's feedback, green-shifted hues have been pulled back to wheat, honey and ochre gold; the same leaf asset is reused for scenic road markers. Palette labels are editorial, not measured leaf percentages or dated phenology claims. The [historical China Weather gallery](https://nmg.weather.com.cn/gqtj/2932291_list.shtml) shows the region's mixed autumn colours; it does not substantiate a 2026 forecast. No route-wide delay or peak-colour date was inferred from current short-range weather reports.

- `public/autumn-birch.png`: generated 2026-09-09 using the built-in Image Gen tool via the imagegen skill; one generation, no image edits. Transparent RGBA, 1254 × 1254. Decorative botanical asset, not a photograph of this year's autumn conditions.
- In-page Arxan road photograph: https://xczx.news.cn/2023-10/13/1212288386_16971850126181n.jpg . Source: https://xczx.news.cn/2023-10/13/c_1212288386.htm (新华网 / 兴安日报, 2023-10-13). Loaded from its source, credited and labelled historical reference. No open redistribution licence established; do not republish publicly without checking permission.
- Basemap: OpenStreetMap standard raster tiles; normal on-demand browser requests only, no proxy/prefetch/offline archive. Attribution stays on map. https://operations.osmfoundation.org/policies/tiles/
- Navigation geometry: Baidu Maps MCP snapshots, 2026-09-09. Original BD09 navigation coordinates are retained; display paths converted using gcoord 1.0.7 to WGS84.

## Literary imagery and birch timeline — 2026-09-09

All four new assets were generated using the **built-in Image Gen** tool. One call each, no variants or retries. Images were inspected before integration. These are original decorative/literary artworks, not this year's autumn observations or exact geographic reconstructions.

- `public/literary-river.png`: 1536 × 1024 PNG, contemplative river/wetland image.
- `public/literary-forest.png`: 1536 × 1024 PNG, imagined northern autumn forest with two reindeer; not a promise of wildlife on this itinerary.
- `public/literary-embers.png`: 1536 × 1024 PNG, quiet embers and remembered forest; not permission or advice to light fires outdoors.
- `public/timeline-birch.png`: 2172 × 724 PNG, genuine RGBA transparency, 92.53% fully transparent per asset-agent check. A functional timeline connector. The initial requested dimensions were 1536 × 512; the tool returned the same 3:1 ratio at a higher resolution. The preview's saturated edge pixels had alpha at most 2/255; no image processing or edits were applied.

The single short novel quotation is attributed to 迟子建《额尔古纳河右岸》 and verified against [中国作家网 / 学习时报，2025-07-02](https://www.chinawriter.com.cn/n1/2025/0702/c404030-40513386.html). Natural motifs were cross-checked with the [文艺报 novel excerpt，2023-12-01](https://wyb.chinawriter.com.cn/Pad/content/202312/01/content72638.html). All other scene captions are labelled original narration; they are not quotations or an attempt to imitate the author's writing style.

### Final prompt — River

```text
Use case: stylized-concept
Asset type: standalone landscape editorial artwork for an autumn roadtrip page; imagined literary art, with any explanatory labeling handled outside the image.
Primary request: a contemplative, semi-abstract landscape evoking the natural river motifs and quiet atmosphere of Chi Zijian's novel The Right Bank of the Argun / 额尔古纳河右岸, without imitating any artist's style or reconstructing a real geographic scene.
Scene and subject: a thin luminous winding silver river ribbon moving through charcoal and brown ink-wash wetlands with scattered ochre texture.
Composition/framing: wide 3:2 landscape, target 1536 x 1024 pixels. Sparse and asymmetrical. The upper and left areas dissolve into large expanses of natural white paper-like mist and fine grain. The river remains legible yet delicate.
Style/medium: an elegant editorial artwork between an imagined aerial landscape and an abstract photographic darkroom print, with expressive wash textures and subtle natural grain.
Lighting/mood: cold still air, contemplative silence, generous breathing space.
Color palette: natural white, silver, charcoal, earthy brown, and restrained gold/ochre; no tech blue or purple.
Constraints: produce one complete standalone image, no panels. This is fictional literary atmosphere, not a travel photo or exact Argun aerial map. No people, no invented ethnic ritual or costume props, no flags, modern roads, vehicles, logos, text, watermark, book-cover frame, or UI frame.
```

### Final prompt — Forest

```text
Use case: photorealistic-natural
Asset type: standalone landscape editorial artwork for an autumn roadtrip page; imagined literary art, with any explanatory labeling handled outside the image.
Primary request: a photorealistic, natural imagined autumn northern forest evoking the larch, birch, and reindeer motifs of Chi Zijian's novel The Right Bank of the Argun / 额尔古纳河右岸, without imitating any artist's style or claiming a specific tourist location.
Scene/backdrop: slender larch and birch trunks in an autumn forest, rich leaf litter and moss, warm low sunlight filtering through golden foliage.
Subject: exactly two believable reindeer loosely among the trunks in the middle ground; one grazing and one alert, with a faint natural breath visible in the cool air. Natural anatomy and realistic scale.
Composition/framing: wide 3:2 landscape, target 1536 x 1024 pixels. Eye-level candid cinema still, natural depth. A few small golden leaves are softly out of focus in the foreground; no continuous falling-leaf storm.
Style/medium: photorealistic with nuanced fur, bark, moss, and leaf textures, luminous yet not oversaturated.
Lighting/mood: warm low sunlight against cool autumn air, quiet but gently alive.
Color palette: gold/ochre, pine green, charcoal, bark brown, and natural white; no tech blue or purple.
Constraints: produce one complete standalone image, no panels. This is an imagined literary scene, not a documentary travel photo or geographic reconstruction. No people, no invented ethnic ritual or costume props, no flags, modern roads, vehicles, magical effects, logos, text, watermark, book-cover frame, or UI frame.
```

### Final prompt — Embers

```text
Use case: stylized-concept
Asset type: standalone landscape editorial artwork for an autumn roadtrip page; imagined literary art, with any explanatory labeling handled outside the image.
Primary request: a mostly abstract intimate meditation on embers, time, and remembered warmth, evoking natural motifs from Chi Zijian's novel The Right Bank of the Argun / 额尔古纳河右岸 without imitating any artist's style or reconstructing a real place.
Scene and subject: charcoal-black night and softly glowing amber embers with fine ash textures. Pale grey smoke rises slowly and dissolves into faint pale birch-like vertical traces.
Composition/framing: wide 3:2 landscape, target 1536 x 1024 pixels. A calm composition with extensive deep black space; the fire is only a small low focal accent, not a roaring bonfire.
Style/medium: a restrained photographic and painting hybrid, tactile ash and char, soft smoke, subtle painterly traces, no graphic symbols.
Lighting/mood: quiet and intimate, lingering warmth in darkness, stillness and memory.
Color palette: deep charcoal black, subtle warm copper and amber, pale grey and natural white; no neon, tech blue, or purple.
Constraints: produce one complete standalone image, no panels. This is fictional literary atmosphere, not a travel photo. No camp equipment, huts, people, invented ethnic ritual or costume props, flags, roads, vehicles, stars arranged as symbols, logos, text, watermark, book-cover frame, or UI frame.
```

### Final prompt — Birch connector

```text
Use case: photorealistic-natural
Asset type: transparent botanical cutout PNG for the connector of a functional seven-day autumn travel timeline.
Primary request: one SINGLE very slender, gently irregular horizontal white-birch branch. Its ivory papery bark and short natural charcoal-black lenticel markings make it unmistakably white birch, with only a few tiny bare side twigs.
Composition/framing: landscape 3:1, target 1536 x 512 pixels. The entire branch is within the frame. It runs left to right almost the full width around the vertical center, fine and delicate enough to support an elegant timeline. Retain comfortable transparent margins above and below. One continuous branch, not a chunky log.
Style/medium: high-quality photorealistic natural botanical cutout with subtle dimensional detail, realistic papery bark texture and restrained natural irregularity.
Color palette: ivory, charcoal, and a little bark brown only.
Background: genuinely transparent RGBA alpha, with no scene or background whatsoever. Preserve delicate twig edges and transparent space around every part.
Constraints: exactly one standalone branch image. NO leaves, since separate existing gold leaf buttons will be placed in code. No shadows cast on a surface. No letters, words, UI, circles, ticks, numbers, symbols, roots, full tree, background, checkerboard, frame, watermark, logos, or added objects.
```

## Final leaf generation prompt

Use case: photorealistic-natural
Asset type: transparent botanical PNG cutout for subtle CSS falling-leaf animation and edge ornaments on a pure white autumn roadtrip map website.
Scene/backdrop: genuinely transparent background with a preserved alpha channel. No backdrop of any color or pattern.
Primary request: exactly ONE beautiful small golden birch leaf, an isolated natural botanical specimen.
Subject: a single triangular-to-ovate birch leaf with a pointed tip and finely serrated edges, lightly curled in three dimensions, with delicate translucent branching veins and a complete slender stem. Clearly a birch leaf, not a maple leaf.
Style/medium: photorealistic macro editorial botanical photography, natural organic detail.
Composition/framing: square 1024 by 1024 image; complete leaf and stem centered, fully visible, with ample transparent margin on every side. Clear silhouette suitable for repeated rotation and scaling.
Lighting/mood: gentle natural autumn daylight passing through fine veins; warm, quiet, elegant.
Color palette: luminous golden yellow, warm ochre, and subtle golden amber along curled edges.
Constraints: one leaf only, preserve true transparency, clean antialiased edges, no ground, no shadow plane, no drop shadow, no surrounding branches, no additional objects, no background, no checkerboard, no text, no watermark, no logos.
