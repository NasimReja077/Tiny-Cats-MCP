import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-container text-on-primary-container shadow",
        secondary:
          "bg-surface-container-high text-on-surface-variant hover:bg-surface-variant",
        success:
          "bg-secondary-container/50 text-secondary border border-secondary/20",
        warning:
          "bg-tertiary-container/30 text-tertiary border border-tertiary/20",
        destructive:
          "bg-error-container/40 text-error border border-error/20",
        outline:
          "text-on-surface-variant border border-outline-variant",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
