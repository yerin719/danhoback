import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// 브라우저 클라이언트 (클라이언트 컴포넌트용)
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// 기존 코드와의 호환성을 위한 default export
const client = createClient();
export default client;