import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const referer = req.headers.get("referer") || "Direct";
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // Secure parameterized query
    const query = "INSERT INTO logs (user_agent, referer, ip) VALUES ($1, $2, $3) RETURNING *";
    const result = await pool.query(query, [userAgent, referer, ip]);

    return NextResponse.json({
      success: true,
      log: result.rows[0],
      query,
      params: [userAgent, referer, ip],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        query: "INSERT INTO logs (user_agent, referer, ip) VALUES ($1, $2, $3) RETURNING *",
      },
      { status: 500 }
    );
  }
}
