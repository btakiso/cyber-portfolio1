"use client"

import * as React from "react"
import { DayPicker, type DayPickerProps } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type CalendarProps = DayPickerProps & {
  mode?: "single"
  selected?: Date
  onSelect?: (date?: Date) => void
  className?: string
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 text-white w-[300px]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center text-white",
        caption_label: "text-sm font-medium text-white",
        nav: "flex items-center justify-center space-x-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 p-0 text-white hover:bg-cyan-500/20"
        ),
        nav_button_previous: "static",
        nav_button_next: "static",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-center",
        head_cell: "text-cyan-500 rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex justify-center mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal text-white hover:bg-cyan-500/20"
        ),
        day_selected: "bg-cyan-500 text-black hover:bg-cyan-400 hover:text-black focus:bg-cyan-500 focus:text-black",
        day_today: "bg-cyan-500/20 text-cyan-500",
        day_outside: "text-slate-500 opacity-50",
        day_disabled: "text-slate-500 opacity-50",
        day_range_middle: "aria-selected:bg-cyan-500/20",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }: { displayMonth: Date }) => (
          <div className="flex items-center gap-1">
            <h2 className="text-sm font-medium text-white">
              {displayMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
        ),
      } as DayPickerProps['components']}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 