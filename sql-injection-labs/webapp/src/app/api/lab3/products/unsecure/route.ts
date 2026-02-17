import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search")?.trim() || "";

  // Intentionally vulnerable for Lab 3 (UNION-based SQLi demo): user input is interpolated.
  const whereClause = search ? `WHERE name ILIKE '%${search}%'` : "";
  const query = `
    SELECT id, name, price, description, image_url, category::text AS category
    FROM products
    ${whereClause}
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
    console.error("Lab3 unsecure products API error:", error);
    return NextResponse.json({ success: false, error: message, query }, { status: 500 });
  }
}
