import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Box } from "@mui/material";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 w-full fighting-game-header">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-display text-primary">
          <picture>
            <source srcSet="/capi_logo.webp" type="image/webp" />
            <img 
              src="/capi_logo.png" 
              alt="Capibara logo" 
              className="h-11 w-11"
              fetchpriority="high"
              width="44"
              height="44"
            />
          </picture>
          <span>CAPIBARISMO</span>
        </Link>
        
        {/* Desktop Navigation */}
        <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' } }} className="items-center gap-2">
          <Button asChild variant="link" className="text-foreground">
            <Link to="/jugar">Simulador 2ª Vuelta</Link>
          </Button>
          <Button asChild variant="link" className="text-foreground">
            <Link to="/compare">Comparador</Link>
          </Button>
          <Button asChild variant="link" className="text-foreground">
            <Link to="/compass">Mapa Político</Link>
          </Button>
          <Button asChild variant="link" className="text-foreground">
            <Link to="/about">Acerca de</Link>
          </Button>
        </Box>

        {/* Mobile Navigation */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <MobileNav />
        </Box>
      </div>
    </header>
  );
}