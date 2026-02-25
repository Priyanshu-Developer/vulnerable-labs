import { NextRequest,NextResponse } from "next/server";
import pool from "@/utils/pool";
import { generateRandomFlag } from "@/utils/flagStore";


const POST = async () => {
  try {
    const flag = generateRandomFlag("lab7");
    await pool.query(' delete from Flags')
    await pool.query(` insert into Flags (flag) values ('${flag}') `)
    return NextResponse.json({ success: true, flag });
  } catch (error) {
    console.error("Lab 7 setup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize lab." },
      { status: 500 },
    );
  }
}

const GET = async (request: NextRequest) => {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing productId parameter" }, { status: 400 });
  }

  try {
    const result = await pool.query(`SELECT * FROM products WHERE id = ${productId}`);
    const [product] = result.rows;
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export { GET, POST };