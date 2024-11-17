"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CalendlyWidgetProps {
  className?: string
  url: string
}

function Calendar({ className, url }: CalendlyWidgetProps) {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)

    // Load Calendly widget script
    const head = document.querySelector('head')
    if (!document.querySelector('#calendly-script')) {
      const script = document.createElement('script')
      script.id = 'calendly-script'
      script.src = "https://assets.calendly.com/assets/external/widget.js"
      script.async = true
      head?.appendChild(script)
    }

    // Initialize Calendly widget
    if ((window as any).Calendly) {
      ;(window as any).Calendly.initInlineWidget({
        url: url,
        parentElement: document.querySelector('.calendly-inline-widget'),
        prefill: {},
        utm: {}
      })
    }

    // Cleanup
    return () => {
      const script = document.querySelector('#calendly-script')
      if (script) {
        script.remove()
      }
    }
  }, [url])

  if (!isClient) {
    return null
  }

  return (
    <div 
      className={cn(
        "rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div 
        className="calendly-inline-widget"
        style={{
          minWidth: '320px',
          height: '700px',
          borderRadius: '0.5rem',
        }}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar } 