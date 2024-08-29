import './globals.css'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import NavBar from '../components/NavBar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-900 text-white">
          <NavBar />
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}