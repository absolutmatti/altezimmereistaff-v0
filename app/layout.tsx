import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import NavigationBar from "@/components/layout/navigation-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Alte Zimmerei - Staffmember Portal",
  description: "Portal für Mitarbeiter der Alte Zimmerei",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen pb-16">
            {children}
            <NavigationBar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

