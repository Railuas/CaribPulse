'use client'
import React from 'react'
type Props = { values: number[]; width?: number; height?: number; strokeWidth?: number; ariaLabel?: string }
export default function Spark({ values, width=280, height=60, strokeWidth=2, ariaLabel='mini chart' }: Props){
  if(!values?.length) return <div className="text-xs" style={{color:'#a3a3a3'}}>—</div>
  const min = Math.min(...values), max = Math.max(...values)
  const norm = (v:number) => max===min ? height/2 : height - ((v - min) / (max - min)) * height
  const step = width / (values.length - 1)
  const pts = values.map((v,i)=>`${i*step},${norm(v)}`).join(' ')
  return (<svg width={width} height={height} role="img" aria-label={ariaLabel} className="block"><polyline points={pts} fill="none" stroke="currentColor" strokeWidth={strokeWidth} /></svg>)
}
