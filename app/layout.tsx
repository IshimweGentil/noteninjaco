import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "../components/NavBar";
import NavBarMobile from "../components/NavBarMobile";
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script"

// export const metadata: Metadata = {
//   title: "Note Ninja",
//   description: "Study using AI",
//   icons: {
//     icon: "./favicon.ico",
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-3NLRJP26R0"></Script>
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-3NLRJP26R0');
            `}
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
