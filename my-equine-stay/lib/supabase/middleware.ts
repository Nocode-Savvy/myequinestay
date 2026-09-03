import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    // Refresh session — IMPORTANT: do not remove this line
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Admin-only routes (strictly checked first)
    if (pathname.startsWith("/admin")) {
      if (!user) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/auth";
        redirectUrl.searchParams.set("mode", "signin");
        redirectUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(redirectUrl);
      }

      let userIsAdmin = false;
      try {
        const { data: profile } = (await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()) as any;
        if (profile?.role === "admin") {
          userIsAdmin = true;
        }
      } catch {
        userIsAdmin = false;
      }

      if (!userIsAdmin) {
        const redirectUrl = new URL("/dashboard", request.url);
        redirectUrl.searchParams.set("unauthorized", "admin");
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Protected routes — require auth
    const protectedRoutes = [
      "/dashboard",
      "/listings/new",
      "/favorites",
    ];
    const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

    if (isProtected && !user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/auth";
      redirectUrl.searchParams.set("mode", "signin");
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect logged-in users away from auth pages
    if (user && (pathname === "/login" || pathname === "/signup" || pathname === "/auth")) {
      // Only redirect away from /auth if not deliberately signing out
      if (!request.nextUrl.searchParams.has("signout")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  } catch {
    // Graceful continuation during prerender or missing credentials
  }

  return supabaseResponse;
}
