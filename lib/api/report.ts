// lib/api/report.ts
import type { GetReportsResponse, GetReportDetailResponse } from "@/types/report";

export async function getReports(): Promise<GetReportsResponse["data"]> {
  const base = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("API_BASE_URL env is missing");

  const res = await fetch(`${base}/admin/reports`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch reports: ${res.status}`);
  }

  const json: GetReportsResponse = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to fetch reports");
  }

  return json.data;
}

export async function getReportDetail(
  reportId: number
): Promise<GetReportDetailResponse["data"]> {
  const base = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("API_BASE_URL env is missing");

  const res = await fetch(`${base}/admin/reports/${reportId}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch report detail: ${res.status}`);
  }

  const json: GetReportDetailResponse = await res.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to fetch report detail");
  }

  return json.data;
}

