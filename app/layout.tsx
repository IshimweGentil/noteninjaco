import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "../components/NavBar";
import NavBarMobile from "../components/NavBarMobile";
import Footer from "../components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-900 text-white min-h-screen flex flex-col overflow-x-hidden">
          <div className="flex flex-col">
            <main className="flex-1 overflow-auto">
              <NavBar />
              <NavBarMobile />
              {children}
              <Footer />
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
