import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId") || "1";

    // Secure parameterized query
    const query = "SELECT * FROM products WHERE id = $1";
    const result = await pool.query(query, [productId]);

    return NextResponse.json({
      success: true,
      exists: result.rows.length > 0,
      product: result.rows[0] || null,
      query,
      params: [productId],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        query: "SELECT * FROM products WHERE id = $1",
      },
      { status: 500 }
    );
  }
}
