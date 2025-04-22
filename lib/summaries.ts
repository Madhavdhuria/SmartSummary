import { getDbConnection } from "./db";

export async function getSummaries(userId: string) {
  const sql = await getDbConnection();
  console.log(Date());
  const summaries = await sql`
  SELECT id, title, created_at 
  FROM pdf_summary 
  WHERE user_id = ${userId} 
  ORDER BY created_at DESC
`;

  console.log(Date());

  return summaries;
}

export async function getSummary(id: string) {
  try {
    const sql = await getDbConnection();

    const [summary] = await sql.query(
      "SELECT * FROM pdf_summary WHERE id = $1",
      [id]
    );

    return summary;
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw new Error("Failed to fetch summary");
  }
}
