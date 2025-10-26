import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * GET handler to fetch all user profiles from the database.
 * This endpoint provides the data for the UsersContext to display
 * a list of live users in the chat system.
 */
export async function GET() {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // It's good practice to check for an active session,
    // ensuring only authenticated users can fetch the user list.
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Fetch all profiles. The 'user_profiles' table is a common convention
    // for storing public user data alongside Supabase's 'auth.users' table.
    const { data: users, error } = await supabase.from("user_profiles").select("*")

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