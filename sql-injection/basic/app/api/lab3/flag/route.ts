import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/pool";
import { generateRandomFlag } from "@/utils/flagStore";


const POST = async () => {
  const flag = generateRandomFlag("lab3");
  const client = await pool.connect();
  try {
    await client.query("INSERT INTO flags (flag) VALUES ($1) ON CONFLICT (flag) DO NOTHING", [flag]);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error saving flag:", err);
    return NextResponse.json({ error: "Failed to save flag" }, { status: 500 });
  } finally {
    client.release();
  }
};

const GET = async (request: NextRequest) => {
  const searchParams = new URL(request.url).searchParams;
  const flag = searchParams.get("flag");
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT flag FROM flags ORDER BY id DESC LIMIT 1");
    if (result.rows.length > 0) {
      if (result.rows[0].flag === flag) {
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Invalid flag" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Flag not found" }, { status: 404 });
    }
  } catch (err) {
    console.error("Error retrieving flag:", err);
    return NextResponse.json({ error: "Failed to retrieve flag" }, { status: 500 });
  } finally {
    client.release();
  }
};

export { POST, GET };
