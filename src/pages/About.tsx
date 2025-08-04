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
            <CardTitle className="text-2xl text-center">Acerca de Capybarismo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h3 className="font-bold text-lg text-foreground mb-2">Nuestra Misión</h3>
              <p>
                En un panorama político complejo, tomar una decisión informada puede ser un desafío. Presidential Punch Perú nace con el objetivo de simplificar este proceso. Nuestra misión es presentar la información de los candidatos presidenciales de Perú de una manera clara, objetiva y fácil de digerir.
              </p>
              <p className="mt-2">
                Utilizamos un formato inspirado en los juegos de lucha clásicos, no para trivializar la política, sino para hacerla más atractiva y accesible para todos, especialmente para quienes se sienten desconectados del debate tradicional.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-lg text-foreground mb-2">Metodología de Datos</h3>
              <p>
                La imparcialidad es el pilar de nuestro trabajo. La información presentada, como la ideología, las creencias clave y la trayectoria, se recopila de fuentes públicas y verificables, incluyendo entrevistas, debates, planes de gobierno y reportajes de medios de comunicación confiables. No favorecemos a ningún candidato; nuestro único fin es informar.
              </p>
            </section>
            <section>
              <h3 className="font-bold text-lg text-foreground mb-2">¿Cómo Interpretamos la Información?</h3>
              <p>
                El diseño busca simplificar temas complejos. Las "creencias clave" son resúmenes de las posturas más recurrentes en el discurso de un candidato. El "mapa de poder" visualiza la experiencia relevante que podría influir en su gestión. Los "clips" son una selección de apariciones mediáticas para que puedas escuchar directamente a los candidatos.
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