// components/ClientBadge.tsx
"use client";

import { useQuery } from "@tanstack/react-query";

export default function ClientBadge() {
  const { data } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { message: "React Query 클라 데이터 OK" };
    },
    staleTime: 60_000,
  });

  return <span className="rounded-md border px-3 py-2 text-sm">{data?.message ?? "로딩중"}</span>;
}
