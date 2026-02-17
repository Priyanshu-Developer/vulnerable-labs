import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const allowedSortFields = new Set(["id", "name", "price"]);

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category")?.trim() || "electronics";
  const sort = request.nextUrl.searchParams.get("sort")?.trim() || "id";
  const safeSort = allowedSortFields.has(sort) ? sort : "id";

  const query = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    WHERE category::text = $1
    ORDER BY ${safeSort}
  `;

  try {
    const result = await pool.query(query, [category]);
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return NextResponse.json({ success: true, data, query, params: [category] }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error("Lab4 secure products API error:", error);
    return NextResponse.json({ success: false, error: message, query, params: [category] }, { status: 500 });
  }
}
