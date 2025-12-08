import { askBot } from "../../../lib/groq";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { query, contextMessages, nfts } = await request.json();
    const answer = await askBot(query, contextMessages, nfts);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Failed to get response from chat bot." },
      { status: 500 }
    );
  }
}