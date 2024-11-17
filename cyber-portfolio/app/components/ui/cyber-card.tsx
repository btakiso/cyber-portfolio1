import { cn } from "@/lib/utils"

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showGradient?: boolean;
}

export function CyberCard({ children, className, showGradient = true, ...props }: CyberCardProps) {
  return (
    <div 
      className={cn(
        "cyber-card relative",
        className
      )} 
      {...props}
    >
      {showGradient && (
        <div className="cyber-gradient-line" />
      )}
      {children}
    </div>
  )
}
