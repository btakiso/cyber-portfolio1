import React from 'react'
import { Header } from './components/header'
import { Footer } from './components/footer'
import './globals.css'  // Updated import path

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
