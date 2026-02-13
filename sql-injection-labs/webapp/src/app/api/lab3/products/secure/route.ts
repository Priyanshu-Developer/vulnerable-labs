import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search")?.trim() || "";

  const query = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    ${search ? "WHERE name ILIKE $1" : ""}
  `;
  const params = search ? [`%${search}%`] : [];

  try {
    const result = await pool.query(query, params);
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error("Lab3 secure products API error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
