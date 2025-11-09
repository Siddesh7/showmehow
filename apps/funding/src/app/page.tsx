"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function Funding() {
  const { ready, authenticated, login, user: authenticatedUser } = usePrivy();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
      <main className="w-full max-w-5xl px-6 py-20 sm:px-8">
        <div className="mb-16 text-center">
          <h1
            className="text-6xl font-normal tracking-tight text-[#1a1a1a] sm:text-7xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Funding
          </h1>
          <p className="mt-6 text-lg text-[#666] max-w-2xl mx-auto leading-relaxed">
            app szn is on and every app needs a zero friction chainless funding
            flow, user can be on any chain and they should be able to start
            using your app rightaway
          </p>

          <div className="mt-8 h-px w-24 bg-[#1a1a1a] mx-auto" />
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-sm border border-[#e5e5e5] bg-white p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1a1a1a] bg-white text-sm font-normal text-[#1a1a1a]">
                1
              </span>
              <h2
                className="text-2xl font-normal text-[#1a1a1a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Sign in
              </h2>
            </div>
            <p className="ml-11 mb-4 text-[#666] leading-relaxed">
              Sign in with a social account to create an embedded wallet
            </p>
            {ready && !authenticated && (
              <div className="ml-11">
                <button
                  onClick={login}
                  className="rounded-sm border border-[#1a1a1a] bg-white px-6 py-2.5 text-sm font-normal text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white"
                >
                  Sign in
                </button>
              </div>
            )}
            {authenticated && (
              <div className="ml-11 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#1a1a1a] bg-white text-xs text-[#1a1a1a]">
                  ✓
                </span>
                <span className="text-sm text-[#666]">Completed</span>
              </div>
            )}
          </div>

          <div className="rounded-sm border border-[#e5e5e5] bg-white p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1a1a1a] bg-white text-sm font-normal text-[#1a1a1a]">
                2
              </span>
              <h2
                className="text-2xl font-normal text-[#1a1a1a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Fund your account
              </h2>
            </div>
            <p className="ml-11 mb-4 text-[#666] leading-relaxed">
              Send any asset you have. The app bridges/swaps in the background
              to whatever chain the app needs (Base in this case)
            </p>
            {authenticated && authenticatedUser && (
              <div className="ml-11">
                <button className="rounded-sm border border-[#1a1a1a] bg-white px-6 py-2.5 text-sm font-normal text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white">
                  Show address to deposit
                </button>
              </div>
            )}
          </div>

          <div className="rounded-sm border border-[#e5e5e5] bg-white p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1a1a1a] bg-white text-sm font-normal text-[#1a1a1a]">
                3
              </span>
              <h2
                className="text-2xl font-normal text-[#1a1a1a]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Use the app
              </h2>
            </div>
            <p className="ml-11 text-[#666] leading-relaxed">
              Start using the app right away.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
