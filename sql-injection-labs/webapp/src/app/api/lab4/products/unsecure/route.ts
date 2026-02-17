import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category")?.trim() || "electronics";
  const sort = request.nextUrl.searchParams.get("sort")?.trim() || "id";

  // Intentionally vulnerable: both category and ORDER BY are interpolated.
  const query = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    WHERE category::text = '${category}'
    ORDER BY ${sort}
  `;

  try {
    const result = await pool.query(query);
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return NextResponse.json({ success: true, data, query }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error("Lab4 unsecure products API error:", error);
    return NextResponse.json({ success: false, error: message, query }, { status: 500 });
  }
}
