import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const base = process.env.API_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { success: false, message: "API_BASE_URL missing", data: null },
        { status: 500 }
      );
    }

    const res = await fetch(`${base}/admin/reports/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: `Failed to fetch report: ${res.status}`, data: null },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message ?? "Unknown error", data: null },
      { status: 500 }
    );
  }
}





