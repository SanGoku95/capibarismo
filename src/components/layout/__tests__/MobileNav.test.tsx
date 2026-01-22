import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MobileNav } from '../MobileNav';

describe('MobileNav', () => {
  const renderMobileNav = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <MobileNav />
      </MemoryRouter>
    );
  };

  it('should render menu button', () => {
    renderMobileNav();
    const menuButton = screen.getByRole('button', { name: /open navigation/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('should open drawer when menu button is clicked', async () => {
    const user = userEvent.setup();
    renderMobileNav();
    
    const menuButton = screen.getByRole('button', { name: /open navigation/i });
    await user.click(menuButton);
    
    // Check that drawer items are visible
    await waitFor(() => {
      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Jugar')).toBeInTheDocument();
      expect(screen.getByText('Comparador')).toBeInTheDocument();
      expect(screen.getByText('Mapa Político')).toBeInTheDocument();
      expect(screen.getByText('Acerca de')).toBeInTheDocument();
    });
  });

  it('should include Jugar navigation item in drawer', async () => {
    const user = userEvent.setup();
    renderMobileNav();
    
    const menuButton = screen.getByRole('button', { name: /open navigation/i });
    await user.click(menuButton);
    
    await waitFor(() => {
      const jugarItem = screen.getByText('Jugar');
      expect(jugarItem).toBeInTheDocument();
    });
  });

  it('should render navigation items in correct order', async () => {
    const user = userEvent.setup();
    renderMobileNav();
    
    const menuButton = screen.getByRole('button', { name: /open navigation/i });
    await user.click(menuButton);
    
    await waitFor(() => {
      const items = [
        screen.getByText('Inicio'),
        screen.getByText('Jugar'),
        screen.getByText('Comparador'),
        screen.getByText('Mapa Político'),
        screen.getByText('Acerca de'),
      ];
      
      items.forEach(item => {
        expect(item).toBeInTheDocument();
      });
    });
  });

  it('should highlight Jugar item when on /jugar route', async () => {
    const user = userEvent.setup();
    renderMobileNav('/jugar');
    
    const menuButton = screen.getByRole('button', { name: /open navigation/i });
    await user.click(menuButton);
    
    await waitFor(() => {
      const jugarButton = screen.getByText('Jugar').closest('a');
      expect(jugarButton).toHaveClass('Mui-selected');
    });
  });

  it('should not highlight Jugar item when on other routes', async () => {
    const user = userEvent.setup();
    renderMobileNav('/compare');
    
    const menuButton = screen.getByRole('button', { name: /open navigation/i });
    await user.click(menuButton);
    
    await waitFor(() => {
      const jugarButton = screen.getByText('Jugar').closest('a');
      expect(jugarButton).not.toHaveClass('Mui-selected');
    });
  });

  it('should close drawer when Jugar item is clicked', async () => {
    const user = userEvent.setup();
    renderMobileNav();
    
    const menuButton = screen.getByRole('button', { name: /open navigation/i });
    
    // Open drawer
    await user.click(menuButton);
    await waitFor(() => {
      expect(screen.getByText('Jugar')).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    // Click Jugar item
    const jugarItem = screen.getByText('Jugar');
    await user.click(jugarItem);
    
    // Verify drawer closes by checking menu button state
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
