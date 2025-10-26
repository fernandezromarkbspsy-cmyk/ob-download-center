import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Handle errors silently
          }
        },
      },
    },
  )

  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "1000")
    const offset = (page - 1) * limit

    const receiverType = searchParams.get("receiver_type")
    const journeyType = searchParams.get("journey_type")
    const receiveStatus = searchParams.get("receive_status")

    let query = supabase.from("consolidated_data").select("*", { count: "exact" })

    if (receiverType) {
      query = query.eq("receiver_type", receiverType)
    }
    if (journeyType) {
      query = query.eq("journey_type", journeyType)
    }
    if (receiveStatus) {
      query = query.eq("receive_status", receiveStatus)
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
