import { getFlag } from "@/utils/flagStore";
import { NextRequest } from "next/server";
import pool from "@/utils/pool";

const GET = async (req : NextRequest) => {
  const { searchParams } = new URL(req.url);
  const flag = searchParams.get("flag");
  const labid = searchParams.get("labid");
  console.log("Received flag:", flag);
  console.log("Received labid:", getFlag(labid || "no_labid"));
  if (labid === null) {
    return new Response(JSON.stringify({ success: false, error: "labid is required" }), { status: 400 });
  }
  if (flag === null) {
    return new Response(JSON.stringify({ success: false, error: "flag is required" }), { status: 400 });
  }
  if (flag === getFlag(labid)) {
    await pool.query("UPDATE progress SET STATUS = 'completed' WHERE lab_id = $1", [labid]);
    await pool.query("UPDATE progress SET STATUS = 'unlocked' WHERE lab_id = $1 AND STATUS = 'locked'", [ "lab"+(parseInt(labid.replace("lab",""))+1)]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ success: false }), { status: 200 });
  }
}

export { GET };