import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/pool";
import { getFlag, saveFlag } from "@/utils/flagStore";

const GET = async (request: NextRequest) => {
  const searchParams = new URL(request.url).searchParams;
  const category = searchParams.get("category");
  console.log("Received category parameter:", category);


  if (!category) {
    return NextResponse.json({ error: "Category parameter is required" }, { status: 400 });
  }

  // Intentionally vulnerable for lab purposes: direct string concatenation.
  const query = `SELECT * FROM products WHERE category = '${category}'`;
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    if (err === " error: ORDER BY position 7 is not in select list"  )
    return NextResponse.json({ error: "Failed to execute query" }, { status: 500 });
  } finally {
    client.release();
  }
}

const POST = async (request: NextRequest) => {
  try {
    const { columnCount } = await request.json();
    console.log("Received columnCount:", columnCount);

    if (typeof columnCount !== "number" || columnCount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid column count" }, { status: 400 });
    }

    if (columnCount === 6) {
      const flag = saveFlag("lab4");
      console.log("Generated flag:", getFlag("lab4"));
      return NextResponse.json({ success: true, flag });
    } else {
      return NextResponse.json({ success: false, error: "Incorrect column count" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ success: false, error: "Failed to process request" }, { status: 500 });
  }
}

export { GET, POST };
