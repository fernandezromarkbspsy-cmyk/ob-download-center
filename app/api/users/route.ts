import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * GET handler to fetch all user profiles from the database.
 * This endpoint provides the data for the UsersContext to display
 * a list of live users in the chat system.
 */
export async function GET() {
  const supabase = await createClient()

  try {
    // Fetch all employees from the employees table
    const { data: users, error } = await supabase.from("employees").select("*")

    if (error) throw error

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}