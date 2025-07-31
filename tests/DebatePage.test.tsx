import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DebatePage } from '../pages/Debate';
import { vi } from 'vitest';

// Mock the data imports
vi.mock('@/data/topics', () => ({
  topics: [
    {
      id: 'seguridad-ciudadana',
      name: 'Seguridad Ciudadana',
      subtopics: [
        { id: 'military-police-support', name: 'Apoyo militar a la policía', science: { stance: 'Mixto', gist: 'Efectivo a corto plazo, riesgoso a largo plazo.', evidence: '...', source: '...' } },
        { id: 'job-programs', name: 'Promover empleos para jóvenes', science: { stance: 'A favor', gist: 'Reduce la reincidencia.', evidence: '...', source: '...' } },
        { id: 'gun-control', name: 'Control de armas', science: { stance: 'A favor', gist: 'Reduce homicidios.', evidence: '...', source: '...' } },
      ],
    },
    {
      id: 'reforma-politica',
      name: 'Reforma Política',
      subtopics: [
        { id: 'bicameralism', name: 'Bicameralidad', science: { stance: 'A favor', gist: 'Mejora la calidad legislativa.', evidence: '...', source: '...' } },
      ],
    },
  ],
}));

vi.mock('@/data/candidateStances', () => ({
  allCandidates: [
    { id: 'keiko', name: 'Keiko Fujimori' },
    { id: 'veronika', name: 'Verónika Mendoza' },
  ],
  candidateData: [
    {
      id: 'keiko',
      actor: 'Keiko Fujimori',
      stances: {
        'military-police-support': { stance: 'A favor', gist: 'Mano dura y orden.', evidence: '...', source: '...' },
        'job-programs': { stance: 'Mixto', gist: 'Inversión privada.', evidence: '...', source: '...' },
      },
    },
    {
      id: 'veronika',
      actor: 'Verónika Mendoza',
      stances: {
        'military-police-support': { stance: 'En contra', gist: 'Reforma policial.', evidence: '...', source: '...' },
        'job-programs': { stance: 'A favor', gist: 'Programas estatales.', evidence: '...', source: '...' },
        'bicameralism': { stance: 'En contra', gist: 'No resuelve crisis.', evidence: '...', source: '...' },
      },
    },
  ],
}));


describe('DebatePage', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <DebatePage />
      </MemoryRouter>
    );
  };

  test('renders initial topic and sub-topics correctly', () => {
    renderComponent();
    expect(screen.getByText('Seguridad Ciudadana')).toBeInTheDocument();
    expect(screen.getByText('Apoyo militar a la policía')).toBeInTheDocument();
    expect(screen.getByText('Promover empleos para jóvenes')).toBeInTheDocument();
    expect(screen.getByText('Control de armas')).toBeInTheDocument();
  });

  test('always shows the Science column', () => {
    renderComponent();
    expect(screen.getByText('Science (RCT)')).toBeInTheDocument();
  });

  test('candidate filter hides and unhides columns correctly', () => {
    renderComponent();

    // Initially, both candidates are visible
    expect(screen.getByText('Keiko Fujimori')).toBeInTheDocument();
    expect(screen.getByText('Verónika Mendoza')).toBeInTheDocument();

    // Open the candidate selector
    fireEvent.mouseDown(screen.getByLabelText('Candidatos'));

    // Deselect Keiko Fujimori
    fireEvent.click(screen.getByText('Keiko Fujimori'));


    // Close the selector by clicking away (e.g., on the body)
    fireEvent.click(document.body);

    // Now, only Verónika should be visible
    expect(screen.queryByText('Keiko Fujimori')).not.toBeInTheDocument();
    expect(screen.getByText('Verónika Mendoza')).toBeInTheDocument();

    // Open the candidate selector again
    fireEvent.mouseDown(screen.getByLabelText('Candidatos'));

    // Reselect Keiko Fujimori
    fireEvent.click(screen.getByText('Keiko Fujimori'));

    // Close the selector
    fireEvent.click(document.body);

    // Both should be visible again
    expect(screen.getByText('Keiko Fujimori')).toBeInTheDocument();
    expect(screen.getByText('Verónika Mendoza')).toBeInTheDocument();
  });

  test('switching the topic changes the rendered sub-topics', () => {
    renderComponent();

    // Initially, "Seguridad Ciudadana" subtopics are shown
    expect(screen.getByText('Apoyo militar a la policía')).toBeInTheDocument();

    // Switch to "Reforma Política"
    fireEvent.mouseDown(screen.getByLabelText('Tema'));
    fireEvent.click(screen.getByText('Reforma Política'));

    // Now, "Reforma Política" subtopics should be visible
    expect(screen.getByText('Bicameralidad')).toBeInTheDocument();

    // And "Seguridad Ciudadana" subtopics should be gone
    expect(screen.queryByText('Apoyo militar a la policía')).not.toBeInTheDocument();
  });

  test('does not allow deselecting the last candidate', () => {
    renderComponent();

    // Open the candidate selector
    fireEvent.mouseDown(screen.getByLabelText('Candidatos'));

    // Deselect Keiko
    fireEvent.click(screen.getByText('Keiko Fujimori'));
    fireEvent.click(document.body); // close

    expect(screen.queryByText('Keiko Fujimori')).not.toBeInTheDocument();
    expect(screen.getByText('Verónika Mendoza')).toBeInTheDocument();

    // Try to deselect the last one, Veronika
    fireEvent.mouseDown(screen.getByLabelText('Candidatos'));
    fireEvent.click(screen.getByText('Verónika Mendoza'));
    fireEvent.click(document.body); // close

    // It should still be there
    expect(screen.getByText('Verónika Mendoza')).toBeInTheDocument();
  });
});
