import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const base = process.env.API_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { success: false, error: { message: "API_BASE_URL is missing" }, data: null },
        { status: 500 }
      );
    }

    const res = await fetch(`${base}/text/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    return NextResponse.json(data ?? { success: false, error: { message: "Invalid JSON" }, data: null }, {
      status: res.status,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: { message: e?.message ?? "Unknown error" }, data: null },
      { status: 500 }
    );
  }
}