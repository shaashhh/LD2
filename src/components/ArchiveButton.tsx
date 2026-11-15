import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ArchiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "border-paper bg-paper text-ink hover:border-[#d6cec0] hover:bg-[#d6cec0]",
  outline:
    "border-line bg-transparent text-paper hover:border-highlight hover:bg-paper/[0.04]",
  ghost:
    "border-transparent bg-transparent text-muted hover:text-paper",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[10px] tracking-[0.16em]",
  md: "h-10 px-4 text-[10px] tracking-[0.18em]",
  lg: "h-11 px-5 text-[11px] tracking-[0.18em]",
};

export function ArchiveButton({
  variant = "outline",
  size = "md",
  className,
  type = "button",
  ...props
}: ArchiveButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[2px] border font-medium uppercase transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
