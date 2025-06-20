'use client'

import * as React from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'

import { cn } from '../utils/helpers'

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn('animate-in zoom-in-90 z-50 mx-3 rounded-lg border-neutral-0 border-2 bg-white p-1', className)}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
