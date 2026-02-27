import { generateRandomFlag } from "@/utils/flagStore";
import pool from "@/utils/pool";
import { NextRequest, NextResponse } from "next/server";

// Lab 11: Conditional Error SQLi

export async function POST() {
  try {
    const flag = generateRandomFlag("lab11");
    await pool.query("delete from Flags");
    await pool.query(`insert into Flags (flag) values ('${flag}')`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lab 11 setup error:", error);
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
    return NextResponse.json({
      status: "processed",
      message: "Request completed",
    });
  } catch (error) {
    console.error("Lab 11 query error:", error);
    return NextResponse.json(
      {
        status: "processed",
        message: "Request completed",
      },
      { status: 500 },
    );
  }
}
