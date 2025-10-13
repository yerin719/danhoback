import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navigation from "@/components/Navigation";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./(styles)/globals.css";
import Providers from "./providers";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: {
    default: "단호박 | 단백질 쉐이크 성분 비교 및 추천",
    template: "%s | 단호박",
  },
  description:
    "똑똑한 프로틴 선택의 시작은 단호박입니다. 시중에 판매되는 모든 단백질 쉐이크의 영양성분을 객관적인 데이터로 제공하고, 핵심 요소를 비교해 드립니다. 다이어트, 근육 증가, 건강 유지 등 당신의 목표에 맞는 최적의 제품을 단호박에서 찾아보세요. 똑똑한 선택으로 당신의 건강한 라이프스타일을 완성해 드립니다.",
  keywords:
    "단백질 쉐이크, 단백질 보충제, 프로틴 파우더, 단백질 비교, 단백질 쉐이크 추천, 단백질 성분, 단백질 영양성분, 가성비 단백질, 단백질 쉐이크 순위",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={notoSansKr.variable}>
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3427802368854641"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZFTS1H98RV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZFTS1H98RV');
          `}
        </Script>

        <Providers>
          <Navigation />
          <main className="pt-16 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
