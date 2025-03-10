"use client"

import type React from "react"
import { LineChart as TremorLineChart, BarChart as TremorBarChart, DonutChart as TremorDonutChart } from "@tremor/react"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />
}

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

interface PieChartProps {
  data: any[]
  index: string
  category: string
  colors: string[]
  valueFormatter?: (value: number) => string
}

export function LineChart({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
}: ChartProps) {
  return (
    <TremorLineChart
      data={data}
      index={index}
      categories={categories}
      colors={colors}
      valueFormatter={valueFormatter}
      yAxisWidth={yAxisWidth}
      showLegend={true}
      showGridLines={false}
      showAnimation={true}
      className="h-full"
    />
  )
}

export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
}: ChartProps) {
  return (
    <TremorBarChart
      data={data}
      index={index}
      categories={categories}
      colors={colors}
      valueFormatter={valueFormatter}
      yAxisWidth={yAxisWidth}
      showLegend={true}
      showGridLines={false}
      showAnimation={true}
      className="h-full"
    />
  )
}

export function PieChart({ data, index, category, colors, valueFormatter = (value) => `${value}` }: PieChartProps) {
  return (
    <TremorDonutChart
      data={data}
      index={index}
      category={category}
      colors={colors}
      valueFormatter={valueFormatter}
      showLabel={true}
      showAnimation={true}
      className="h-full"
    />
  )
}

