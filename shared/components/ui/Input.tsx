import * as React from "react";

import { cn } from "@/shared/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type InputPropsWithIcon = InputProps & { icon: React.ReactNode };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const InputIcon = React.forwardRef<HTMLInputElement, InputPropsWithIcon>(
  ({ className, type, icon, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-2 h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-within:ring-1",
          disabled && "opacity-50"
        )}
      >
        <input
          type={type}
          className={cn("w-full h-full", className)}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {icon}
      </div>
    );
  }
);
InputIcon.displayName = "InputIcon";

export { Input, InputIcon };
