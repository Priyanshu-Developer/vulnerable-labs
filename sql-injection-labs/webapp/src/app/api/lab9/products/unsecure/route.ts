import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || "1";

    // VULNERABLE: Direct string concatenation - SQL Injection!
    const query = `SELECT * FROM products WHERE id = '${productId}'`;
    const result = await pool.query(query);

    return NextResponse.json({
      success: true,
      exists: result.rows.length > 0,
      product: result.rows[0] || null,
      query,
    });
  } catch (error: any) {
    const { searchParams } = new URL(req.url);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        query: `SELECT * FROM products WHERE id = '${searchParams.get("productId") || "1"}'`,
      },
      { status: 500 }
    );
  }
}
