import { cn } from "@/lib/cn";

interface EqualizerProps {
  active: boolean;
  className?: string;
}

export function Equalizer({ active, className }: EqualizerProps) {
  return (
    <span className={cn("eq", className)} data-active={active} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
