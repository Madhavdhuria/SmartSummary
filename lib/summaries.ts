import { getDbConnection } from "./db";

export async function getSummaries(userId:string) {
    const sql=await getDbConnection();
    const summaries=await sql`SELECT * FROM pdf_summary WHERE user_id=${userId} order by created_at desc`;
    return summaries;
}