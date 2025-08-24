// app/page.tsx
import ClientBadge from "@/components/ClientBadge";
import { Button } from "@/components/ui/button";

async function getServerMessage() {
  return { message: "서버 렌더 텍스트 OK" };
}

export default async function Home() {
  const data = await getServerMessage();

  return (
    <main className="mx-auto max-w-xl p-8 space-y-6">
      <section>
        <h1 className="text-2xl font-semibold">안녕 단호박</h1>
        <p className="text-sm text-gray-600">{data.message}</p>
      </section>

      <section className="flex items-center gap-3">
        <Button>shadcn 버튼</Button>
        <ClientBadge />
      </section>
    </main>
  );
}
