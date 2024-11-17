"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CalendlyWidgetProps {
  className?: string
  url: string
}

function Calendar({ className, url }: CalendlyWidgetProps) {
  const [isClient, setIsClient] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setIsClient(true)

    const loadCalendly = async () => {
      // Load Calendly widget script
      const script = document.createElement('script')
      script.id = 'calendly-script'
      script.src = "https://assets.calendly.com/assets/external/widget.js"
      script.async = true
      
      // Wait for script to load
      await new Promise((resolve) => {
        script.onload = resolve
        document.head.appendChild(script)
      })

      // Initialize Calendly widget after script loads
      if (calendarRef.current && (window as any).Calendly) {
        ;(window as any).Calendly.initInlineWidget({
          url: url,
          parentElement: calendarRef.current,
          prefill: {},
          utm: {}
        })
      }
    }

    loadCalendly()

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
        ref={calendarRef}
        className="calendly-inline-widget"
        style={{
          minWidth: '320px',
          height: '600px',
          borderRadius: '0.5rem',
        }}
        data-url={url}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar } 