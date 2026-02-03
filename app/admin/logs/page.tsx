'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Interfaces
interface PerformanceLog {
  id: string;
  operationType: 'MERGE' | 'COMPRESS' | 'CONVERT_TO_IMAGE' | 'EDIT';
  fileCount: number;
  totalInputSizeInBytes: string;
  outputSizeInBytes: string | null;
  processingTimeInMs: number;
  createdAt: string;
  githubVersion?: string | null;
  path?: string | null;
}

interface FrontendVital {
  id: string;
  name: string;
  value: number;
  path: string;
  createdAt: string;
  githubVersion?: string | null;
}

interface UserExperienceLog {
  id: string;
  metricName: string;
  durationInMs: number;
  path: string;
  fileCount: number | null;
  totalFileSizeInBytes: string | null;
  createdAt: string;
  githubVersion?: string | null;
}

export default function AdminLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // States
  const [serverLogs, setServerLogs] = useState<PerformanceLog[]>([]);
  const [frontendVitals, setFrontendVitals] = useState<FrontendVital[]>([]);
  const [uxLogs, setUxLogs] = useState<UserExperienceLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGithubVersion, setSelectedGithubVersion] = useState<string>('all');
  const [githubVersions, setGithubVersions] = useState<string[]>([]);
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
      async function fetchAllData() {
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
            // 리포트 가져오기 실패해도 계속 진행
            console.error("Failed to fetch latest report ID:", e);
          }

          const [serverRes, frontendRes, uxRes] = await Promise.all([
            fetch('/api/admin/performance-logs'),
            fetch('/api/frontend-vitals'),
            fetch('/api/admin/user-experience-logs'),
          ]);

          if (!serverRes.ok || !frontendRes.ok || !uxRes.ok) {
            throw new Error(`HTTP error! Server: ${serverRes.status}, Frontend: ${frontendRes.status}, UX: ${uxRes.status}`);
          }

          const serverData: PerformanceLog[] = await serverRes.json();
          const frontendData: FrontendVital[] = await frontendRes.json();
          const uxData: UserExperienceLog[] = await uxRes.json();

          setServerLogs(serverData);
          setFrontendVitals(frontendData);
          setUxLogs(uxData);

          const serverVersions = serverData.map(log => log.githubVersion).filter(Boolean) as string[];
          const frontendVersions = frontendData.map(vital => vital.githubVersion).filter(Boolean) as string[];
          const uxVersions = uxData.map(log => log.githubVersion).filter(Boolean) as string[];
          const uniqueVersions = Array.from(new Set([...serverVersions, ...frontendVersions, ...uxVersions]));
          setGithubVersions(['all', ...uniqueVersions]);

        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }

      fetchAllData();
    }
  }, [session, status]);

  // Filtering
  const filteredServerLogs = selectedGithubVersion === 'all'
    ? serverLogs
    : serverLogs.filter(log => log.githubVersion === selectedGithubVersion);

  const filteredFrontendVitals = selectedGithubVersion === 'all'
    ? frontendVitals
    : frontendVitals.filter(vital => vital.githubVersion === selectedGithubVersion);

  const filteredUxLogs = selectedGithubVersion === 'all'
    ? uxLogs
    : uxLogs.filter(log => log.githubVersion === selectedGithubVersion);

  // Formatters
  const formatBytes = (bytes: string | null) => {
    if (bytes === null) return 'N/A';
    const numBytes = BigInt(bytes);
    if (numBytes === BigInt(0)) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(Number(numBytes)) / Math.log(k));
    return parseFloat((Number(numBytes) / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  };

  const formatVitalValue = (name: string, value: number) => {
    if (['LCP', 'INP'].includes(name)) {
      return `${(value / 1000).toFixed(2)} s`;
    }
    if (name === 'CLS') {
      return value.toFixed(4);
    }
    return `${value.toFixed(2)} ms`;
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
              <h1 className="text-2xl font-bold text-neutral-100">종합 성능 대시보드</h1>
            </div>

            <div className="mb-4">
              <label htmlFor="githubVersionFilter" className="block text-sm font-medium text-neutral-300 mb-2">
                GitHub 버전 필터:
              </label>
              <select
                id="githubVersionFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-neutral-600 bg-neutral-800 text-neutral-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedGithubVersion}
                onChange={(e) => setSelectedGithubVersion(e.target.value)}
              >
                {githubVersions.map(version => (
                  <option key={version} value={version}>
                    {version === 'all' ? '모든 버전' : version}
                  </option>
                ))}
              </select>
            </div>

            {loading && <p className="text-center text-neutral-300 py-4">데이터를 불러오는 중...</p>}
            {error && (
              <div className="rounded-lg border border-red-700 bg-red-900/10 px-4 py-3 text-sm text-red-400 mb-4">
                ❌ 오류: {error}
              </div>
            )}

            {/* User Experience Logs */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-neutral-100">사용자 경험(UX) 성능 로그</h2>
              {!loading && !error && filteredUxLogs.length === 0 ? (
                <p className="text-center text-neutral-400">표시할 UX 로그가 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                    <thead className="bg-neutral-700">
                      <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">측정 항목</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">소요 시간</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">경로</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">파일 개수</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">총 파일 크기</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">기록 시간</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">GitHub 버전</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUxLogs.map((log) => (
                        <tr key={log.id} className="border-b border-neutral-700 last:border-b-0 hover:bg-neutral-750">
                          <td className="py-2 px-4 text-sm text-neutral-200">{log.metricName}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{formatTime(log.durationInMs)}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{log.path}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{log.fileCount ?? 'N/A'}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{formatBytes(log.totalFileSizeInBytes)}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{new Date(log.createdAt).toLocaleString()}</td>
                          <td className="py-2 px-4 text-sm">
                            {log.githubVersion && log.githubVersion !== 'local' ? (
                              <a href={`https://github.com/JOJoungMin/PdfMerge/commit/${log.githubVersion}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                                {log.githubVersion.substring(0, 7)}
                              </a>
                            ) : (
                              <span className="text-neutral-400">{log.githubVersion || 'N/A'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Server Performance Logs */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-neutral-100">서버 성능 로그</h2>
              {!loading && !error && filteredServerLogs.length === 0 ? (
                <p className="text-center text-neutral-400">표시할 서버 로그가 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                    <thead className="bg-neutral-700">
                      <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">작업 유형</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">파일 개수</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">입력 크기</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">출력 크기</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">처리 시간</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">기록 시간</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">GitHub 버전</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServerLogs.map((log) => (
                        <tr key={log.id} className="border-b border-neutral-700 last:border-b-0 hover:bg-neutral-750">
                          <td className="py-2 px-4 text-sm text-neutral-200">{log.operationType}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{log.fileCount}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{formatBytes(log.totalInputSizeInBytes)}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{formatBytes(log.outputSizeInBytes)}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{formatTime(log.processingTimeInMs)}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{new Date(log.createdAt).toLocaleString()}</td>
                          <td className="py-2 px-4 text-sm">
                            {log.githubVersion && log.githubVersion !== 'local' ? (
                              <a href={`https://github.com/JOJoungMin/PdfMerge/commit/${log.githubVersion}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                                {log.githubVersion.substring(0, 7)}
                              </a>
                            ) : (
                              <span className="text-neutral-400">{log.githubVersion || 'N/A'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Frontend Web Vitals */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-neutral-100">프론트엔드 성능 지표 (Core Web Vitals)</h2>
              {!loading && !error && filteredFrontendVitals.length === 0 ? (
                <p className="text-center text-neutral-400">표시할 프론트엔드 지표가 없습니다.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                    <thead className="bg-neutral-700">
                      <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">경로</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">지표 이름</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">값</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">기록 시간</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-neutral-200">GitHub 버전</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFrontendVitals.map((vital) => (
                        <tr key={vital.id} className="border-b border-neutral-700 last:border-b-0 hover:bg-neutral-750">
                          <td className="py-2 px-4 text-sm text-neutral-200">{vital.path}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{vital.name}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{formatVitalValue(vital.name, vital.value)}</td>
                          <td className="py-2 px-4 text-sm text-neutral-200">{new Date(vital.createdAt).toLocaleString()}</td>
                          <td className="py-2 px-4 text-sm">
                            {vital.githubVersion && vital.githubVersion !== 'local' ? (
                              <a href={`https://github.com/JOJoungMin/PdfMerge/commit/${vital.githubVersion}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                                {vital.githubVersion.substring(0, 7)}
                              </a>
                            ) : (
                              <span className="text-neutral-400">{vital.githubVersion || 'N/A'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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



