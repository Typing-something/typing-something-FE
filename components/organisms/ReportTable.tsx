"use client";

import { useState } from "react";
import type { ReportSummary } from "@/types/report";

type Props = {
  reports: ReportSummary[];
};

export function ReportTable({ reports }: Props) {
  // 커밋별로 그룹화
  const groupedByCommit = reports.reduce((acc, report) => {
    const commit = report.git_commit || "unknown";
    if (!acc[commit]) {
      acc[commit] = [];
    }
    acc[commit].push(report);
    return acc;
  }, {} as Record<string, ReportSummary[]>);

  // 커밋별로 정렬 (최신순)
  const sortedCommits = Object.entries(groupedByCommit).sort((a, b) => {
    const aLatest = a[1][0]?.test_time || "";
    const bLatest = b[1][0]?.test_time || "";
    return bLatest.localeCompare(aLatest);
  });

  return (
    <div className="space-y-6">
      {sortedCommits.map(([commit, commitReports]) => (
        <CommitGroup
          key={commit}
          commit={commit}
          reports={commitReports}
        />
      ))}
    </div>
  );
}

// 커밋별 그룹 컴포넌트
function CommitGroup({
  commit,
  reports,
}: {
  commit: string;
  reports: ReportSummary[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const commitShort = commit !== "unknown" ? commit.substring(0, 7) : "N/A";
  const commitUrl = commit !== "unknown"
    ? `https://github.com/Typing-something/Flask_Api_Server/commit/${commit}`
    : null;

  // 리포트를 최신순으로 정렬 (test_time 기준)
  const sortedReports = [...reports].sort((a, b) => 
    b.test_time.localeCompare(a.test_time)
  );

  // 기본적으로 최신 5개만 표시, 확장 시 모두 표시
  const visibleReports = isExpanded ? sortedReports : sortedReports.slice(0, 5);
  const hasMore = sortedReports.length > 5;

  return (
    <div className="bg-neutral-800 border border-neutral-700 overflow-hidden">
      {/* 커밋 헤더 */}
      <div className="bg-neutral-700 px-3 py-1.5 border-b border-neutral-600">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-300">Commit:</span>
          {commitUrl ? (
            <a
              href={commitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline font-mono text-xs"
            >
              {commitShort}
            </a>
          ) : (
            <span className="text-neutral-400 font-mono text-xs">{commitShort}</span>
          )}
          <span className="text-[10px] text-neutral-500">
            ({reports.length}개 리포트)
          </span>
        </div>
      </div>

      {/* 리포트 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-700">
          <thead className="bg-neutral-700/50">
            <tr>
              <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                상태
              </th>
              <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                리포트 ID
              </th>
              <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                테스트 시간
              </th>
              <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                테스트 결과
              </th>
              <th className="px-3 py-1.5 text-left text-[10px] font-semibold text-neutral-300 uppercase tracking-wider">
                성능 리포트
              </th>
            </tr>
          </thead>
          <tbody className="bg-neutral-800 divide-y divide-neutral-700">
            {visibleReports.map((report) => (
              <ReportTableRow key={report.report_id} report={report} />
            ))}
          </tbody>
        </table>
      </div>

      {/* 기록 펼쳐보기 버튼 */}
      {hasMore && (
        <div className="bg-neutral-700/50 px-3 py-2 border-t border-neutral-600">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-neutral-300 hover:text-neutral-100 transition-colors"
          >
            {isExpanded ? "기록 접기" : `기록 펼쳐보기 (${sortedReports.length - 5}개 더 보기)`}
          </button>
        </div>
      )}
    </div>
  );
}

// 리포트 테이블 행 컴포넌트
function ReportTableRow({ report }: { report: ReportSummary }) {
  const { summary, test_time } = report;
  const passRate = summary.total > 0
    ? ((summary.passed / summary.total) * 100).toFixed(1)
    : "0";

  // 시간 포맷: 분 단위까지만 (YYYY-MM-DD HH:MM)
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return timeStr;
    }
  };

  // Jenkins 스타일: 통과는 초록색, 실패는 빨간색
  const rowBgColor = summary.is_passed
    ? "bg-green-900/10 hover:bg-green-900/20 border-l-4 border-green-500"
    : "bg-red-900/10 hover:bg-red-900/20 border-l-4 border-red-500";

  return (
    <tr className={`${rowBgColor} transition-colors`}>
      <td className="px-3 py-2 whitespace-nowrap">
        <div
          className={[
            "inline-flex items-center justify-center w-6 h-6 text-[10px] font-semibold",
            summary.is_passed
              ? "bg-green-900/30 text-green-400 border border-green-700/50"
              : "bg-red-900/30 text-red-400 border border-red-700/50",
          ].join(" ")}
        >
          {summary.is_passed ? "✓" : "✗"}
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-neutral-100">
        #{report.report_id}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-300">
        {formatTime(test_time)}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-xs text-neutral-300">
        <div className="flex items-center gap-1.5">
          <span>{summary.passed}/{summary.total}</span>
          <span className="text-neutral-600">•</span>
          <span
            className={summary.is_passed ? "text-green-400" : "text-red-400"}
          >
            {passRate}%
          </span>
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <a
          href={`/admin/reports/${report.report_id}`}
          className="px-2 py-1 text-[10px] font-medium text-neutral-300 bg-neutral-700 hover:bg-neutral-600 transition-colors rounded"
          onClick={(e) => e.stopPropagation()}
        >
          성능 리포트 보러가기
        </a>
      </td>
    </tr>
  );
}




