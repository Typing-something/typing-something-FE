"use client";

export default function SignupPageUI() {
  return (
    <main className="min-h-screen bg-neutral-100 px-8 py-20">
      <section className="mx-auto w-full max-w-[560px]">
        <h1 className="text-center text-[24px] font-black tracking-tight text-neutral-900">
          SIGN UP
        </h1>

        <div className="mx-auto mt-12 w-full max-w-[560px]">
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

          {/* Nickname */}
          <div className="mt-7">
            <label className="block text-xs font-semibold tracking-wide text-neutral-900">
              NICKNAME
            </label>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Nickname"
                className="h-12 w-full border border-neutral-300 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900/30"
              />
            </div>
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

          {/* Confirm Password */}
          <div className="mt-7">
            <label className="block text-xs font-semibold tracking-wide text-neutral-900">
              CONFIRM PASSWORD
            </label>
            <div className="mt-2">
              <input
                type="password"
                placeholder="Confirm Password"
                className="h-12 w-full border border-neutral-300 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900/30"
              />
            </div>
          </div>

          {/* helper row */}
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              By signing up, you agree to our terms.
            </span>
            <button type="button" className="text-sm text-neutral-900 hover:underline">
              Already have an account?
            </button>
          </div>

          {/* Button */}
          <div className="mt-10">
            <button
              type="button"
              className="h-14 w-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-sm font-semibold tracking-wide text-white shadow-[0_14px_40px_-16px_rgba(0,0,0,0.65)] hover:brightness-110 active:brightness-95"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}