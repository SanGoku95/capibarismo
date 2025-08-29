import { PoliticalCompass } from '@/components/political-compass/PoliticalCompass';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO, StructuredData } from '@/components/seo/SEO';
import { generateBreadcrumbStructuredData } from '@/lib/seo';

export function PoliticalCompassPage() {
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Inicio', url: '/' },
    { name: 'Compass Político', url: '/compass' }
  ]);

  return (
    <>
      <SEO 
        title="Compass Político - Posturas de Candidatos"
        description="Visualiza y compara las posturas políticas de todos los candidatos presidenciales de Perú 2026 en el eje económico y social. Herramienta interactiva para entender ideologías políticas."
        keywords={[
          'compass politico',
          'posturas politicas',
          'ideologia candidatos',
          'eje economico social',
          'izquierda derecha',
          'liberal conservador'
        ]}
      />
      <StructuredData data={breadcrumbData} />
      
      <div className="min-h-screen fighting-game-bg">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display text-accent mb-4">
              COMPASS POLÍTICO
            </h1>
            <p className="text-lg text-foreground/90 max-w-3xl mx-auto">
              Visualiza las posturas políticas de todos los candidatos en los ejes económico y social.
            </p>
          </header>

        {/* Main Compass */}
        <div className="max-w-5xl mx-auto mb-8">
          <PoliticalCompass width={600} height={600} />
        </div>

        {/* Explanation */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card className="fighting-game-card">
            <CardHeader>
              <CardTitle className="text-accent font-display">
                Eje Económico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-team-left">Izquierda</span>
                <span className="font-semibold text-team-right">Derecha</span>
              </div>
              <div className="text-sm text-foreground/80">
                <p className="mb-2">
                  <strong>Izquierda:</strong> Mayor intervención estatal, regulación de mercados, 
                  redistribución de riqueza, servicios públicos amplios.
                </p>
                <p>
                  <strong>Derecha:</strong> Libre mercado, menor intervención estatal, 
                  privatización, reducción de impuestos.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="fighting-game-card">
            <CardHeader>
              <CardTitle className="text-accent font-display">
                Eje Social
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-secondary">Libertario</span>
                <span className="font-semibold text-primary">Autoritario</span>
              </div>
              <div className="text-sm text-foreground/80">
                <p className="mb-2">
                  <strong>Libertario:</strong> Máximas libertades individuales, 
                  derechos civiles amplios, tolerancia social.
                </p>
                <p>
                  <strong>Autoritario:</strong> Mayor control social, 
                  valores tradicionales, orden y seguridad priorizados.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}

export default PoliticalCompassPage;