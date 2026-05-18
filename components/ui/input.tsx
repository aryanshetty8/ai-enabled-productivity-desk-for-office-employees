import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          "w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-forest-900/35 focus:border-forest-500",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";
