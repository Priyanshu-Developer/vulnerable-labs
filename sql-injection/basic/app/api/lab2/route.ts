import { NextResponse, NextRequest } from 'next/server'
import pool from '@/utils/pool'
import { getFlag, saveFlag } from '@/utils/flagStore'

const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const res = await pool.query(`SELECT * FROM products WHERE id = ${id}`);
    if (res.rows.length > 0) {
      console.log(res.rows[0]);
      return NextResponse.json({ product: res.rows[0] });
    } else {
      return NextResponse.json({ product: null });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(errorMessage);
    const flag = saveFlag("lab2");
    return NextResponse.json({ error: errorMessage, flag });
  }
}

export { GET };