import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const probe = request.nextUrl.searchParams.get("probe")?.trim() || "";

  const query = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    WHERE name ILIKE $1
  `;

  try {
    const result = await pool.query(query, [`%${probe}%`]);
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return NextResponse.json({ success: true, data, query, params: [`%${probe}%`] }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json({ success: false, error: message, query, params: [`%${probe}%`] }, { status: 500 });
  }
}
