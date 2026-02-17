import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieValue = body.cookie || "user=guest";

    // Extract the user value from cookie
    const userParam = cookieValue.split("=")[1] || "guest";

    // Secure parameterized query
    const query = "SELECT * FROM users WHERE username = $1 OR id::text = $1";
    const result = await pool.query(query, [userParam]);

    if (result.rows.length > 0) {
      return NextResponse.json({
        success: true,
        user: result.rows[0],
        query,
        params: [userParam],
      });
    }

    return NextResponse.json({
      success: false,
      error: "Session not found",
      query,
      params: [userParam],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        query: "SELECT * FROM users WHERE username = $1 OR id::text = $1",
      },
      { status: 500 }
    );
  }
}
