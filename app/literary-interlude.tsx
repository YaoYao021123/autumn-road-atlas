'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import content from './literary-scenes.json';
import './literary.css';

type Props = { motionEnabled: boolean; onRouteSelect: (day: number) => void };

export function LiteraryInterlude({ motionEnabled, onRouteSelect }: Props) {
  const [sceneId, setSceneId] = useState('river');
  const [seen, setSeen] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = section.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <section ref={section} id="right-bank" className="literary-interlude" aria-labelledby="literary-heading" data-motion={motionEnabled} data-seen={seen}>
    <header className="literary-header">
      <div>
        <span className="literary-eyebrow"><BookOpen size={16} strokeWidth={1.3}/>路上的一本书</span>
        <h2 id="literary-heading">额尔古纳河<span>右岸</span></h2>
      </div>
      <p>让地图告诉我们去哪里，<br/>让一本书，改变观看的方式。</p>
    </header>

    <Tabs value={sceneId} onValueChange={value => setSceneId(String(value))} className="literary-tabs">
      <TabsList className="literary-selector" aria-label="切换文学氛围图">
        {content.scenes.map(scene => <TabsTrigger key={scene.id} value={scene.id} className="literary-tab">
          <span className="literary-tab-number">{scene.number}</span>
          <span>{scene.title}<small>{scene.mood}</small></span>
          <MoveUpRight size={16} aria-hidden="true"/>
        </TabsTrigger>)}
      </TabsList>

      {content.scenes.map(scene => <TabsContent key={scene.id} value={scene.id} className="literary-panel">
        <div className="literary-spread" data-scene={scene.id}>
          <div className="literary-text">
            <span className="literary-folio">山林来信 <i>/</i> {scene.number}</span>
            <figure className="literary-quotation">
              <blockquote cite={content.quoteSource}>{content.quote}</blockquote>
              <figcaption>迟子建《额尔古纳河右岸》<a href={content.quoteSource} target="_blank" rel="noopener noreferrer" aria-label="查看中国作家网中的原文出处">原文出处<ArrowUpRight size={12}/></a></figcaption>
            </figure>
            <div className="literary-original">
              <span>原创旁白</span>
              <p>{scene.lines.map(line => <span key={line}>{line}</span>)}</p>
            </div>
            <Button variant="ghost" className="literary-route-link" onClick={() => onRouteSelect(scene.routeDay)}>{scene.routeLabel}<ArrowUpRight size={16}/></Button>
          </div>
          <figure className="literary-artwork">
            <div className="literary-image-wrap">
              {failedImages.includes(scene.id)
                ? <div className="literary-image-error"><BookOpen size={24}/><p>画面暂未载入，文字仍可阅读。</p></div>
                : <img src={scene.image} alt={scene.alt} width={1536} height={1024} loading="lazy" decoding="async" onError={() => setFailedImages(ids => ids.includes(scene.id) ? ids : [...ids, scene.id])}/>}
            </div>
            <figcaption><span>{scene.motif}</span><span>AI 氛围创作 · 非沿途实景</span></figcaption>
          </figure>
        </div>
      </TabsContent>)}
    </Tabs>

    <div className="literary-colophon">
      <p>画面受小说自然意象启发，不是情节复刻；书中生活地域不等同于本次路线。驯鹿与火塘是文学意象，不表示途中可观鹿或可野外生火。</p>
      <a href={content.motifSource} target="_blank" rel="noopener noreferrer">关于书中的山林<ArrowUpRight size={13}/></a>
    </div>
  </section>;
}
