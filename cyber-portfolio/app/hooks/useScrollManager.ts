'use client'

import { useState, useEffect, useCallback } from 'react'

interface ScrollState {
  isScrolled: boolean
  showScrollTop: boolean
  scrollY: number
}

export function useScrollManager() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolled: false,
    showScrollTop: false,
    scrollY: 0
  })

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    setScrollState({
      isScrolled: scrollTop > 50,
      showScrollTop: scrollTop > 300,
      scrollY: scrollTop
    })
  }, [])

  useEffect(() => {
    // Single scroll listener with better performance
    let ticking = false
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    // Add passive listener for better performance
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true })
    
    // Initial call
    handleScroll()

    return () => {
      window.removeEventListener('scroll', optimizedScrollHandler)
    }
  }, [handleScroll])

  const scrollToTop = useCallback(() => {
    // Prevent multiple rapid calls
    if (scrollState.scrollY < 100) return
    
    // Use a more stable scroll method
    const startPos = window.pageYOffset
    const duration = 500
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease-out function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentPos = startPos * (1 - easeOut)
      
      window.scrollTo(0, currentPos)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    
    requestAnimationFrame(animateScroll)
  }, [scrollState.scrollY])

  return {
    isScrolled: scrollState.isScrolled,
    showScrollTop: scrollState.showScrollTop,
    scrollY: scrollState.scrollY,
    scrollToTop
  }
}
