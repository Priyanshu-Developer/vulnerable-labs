import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || "1";


    // Secure parameterized query
    const query = "SELECT * FROM products WHERE id = $1";
    const result = await pool.query(query, [productId]);

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      exists: result.rows.length > 0,
      product: result.rows[0] || null,
      responseTime,
      query,
      params: [productId],
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        responseTime,
        query: "SELECT * FROM products WHERE id = $1",
      },
      { status: 500 }
    );
  }
}
