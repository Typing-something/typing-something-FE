// app/admin/reports/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/authOption";
import { redirect } from "next/navigation";
import { getReportDetail, getReports } from "@/lib/api/report";
import Link from "next/link";
import { ReportDetailContent } from "./ReportDetailContent";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 관리자 권한 체크
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean((session?.user as any)?.is_admin);

  if (!isAdmin) {
    redirect("/");
  }

  const { id } = await params;
  let reportDetail = null;
  let error: string | null = null;

  try {
    reportDetail = await getReportDetail(Number(id));
  } catch (e: any) {
    error = e.message || "리포트를 불러오는데 실패했습니다.";
  }

  // 최신 리포트 ID 계산
  let latestReportId: number | null = null;
  try {
    const reports = await getReports();
    if (reports.length > 0) {
      latestReportId = Math.max(...reports.map(r => r.report_id));
    }
  } catch (e) {
    // 리포트 가져오기 실패해도 계속 진행
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* 상단 헤더와 경계선 */}
      <div className="fixed top-14 left-0 right-0 h-px bg-neutral-700 z-40" />
      
      <div className="flex pt-14">
        {/* 좌측 사이드바 */}
        <AdminSidebar latestReportId={latestReportId} />
        
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 ml-[140px] min-h-screen">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Link
                  href="/admin"
                  className="text-sm text-neutral-400 hover:text-neutral-300 mb-2 inline-block"
                >
                  ← 대시보드로 돌아가기
                </Link>
                <h1 className="text-2xl font-bold text-neutral-100">
                  리포트 #{id} 상세
                </h1>
                {reportDetail && (
                  <p className="mt-1 text-sm text-neutral-400">
                    {reportDetail.report_info.date} • 커밋:{" "}
                    {reportDetail.report_info.commit ? (
                      <a
                        href={`https://github.com/Typing-something/Flask_Api_Server/commit/${reportDetail.report_info.commit}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {reportDetail.report_info.commit.substring(0, 7)}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                )}
              </div>
            </div>

            {error ? (
              <div className="border border-red-700 bg-red-900/10 px-4 py-3 text-sm text-red-400">
                ❌ {error}
              </div>
            ) : reportDetail ? (
              <ReportDetailContent report={reportDetail} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

// 좌측 사이드바 컴포넌트
function AdminSidebar({ latestReportId }: { latestReportId: number | null }) {
  const menuItems = [
    { href: "/admin", label: "대시보드" },
    { href: latestReportId ? `/admin/reports/${latestReportId}` : "/admin/reports", label: "성능 리포트" },
    { href: "/admin/users", label: "사용자 관리" },
    { href: "/admin/system", label: "시스템 설정" },
    { href: "/admin/logs", label: "로그" },
    { href: "/admin/stats", label: "통계" },
  ];

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[140px] bg-neutral-800 border-r border-neutral-700 overflow-y-auto z-30">
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-2 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100 rounded-md transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      
      {/* 빌드 대기 목록 섹션 */}
      <div className="mt-6 px-3">
        <h3 className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          빌드 대기 목록
        </h3>
        <div className="text-[10px] text-neutral-500">
          빌드 대기 항목이 없습니다.
        </div>
      </div>

      {/* 빌드 실행 상태 섹션 */}
      <div className="mt-4 px-3">
        <h3 className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          빌드 실행 상태
        </h3>
        <div className="space-y-0.5 text-[10px] text-neutral-400">
          <div>1 대기 중</div>
          <div>2 대기 중</div>
        </div>
      </div>
    </aside>
  );
}



