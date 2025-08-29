import { CompareView } from '@/components/compare/CompareViewLayout';
import { CandidatePicker } from '@/components/compare/CandidatePicker';
import { SEO, StructuredData } from '@/components/seo/SEO';
import { generateBreadcrumbStructuredData } from '@/lib/seo';

const Index = () => {
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Inicio', url: '/' },
    { name: 'Comparador', url: '/compare' }
  ]);

  return (
    <>
      <SEO 
        title="Comparador de Candidatos Presidenciales"
        description="Compara lado a lado las propuestas, trayectorias y posiciones políticas de los candidatos presidenciales de Perú 2026. Herramienta interactiva para tomar decisiones informadas."
        keywords={[
          'comparador candidatos',
          'propuestas presidenciales',
          'versus candidatos',
          'elecciones peru 2026',
          'decidir voto'
        ]}
      />
      <StructuredData data={breadcrumbData} />
      
      <div className="min-h-screen fighting-game-bg-compare lg:grid lg:grid-rows-[1fr_auto] lg:h-screen">
        <CompareView />
        <CandidatePicker />
      </div>
    </>
  );
};

export default Index;
