import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sandbox Group | 香港企業合規與牌照申請專家",
  description: "Sandbox Group 為企業提供 MSO 牌照申請、SFC 牌照、AML 合規、公司秘書及合規科技方案。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Noto+Sans+TC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
