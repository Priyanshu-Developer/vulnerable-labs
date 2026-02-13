import { NextResponse,NextRequest } from "next/server";
import pool from "@/lib/db";


const POST = async (request: NextRequest) => {
  const formData = await request.json();
  const labId = formData.lab_name as string; // ex: lab1
  console.log("Received lab completion request for:", labId);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Mark current lab as completed
    await client.query(
      `UPDATE progress 
       SET status = 'completed' 
       WHERE lab_name = $1`,
      [labId]
    );

    // 2️⃣ Extract lab number
    const currentLabNumber = parseInt(labId.replace("lab", ""));
    if (currentLabNumber >= 32) {
      await client.query("COMMIT");
      return new Response(`All labs completed!`);
    }
    const nextLab = `lab${currentLabNumber + 1}`;

    // 3️⃣ Unlock next lab
    await client.query(
      `UPDATE progress 
       SET status = 'uncomplete'
       WHERE lab_name = $1
       AND status = 'locked'`,
      [nextLab]
    );

    await client.query("COMMIT");

    return new Response(`Progress updated & next lab unlocked`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const GET = async () => {


  const sql = `SELECT * FROM progress WHERE status IN ('uncomplete')`;
  try {
    const result = await pool.query(sql);
    console.log("Unlocked labs:", result.rows[0].lab_name);
    return NextResponse.json({ unlockedLab:result.rows[0].lab_name }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

};



export { POST, GET };
