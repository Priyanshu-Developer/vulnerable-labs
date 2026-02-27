import { generateRandomFlag } from "@/utils/flagStore"
import pool from "@/utils/pool";
import { generateSessionId } from "@/utils/sessions";
import { NextRequest, NextResponse } from "next/server";

//  Lab 9: Blind SQL Injection via Cookies

export async function POST() {
  try {
    const flag = generateRandomFlag("lab9");
    await pool.query(' delete from Flags')
    await pool.query(` insert into Flags (flag) values ('${flag}') `)
    await pool.query("delete from sessions");
    const sessions = generateSessionId();
    await pool.query(` insert into sessions (cookie) values ('${sessions}') `)

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "session",
      value: sessions,
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "strict",
    });
    return response;
  } catch (error) {
    console.error("Lab 9 setup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize lab." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const cookie = req.cookies.get("session")?.value || "";
  try {
    const query = ` SELECT * FROM sessions where cookie='${cookie}';`
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return NextResponse.json({
        status: "processed",
        message: "Product request completed"
      });
    }
    const product = await pool.query(` SELECT * FROM products where id=$1;`, [id]);
    return NextResponse.json({
      status: "processed",
      message: "Product request completed",
      product: product.rows[0]

    });
  } catch (err) {
    console.error("Database query error:", err);
    return NextResponse.json({
      status: "processed",
      message: "Product request completed"
    });
  }
}
