import type React from "react"
import Link from "next/link"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/sonner"
import { LogoutButton } from "@/components/logout-button"
import { UserSettingsButton } from "@/components/user-settings-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Research Team Portal",
  description: "Secure portal for research team collaboration",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <header className="container mx-auto p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                  <Link href="/">Research Team Portal</Link>
                </h1>
                <div className="flex items-center space-x-2">
                  <UserSettingsButton />
                  <LogoutButton />
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-grow">{children}</main>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

