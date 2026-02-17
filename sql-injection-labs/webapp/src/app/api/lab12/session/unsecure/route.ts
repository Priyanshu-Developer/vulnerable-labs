import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
    const cookieValue = body.cookie || "user=guest";

    // Extract the user value from cookie
    const userParam = cookieValue.split("=")[1] || "guest";

    // VULNERABLE: Direct string concatenation - Cookie-Based SQL Injection!
    const query = `SELECT * FROM users WHERE username = '${userParam}' OR id::text = '${userParam}'`;
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      return NextResponse.json({
        success: true,
        user: result.rows[0],
        query,
      });
    }

    return NextResponse.json({
      success: false,
      error: "Session not found",
      query,
    });
  } catch (error: any) {
    const cookieValue = body.cookie || "user=guest";
    const userParam = cookieValue.split("=")[1] || "guest";
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        query: `SELECT * FROM users WHERE username = '${userParam}' OR id::text = '${userParam}'`,
      },
      { status: 500 }
    );
  }
}
