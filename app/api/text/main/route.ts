// app/api/text/main/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const base = process.env.API_BASE_URL;
  if (!base) {
    return NextResponse.json(
      { success: false, message: "API_BASE_URL missing", data: null },
      { status: 500 }
    );
  }

  // 클라이언트가 보낸 쿼리(user_id 등) 그대로 전달
  const { searchParams } = new URL(req.url);

  // 여기서 10을 고정할 수도 있고, 나중에 limit으로 받을 수도 있음
  const url = new URL("/text/main/10", base);
  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      // ✅ 인증/세션 유지(쿠키 전달)
      cookie: req.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}