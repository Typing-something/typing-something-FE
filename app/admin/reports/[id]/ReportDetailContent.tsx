"use client";

import { useState } from "react";
import type { ReportDetail } from "@/types/report";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type Props = {
  report: ReportDetail;
};

type ApiViewTab = "latency" | "rps" | "table";

export function ReportDetailContent({ report }: Props) {
  const [apiViewTab, setApiViewTab] = useState<ApiViewTab>("table");
  const userCount = 30; // 고정값
  const totalRequests = report.performance_results.reduce(
    (sum, p) => sum + p.stats.total_requests,
    0
  );
  const totalRPS = report.performance_results.reduce(
    (sum, p) => sum + p.stats.rps,
    0
  );

  // 그래프용 데이터 준비
  const latencyData = report.performance_results.map((p) => ({
    name: `${p.method} ${p.endpoint.substring(0, 20)}${p.endpoint.length > 20 ? "..." : ""}`,
    avg: p.latency.avg,
    p95: p.latency.p95,
    p99: p.latency.p99,
    max: p.latency.max,
  }));

  const rpsData = report.performance_results.map((p) => ({
    name: `${p.method} ${p.endpoint.substring(0, 20)}${p.endpoint.length > 20 ? "..." : ""}`,
    rps: p.stats.rps,
    total: p.stats.total_requests,
  }));

  return (
    <div className="space-y-6">
      {/* API 성능 지표 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-neutral-100">
            API 성능 지표 ({report.performance_results.length}개)
          </h2>
          
          {/* 탭 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setApiViewTab("latency")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                apiViewTab === "latency"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
              }`}
            >
              지연시간
            </button>
            <button
              onClick={() => setApiViewTab("rps")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                apiViewTab === "rps"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
              }`}
            >
              RPS
            </button>
            <button
              onClick={() => setApiViewTab("table")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                apiViewTab === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
              }`}
            >
              목록
            </button>
          </div>
        </div>

        {/* 부하 환경 정보 */}
        <div className="mb-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
          <h3 className="text-sm font-semibold text-neutral-200 mb-3">
            부하 환경
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-neutral-400 mb-1">동시 사용자</div>
              <div className="text-lg font-bold text-blue-400">
                {userCount}명
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-400 mb-1">총 요청 수</div>
              <div className="text-lg font-bold text-green-400">
                {totalRequests.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-400 mb-1">전체 RPS</div>
              <div className="text-lg font-bold text-orange-400">
                {totalRPS.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* 탭별 콘텐츠 */}
        {apiViewTab === "latency" && (
          <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-200">
                지연 시간 (ms)
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#3b82f6]"></div>
                  <span className="text-neutral-300">평균</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#f59e0b]"></div>
                  <span className="text-neutral-300">P95</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#ef4444]"></div>
                  <span className="text-neutral-300">P99</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#8b5cf6]"></div>
                  <span className="text-neutral-300">최대</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: "#e5e7eb", fontSize: 10 }}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "4px",
                  }}
                />
                <Bar dataKey="avg" fill="#3b82f6" name="평균" />
                <Bar dataKey="p95" fill="#f59e0b" name="P95" />
                <Bar dataKey="p99" fill="#ef4444" name="P99" />
                <Bar dataKey="max" fill="#8b5cf6" name="최대" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {apiViewTab === "rps" && (
          <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-200">
                요청 처리량 (RPS)
              </h3>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 bg-[#10b981]"></div>
                <span className="text-neutral-300">RPS</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rpsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: "#e5e7eb", fontSize: 10 }}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "4px",
                  }}
                />
                <Bar dataKey="rps" fill="#10b981" name="RPS" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {apiViewTab === "table" && (
          <div className="bg-neutral-800 border border-neutral-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-700">
                <thead className="bg-neutral-700">
                  <tr>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      Endpoint
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      평균
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      P95
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      P99
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      최대
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      RPS
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      총 요청
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      실패
                    </th>
                    <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                      에러율
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-neutral-800 divide-y divide-neutral-700">
                  {report.performance_results.map((perf, idx) => (
                    <PerformanceTableRow key={idx} performance={perf} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 테스트 케이스 결과 */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-100 mb-3">
          Unit test ({report.pytest_results.length}개)
        </h2>
        <div className="bg-neutral-800 border border-neutral-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-700">
              <thead className="bg-neutral-700">
                <tr>
                  <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                    테스트 이름
                  </th>
                  <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                    메시지
                  </th>
                </tr>
              </thead>
              <tbody className="bg-neutral-800 divide-y divide-neutral-700">
                {report.pytest_results.map((test, idx) => (
                  <TestCaseTableRow key={idx} test={test} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

// 성능 테이블 행 컴포넌트
function PerformanceTableRow({
  performance,
}: {
  performance: {
    method: string;
    endpoint: string;
    latency: { avg: number; p95: number; p99: number; max: number };
    stats: {
      rps: number;
      total_requests: number;
      fail_count: number;
      error_rate: number;
    };
    is_satisfied: boolean;
  };
}) {
  const { method, endpoint, latency, stats, is_satisfied } = performance;
  const rowBgColor = is_satisfied
    ? "bg-green-900/10 border-l-4 border-green-500"
    : "bg-red-900/10 border-l-4 border-red-500";

  return (
    <tr className={rowBgColor}>
      <td className="px-3 py-2 whitespace-nowrap">
        <div
          className={[
            "inline-flex items-center justify-center w-5 h-5 text-[10px] font-semibold",
            is_satisfied
              ? "bg-green-900/30 text-green-400 border border-green-700/50"
              : "bg-red-900/30 text-red-400 border border-red-700/50",
          ].join(" ")}
        >
          {is_satisfied ? "✓" : "✗"}
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <span
          className={[
            "px-1.5 py-0.5 text-[10px] font-semibold",
            method === "GET"
              ? "bg-blue-900/30 text-blue-400"
              : method === "POST"
              ? "bg-green-900/30 text-green-400"
              : "bg-yellow-900/30 text-yellow-400",
          ].join(" ")}
        >
          {method}
        </span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-300 font-mono">
        {endpoint}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-300">
        {latency.avg.toFixed(0)}ms
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-orange-400 font-semibold">
        {latency.p95.toFixed(0)}ms
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-red-400 font-semibold">
        {latency.p99.toFixed(0)}ms
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-300">
        {latency.max.toFixed(0)}ms
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-300">
        {stats.rps.toFixed(1)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-300">
        {stats.total_requests.toLocaleString()}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-red-400">
        {stats.fail_count}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-red-400">
        {stats.error_rate.toFixed(2)}%
      </td>
    </tr>
  );
}

// 테스트 케이스 테이블 행 컴포넌트
function TestCaseTableRow({
  test,
}: {
  test: { test_name: string; status: string; message: string };
}) {
  const rowBgColor =
    test.status === "passed"
      ? "bg-green-900/10 border-l-4 border-green-500"
      : "bg-red-900/10 border-l-4 border-red-500";

  return (
    <tr className={rowBgColor}>
      <td className="px-3 py-2 whitespace-nowrap">
        <div
          className={[
            "inline-flex items-center justify-center w-5 h-5 text-[10px] font-semibold",
            test.status === "passed"
              ? "bg-green-900/30 text-green-400 border border-green-700/50"
              : "bg-red-900/30 text-red-400 border border-red-700/50",
          ].join(" ")}
        >
          {test.status === "passed" ? "✓" : "✗"}
        </div>
      </td>
      <td className="px-3 py-2 text-xs text-neutral-100 font-medium">
        {test.test_name}
      </td>
      <td className="px-3 py-2 text-xs text-neutral-400 font-mono">
        {test.message || "-"}
      </td>
    </tr>
  );
}

