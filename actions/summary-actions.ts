"use server";

import { getDbConnection } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deleteSummary = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return redirect("/sign-in");
    }
    const userId = user?.id;
    const sql = await getDbConnection();
    const result =
      await sql`DELETE FROM pdf_summary WHERE id=${id} and user_id=${userId} returning id`;
    if (result.length > 0) {
      revalidatePath("/dashboard");
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  } catch (error) {
    console.error("Error deleting summary:", error);
    return {
      success: false,
    };
  }
};
