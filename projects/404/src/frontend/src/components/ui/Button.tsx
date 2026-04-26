import React from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  as?: "button" | "a";
  href?: string;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-600)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap flex-shrink-0";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 ring-1 ring-inset ring-white/20",
  secondary:
    "bg-gradient-to-b from-[var(--color-green-500)] to-[var(--color-green-600)] text-white shadow-[0_4px_14px_0_rgba(13,148,136,0.25)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.35)] hover:-translate-y-0.5 ring-1 ring-inset ring-white/20",
  outline:
    "bg-white border border-[var(--color-primary-200)] text-[var(--color-primary-700)] shadow-sm hover:border-[var(--color-primary-400)] hover:bg-[var(--color-primary-50)] hover:-translate-y-0.5",
  ghost: "text-[var(--color-gray-600)] hover:bg-gray-100/80 hover:text-gray-900 border border-transparent hover:border-gray-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      className,
      as,
      href,
      type,
      ...props
    },
    ref,
  ) => {
    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    if (as === "a" && href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} type={type ?? "button"} className={classes} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
