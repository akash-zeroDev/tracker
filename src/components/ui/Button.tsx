import React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
          "h-10 px-4 py-2",
          variant === "primary" && "bg-white text-black hover:bg-white/90 active:bg-white/80",
          variant === "secondary" && "glass-panel hover:bg-white/10 active:bg-white/5",
          variant === "ghost" && "hover:bg-white/10 active:bg-white/5",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
