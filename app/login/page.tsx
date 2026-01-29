"use client";

import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
export default function LoginPageUI() {
  return (
    <main className="min-h-screen bg-neutral-100 px-8 py-32">
      {/* 전체 레이아웃 */}
      <section className="mx-auto w-full max-w-[560px]">
        {/* Title */}
        <h1 className="text-center text-[24px] font-black tracking-tight text-neutral-900">
          LOGIN
        </h1>

        {/* Form */}
        <div className="mx-auto mt-12 w-full max-w-[640px]">
          {/* Email */}
          <label className="block text-xs font-semibold tracking-wide text-neutral-900">
            EMAIL ADDRESS
          </label>
          <div className="mt-2">
            <input
              type="email"
              placeholder="Email Address"
              className="h-12 w-full border border-neutral-300 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900/30"
            />
          </div>

          {/* Password */}
          <div className="mt-7 flex items-center justify-between">
            <label className="text-xs font-semibold tracking-wide text-neutral-900">
              PASSWORD
            </label>

            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              show
            </span>
          </div>

          <div className="mt-2">
            <input
              type="password"
              placeholder="Password"
              className="h-12 w-full border border-neutral-300 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900/30"
            />
          </div>

          {/* Forgot */}
          <div className="mt-5">
            <button
              type="button"
              className="text-sm text-neutral-900 hover:underline"
            >
              Forgot your password
            </button>
          </div>

          <div className="mt-12 space-y-3">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex h-14 w-full items-center justify-center gap-3 bg-white text-sm font-semibold text-neutral-900 border border-neutral-300 shadow-sm hover:bg-neutral-50 active:bg-neutral-100"
            >
              <img src="/googleImg.png" alt="Google" className="h-5 w-5" />
              Continue with Google
            </button>

            {/* 기존 버튼은 “UI만” 남기거나 지워도 됨 */}
            <button
              type="button"
              onClick={() =>
                toast.info("이메일 로그인은 곧 추가될 예정이에요", {
                  toastId: "email-login-soon",
                })
              }
              className="h-14 w-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950
                        text-sm font-semibold tracking-wide text-white
                        shadow-[0_14px_40px_-16px_rgba(0,0,0,0.65)]
                        hover:brightness-110 active:brightness-95"
            >
              LOGIN
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}