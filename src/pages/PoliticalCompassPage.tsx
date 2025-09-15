import { PoliticalCompass } from '@/components/political-compass/PoliticalCompass';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PoliticalCompassPage() {
  return (
    <div className="min-h-screen fighting-game-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display text-accent mb-4">
            Coordenadas Ideológicas
          </h1>
          <p className="text-lg text-foreground/90 max-w-3xl mx-auto">
            Visualiza las posturas políticas de todos los candidatos en los ejes económico y social.
          </p>
        </div>

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
  );
}

export default PoliticalCompassPage;