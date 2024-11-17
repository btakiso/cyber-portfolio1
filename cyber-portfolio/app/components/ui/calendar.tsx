"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CalendlyWidgetProps {
  className?: string
  url: string
}

function Calendar({ className, url }: CalendlyWidgetProps) {
  React.useEffect(() => {
    // Add Calendly stylesheet
    const link = document.createElement('link')
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Add Calendly script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    // Initialize Calendly
    script.onload = () => {
      if ((window as any).Calendly) {
        ;(window as any).Calendly.initInlineWidget({
          url: url,
          parentElement: document.querySelector('.calendly-inline-widget'),
          prefill: {},
          utm: {}
        })
      }
    }

    return () => {
      // Cleanup
      document.head.removeChild(link)
      document.body.removeChild(script)
    }
  }, [url])

  return (
    <div 
      className={cn(
        "rounded-lg overflow-hidden",
        className
      )}
    >
      <div 
        className="calendly-inline-widget"
        data-url={url}
        style={{
          minWidth: '320px',
          height: '500px', // Reduced height
        }}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar } 