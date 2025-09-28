import { createServerClient } from "@supabase/ssr";
import type { Database } from "database.types";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequiredPage } from "./lib/auth";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 세션 갱신
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호된 라우트 정의
  const protectedPaths = ["/profile", "/favorites", "/community/write"];

  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  const isAdminPath = isAdminRequiredPage(request.nextUrl.pathname);

  // 로그인 페이지 접근 제어
  if (request.nextUrl.pathname.startsWith("/auth/login") && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 보호된 라우트 접근 제어
  if (isProtectedPath && !user) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 관리자 페이지 접근 제어
  if (isAdminPath) {
    // 로그인하지 않은 경우
    if (!user) {
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 사용자 정보 조회하여 role 확인
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // admin role이 아닌 경우 접근 거부
    if (!userProfile || userProfile.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
