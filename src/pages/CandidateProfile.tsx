import { useParams, Link } from 'react-router-dom';
import { candidates } from '@/data/candidates';
import NotFound from './NotFound';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const candidate = candidates.find((c) => c.id === id);

  if (!candidate) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen fighting-game-bg text-white">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Comparar
            </Link>
          </Button>
          <h1 className="text-xl font-bold">{candidate.nombre}</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="fighting-game-card">
              <CardContent className="p-6">
                <img
                  src={candidate.fullBody}
                  alt={`Imagen de cuerpo entero de ${candidate.nombre}`}
                  className="w-full rounded-lg shadow-lg mx-auto object-cover"
                />
                <h2 className="text-2xl font-bold mt-4 text-center">{candidate.nombre}</h2>
                <p className="text-center text-muted-foreground">{candidate.profession}</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="fighting-game-card">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{candidate.summary}</p>
                <div className="mt-4">
                  <Badge>{candidate.ideologia}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="fighting-game-card">
              <CardHeader>
                <CardTitle>Trayectoria Política y Profesional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.powerMap.map((item) => (
                  <div key={item.role}>
                    <p className="font-semibold">{item.role}</p>
                    <p className="text-sm text-muted-foreground">{item.from} - {item.to}</p>
                    <Separator className="my-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}