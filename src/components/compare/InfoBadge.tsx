import { type ReactNode, useId, useRef, useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface InfoBadgeProps {
  label: string;
  className?: string;
  description: ReactNode;
}

export function InfoBadge({ label, className, description }: InfoBadgeProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const contentId = useId();

  const clearTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handlePointerEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== 'touch') {
      clearTimer();
      setOpen(true);
    }
  };

  const handlePointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== 'touch') {
      clearTimer();
      closeTimer.current = window.setTimeout(() => setOpen(false), 120);
    }
  };

  const handleClick = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    clearTimer();
    setOpen(prev => !prev);
  };

  useEffect(() => () => clearTimer(), []);

  const triggerClasses = cn(
    "inline-flex items-center gap-1 rounded-full border border-white/12 bg-card/80 px-2.5 py-1 text-[11px] font-medium lowercase tracking-wide text-foreground/80 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.55)] transition-all duration-200 ease-out backdrop-blur-md",
    "hover:border-primary/70 hover:text-primary-foreground hover:bg-primary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary/70 focus-visible:ring-offset-background",
    open && "border-primary/80 bg-primary/85 text-primary-foreground shadow-[0_0_28px_rgba(244,63,94,0.45)]",
    className,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={triggerClasses}
          aria-describedby={contentId}
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white/30 transition-colors group-hover:bg-white/80" />
          <span className="leading-none">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={contentId}
        side="top"
        align="start"
        sideOffset={12}
        className="max-w-xs rounded-2xl border border-white/12 bg-card/95 p-4 text-sm leading-relaxed text-foreground/85 shadow-[0_22px_42px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-10 rounded-full bg-gradient-to-r from-primary/70 via-accent/60 to-secondary/65" />
          <div>{description}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
