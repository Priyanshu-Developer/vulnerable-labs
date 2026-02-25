import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/pool";

const GET = async (request: NextRequest) => {
  const searchParams = new URL(request.url).searchParams;
  const category = searchParams.get("category");
  console.log("Received category parameter:", category);

  if (!category) {
    return NextResponse.json({ error: "Category parameter is required" }, { status: 400 });
  }

  // Intentionally vulnerable for lab purposes: direct string concatenation.
  const query = `SELECT id,name,price FROM products WHERE category = '${category}'`;
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    return NextResponse.json({ error: "Failed to execute query" }, { status: 500 });
  } finally {
    client.release();
  }
}

export { GET };
