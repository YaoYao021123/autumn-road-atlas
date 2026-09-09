// Encoded-polyline delta representation at precision 6. The source is already
// rounded to six decimals, so this preserves every stored coordinate exactly.
export function encodeRoute(points:[number,number][]):string {
  let lat=0,lng=0,result='';
  const encode=(delta:number)=>{
    let value=delta<0?~(delta<<1):delta<<1;
    while(value>=32){result+=String.fromCharCode((32|(value&31))+63);value>>>=5;}
    result+=String.fromCharCode(value+63);
  };
  for(const point of points){const a=Math.round(point[0]*1e6),b=Math.round(point[1]*1e6);encode(a-lat);encode(b-lng);lat=a;lng=b;}
  return result;
}
export function decodeRoute(encoded:string):[number,number][] {
  const points:[number,number][]=[];let index=0,lat=0,lng=0;
  const value=()=>{
    let result=0,shift=0,byte:number;
    do{
      if(index>=encoded.length||shift>30)throw new Error('Invalid route encoding');
      byte=encoded.charCodeAt(index++)-63;
      if(byte<0||byte>63)throw new Error('Invalid route character');
      result|=(byte&31)<<shift;shift+=5;
    }while(byte>=32);
    return result&1?~(result>>>1):result>>>1;
  };
  while(index<encoded.length){lat+=value();lng+=value();points.push([lat/1e6,lng/1e6]);}
  return points;
}
