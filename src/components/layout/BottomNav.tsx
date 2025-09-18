import { Home, Scale, Compass, Bookmark } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/compare", label: "Comparar", icon: Scale },
  { to: "/compass", label: "Brújula", icon: Compass },
  { to: "/saved", label: "Guardados", icon: Bookmark },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-between">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-semibold uppercase tracking-wide transition",
                isActive ? "text-accent" : "text-muted-foreground hover:text-accent/80",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
