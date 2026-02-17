import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || "admin";

    // VULNERABLE: Direct string concatenation - Conditional Error SQL Injection!
    const query = `SELECT EXISTS(SELECT 1 FROM users WHERE username = '${username}') as user_exists`;
    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      exists: result.rows[0]?.user_exists || false,
      query,
    });
  } catch (error: any) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || "admin";
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errorCode: error.code,
        errorDetail: error.detail,
        query: `SELECT EXISTS(SELECT 1 FROM users WHERE username = '${username}') as user_exists`,
      },
      { status: 500 }
    );
  }
}
