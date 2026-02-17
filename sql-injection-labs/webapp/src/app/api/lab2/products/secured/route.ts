import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {

  const search = req.nextUrl.searchParams.get("search")?.trim() || "";

  // ✅ SECURE: using parameterized queries prevents SQL injection.
  const query = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    ${search ? `WHERE name ILIKE $1` : ""}
  `;

  const queryParams = search ? [`%${search}%`] : [];

  try {
    const result = await pool.query(query, queryParams);
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return NextResponse.json({ success: true, data, query: query.trim(), params: queryParams }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error("Products API error:", error);
    // 🚨 Error leakage to support error-based SQLi learning.
    return NextResponse.json(
      { success: false, error: message, query: query.trim(), params: queryParams },
      { status: 500 }
    );
  }

}
