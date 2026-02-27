import { generateRandomFlag } from "@/utils/flagStore";
import pool from "@/utils/pool";
import { generateSessionId } from "@/utils/sessions";
import { NextRequest, NextResponse } from "next/server";

// Lab 10: Blind SQLi in HTTP Headers (User-Agent, Referer, custom headers)

export async function POST() {
  try {
    const flag = generateRandomFlag("lab10");
    await pool.query("delete from Flags");
    await pool.query(`insert into Flags (flag) values ('${flag}')`);
    await pool.query("delete from sessions");

    const sessionId = generateSessionId();
    await pool.query(`insert into sessions (cookie) values ('${sessionId}')`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lab 10 setup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize lab." },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  const customHeader = req.headers.get("x-lab-probe") || "";

  try {
    const headerPayloads = [userAgent, referer, customHeader].filter(Boolean);
    if (headerPayloads.length === 0) {
      return NextResponse.json({
        status: "processed",
        message: "Request completed",
      });
    }

    let authorized = false;
    for (const headerPayload of headerPayloads) {
      const query = `SELECT * FROM sessions WHERE cookie='${headerPayload}';`;
      const result = await pool.query(query);
      if (result.rows.length > 0) {
        authorized = true;
        break;
      }
    }

    if (!authorized) {
      return NextResponse.json({
        status: "processed",
        message: "Request completed",
      });
    }

    const product = await pool.query("SELECT * FROM products WHERE id=$1;", [id]);
    return NextResponse.json({
      status: "processed",
      message: "Request completed",
      product: product.rows[0],
    });
  } catch (error) {
    console.error("Lab 10 query error:", error);
    return NextResponse.json({
      status: "processed",
      message: "Request completed",
    });
  }
}
