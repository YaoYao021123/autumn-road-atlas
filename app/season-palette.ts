// An editorial regional palette, not a measurement or a 2026 leaf-colour forecast.
export const seasonPalette: Record<number,{label:string;hue:number;saturation:number;brightness:number;ink:string}>={
  1:{label:'平原麦黄',hue:8,saturation:1.03,brightness:1.04,ink:'#927327'},
  2:{label:'林草浅金',hue:3,saturation:1.12,brightness:1.02,ink:'#9b7521'},
  3:{label:'河谷金黄',hue:-2,saturation:1.23,brightness:1,ink:'#a5721c'},
  4:{label:'林草暖金',hue:-12,saturation:1.28,brightness:.99,ink:'#a86723'},
  5:{label:'秋林琥珀',hue:-23,saturation:1.32,brightness:.95,ink:'#a25026'},
  6:{label:'山地赭金渐回平原',hue:-7,saturation:1.16,brightness:1.02,ink:'#a37725'},
  7:{label:'城中浅金',hue:6,saturation:1.08,brightness:1.04,ink:'#9a7a2c'},
};
export function leafVariables(day:number){
  const tone=seasonPalette[day];
  return {'--leaf-hue':`${tone.hue}deg`,'--leaf-saturation':tone.saturation,'--leaf-brightness':tone.brightness,'--leaf-ink':tone.ink};
}
