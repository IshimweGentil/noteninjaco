import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import NavBar from '../components/NavBar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-900 text-white min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}