import definitions from './road-scenes.json';
import { navigationUrl, segments, type Day, type Position } from './trip';

export type SceneDefinition = {
  id: string;
  day: number;
  title: string;
  road: string;
  kind: 'window' | 'parking' | 'transfer';
  description: string;
  timing: string;
  caution: string;
  sources: { label: string; url: string }[];
  provenance: string;
  legIds: string[];
  bd09: [number, number];
  position: Position;
};

export type RoadScene = SceneDefinition & {
  position: Position;
  highlight: Position[];
  legId: string;
  navigationHref?: string;
};

export const sceneKindLabels: Record<SceneDefinition['kind'], string> = {
  window: '车窗观景 · 路段示意',
  parking: '正规停车 · 可选短停',
  transfer: '停车换乘',
};

const scenes = definitions as SceneDefinition[];
const radians = Math.PI / 180;

function distanceKm(a: Position, b: Position): number {
  const lat = (b[0] - a[0]) * radians;
  const lng = (b[1] - a[1]) * radians;
  const h = Math.sin(lat / 2) ** 2
    + Math.cos(a[0] * radians) * Math.cos(b[0] * radians) * Math.sin(lng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}

// A short portion of the selected route illustrates the corridor, not a scenic
// area's exact boundary. Never infer stopping access from this line or marker.
function corridorHighlight(points: Position[], index: number): Position[] {
  let start = index;
  let end = index;
  let before = 0;
  let after = 0;
  while (start > 0) {
    const next = distanceKm(points[start], points[start - 1]);
    if (before + next > 5) break;
    before += next;
    start -= 1;
  }
  while (end < points.length - 1) {
    const next = distanceKm(points[end], points[end + 1]);
    if (after + next > 5) break;
    after += next;
    end += 1;
  }
  return end > start ? points.slice(start, end + 1) : [];
}

export function getRoadScenes(days: Day[]): RoadScene[] {
  return scenes.flatMap((scene): RoadScene[] => {
    const day = days.find((candidate) => candidate.id === scene.day);
    const legId = day?.legs.find((id) => scene.legIds.includes(id));
    if (!legId) return [];
    const leg = segments[legId];
    if (!leg) return [];

    if (scene.kind !== 'window') {
      return [{
        ...scene,
        bd09: leg.destination.bd09,
        position: leg.destination.position,
        highlight: [],
        legId,
        navigationHref: navigationUrl(leg),
      }];
    }

    let nearest = -1;
    let distance = Infinity;
    leg.points.forEach((point, index) => {
      const current = distanceKm(scene.position, point);
      if (current < distance) {
        nearest = index;
        distance = current;
      }
    });
    // A stale definition must not create a plausible-looking point on a
    // different road. The data check reports a missing expected scene.
    if (nearest < 0 || distance > 5) return [];
    return [{
      ...scene,
      position: leg.points[nearest],
      highlight: corridorHighlight(leg.points, nearest),
      legId,
    }];
  });
}
