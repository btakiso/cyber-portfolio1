'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Shield, Lock, Key, Wifi, Server, Database, ArrowRight } from 'lucide-react'

const floatingIcons = [
  { Icon: Shield, top: '10%', left: '10%', size: 12, opacity: 60, color: 'blue-500' },
  { Icon: Lock, top: '70%', right: '15%', size: 16, opacity: 40, color: 'blue-600' },
  { Icon: Key, top: '30%', right: '10%', size: 10, opacity: 50, color: 'blue-400' },
  { Icon: Wifi, top: '20%', left: '30%', size: 14, opacity: 45, color: 'blue-500' },
  { Icon: Server, top: '60%', left: '20%', size: 16, opacity: 55, color: 'blue-400' },
  { Icon: Database, top: '40%', right: '30%', size: 11, opacity: 50, color: 'blue-500' },
]

export function HeroSection() {
  const [text, setText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const fullText = 'Securing the Digital World'

  const typeText = useCallback(() => {
    let index = 0
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(intervalId)
        setTimeout(() => setShowCursor(false), 1400)
      }
    }, 70)

    return () => clearInterval(intervalId)
  }, [fullText])

  useEffect(() => {
    typeText()
  }, [typeText])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700/20 via-gray-800/40 to-gray-900/80" />
      
      {/* Floating cybersecurity icons */}
      <div className="absolute inset-0">
        {floatingIcons.map(({ Icon, top, left, right, size, opacity, color }, index) => (
          <div key={index} className="floating-icon" style={{ top, left, right }}>
            <Icon className={`w-${size} h-${size} text-${color} opacity-${opacity}`} />
          </div>
        ))}
      </div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-blue-300 min-h-[1.2em]">
          {text}
          {showCursor && <span className="animate-blink">|</span>}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          Cybersecurity enthusiast
        </p>
        <Link
          href="/projects"
          className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 inline-flex items-center group"
        >
          View Projects
          <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      <style jsx>{`
        .floating-icon {
          position: absolute;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .floating-icon:nth-child(2n) { animation-duration: 8s; }
        .floating-icon:nth-child(3n) { animation-duration: 10s; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-blink { animation: blink 0.7s infinite; }
      `}</style>
    </section>
  )
}