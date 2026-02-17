import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const referer = req.headers.get("referer") || "Direct";
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // VULNERABLE: Direct string concatenation - Header-Based SQL Injection!
    const query = `INSERT INTO logs (user_agent, referer, ip) VALUES ('${userAgent}', '${referer}', '${ip}') RETURNING *`;
    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      log: result.rows[0],
      query,
    });
  } catch (error: any) {
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const referer = req.headers.get("referer") || "Direct";
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errorCode: error.code,
        errorDetail: error.detail,
        query: `INSERT INTO logs (user_agent, referer, ip) VALUES ('${userAgent}', '${referer}', '${ip}') RETURNING *`,
      },
      { status: 500 }
    );
  }
}
