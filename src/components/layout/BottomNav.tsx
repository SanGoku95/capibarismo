import { NavLink } from "react-router-dom";
import { Compass, Home, Scale, Bookmark } from "lucide-react";

const items = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/compare", label: "Comparar", icon: Scale },
  { to: "/compass", label: "Brújula", icon: Compass },
  { to: "/saved", label: "Guardado", icon: Bookmark },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-xl items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                  isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

