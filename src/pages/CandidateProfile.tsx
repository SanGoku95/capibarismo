import { useParams, Link } from 'react-router-dom';
import { candidates } from '@/data/candidates';
import NotFound from './NotFound';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Star, Briefcase, Radio, Power, Rss } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FaTiktok, FaYoutube, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

const socialIcons: { [key: string]: React.ReactElement } = {
  tiktok: <FaTiktok />,
  youtube: <FaYoutube />,
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
  twitter: <FaTwitter />,
};

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
            <Link to="/compare">
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
            <div className="lg:sticky lg:top-24">
              <Card className="fighting-game-card">
                <CardContent className="p-6">
                  <img
                    src={candidate.fullBody}
                    alt={`Imagen de cuerpo entero de ${candidate.nombre}`}
                    className="w-full max-w-[280px] lg:max-w-full rounded-lg shadow-lg mx-auto object-cover aspect-[2/3]"
                  />
                  <h2 className="text-2xl font-bold mt-4 text-center">{candidate.nombre}</h2>
                  <p className="text-center text-muted-foreground">{candidate.ideologia}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="fighting-game-card" id="proyecto-politico">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield size={20} /> Proyecto Político</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold mb-2">{candidate.proyectoPolitico.titulo}</h3>
                <p className="leading-relaxed">{candidate.proyectoPolitico.resumen}</p>
              </CardContent>
            </Card>

            <Card className="fighting-game-card" id="creencias-clave">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star size={20} /> Creencias Clave</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {candidate.creenciasClave.map((belief) => (
                  <Badge key={belief} variant="secondary" id={`creencia-${belief.toLowerCase().replace(/\s+/g, '-')}`}>{belief}</Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="fighting-game-card" id="trayectoria">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase size={20} /> Trayectoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.trayectoria.map((item, index) => (
                  <div key={item.id} id={item.id} className="scroll-mt-24">
                    <p className="font-semibold">{item.rol} <span className="text-sm text-muted-foreground font-normal">({item.periodo})</span></p>
                    <p className="text-sm text-muted-foreground">{item.descripcion}</p>
                    {index < candidate.trayectoria.length - 1 && <Separator className="my-3" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="fighting-game-card" id="presencia-digital">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Rss size={20} /> Presencia en Medios Digitales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(candidate.presenciaDigital).map(([platform, description]) => (
                  <div key={platform} className="flex items-start gap-4">
                    <div className="text-2xl text-muted-foreground mt-1">
                      {socialIcons[platform] || <Radio />}
                    </div>
                    <div>
                      <h4 className="font-semibold capitalize">{platform}</h4>
                      <p className="leading-relaxed text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="fighting-game-card" id="mapa-de-poder">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Power size={20} /> Mapa de Poder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Alianzas Clave</h4>
                  <p className="text-muted-foreground">{candidate.mapaDePoder.alianzas.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Principales Opositores</h4>
                  <p className="text-muted-foreground">{candidate.mapaDePoder.opositores.join(', ')}</p>
                </div>
                 <div>
                  <h4 className="font-semibold">Base de Seguidores</h4>
                  <p className="text-muted-foreground">{candidate.mapaDePoder.seguidores}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}