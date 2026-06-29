import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sandbox.ceo'),
  title: {
    default: 'Sandbox Group | 香港企業合規與牌照申請專家',
    template: '%s | Sandbox Group',
  },
  description: 'Sandbox Group 為企業提供 MSO 牌照申請、SFC 牌照、AML 合規、公司秘書及合規科技方案。由前金融機構合規主管領導，助您高效取牌、持續合規。',
  keywords: ['MSO牌照', 'SFC牌照', 'AML合規', '公司合規', '香港牌照申請', '合規顧問', 'Sandbox Group', 'MSO licensing', 'SFC licensing', 'Hong Kong compliance'],
  authors: [{ name: 'Sandbox Group' }],
  creator: 'Sandbox Group',
  publisher: 'Sandbox Group',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_HK',
    alternateLocale: ['en_HK', 'zh_CN'],
    siteName: 'Sandbox Group',
    title: 'Sandbox Group | 香港企業合規與牌照申請專家',
    description: 'Sandbox Group 為企業提供 MSO 牌照申請、SFC 牌照、AML 合規、公司秘書及合規科技方案。由前金融機構合規主管領導。',
    url: 'https://www.sandbox.ceo',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Sandbox Group — 香港合規與牌照申請專家' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sandbox Group | 香港企業合規與牌照申請專家',
    description: 'Sandbox Group 為企業提供 MSO 牌照申請、SFC 牌照、AML 合規及公司秘書服務。',
    images: ['/opengraph-image'],
  },
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
