import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "../components/NavBar";
import NavBarMobile from "../components/NavBarMobile";
import Script from "next/script";

export const metadata: Metadata = {
  title: "NoteNinjaCo",
  description: "Streamline Your Studying Process",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "NoteNinjaCo",
    description: "Streamline Your Studying Process",
    url: "https://www.noteninja.co", // Replace with your actual URL
    siteName: "NoteNinjaCo",
    images: [
      {
        url: "/noteninhero.png", // Local path to your image
        width: 1200,
        height: 630,
        alt: "NoteNinjaCo - Streamline Your Studying Process",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteNinjaCo",
    description: "Streamline Your Studying Process",
    images: ["/noteninhero.png"], // Local path to your image
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Google tag (gtag.js) */}
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-3NLRJP26R0"></Script>
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-3NLRJP26R0');
            `}
            <link rel="icon" href="/logo.ico" />
          </Script>
        </head>
        <body className="bg-slate-950 text-white min-h-screen flex flex-col">
          <div className="flex">
            <main className="flex-1">
              <NavBar />
              <NavBarMobile />
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}