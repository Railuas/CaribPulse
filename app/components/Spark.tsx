import React from "react";

export default function Spark({ data, width=120, height=40, strokeWidth=2 }:{data:number[]; width?:number; height?:number; strokeWidth?:number}){
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * (width - 8) + 4;
    const y = height - 6 - ((v - min) / range) * (height - 12);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="spark">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}
