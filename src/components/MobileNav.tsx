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
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ChatIcon from '@mui/icons-material/Chat';

const navItems = [
  { text: 'Inicio', path: '/', icon: <HomeIcon /> },
  { text: 'Comparador', path: '/compare', icon: <CompareArrowsIcon /> },
  { text: 'Prensa', path: '/news', icon: <NewspaperIcon /> },
  { text: 'Debate', path: '/debate', icon: <GavelIcon /> },
  { text: 'Chat', path: '/chat', icon: <ChatIcon /> },
  { text: 'Metodología', path: '/about', icon: <InfoOutlinedIcon /> },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250, height: '100%', bgcolor: 'hsl(var(--sidebar-background))' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                paddingY: 2,
                '&:hover': {
                  backgroundColor: 'hsl(var(--sidebar-accent) / 0.7)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'hsl(var(--sidebar-accent))',
                  borderRight: '4px solid hsl(var(--primary))',
                  '&:hover': {
                    backgroundColor: 'hsl(var(--sidebar-accent))',
                  },
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
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleDrawer(true)}
        sx={{ color: 'hsl(var(--foreground))' }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'hsl(var(--sidebar-background))',
            borderRight: '4px solid hsl(var(--border))',
          },
        }}
      >
        {list()}
      </Drawer>
    </>
  );
}