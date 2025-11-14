import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.chucknorris.io/jokes/random", {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch joke" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      joke: data.value,
      id: data.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
