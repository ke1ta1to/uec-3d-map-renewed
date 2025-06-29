import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UEC 3D キャンパスマップ | 電気通信大学バーチャルキャンパス",
  description:
    "電気通信大学の3Dキャンパスマップで、バーチャルにキャンパスを探索できます。最新のWeb技術を使用したインタラクティブな3Dマップで、建物の配置や施設の位置を直感的に確認できます。",
  keywords:
    "電気通信大学, UEC, 3Dマップ, キャンパスマップ, バーチャルキャンパス, 3D, WebGL, React",
  authors: [{ name: "UEC 3D Map Team" }],
  creator: "UEC 3D Map",
  publisher: "UEC 3D Map",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://uec-3d-map.vercel.app"), // 実際のデプロイURLに変更
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "UEC 3D キャンパスマップ | 電気通信大学バーチャルキャンパス",
    description:
      "電気通信大学の3Dキャンパスマップで、バーチャルにキャンパスを探索できます。最新のWeb技術を使用したインタラクティブな3Dマップ。",
    url: "https://uec-3d-map.vercel.app",
    siteName: "UEC 3D キャンパスマップ",
    images: [
      {
        url: "/og-image.jpg", // 【要準備】OGP画像（1200x630px）
        width: 1200,
        height: 630,
        alt: "UEC 3D キャンパスマップのスクリーンショット",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UEC 3D キャンパスマップ",
    description:
      "電気通信大学の3Dキャンパスマップで、バーチャルにキャンパスを探索",
    images: ["/twitter-image.jpg"], // 【要準備】Twitter画像（1200x600px）
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: 'google-site-verification-code', // 【要準備】Google Search Console認証コード
    // bing: 'bing-verification-code', // 【要準備】Bing Webmaster認証コード
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "UEC 3D キャンパスマップ",
              description:
                "電気通信大学の3Dキャンパスマップで、バーチャルにキャンパスを探索できます。",
              url: "https://uec-3d-map.vercel.app",
              applicationCategory: "EducationApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "JPY",
              },
              creator: {
                "@type": "Organization",
                name: "UEC 3D Map Team",
              },
              about: {
                "@type": "EducationalOrganization",
                name: "電気通信大学",
                alternateName: "University of Electro-Communications",
                url: "https://www.uec.ac.jp/",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "調布ヶ丘1-5-1",
                  addressLocality: "調布市",
                  addressRegion: "東京都",
                  postalCode: "182-8585",
                  addressCountry: "JP",
                },
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
