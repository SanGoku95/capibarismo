// filepath: src/components/MobileNav.tsx
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const navItems = [
  { text: 'Inicio', path: '/', icon: <HomeIcon /> },
  { text: 'Simulador 2ª Vuelta', path: '/jugar', icon: <SportsEsportsIcon /> },
  { text: 'Comparador', path: '/compare', icon: <CompareArrowsIcon /> },
  { text: 'Mapa Político', path: '/compass', icon: <GavelIcon /> },
  { text: 'Acerca de', path: '/about', icon: <InfoOutlinedIcon /> },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [ignoreTap, setIgnoreTap] = React.useState(false);
  const menuBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const location = useLocation();

  // Detect iOS (including iPadOS that reports as Mac with touch)
  const isIOS = React.useMemo(() => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return false;
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && ('ontouchend' in window));
  }, []);

  const openDrawer = () => {
    if (ignoreTap) return;
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setIgnoreTap(true);
    window.setTimeout(() => setIgnoreTap(false), 400); // small bump for reliability
    menuBtnRef.current?.blur();
  };

  React.useEffect(() => {
    if (isOpen) closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const list = () => (
    <Box sx={{ width: 250, height: '100%', bgcolor: 'hsl(var(--sidebar-background))' }} role="menu">
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={(e) => {
                e.stopPropagation();
                closeDrawer();
              }}
              selected={location.pathname === item.path}
              sx={{
                paddingY: 2,
                '&:hover': { backgroundColor: 'hsl(var(--sidebar-accent) / 0.7)' },
                '&.Mui-selected': {
                  backgroundColor: 'hsl(var(--sidebar-accent))',
                  borderRight: '4px solid hsl(var(--primary))',
                  '&:hover': { backgroundColor: 'hsl(var(--sidebar-accent))' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'hsl(var(--sidebar-foreground))' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.8rem',
                  color: 'hsl(var(--sidebar-foreground))',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        ref={menuBtnRef}
        color="inherit"
        aria-label="open navigation"
        aria-haspopup="menu"
        aria-expanded={isOpen ? 'true' : 'false'}
        onClick={openDrawer}
        disabled={ignoreTap}
        edge="start"
        sx={{ color: 'hsl(var(--foreground))' }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={closeDrawer}
        ModalProps={{
          keepMounted: true,
          disableScrollLock: true,
          // Only relax focus on iOS; keep defaults elsewhere for a11y
          disableAutoFocus: isIOS,
          disableEnforceFocus: isIOS,
          disableRestoreFocus: isIOS,
        }}
        transitionDuration={{ enter: 180, exit: 140 }}
        PaperProps={{
          sx: {
            backgroundColor: 'hsl(var(--sidebar-background))',
            borderRight: '4px solid hsl(var(--border))',
            willChange: 'transform',
          },
        }}
      >
        {list()}
      </Drawer>
    </>
  );
}