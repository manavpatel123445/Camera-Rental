"use client"

import * as React from "react"
import * as RadixLabel from "@radix-ui/react-label"

const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  React.ComponentPropsWithoutRef<typeof RadixLabel.Root>
>(({ className, ...props }, ref) => (
  <RadixLabel.Root ref={ref} className={className} {...props} />
))
Label.displayName = "Label"

export { Label }