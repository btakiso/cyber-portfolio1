'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      // Use a more stable scroll position check instead of getBoundingClientRect
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Show button when user has scrolled down at least 300px from top
      // This prevents the button from appearing/disappearing at the very bottom
      const shouldShow = scrollTop > 300
      setShowScrollTop(shouldShow)
    }

    // Debounce the scroll event for better performance
    let timeoutId: NodeJS.Timeout | null = null
    const debouncedHandleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        handleScroll()
      }, 10) // 10ms debounce
    }

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const scrollToTop = () => {
    // Use a more reliable scroll method that works across browsers
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Fallback for older browsers
      window.scrollTo(0, 0)
    }
  }

  return (
    <footer ref={footerRef} className="bg-gray-900 text-gray-300 py-12 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-blue-500 mb-4">Bereket Takiso</h3>
            <p className="text-gray-400">Securing the digital frontier, one line of code at a time.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Quick Links</h4>
            <ul className="space-y-2">
              {['projects', 'blog', 'about'].map((link) => (
                <li key={link}>
                  <Link href={`/${link}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                    {link.charAt(0).toUpperCase() + link.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-4 text-gray-100">Connect</h4>
            <div className="flex space-x-4">
              {[ 
                { href: "https://github.com/btakiso", icon: Github, label: "GitHub" },
                { href: "https://www.linkedin.com/in/bereket-takiso/", icon: Linkedin, label: "LinkedIn" },
                { href: "mailto:berekettakiso@gmail.com", icon: Mail, label: "Email" }
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Icon className="w-6 h-6" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Bereket Takiso. All rights reserved.</p>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 text-blue-500 hover:text-blue-400 p-3 rounded-full transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 border-2 border-blue-500 hover:border-blue-400"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </footer>
  )
}