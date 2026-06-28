import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-medium transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black " +
  "disabled:pointer-events-none disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        default: 
          "bg-black text-white border-2 border-black " +
          "shadow-[4px_4px_0px_0px_#000] " + 
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] " +
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_0px_#000]",
        destructive:
          "bg-red-500 text-white border-2 border-black " +
          "shadow-[4px_4px_0px_0px_#000] " + 
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] " +
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_0px_#000]",
        outline:
          "border-2 border-black bg-white hover:bg-black hover:text-white " +
          "shadow-[4px_4px_0px_0px_#000] " + 
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] " +
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_0px_#000]",
        secondary:
          "bg-gray-200 text-gray-900 border-2 border-black " +
          "shadow-[4px_4px_0px_0px_#000] " + 
          "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] " +
          "active:translate-x-[4px] active:translate-y-[4px] active:shadow-[0px_0px_0px_0px_#000]",
        ghost: 
          "hover:bg-gray-100 hover:text-gray-900 border-2 border-transparent " +
          "hover:shadow-[2px_2px_0px_0px_#ccc] " + 
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_#ccc]",
        link: 
          "text-gray-900 underline-offset-4 hover:underline border-2 border-transparent " +
          "hover:shadow-[0px_0px_0px_0px_transparent] " + 
          "active:translate-x-[0px] active:translate-y-[0px]", 
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }