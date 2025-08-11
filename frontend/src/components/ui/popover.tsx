"use client"

import * as React from "react"
import * as RadixPopover from "@radix-ui/react-popover"

const Popover = RadixPopover.Root
const PopoverTrigger = RadixPopover.Trigger
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Content>,
  React.ComponentPropsWithoutRef<typeof RadixPopover.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <RadixPopover.Portal>
    <RadixPopover.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={className}
      {...props}
    />
  </RadixPopover.Portal>
))
PopoverContent.displayName = RadixPopover.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }