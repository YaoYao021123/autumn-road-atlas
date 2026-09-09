import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '北纬秋行 · 大兴安岭动态路线',
  description: '9月27日至10月3日，自长春出发的追秋自驾。查看逐日道路轨迹、模拟行车与百度地图分段导航。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head><link rel="preload" href="/fonts/autumn-brush.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head>
      <body>
        {children}
      </body>
    </html>
  );
}
