'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Network, Book, User, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/', icon: Shield, label: 'Home' },
  { href: '/projects', icon: Network, label: 'Projects' },
  { href: '/blog', icon: Book, label: 'Blog' },
  { href: '/about', icon: User, label: 'About' },
  { href: '/contact', icon: User, label: 'Contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition-colors">
          <Shield className="inline-block mr-2" />
          Bereket Takiso
        </Link>
        <div className="hidden md:flex space-x-6">
          {navItems.map(({ href, icon: Icon, label }) => (
            <NavLink key={href} href={href} icon={Icon} label={label} isActive={pathname === href} />
          ))}
        </div>
        <button
          className="md:hidden text-gray-300 hover:text-blue-400 transition-colors z-50"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900/95 z-40 flex items-center justify-center" ref={menuRef}>
          <div className="w-full max-w-sm">
            <nav className="flex flex-col space-y-6">
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link 
                  key={href}
                  href={href}
                  className="flex items-center space-x-4 text-2xl font-medium text-white hover:text-blue-400 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={28} />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </nav>
  )
}

interface NavLinkProps {
  href: string
  icon: React.ElementType
  label: string
  isActive: boolean
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, label, isActive }) => (
  <Link
    href={href}
    className={`flex items-center text-gray-300 hover:text-blue-400 transition-colors relative group ${
      isActive ? 'text-blue-400' : ''
    }`}
  >
    <Icon className="w-5 h-5 mr-1" />
    {label}
    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
  </Link>
)