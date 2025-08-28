'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    // Store scroll position before navigation
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString())
    }

    // Restore scroll position after navigation
    const restoreScroll = () => {
      const savedPosition = sessionStorage.getItem(`scroll-${pathname}`)
      if (savedPosition) {
        // Delay restoration to ensure content is loaded
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition, 10))
        }, 100)
      }
    }

    // Save scroll position on page unload
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Restore scroll position when component mounts
    restoreScroll()

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname])

  useEffect(() => {
    // Prevent scroll restoration on back button if user is at top
    const handlePopState = () => {
      if (window.scrollY === 0) {
        // User is at top, don't restore scroll
        sessionStorage.removeItem(`scroll-${pathname}`)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [pathname])

  return null
}
