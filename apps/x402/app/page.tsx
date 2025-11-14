"use client";

import {
  usePrivy,
  useWallets,
  useFundWallet,
  useX402Fetch,
} from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";
interface Balance {
  chain: string;
  asset: string;
  raw_value: string;
  raw_value_decimals: number;
  display_values: {
    usdc?: string;
    usd?: string;
  };
}

export default function X402() {
  const { ready, authenticated, login, user: authenticatedUser } = usePrivy();
  const { wallets } = useWallets();
  const { fundWallet } = useFundWallet();
  const { wrapFetchWithPayment } = useX402Fetch();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [joke, setJoke] = useState<string | null>(null);
  const [loadingJoke, setLoadingJoke] = useState(false);
  const [jokeError, setJokeError] = useState<string | null>(null);
  const walletAddress = wallets.find(
    (w) => w.walletClientType === "privy"
  )?.address;
  const walletId = authenticatedUser?.wallet?.id;

  useEffect(() => {
    const fetchBalance = async () => {
      if (!authenticated || !walletId) {
        setBalance(null);
        return;
      }

      try {
        const response = await fetch(`/api/balance?walletId=${walletId}`);
        if (response.ok) {
          const data = await response.json();
          const usdcBalance = data.balances?.find(
            (b: Balance) => b.chain === "base_sepolia" && b.asset === "usdc"
          );
          setBalance(usdcBalance || null);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [authenticated, walletId]);

  const usdcBalance = balance?.display_values?.usdc
    ? parseFloat(balance.display_values.usdc)
    : 0;
  const hasSufficientBalance = usdcBalance >= 0.01;

  const handlePayAndRequest = async () => {
    if (!walletAddress) {
      setJokeError("Wallet address not found");
      return;
    }

    setLoadingJoke(true);
    setJokeError(null);
    setJoke(null);

    try {
      const fetchWithPayment = wrapFetchWithPayment({
        walletAddress,
        fetch,
      });

      const response = await fetchWithPayment("/api/joke");

      if (!response.ok) {
        throw new Error(`Failed to fetch joke: ${response.statusText}`);
      }

      const data = await response.json();
      setJoke(data.joke || "No joke received");

      // Refresh balance after payment
      if (walletId) {
        const balanceResponse = await fetch(
          `/api/balance?walletId=${walletId}`
        );
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          const usdcBalance = balanceData.balances?.find(
            (b: Balance) => b.chain === "base_sepolia" && b.asset === "usdc"
          );
          setBalance(usdcBalance || null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch joke:", error);
      setJokeError(
        error instanceof Error ? error.message : "Failed to fetch joke"
      );
    } finally {
      setLoadingJoke(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
      <main className="w-full max-w-5xl px-6 py-20 sm:px-8">
        <div className="mb-16 text-center">
          <h1
            className="text-6xl font-normal tracking-tight text-[#1a1a1a] sm:text-7xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            x402
          </h1>
          <p className="mt-6 text-lg text-[#666] max-w-2xl mx-auto leading-relaxed">
            a simple demo of x402 w/ Privy and how it works
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
                Request a joke with payment
              </h2>
            </div>
            <p className="ml-11 mb-4 text-[#666] leading-relaxed">
              A joke costs 0.01 USDC. Pay and request a Chuck Norris joke.
            </p>
            {authenticated && authenticatedUser && (
              <div className="ml-11 space-y-3">
                {balance ? (
                  <div className="space-y-2">
                    <p className="text-sm text-[#666]">
                      Balance: {balance.display_values.usdc || "0"} USDC
                      {balance.display_values.usd &&
                        ` ($${balance.display_values.usd})`}{" "}
                      Base Sepolia
                    </p>
                    {!hasSufficientBalance && (
                      <p className="text-sm text-red-600">
                        Insufficient balance. You need at least 0.01 USDC on
                        Base Sepolia.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#666]">
                    Balance: 0 USDC (Base Sepolia)
                  </p>
                )}
                <div className="flex gap-3">
                  {!hasSufficientBalance && (
                    <button
                      onClick={() =>
                        fundWallet({
                          address: walletAddress!,
                          options: {
                            chain: baseSepolia,
                            asset: "USDC",
                            amount: "1",
                          },
                        })
                      }
                      className="rounded-sm border border-[#1a1a1a] bg-white px-6 py-2.5 text-sm font-normal text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white"
                    >
                      Fund Wallet
                    </button>
                  )}
                  <button
                    onClick={handlePayAndRequest}
                    disabled={!hasSufficientBalance || loadingJoke}
                    className="rounded-sm border border-[#1a1a1a] bg-white px-6 py-2.5 text-sm font-normal text-[#1a1a1a] transition-all hover:bg-[#1a1a1a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#1a1a1a]"
                  >
                    {loadingJoke ? "Processing..." : "Pay and Request"}
                  </button>
                </div>
                {joke && (
                  <div className="mt-4 rounded-sm border border-[#e5e5e5] bg-[#fafafa] p-4">
                    <p className="text-sm font-medium text-[#1a1a1a] mb-2"></p>
                    <p className="text-sm text-[#666] leading-relaxed">
                      {joke}
                    </p>
                  </div>
                )}
                {jokeError && (
                  <div className="mt-4 rounded-sm border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-600">{jokeError}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
