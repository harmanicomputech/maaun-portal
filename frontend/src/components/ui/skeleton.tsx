import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl skeleton-shimmer min-h-4", className)}
      {...props}
    />
  )
}

export { Skeleton }
