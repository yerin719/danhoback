"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ArticleWriteButton() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  return (
    <Button asChild variant="default" size="sm">
      <Link href="/articles/new">글 작성</Link>
    </Button>
  );
}