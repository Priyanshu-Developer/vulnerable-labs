import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  const idInput = request.nextUrl.searchParams.get("id")?.trim() || "1";
  const id = Number(idInput);

  const query = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    WHERE id = $1
  `;

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ success: false, error: "id must be a positive integer", query, params: [id] }, { status: 400 });
  }

  try {
    const result = await pool.query(query, [id]);
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    return NextResponse.json({ success: true, data, query, params: [id] }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    return NextResponse.json({ success: false, error: message, query, params: [id] }, { status: 500 });
  }
}
