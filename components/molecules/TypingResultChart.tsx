"use client";

import { useMemo } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { MetricSnapshot } from "@/hooks/useLiveTypingMetrics";

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

type Props = {
  snapshots: MetricSnapshot[];
};

export function TypingResultChart({ snapshots }: Props) {
  const option = useMemo(() => {
    const seconds = snapshots.map((s) => `${s.second}s`);
    const wpmData = snapshots.map((s) => s.wpm);
    const accData = snapshots.map((s) => s.acc);

    return {
      tooltip: {
        trigger: "axis" as const,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderColor: "#e5e5e5",
        borderWidth: 1,
        textStyle: { color: "#404040", fontSize: 12 },
        formatter(params: Array<{ seriesName: string; value: number; marker: string }>) {
          const lines = params.map(
            (p) => `${p.marker} ${p.seriesName}: <b>${p.value}${p.seriesName === "ACC" ? "%" : ""}</b>`
          );
          return lines.join("<br/>");
        },
      },
      legend: {
        data: ["WPM", "ACC"],
        bottom: 0,
        textStyle: { color: "#737373", fontSize: 11 },
        itemWidth: 16,
        itemHeight: 8,
      },
      grid: {
        left: 40,
        right: 40,
        top: 16,
        bottom: 32,
        containLabel: false,
      },
      xAxis: {
        type: "category" as const,
        data: seconds,
        axisLine: { lineStyle: { color: "#d4d4d4" } },
        axisLabel: { color: "#a3a3a3", fontSize: 10 },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: "value" as const,
          name: "WPM",
          nameTextStyle: { color: "#a3a3a3", fontSize: 10 },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: "#a3a3a3", fontSize: 10 },
          splitLine: { lineStyle: { color: "#f0f0f0" } },
        },
        {
          type: "value" as const,
          name: "ACC",
          min: 0,
          max: 100,
          nameTextStyle: { color: "#a3a3a3", fontSize: 10 },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: "#a3a3a3", fontSize: 10, formatter: "{value}%" },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: "WPM",
          type: "line" as const,
          smooth: true,
          symbol: "circle",
          symbolSize: 4,
          lineStyle: { width: 1.5, color: "#fb4058" },
          itemStyle: { color: "#fb4058" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(251,64,88,0.15)" },
              { offset: 1, color: "rgba(251,64,88,0)" },
            ]),
          },
          data: wpmData,
          yAxisIndex: 0,
        },
        {
          name: "ACC",
          type: "line" as const,
          smooth: true,
          symbol: "circle",
          symbolSize: 4,
          lineStyle: { width: 1.5, color: "#64748b", type: "dashed" as const },
          itemStyle: { color: "#64748b" },
          data: accData,
          yAxisIndex: 1,
        },
      ],
    };
  }, [snapshots]);

  if (snapshots.length < 2) return null;

  return (
    <div className="w-full">
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        style={{ height: 140, width: "100%" }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
