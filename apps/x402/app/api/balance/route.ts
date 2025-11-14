import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const walletId = searchParams.get("walletId");

  if (!walletId) {
    return NextResponse.json(
      { error: "walletId is required" },
      { status: 400 }
    );
  }

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;

  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: "Privy credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const auth = Buffer.from(`${appId}:${appSecret}`).toString("base64");

    const balanceUrl = new URL(
      `https://api.privy.io/v1/wallets/${walletId}/balance`
    );
    balanceUrl.searchParams.set("asset", "usdc");
    balanceUrl.searchParams.set("chain", "base_sepolia");
    balanceUrl.searchParams.set("include_currency", "usd");

    const balanceResponse = await fetch(balanceUrl.toString(), {
      headers: {
        Authorization: `Basic ${auth}`,
        "privy-app-id": appId,
      },
    });

    if (!balanceResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch balance" },
        { status: balanceResponse.status }
      );
    }

    const balanceData = await balanceResponse.json();
    return NextResponse.json(balanceData);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
