"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { ReportSummary, ReportDetail } from "@/types/report";

type Props = {
  reports: ReportSummary[];
};

type TrendData = {
  reportId: number;
  commit: string;
  commitShort: string;
  date: string;
  p95: number;
  p99: number;
  avg: number;
  rps: number;
};

export function PerformanceTrendChart({ reports }: Props) {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendData() {
      try {
        setLoading(true);
        // 리포트 ID 15번 이상인 리포트들 필터링
        const filteredReports = reports.filter((r) => r.report_id >= 15);
        
        // 각 리포트의 상세 정보를 가져와서 /text/all API 성능 추출
        const dataPromises = filteredReports.map(async (report) => {
          try {
            const res = await fetch(`/api/admin/reports/${report.report_id}`, {
              method: "GET",
              cache: "no-store",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`Failed to fetch report ${report.report_id}: ${res.status} - ${errorText}`);
            }

            const json = await res.json();
            if (!json.success) {
              throw new Error(json.message || "Failed to fetch report detail");
            }

            const detail: ReportDetail = json.data;
            
            // /text/main/[limit] API 찾기
            const textMainApi = detail.performance_results.find(
              (p) => p.endpoint.includes("/text/main")
            );
            
            if (textMainApi) {
              return {
                reportId: report.report_id,
                commit: report.git_commit,
                commitShort: report.git_commit?.substring(0, 7) || "N/A",
                date: report.test_time,
                p95: textMainApi.latency.p95,
                p99: textMainApi.latency.p99,
                avg: textMainApi.latency.avg,
                rps: textMainApi.stats.rps,
              };
            }
            return null;
          } catch (e) {
            console.error(`Failed to fetch report ${report.report_id}:`, e);
            return null;
          }
        });

        const results = await Promise.all(dataPromises);
        const validData = results.filter((d): d is TrendData => d !== null);
        
        // 리포트 ID 순으로 정렬
        validData.sort((a, b) => a.reportId - b.reportId);
        
        setTrendData(validData);
      } catch (e: any) {
        setError(e.message || "데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchTrendData();
  }, [reports]);

  if (loading) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg">
        <div className="text-sm text-neutral-400">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg">
        <div className="text-sm text-red-400">❌ {error}</div>
      </div>
    );
  }

  if (trendData.length === 0) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg">
        <div className="text-sm text-neutral-400">표시할 데이터가 없습니다.</div>
      </div>
    );
  }

  // 커밋별 색상 매핑 (같은 커밋은 같은 색상)
  const commitColors: Record<string, string> = {};
  const uniqueCommits = Array.from(new Set(trendData.map(d => d.commit))).filter(Boolean);
  
  // 커밋별로 그룹화하고 각 커밋의 가장 최신 리포트 시간 기준으로 정렬
  const commitsWithLatestTime = uniqueCommits.map(commit => {
    const commitData = trendData.filter(d => d.commit === commit);
    const latestTime = commitData.reduce((latest, current) => 
      current.date > latest ? current.date : latest, commitData[0].date
    );
    return { commit, latestTime };
  });
  
  // 최신순으로 정렬하고 최신 5개만 선택
  const latest5Commits = commitsWithLatestTime
    .sort((a, b) => b.latestTime.localeCompare(a.latestTime))
    .slice(0, 5)
    .map(item => item.commit);
  
  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
  ];
  uniqueCommits.forEach((commit, idx) => {
    commitColors[commit] = colors[idx % colors.length];
  });

  // 각 커밋별로 최신 리포트 8개씩 선택 (총 40개 데이터)
  const selectedData: TrendData[] = [];
  latest5Commits.forEach(commit => {
    const commitData = trendData
      .filter(d => d.commit === commit)
      .sort((a, b) => b.date.localeCompare(a.date)) // 최신순 정렬
      .slice(0, 8); // 최신 8개만 선택
    selectedData.push(...commitData);
  });
  
  // 리포트 ID 순으로 정렬 (그래프에서 시간순으로 보이도록)
  selectedData.sort((a, b) => a.reportId - b.reportId);
  
  // 각 리포트별 데이터 준비 (최신 커밋 5개 × 각 8개 기록 = 총 40개)
  const chartData = selectedData.map((data) => ({
    reportId: data.reportId,
    reportLabel: `#${data.reportId}`,
    commit: data.commitShort,
    fullCommit: data.commit,
    p95: Math.round(data.p95),
    p99: Math.round(data.p99),
    avg: Math.round(data.avg),
    rps: Math.round(data.rps * 10) / 10,
    date: data.date,
  }));


  // 커밋별 범례 데이터 (최신 5개만 표시)
  const commitLegend = latest5Commits.map(commit => ({
    commit: commit.substring(0, 7),
    color: commitColors[commit],
    count: trendData.filter(d => d.commit === commit).length,
  }));

  return (
    <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-neutral-200 mb-3">
        API 성능 추이 (메인 페이지 로드 API)
      </h3>
      
      {/* P99, 평균 범례 */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-neutral-300">P99 (최악의 케이스) (ms)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-neutral-300">평균 (ms)</span>
        </div>
      </div>

      {/* 커밋별 범례 */}
      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        {commitLegend.map((item) => (
          <div key={item.commit} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-neutral-300 font-mono">{item.commit}</span>
            <span className="text-neutral-500">({item.count}개)</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="reportLabel"
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            tickFormatter={(value) => value} // 리포트 ID만 표시
          />
          <YAxis 
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            domain={[0, 1000]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "4px",
            }}
            formatter={(value: any, name?: string) => {
              if (name === "avg" || name === "p99") {
                return `${value}ms`;
              }
              return value;
            }}
            labelFormatter={(label) => `리포트 ${label}`}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as typeof chartData[0];
                return (
                  <div className="bg-neutral-800 border border-neutral-700 p-3 rounded">
                    <p className="text-xs text-neutral-300 mb-1">리포트 {label}</p>
                    <p className="text-xs text-neutral-400 mb-2">
                      커밋: <span className="font-mono">{data.commit}</span>
                    </p>
                    {payload.map((entry, idx) => (
                      <p key={idx} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}ms
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#3b82f6"
            strokeWidth={2}
            name="평균 (ms)"
            dot={(props: any) => {
              const data = props.payload as typeof chartData[0];
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={5}
                  fill={commitColors[data.fullCommit] || "#3b82f6"}
                  stroke="#fff"
                  strokeWidth={1}
                />
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="p99"
            stroke="#ef4444"
            strokeWidth={2}
            name="P99 (최악의 케이스) (ms)"
            dot={(props: any) => {
              const data = props.payload as typeof chartData[0];
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={5}
                  fill={commitColors[data.fullCommit] || "#ef4444"}
                  stroke="#fff"
                  strokeWidth={1}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* X축 아래 커밋 정보 표시 (각 커밋별 최신 1개만, 그래프 순서에 맞춰) */}
      <div className="mt-2 flex justify-around gap-1 text-xs">
        {latest5Commits
          .map((commit) => {
            // 각 커밋별로 가장 최신 리포트 찾기
            const commitData = chartData
              .filter(d => d.fullCommit === commit)
              .sort((a, b) => b.reportId - a.reportId)[0]; // 최신 리포트 1개만
            
            if (!commitData) return null;
            
            return { commit, commitData };
          })
          .filter((item): item is { commit: string; commitData: typeof chartData[0] } => item !== null)
          .sort((a, b) => a.commitData.reportId - b.commitData.reportId) // 리포트 ID 순으로 정렬
          .map(({ commit, commitData }) => {
            const commitUrl = commitData.fullCommit && commitData.fullCommit !== 'unknown'
              ? `https://github.com/Typing-something/Flask_Api_Server/commit/${commitData.fullCommit}`
              : null;
            
            return (
              <div key={commit} className="flex flex-col items-center gap-0.5 min-w-[60px]">
                <div 
                  className="w-2 h-2 rounded cursor-pointer hover:opacity-80 transition-opacity" 
                  style={{ backgroundColor: commitColors[commit] || "#3b82f6" }}
                  title={commitData.commit}
                ></div>
                {commitUrl ? (
                  <a
                    href={commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-blue-400 hover:underline font-mono text-[10px] transition-colors"
                  >
                    {commitData.commit}
                  </a>
                ) : (
                  <span className="text-neutral-400 font-mono text-[10px]">{commitData.commit}</span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

