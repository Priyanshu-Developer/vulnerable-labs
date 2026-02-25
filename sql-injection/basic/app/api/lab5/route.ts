import { generateRandomFlag } from "@/utils/flagStore"
import pool from "@/utils/pool"


const POST = async (req: Request) => {
  try {
    const flag = generateRandomFlag("lab5")
      await pool.query(`
      CREATE TABLE IF NOT EXISTS magic (
        id INT PRIMARY KEY,
        flag VARCHAR(255),
        dummy INT
      )
    `);

    await pool.query(`
      INSERT INTO magic (id, flag, dummy)
      VALUES (1, $1, 0)
      ON CONFLICT (id)
      DO UPDATE SET flag = EXCLUDED.flag
    `, [flag]);
    return new Response(JSON.stringify({message : "Magic table created and flag set."}), { status: 200 });
  } catch (error) {
    console.error("Error setting up magic table:", error);
    return new Response(JSON.stringify({ error: "Database setup failed." }), { status: 500 });
  }
}
export { POST };