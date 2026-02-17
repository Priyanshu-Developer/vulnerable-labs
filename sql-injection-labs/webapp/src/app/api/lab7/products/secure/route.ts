import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";

  const whereClause = q ? "WHERE name ILIKE $1 OR description ILIKE $1 OR category::text ILIKE $1" : "";
  const params = q ? [`%${q}%`] : [];

  const query = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    ${whereClause}
    ORDER BY id
  `;

  try {
    const result = await pool.query(query, params);
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return NextResponse.json({ success: true, data, query, params }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json({ success: false, error: message, query, params }, { status: 500 });
  }
}
