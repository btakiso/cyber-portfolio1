"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CalendlyWidgetProps {
  className?: string
  url: string
}

function Calendar({ className, url }: CalendlyWidgetProps) {
  React.useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on component unmount
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div 
      className={cn(
        "rounded-lg bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div 
        className="calendly-inline-widget"
        data-url={url}
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