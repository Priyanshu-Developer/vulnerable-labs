import { NextRequest, NextResponse } from "next/server";
import { saveFlag } from "@/utils/flagStore";
import pool from "@/utils/pool";

type LabMode = "string" | "numeric";

const POST = async () => {
  try {
    const flag = saveFlag("lab6");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lab6_users (
        id INT PRIMARY KEY,
        username VARCHAR(80) NOT NULL,
        role VARCHAR(40) NOT NULL
      )
    `);

    await pool.query(`
      INSERT INTO lab6_users (id, username, role)
      VALUES
        (1, 'alice', 'student'),
        (2, 'bob', 'auditor'),
        (3, 'charlie', 'analyst')
      ON CONFLICT (id) DO UPDATE
      SET username = EXCLUDED.username, role = EXCLUDED.role
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lab6_secrets (
        id INT PRIMARY KEY,
        flag VARCHAR(255) NOT NULL
      )
    `);

    await pool.query(
      `
      INSERT INTO lab6_secrets (id, flag)
      VALUES (1, $1)
      ON CONFLICT (id)
      DO UPDATE SET flag = EXCLUDED.flag
      `,
      [flag],
    );

    return NextResponse.json({
      success: true,
      message: "Lab 6 initialized.",
    });
  } catch (error) {
    console.error("Lab 6 setup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize lab." },
      { status: 500 },
    );
  }
};

const GET = async (request: NextRequest) => {
  const searchParams = new URL(request.url).searchParams;
  const mode = (searchParams.get("mode") || "string") as LabMode;
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json(
      { error: "Input parameter is required.", rows: [] },
      { status: 400 },
    );
  }

  if (mode !== "string" && mode !== "numeric") {
    return NextResponse.json(
      { error: "mode must be either string or numeric.", rows: [] },
      { status: 400 },
    );
  }

  const query =
    mode === "string"
      ? `SELECT id, username, role FROM lab6_users WHERE username = '${input}'`
      : `SELECT id, username, role FROM lab6_users WHERE id = ${input}`;

  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return NextResponse.json({
      rows: result.rows,
      mode,
      query,
      message:
        result.rows.length > 0
          ? `Query executed in ${mode} context.`
          : `No rows returned in ${mode} context.`,
    });
  } catch (error: unknown) {
    console.error("Lab 6 query error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to execute query.";
    return NextResponse.json(
      { error: errorMessage, rows: [], mode, query },
      { status: 500 },
    );
  } finally {
    client.release();
  }
};

export { GET, POST };
