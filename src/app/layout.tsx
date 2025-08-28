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
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
