import React from 'react'
import Link from 'next/link'
import { Home, Shield } from 'lucide-react'
import { Header } from './components/header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <div className="container mx-auto px-4 pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <Shield className="w-24 h-24 text-blue-500 mb-8" />
        <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-xl mb-8 text-center max-w-md">
          Oops! The project you're looking for doesn't exist or has been moved. 
        </p>
        <Link
          href="/projects"
          className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
        >
          <Home className="w-5 h-5 mr-2" />
          Return to Projects
        </Link>
      </div>
    </div>
  )
}