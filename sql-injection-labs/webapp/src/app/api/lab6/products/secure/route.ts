import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category")?.trim() || "electronics";
  const maxPriceInput = request.nextUrl.searchParams.get("maxPrice")?.trim() || "50";
  const maxPrice = Number(maxPriceInput);

  const query = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    WHERE category::text = $1
      AND price <= $2
  `;

  if (Number.isNaN(maxPrice)) {
    return NextResponse.json({ success: false, error: "maxPrice must be numeric", query, params: [category, maxPrice] }, { status: 400 });
  }

  try {
    const result = await pool.query(query, [category, maxPrice]);
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return NextResponse.json({ success: true, data, query, params: [category, maxPrice] }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json({ success: false, error: message, query, params: [category, maxPrice] }, { status: 500 });
  }
}
