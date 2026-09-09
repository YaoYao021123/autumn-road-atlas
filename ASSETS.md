# Asset provenance

## Cultural reading landscape — 2026-09-09

The former three-tab book gallery is now an unboxed editorial sequence. Work metadata, geography boundaries and evidence URLs live in `app/cultural-works.json`. Only the existing short novel excerpt is quoted; connective prose is original. The original three generated scene files remain intact, but only the river and forest appear in the new composition. CSS masks are presentation effects, not new photographs or edits to the source assets.

- 《额尔古纳河右岸》: regional literary context, not a claim that all events occurred in today's Erguna city. The reindeer motif is not a wildlife-location promise.
- 老舍《草原》: Chen Barag Banner visit, not the New Barag Left/Right Banners. The 1961 text's green landscape is not a 2026 autumn forecast.
- 王伟《中国最后的驯鹿部落》: photography introduced through [Tsinghua Academy's original-image and collection record](https://www.ad.tsinghua.edu.cn/info/1219/27094.htm). No photographs copied or embedded. Genhe/Aoluguya is explicitly outside this route; the adjacent AI forest is clearly not Wang Wei's work.
- 《大象席地而坐》: public film still from [Arsenal / Berlinale Forum 2018](https://www.arsenal-berlin.de/en/berlinale-forum/archive/program-archive/2018/forum-program/main-program/an-elephant-sitting-still-1/), remote source `https://www.arsenal-berlin.de/assets/_processed_/1/9/csm_201813696_23860_a916b77a27.jpg`, 1074 × 670. Asset researcher confirmed actual loading and inspected this image. No individual still-photographer credit or open redistribution licence supplied; do not describe it as CC or republish publicly without a rights review. The image is not a Manzhouli photograph: Manzhouli is the narrative destination; filming was in Hebei Jingxing.
- [Criterion's official 2m30s trailer](https://www.criterionchannel.com/videos/an-elephant-sitting-still-trailer) is linked, not downloaded or autoplayed. Access depends on platform and location.
- 《人世间》: Changchun as an actual filming city, with the provincial culture department's location list. The image reused here is the existing Xinhua 2023-10-24 Xinmin Square city photograph by Yan Linyun, explicitly not a production still or a claim that this exact frame is a filming site. CCTV's location-report page is linked, not downloaded.

Research alternatives deliberately not added to the route: 《黑骏马》/Ujimqin, 《狼图腾》/Ulagai, and unverified exact film-viewpoint pins. Wure'ertu's photographs in China National Geography were considered but not embedded: the publisher restricts reuse and its image returned a Referer ACL error. No anti-hotlink bypass was attempted.

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

## 2026-09-10 — editorial typography and quiet forest background

- Display type: [Ma Shan Zheng, official Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/mashanzheng), SIL OFL 1.1. The self-hosted subset is `public/fonts/autumn-brush.woff2` (36,976 bytes); license in `public/fonts/OFL-MaShanZheng.txt`; actual headline characters in `app/title-glyphs.txt`. System sans remains for body/control copy. This is not the original lettering from 《漫长的季节》. Its official [2023-04-14 poster](https://www.sina.cn/news/detail/4890388751454219.html) informed the pen rhythm and title hierarchy, not a copied wordmark.
- River/forest/embers and leaf/branch PNG originals remain unchanged. The page now consumes WebP versions. The two displayed literary artworks plus the leaf and branch total 467,496 bytes instead of 6,258,374 bytes (92.5% smaller); this is an asset-byte comparison, not a measured page-speed/LCP improvement.
- New original forest plate: `public/forest-drive.webp` (1440×960, 325,574 bytes); mobile `public/forest-drive-960.webp` (960×640, 165,600 bytes). Built-in image_gen, one generation; fictional northern autumn, not an Arxan documentary photo. Prompt below. Both exports only resize/encode the generated plate.
- A separate generic white SUV was generated for an explored animation. Following user feedback, **the final page is static**: no car layer, player, timeline, animation loop or motion observer. `public/forest-car.webp` is retained but is not requested by the page. Map route playback is separate and unchanged.
- The close-up 《大象席地而坐》 still is no longer embedded; [Arsenal's original film page](https://www.arsenal-berlin.de/en/berlinale-forum/archive/program-archive/2018/forum-program/main-program/an-elephant-sitting-still-1/) remains an explicit source link. No third-party video was downloaded or rehosted.

### Final prompt — forest-road background (built-in image_gen)

```text
Use case: photorealistic-natural
Asset type: original raster background plate for a lightweight autumn road-trip animation; fictional northern forest atmosphere, not documentary or exact geographic reconstruction.
Primary request: a genuinely photorealistic STRICTLY VERTICAL NADIR aerial photograph, camera pointing exactly straight down at 90 degrees, of a golden autumn birch-and-larch forest with one narrow two-lane gray asphalt road.
Scene/backdrop: a dense, varied canopy of golden white birch and yellow larch trees, small touches of subdued evergreen green, believable natural leaf and branch texture, rich but restrained ochre and honey autumn colors.
Subject: one continuous narrow gray two-way paved road travels from the BOTTOM edge at approximately x=50% to the TOP edge at approximately x=50%. The road has a gentle, shallow S curve: around x=50% at bottom, x=45% near lower third, x=56% near upper third, and x=50% at top. Both edges are crisp enough that an animated vehicle can trace the road smoothly. Road width is approximately 5% to 7% of image width. Subtle center dashed white line and understated road edges, realistic rural asphalt.
Composition/framing: wide landscape 3:2 aspect ratio, target 1536 x 1024 pixels. Strict orthographic-looking overhead drone view; all road width stays consistent without vanishing point or horizon. Forest fills all remaining area edge to edge. Natural irregular tree crowns may approach the shoulder, but keep the entire road's travel corridor visible and unobstructed. Single image, not a collage.
Lighting/mood: clear soft autumn daylight from upper left, realistic subtle shadows from tree crowns, quiet photographic atmosphere.
Color palette: gold, ochre, honey, bark brown, restrained forest green and neutral gray; no neon, no technology blue, no purple.
Constraints: NO vehicles of any kind, no cars, no people, no buildings, no animals, no junctions, no forks, no guardrail billboards, no written words, no logos, no watermark, no UI, no borders. No oblique angle, no horizon, no mountains in perspective, no tilt-shift miniature look. This is an empty road background, with the vehicle to be added later as a separate animated layer.
```

### Final prompt — unused SUV layer (built-in image_gen)

```text
Use case: product-mockup
Asset type: one photorealistic transparent vehicle sprite for compositing over an overhead aerial road photograph.
Primary request: exactly ONE white large modern SUV viewed from STRICTLY VERTICAL DIRECTLY OVERHEAD, camera pointing straight down at 90 degrees. The FRONT of the car points straight UP toward the top edge of the image.
Subject: a long, substantial, clean white large SUV with realistic proportions, black panoramic glass roof, dark windshield near the front, dark rear window at the rear, understated silver trim and two side mirrors. Generic design with NO branding; it need not match any particular make or model.
Composition/framing: a tall narrow portrait canvas, approximately 1:2 width-to-height ratio, target 768 x 1536 pixels. One centered complete vehicle aligned to the exact vertical axis. Keep the crop compact: the car fills roughly 85% of the canvas height and 80% of its width including mirrors, while retaining all bumpers and mirrors fully in frame. No other object.
Style/medium: photorealistic automotive material rendering, crisp white painted metal, believable black glass reflections, clean anti-aliased silhouette; dimensional enough to look real but strictly top-down. No oblique perspective, no visible front grille elevation or side panels.
Lighting: subtle soft outdoor daylight from upper left, neutral restrained reflections matching an autumn aerial scene.
Background: GENUINELY TRANSPARENT RGBA alpha. No background at all. Preserve clean alpha around the body and fine mirrors; all space surrounding the SUV must be transparent. No floor plane, no road, no landscape, no studio backdrop, no solid-color background, no painted checkerboard.
Constraints: exactly one standalone car; front points UP, rear points DOWN; no people, no text, no logos, no readable number plates, no watermark, no UI, no border, no multiple angles, no multiple vehicles, no decorative elements. Do not bake a cast shadow into an opaque surrounding rectangle.
```

## 2026-09-10 — lighter delivery and a landscape film still

- `public/elephant-night-v1.webp`: 1440×961, 39,056 bytes. [Rediance official film page](https://www.rediancefilms.com/film.php-30.html?id=18), [source still](https://www.rediancefilms.com/asset/image/a/film_18_5.jpg), originally 7360×4912 / 701,204 bytes. Visually inspected: night mountain silhouette, distant passengers in headlights and coach on the right. Used as one low-resolution attributed illustration in film discussion; not openly licensed and no unrestricted reuse permission asserted. Also listed for press download by [Zeta Filmes](https://www.zetafilmes.com.br/filme.php?id=74). This is a film frame, **not Manzhouli scenery**. Encoding: `cwebp -q 80 -resize 1440 0`. No video downloaded or embedded.
- `public/day04-grassland-v1.webp`: 840 px wide, 42,922 bytes, resized and WebP-re-encoded from mayanming's Wikimedia Commons photograph (source URL remains in `app/day-scenes.json`). Original 2,426,541 bytes. Derived image remains [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/), author credit retained. The 2012 August **summer** date remains visible; no recoloring or 2026 autumn claim.
- `app/regional-water.generated.json`: 5,992 bytes, 10 river/lake features derived from Natural Earth 1:50m, [public domain](https://www.naturalearthdata.com/about/terms-of-use/). Official source: [Natural Earth vector repository](https://github.com/nvkelso/natural-earth-vector/tree/master/geojson), `ne_50m_rivers_lake_centerlines.geojson` (Git blob `6f9d88ea3498448c7f29f458ce42a771a36bd6be`) and `ne_50m_lakes.geojson` (`5ddced58279ea13ae5023929f135bb7ecfd12d95`). Generator `scripts/prepare-regional-water.mjs` keeps regional physical features, drops outside river vertices and rounds to four decimals. Deliberately no political boundaries, invented roads or tile imagery. Only approximate geographic context; route coordinates themselves stay full precision.
- Detailed OpenStreetMap tiles are optional, requested directly by the browser only after selection, with visible attribution and ordinary HTTP caching. Follow the [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/); no bulk downloading, prefetch or map proxy.

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
