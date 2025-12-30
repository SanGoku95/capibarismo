import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ComparePage from '../ComparePage';
import { useCompareStore } from '@/store/useCompareStore';
import { listCandidates } from '@/data';

// Mock the SEO hook
vi.mock('@/lib/useSEO', () => ({
  useSEO: vi.fn(),
}));

describe('ComparePage', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useCompareStore.getState();
    store.setLeftCandidate(null);
    store.setRightCandidate(null);
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(
        <BrowserRouter>
          <ComparePage />
        </BrowserRouter>
      );

      // Use getAllByText since "Candidatos" appears in both mobile and desktop views
      const candidatosHeaders = screen.getAllByText(/candidatos:/i);
      expect(candidatosHeaders.length).toBeGreaterThan(0);
    });

    it('should render CompareView component', () => {
      const { container } = render(
        <BrowserRouter>
          <ComparePage />
        </BrowserRouter>
      );

      // Check that the compare view layout is rendered
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    });

    it('should render CandidatePicker component', () => {
      render(
        <BrowserRouter>
          <ComparePage />
        </BrowserRouter>
      );

      // Should show instruction text (appears in both mobile and desktop)
      const instructions = screen.getAllByText(/elige dos para comparar/i);
      expect(instructions.length).toBeGreaterThan(0);
    });
  });

  describe('URL Parameters', () => {
    it('should load left candidate from URL parameter ?a=', async () => {
      const candidates = listCandidates();
      const testCandidate = candidates[0];

      render(
        <MemoryRouter initialEntries={[`/compare?a=${testCandidate.id}`]}>
          <ComparePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        const store = useCompareStore.getState();
        expect(store.leftCandidate?.id).toBe(testCandidate.id);
      });
    });

    it('should load right candidate from URL parameter ?b=', async () => {
      const candidates = listCandidates();
      const testCandidate = candidates[1];

      render(
        <MemoryRouter initialEntries={[`/compare?b=${testCandidate.id}`]}>
          <ComparePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        const store = useCompareStore.getState();
        expect(store.rightCandidate?.id).toBe(testCandidate.id);
      });
    });

    it('should load both candidates from URL parameters ?a=&b=', async () => {
      const candidates = listCandidates();
      const leftCandidate = candidates[0];
      const rightCandidate = candidates[1];

      render(
        <MemoryRouter initialEntries={[`/compare?a=${leftCandidate.id}&b=${rightCandidate.id}`]}>
          <ComparePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        const store = useCompareStore.getState();
        expect(store.leftCandidate?.id).toBe(leftCandidate.id);
        expect(store.rightCandidate?.id).toBe(rightCandidate.id);
      });
    });

    it('should ignore invalid candidate IDs in URL parameters', async () => {
      render(
        <MemoryRouter initialEntries={['/compare?a=invalid-id&b=also-invalid']}>
          <ComparePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        const store = useCompareStore.getState();
        expect(store.leftCandidate).toBeNull();
        expect(store.rightCandidate).toBeNull();
      });
    });

    it('should handle partial valid URL parameters', async () => {
      const candidates = listCandidates();
      const validCandidate = candidates[0];

      render(
        <MemoryRouter initialEntries={[`/compare?a=${validCandidate.id}&b=invalid-id`]}>
          <ComparePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        const store = useCompareStore.getState();
        expect(store.leftCandidate?.id).toBe(validCandidate.id);
        expect(store.rightCandidate).toBeNull();
      });
    });
  });

  describe('Integration with Store', () => {
    it('should not override existing candidates when URL params are empty', async () => {
      const candidates = listCandidates();
      const leftCandidate = candidates[0];

      // Pre-set a candidate in store
      const store = useCompareStore.getState();
      store.setLeftCandidate(leftCandidate);

      render(
        <MemoryRouter initialEntries={['/compare']}>
          <ComparePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        const currentStore = useCompareStore.getState();
        expect(currentStore.leftCandidate?.id).toBe(leftCandidate.id);
      });
    });

    it('should respond to URL parameter changes', async () => {
      const candidates = listCandidates();
      const firstCandidate = candidates[0];

      render(
        <MemoryRouter initialEntries={[`/compare?a=${firstCandidate.id}`]}>
          <ComparePage />
        </MemoryRouter>
      );

      await waitFor(() => {
        const store = useCompareStore.getState();
        expect(store.leftCandidate?.id).toBe(firstCandidate.id);
      });

      // Verify the candidate was loaded from URL
      expect(useCompareStore.getState().leftCandidate).not.toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have proper layout structure', () => {
      const { container } = render(
        <BrowserRouter>
          <ComparePage />
        </BrowserRouter>
      );

      const mainContainer = container.querySelector('.min-h-screen');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('fighting-game-bg-compare');
    });

    it('should be navigable by keyboard', () => {
      render(
        <BrowserRouter>
          <ComparePage />
        </BrowserRouter>
      );

      const candidates = listCandidates();
      candidates.forEach(candidate => {
        // Each candidate button appears twice (mobile and desktop view)
        const buttons = screen.getAllByLabelText(new RegExp(`seleccionar a ${candidate.nombre}`, 'i'));
        expect(buttons.length).toBeGreaterThan(0);
        buttons.forEach(button => {
          expect(button).toHaveAttribute('tabIndex', '0');
        });
      });
    });
  });
});
