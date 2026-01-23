import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  it('should render without crashing', () => {
    renderHeader();
    expect(screen.getByText('CAPIBARISMO')).toBeInTheDocument();
  });

  it('should render desktop navigation with all links including Jugar', () => {
    renderHeader();
    
    // Check that all navigation links are present
    const jugarLink = screen.getByRole('link', { name: /jugar/i });
    const comparadorLink = screen.getByRole('link', { name: /comparador/i });
    const mapaLink = screen.getByRole('link', { name: /mapa político/i });
    const acercaLink = screen.getByRole('link', { name: /acerca de/i });
    
    expect(jugarLink).toBeInTheDocument();
    expect(comparadorLink).toBeInTheDocument();
    expect(mapaLink).toBeInTheDocument();
    expect(acercaLink).toBeInTheDocument();
  });

  it('should render Jugar link with correct path', () => {
    renderHeader();
    
    const jugarLink = screen.getByRole('link', { name: /jugar/i });
    expect(jugarLink).toHaveAttribute('href', '/jugar');
  });

  it('should render navigation links in correct order', () => {
    renderHeader();
    
    // Get all navigation links (excluding the logo link)
    const allLinks = screen.getAllByRole('link');
    const navLinks = allLinks.filter(link => 
      link.textContent === 'Jugar' || 
      link.textContent === 'Comparador' || 
      link.textContent === 'Mapa Político' || 
      link.textContent === 'Acerca de'
    );
    
    expect(navLinks[0].textContent).toBe('Jugar');
    expect(navLinks[1].textContent).toBe('Comparador');
    expect(navLinks[2].textContent).toBe('Mapa Político');
    expect(navLinks[3].textContent).toBe('Acerca de');
  });
});
