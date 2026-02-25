import { NextRequest ,NextResponse} from "next/server";
import { pool } from "@/utils/pool";
import { saveFlag } from "@/utils/flagStore";

const POST = async (req: NextRequest) => {
  const { username, password } = await req.json();
  try {
    const res = await pool.query(`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`);
    if (res.rows.length > 0) {
      const flag = saveFlag("lab1");
      return NextResponse.json({ flag });
    } else {
      return NextResponse.json({ flag: null });
    }
  } catch (error) {
    return NextResponse.json({ flag: null });
  }
}

export { POST };
