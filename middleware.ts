import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and public routes
  if (pathname === "/login" || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Check if user is logged in (this is a simple check, in production you'd use more secure methods)
  // For now, we'll allow all routes and let the client-side handle redirects
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
