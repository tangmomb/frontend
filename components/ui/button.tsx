import * as React from "react"
import { cn } from "@/lib/utils"

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "primary" | "outline"
  size?: "default" | "sm" | "lg"
}) {
  return (
    <button
      className={cn(
        "button",
        `button-${variant}`,
        size !== "default" && `button-${size}`,
        className
      )}
      {...props}
    />
  )
}

export { Button }
