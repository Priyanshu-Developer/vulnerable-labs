import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

const POST = async (_req: NextRequest) => {
  const { username, password } = await _req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required", query: "" }, { status: 400 });
  }

  try {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log(query)
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid username or password", query }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", query }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    const errorQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    return NextResponse.json({ error: "Internal server error", query: errorQuery }, { status: 500 });
  }
};

export { POST };