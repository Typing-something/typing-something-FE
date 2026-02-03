'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Interfaces
interface UserAccount {
  user_id: number;
  username: string;
  email: string;
  profile_pic: string | null;
  ranking_score: number;
}

interface UserStats {
  play_count: number;
  max_combo: number;
  avg_accuracy: number;
  best_cpm: number;
  avg_cpm: number;
  best_wpm: number;
  avg_wpm: number;
}

interface User {
  account: UserAccount;
  stats: UserStats;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // States
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latestReportId, setLatestReportId] = useState<number | null>(null);

  // Authorization Effect
  useEffect(() => {
    if (status === 'loading') return;
    const isAdmin = Boolean((session?.user as any)?.is_admin);
    if (status === 'unauthenticated' || !isAdmin) {
      router.push('/');
    }
  }, [session, status, router]);

  // Fetching logic
  useEffect(() => {
    const isAdmin = Boolean((session?.user as any)?.is_admin);
    if (status === 'authenticated' && isAdmin) {
      async function fetchUsers() {
        setLoading(true);
        try {
          // 최신 리포트 ID 가져오기
          try {
            const reportsRes = await fetch('/api/admin/reports');
            if (reportsRes.ok) {
              const reportsJson = await reportsRes.json();
              if (reportsJson.success && reportsJson.data && reportsJson.data.length > 0) {
                const reports = reportsJson.data;
                const latestId = Math.max(...reports.map((r: any) => r.report_id));
                setLatestReportId(latestId);
              }
            }
          } catch (e) {
            console.error("Failed to fetch latest report ID:", e);
          }

          const res = await fetch('/api/admin/users');

          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const json = await res.json();

          if (!json.success) {
            throw new Error(json.message || 'Failed to fetch users');
          }

          setUsers(json.data.users || []);

        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }

      fetchUsers();
    }
  }, [session, status]);

  // Formatters
  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toLocaleString();
  };

  const formatDecimal = (num: number | null, decimals: number = 2) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toFixed(decimals);
  };

  // Render
  if (status === 'loading' || status === 'unauthenticated' || !Boolean((session?.user as any)?.is_admin)) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <p className="text-neutral-100">접근 권한을 확인 중이거나, 권한이 없습니다...</p>
      </div>
    );
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
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-neutral-100">사용자 관리</h1>
              <p className="text-sm text-neutral-400 mt-1">총 {users.length}명의 사용자</p>
            </div>

            {loading && <p className="text-center text-neutral-300 py-4">데이터를 불러오는 중...</p>}
            {error && (
              <div className="rounded-lg border border-red-700 bg-red-900/10 px-4 py-3 text-sm text-red-400 mb-4">
                ❌ 오류: {error}
              </div>
            )}

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                  <thead className="bg-neutral-700">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">사용자 ID</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">사용자명</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">이메일</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">랭킹 점수</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">플레이 횟수</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">최대 콤보</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">평균 정확도</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">최고 CPM</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">평균 CPM</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">최고 WPM</th>
                      <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">평균 WPM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-4 text-center text-neutral-400">
                          표시할 사용자가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.account.user_id} className="border-b border-neutral-700 last:border-b-0 hover:bg-neutral-750">
                          <td className="py-2 px-4 text-sm text-neutral-200 font-medium">
                            #{user.account.user_id}
                          </td>
                          <td className="py-2 px-4 text-sm text-neutral-200">
                            <div className="flex items-center gap-2">
                              {user.account.profile_pic && (
                                <img
                                  src={user.account.profile_pic}
                                  alt={user.account.username}
                                  className="w-6 h-6 rounded-full"
                                />
                              )}
                              <span>{user.account.username}</span>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{user.account.email}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">
                            {formatNumber(user.account.ranking_score)}
                          </td>
                          <td className="py-2 px-4 text-sm text-neutral-200">
                            {formatNumber(user.stats.play_count)}
                          </td>
                          <td className="py-2 px-4 text-sm text-neutral-200">
                            {formatNumber(user.stats.max_combo)}
                          </td>
                          <td className="py-2 px-4 text-sm text-neutral-200">
                            {formatDecimal(user.stats.avg_accuracy)}%
                          </td>
                          <td className="py-2 px-4 text-sm text-neutral-200">
                            {formatNumber(user.stats.best_cpm)}
                          </td>
                          <td className="py-2 px-4 text-sm text-neutral-200">
                            {formatDecimal(user.stats.avg_cpm)}
                          </td>
                          <td className="py-2 px-4 text-sm text-neutral-200">
                            {formatNumber(user.stats.best_wpm)}
                          </td>
                          <td className="py-2 px-4 text-sm text-neutral-200">
                            {formatDecimal(user.stats.avg_wpm)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
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

