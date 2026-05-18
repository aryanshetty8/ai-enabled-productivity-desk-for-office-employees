import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        "w-full rounded-xl border border-forest-900/10 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-forest-900/35 focus:border-forest-500",
        className
      )}
    />
  );
});

Textarea.displayName = "Textarea";
