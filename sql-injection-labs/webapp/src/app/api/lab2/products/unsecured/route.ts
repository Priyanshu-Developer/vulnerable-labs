import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search")?.trim() || "";

    // ❌ INTENTIONALLY VULNERABLE: direct string interpolation enables SQL injection.
    const whereClause = search ? `WHERE name ILIKE '%${search}%'` : "";


    const query = `
      SELECT id, name, price, description, image_url, category::text AS category
      FROM products
      ${whereClause}
    `;

    const result = await pool.query(query);
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error("Products API error:", error);
    // 🚨 Error leakage to support error-based SQLi learning.
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
