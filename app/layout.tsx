import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import NavBar from '../components/NavBar'
import NavBarMobile from '../components/NavBarMobile'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
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
  )
}