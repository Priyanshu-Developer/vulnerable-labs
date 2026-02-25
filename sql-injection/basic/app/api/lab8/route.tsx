// app/api/lab2/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/pool";
import { generateRandomFlag } from "@/utils/flagStore";

export async function POST() {
  try {
    const flag = generateRandomFlag("lab8");
    await pool.query(' delete from Flags')
    await pool.query(` insert into Flags (flag) values ('${flag}') `)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lab 8 setup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize lab." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  const query = `
    SELECT * FROM products
    WHERE id = ${id};
  `;
  

  try {
    await pool.query(query);
    console.log("Query executed:", query);
    // IMPORTANT: Always same response
    return NextResponse.json({
      status: "processed",
      message: "Product request completed"
    });

  } catch (err) {
    console.error("Database query error:", err);
    return NextResponse.json({
      status: "processed",
      message: "Product request completed"
    });
  }
}