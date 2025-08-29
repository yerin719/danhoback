import MobileBottomNav from "@/components/MobileBottomNav";
import Navigation from "@/components/Navigation";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import Providers from "./providers";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "단호박",
  description: "단백질 정보 커뮤니티",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Navigation />
          <main className="pb-16 md:pb-0">{children}</main>
          <MobileBottomNav />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
