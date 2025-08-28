import { cn } from "@/lib/utils";

interface TagPillProps {
  children: React.ReactNode;
  variant?: "default" | "ideology" | "belief";
  className?: string;
}

export function TagPill({ children, variant = "default", className }: TagPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
        {
          "bg-muted text-muted-foreground": variant === "default",
          "bg-primary/10 text-primary border border-primary/20": variant === "ideology",
          "bg-accent text-accent-foreground": variant === "belief",
        },
        className
      )}
    >
      {children}
    </span>
  );
}