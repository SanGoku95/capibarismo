import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full fighting-game-header">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="text-lg font-bold text-primary transform -skew-x-12">
          CAPYBARISMO
        </Link>
        <nav>
          <Button asChild variant="link" className="text-foreground">
            <Link to="/about">Metodología</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}