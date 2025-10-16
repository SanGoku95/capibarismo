import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useArticleSEO } from "@/lib/useSEO";

export function About() {
  // SEO for About page
  useArticleSEO(
    'Acerca de Capibarismo | Información Objetiva sobre Elecciones Perú 2026',
    'Conoce nuestra misión de presentar información objetiva y verificada sobre los candidatos presidenciales de Perú 2026. Metodología transparente basada en fuentes confiables.',
    '2025-01-01',
    '2025-10-16'
  );

  return (
    <div className="min-h-screen fighting-game-bg text-white">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button asChild variant="ghost" className="mb-8 w-full sm:w-auto justify-center sm:justify-start gap-2 rounded-full border border-border/60 bg-black/20 px-5 py-2 transition-all hover:border-accent hover:bg-accent/10">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Volver a Inicio
          </Link>
        </Button>
        </div>

        <Card className="fighting-game-card max-w-4xl mx-auto shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl md:text-3xl text-center font-display text-accent">Acerca de Capybarismo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h3 className="font-bold text-xl text-foreground mb-3">Nuestra Misión</h3>
              <p>
                En un panorama político complejo, tomar una decisión informada puede ser un desafío. Capybarismo nace con el objetivo de simplificar este proceso. Nuestra misión es presentar la información de los candidatos presidenciales de Perú de una manera clara, objetiva y fácil de digerir.
              </p>
              <p className="mt-2">
                Utilizamos un formato inspirado en los juegos de lucha clásicos, no para trivializar la política, sino para hacerla más atractiva y accesible para todos, especialmente para quienes se sienten desconectados del debate tradicional.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-xl text-foreground mb-3">Metodología de Datos</h3>
              <p>
                La imparcialidad es el pilar de nuestro trabajo. La información presentada, como la ideología, las creencias clave y la trayectoria, se recopila de fuentes públicas y verificables, incluyendo entrevistas, debates, planes de gobierno y reportajes de medios de comunicación confiables. No favorecemos a ningún candidato; nuestro único fin es informar.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-xl text-foreground mb-3">¿Cómo Interpretamos la Información?</h3>
              <p>
                El diseño busca simplificar temas complejos. Las "creencias clave" son resúmenes de las posturas más recurrentes en el discurso de un candidato. El "mapa de poder" visualiza la experiencia relevante que podría influir en su gestión. Los "clips" son una selección de apariciones mediáticas para que puedas escuchar directamente a los candidatos.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-xl text-foreground mb-3">¿Cómo medimos el Mapa Político?</h3>
              <p>
                Para entender a fondo a quienes aspiran a dirigir el país, hemos diseñado una metodología que va más allá de las etiquetas tradicionales. Nuestro análisis es <em>cuadridimensional</em> y califica a cada candidato en <strong>cuatro ejes</strong>, con puntajes de <strong>-10 a +10</strong> en cada uno.
              </p>
              <p className="mt-3 font-medium">Estos cuatro ejes son:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Eje Económico:</strong> mide si el candidato prefiere un Estado que interviene y controla la economía (<em>Izquierda Intervencionista</em>) o uno que fomenta la libre competencia y la inversión privada (<em>Derecha Pro‑Mercado</em>).
                </li>
                <li>
                  <strong>Eje Social:</strong> evalúa las posturas sobre libertades individuales. Va desde quienes defienden la expansión de derechos para las minorías (<em>Progresismo Liberal</em>) hasta quienes priorizan el “orden” y los valores tradicionales (<em>Autoritarismo Conservador</em>).
                </li>
                <li>
                  <strong>Eje Territorial:</strong> analiza la visión sobre la distribución del poder. Mapea desde quienes buscan dar más autonomía y recursos a las regiones (<em>Regionalismo</em>) hasta quienes prefieren concentrar las decisiones en Lima (<em>Centralismo</em>).
                </li>
                <li>
                  <strong>Eje de Gobernanza (Estilo de Poder):</strong> examina el respeto por las reglas democráticas. Distingue entre quienes buscan fortalecer las instituciones (<em>Institucionalismo</em>) y quienes proponen un cambio radical del sistema, a menudo con un discurso de confrontación (<em>Populismo Antisistema</em>).
                </li>
              </ul>
              <p className="mt-3">
                Este sistema nos permite construir un <em>perfil político multidimensional</em> y más matizado de cada candidato, revelando sus prioridades y su posible estilo de gobierno. No buscamos decirte por quién votar, sino darte una herramienta poderosa para un voto informado y consciente.
              </p>
              <p className="mt-2 text-sm">
                ¿Quieres saber más sobre nuestro método o aplicarlo a otros análisis? Escríbenos a
                {' '}<a className="underline hover:text-accent" href="mailto:info@capibarismo.com">info@capibarismo.com</a>.
              </p>
            </section>
             <p className="text-center text-foreground pt-6 border-t border-border/50 mt-8 text-sm">
              Este es un proyecto independiente y sin fines de lucro.
            </p>
            <div className="flex justify-center pt-2">
              <Button asChild className="rounded-full transition-all hover:scale-105">
                <Link to="/fuentes">Consulta todas las fuentes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}