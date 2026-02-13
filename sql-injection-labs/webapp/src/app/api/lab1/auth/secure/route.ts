import  pool  from "@/lib/db";  

const POST = async (request: Request) => {
  const { username, password } = await request.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Username and password are required" }), { status: 400 });
  }

  try {
    const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;
    const values = [username, password];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

export { POST };