import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen fighting-game-bg text-white">
      <div className="container mx-auto p-4 md:p-8">
        <Button asChild variant="outline" className="mb-8">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Comparar
          </Link>
        </Button>

        <Card className="fighting-game-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Nuestra Metodología</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Bienvenido a Presidential Punch Perú. Nuestro objetivo es presentar la información de los candidatos de una manera clara, objetiva y fácil de digerir, utilizando un formato inspirado en los juegos de lucha clásicos para hacerlo más atractivo.
            </p>
            <section>
              <h3 className="font-bold text-lg text-foreground mb-2">Recopilación de Datos</h3>
              <p>
                La información presentada, como la ideología, las creencias clave y la trayectoria, se recopila de fuentes públicas y verificables, incluyendo entrevistas, debates, planes de gobierno y reportajes de medios de comunicación confiables. No favorecemos a ningún candidato.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-lg text-foreground mb-2">Visualización</h3>
              <p>
                El diseño busca simplificar temas complejos. Las "creencias clave" son resúmenes de posturas recurrentes y los "clips" son enlaces a declaraciones importantes. El "mapa de poder" visualiza la experiencia relevante de cada candidato.
              </p>
            </section>
             <p className="text-center text-foreground pt-4">
              Este es un proyecto independiente y sin fines de lucro.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}