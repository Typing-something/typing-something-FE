// types/report.ts

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
};

// 리포트 목록 아이템
export type ReportSummary = {
  report_id: number;
  test_time: string;
  git_commit: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    is_passed: boolean;
  };
  load_test_info: {
    user_count: number;
  };
};

// 리포트 목록 응답
export type GetReportsResponse = ApiResponse<ReportSummary[]>;

// Pytest 테스트 케이스 결과
export type TestCaseResult = {
  test_name: string;
  status: string;
  message: string;
};

// API 성능 지표
export type ApiPerformance = {
  method: string;
  endpoint: string;
  latency: {
    avg: number;
    p95: number;
    p99: number;
    max: number;
  };
  stats: {
    rps: number;
    total_requests: number;
    fail_count: number;
    error_rate: number;
  };
  is_satisfied: boolean;
};

// 리포트 상세 정보
export type ReportDetail = {
  report_info: {
    id: number;
    date: string;
    commit: string;
  };
  load_test_info?: {
    user_count: number;
  };
  pytest_results: TestCaseResult[];
  performance_results: ApiPerformance[];
};

// 리포트 상세 응답
export type GetReportDetailResponse = ApiResponse<ReportDetail>;




