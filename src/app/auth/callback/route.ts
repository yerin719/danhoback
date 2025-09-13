import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectedFrom = requestUrl.searchParams.get("redirectedFrom");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // redirectedFrom이 있으면 해당 페이지로, 없으면 홈페이지로 리디렉션
  const targetUrl = redirectedFrom && redirectedFrom.startsWith('/') ? redirectedFrom : '/';
  return NextResponse.redirect(`${origin}${targetUrl}`);
}