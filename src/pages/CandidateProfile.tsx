import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { candidates } from '@/data/candidates';
import NotFound from './NotFound';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Star, Briefcase, Radio, Power, Rss, Link as LinkIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FaTiktok, FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaRegWindowRestore } from 'react-icons/fa';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const socialIcons: { [key: string]: React.ReactElement } = {
  tiktok: <FaTiktok />,
  youtube: <FaYoutube />,
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
  twitter: <FaTwitter />,
  web: <FaRegWindowRestore />,
};

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const candidate = candidates.find((c) => c.id === id);

  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

  useEffect(() => {
    if (!candidate) return;

    const hash = location.hash.substring(1);
    if (hash) {
      let valueToOpen = hash;
      let elementToScrollToId = hash;

      if (hash.startsWith('creencia-')) {
        valueToOpen = hash.split('creencia-')[1];
        elementToScrollToId = 'creencias-clave';
      } else if (candidate.trayectoria.some(t => t.id === hash)) {
        // If the hash is a specific trajectory ID, open it, but scroll to the main section
        valueToOpen = hash;
        elementToScrollToId = 'trayectoria';
      } else if (hash === 'trayectoria' && candidate.trayectoria.length > 0) {
        // If the hash is for the whole section, open the first item
        valueToOpen = candidate.trayectoria[0].id;
      }
      
      setOpenAccordionItems(prev => [...new Set([...prev, valueToOpen])]);

      const element = document.getElementById(elementToScrollToId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, candidate]);

  const handleGoBack = () => {
    navigate(-1); // This is equivalent to history.back()
  };

  if (!candidate) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen fighting-game-bg text-white">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
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
                  <div className="relative">
                    <div className="absolute inset-0 rounded-lg blur-xl opacity-20 bg-primary"></div>
                    <img
                      src={candidate.fullBody}
                      alt={`Imagen de cuerpo entero de ${candidate.nombre}`}
                      className="relative z-10 w-full max-w-[280px] lg:max-w-full rounded-lg shadow-2xl mx-auto object-cover aspect-[2/3] border-2 border-primary/30"
                      style={{
                        filter: 'drop-shadow(0 0 20px rgba(var(--primary), 0.3))',
                      }}
                    />
                  </div>
                  <h2 className="text-2xl font-bold mt-4 text-center tracking-wide">{candidate.nombre}</h2>
                  <p className="text-center text-muted-foreground font-medium">{candidate.ideologia}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="fighting-game-card scroll-mt-24" id="proyecto-politico">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield size={20} /> Proyecto Político</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold mb-2">{candidate.proyectoPolitico.titulo}</h3>
                <p className="leading-relaxed text-muted-foreground">{candidate.proyectoPolitico.resumen}</p>
                {candidate.proyectoPolitico.detalles && (
                  <Accordion 
                    type="multiple" 
                    className="w-full mt-4"
                    value={openAccordionItems}
                    onValueChange={setOpenAccordionItems}
                  >
                    {candidate.proyectoPolitico.detalles.map((detalle) => (
                      <AccordionItem value={detalle.subtitulo} key={detalle.subtitulo} className="border-b-muted-foreground/20">
                        <AccordionTrigger>{detalle.subtitulo}</AccordionTrigger>
                        <AccordionContent>
                          {detalle.texto}
                          {detalle.fuente && (
                            <a href={detalle.fuente} target="_blank" rel="noopener noreferrer" className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 mt-2">
                              <LinkIcon size={12} />
                              Fuente
                            </a>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>

            <Card className="fighting-game-card scroll-mt-24" id="creencias-clave">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star size={20} /> Creencias Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion 
                  type="multiple" 
                  className="w-full"
                  value={openAccordionItems}
                  onValueChange={setOpenAccordionItems}
                >
                  {candidate.creenciasClave.map((creencia) => (
                    <AccordionItem value={creencia.id} key={creencia.id} id={`creencia-${creencia.id}`} className="border-b-muted-foreground/20">
                      <AccordionTrigger>{creencia.nombre}</AccordionTrigger>
                      <AccordionContent>
                        <p>{creencia.resumen}</p>
                        {creencia.detalle && <p className="mt-2 text-sm text-muted-foreground">{creencia.detalle}</p>}
                        {creencia.fuente && (
                          <a href={creencia.fuente} target="_blank" rel="noopener noreferrer" className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 mt-2">
                            <LinkIcon size={12} />
                            Fuente
                          </a>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="fighting-game-card scroll-mt-24" id="trayectoria">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase size={20} /> Trayectoria</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion 
                  type="multiple" 
                  className="w-full"
                  value={openAccordionItems}
                  onValueChange={setOpenAccordionItems}
                >
                  {candidate.trayectoria.map((item) => (
                    <AccordionItem value={item.id} key={item.id} id={item.id} className="border-b-muted-foreground/20">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex-1">
                          <p className="font-semibold text-base">{item.rol}</p>
                          <p className="text-sm text-muted-foreground font-normal">({item.periodo})</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-4">
                        <p className="text-base text-muted-foreground">{item.descripcion}</p>
                        {item.detalles && item.detalles.map((detalle, index) => (
                          <div key={index} className="pl-4 border-l-2 border-primary/30">
                            <h4 className="font-semibold text-foreground">{detalle.subtitulo}</h4>
                            <p className="text-muted-foreground mt-1">{detalle.texto}</p>
                          </div>
                        ))}
                        {item.fuente && (
                          <a href={item.fuente} target="_blank" rel="noopener noreferrer" className="text-xs text-primary/80 hover:text-primary flex items-center gap-1 mt-4">
                            <LinkIcon size={12} />
                            Fuente
                          </a>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="fighting-game-card scroll-mt-24" id="presencia-digital">
              <CardHeader>
              <CardTitle className="flex items-center gap-2"><Rss size={20} /> Presencia en Medios Digitales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              {candidate.presenciaDigital.plataformas.map((plataforma) => (
                <div key={plataforma.nombre} className="flex items-start gap-4">
                <div className="text-2xl text-muted-foreground mt-1">
                  {socialIcons[plataforma.nombre] || <Radio />}
                </div>
                <div>
                  <a href={plataforma.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  <h4 className="font-semibold capitalize flex items-center gap-1.5">
                    {plataforma.nombre}
                    <LinkIcon size={14} className="inline-block text-primary/80" />
                  </h4>
                  </a>
                  <p className="leading-relaxed text-muted-foreground mt-1">{plataforma.estrategia}</p>
                </div>
                </div>
              ))}
              </CardContent>
            </Card>

            <Card className="fighting-game-card scroll-mt-24" id="mapa-de-poder">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Power size={20} /> Mapa de Poder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Alianzas Clave</h4>
                  <div className="space-y-3">
                    {candidate.mapaDePoder.alianzas.map(item => (
                      <div key={item.nombre}>
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-sm text-muted-foreground">{item.descripcion}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-lg mb-2">Principales Opositores</h4>
                  <div className="space-y-3">
                    {candidate.mapaDePoder.opositores.map(item => (
                      <div key={item.nombre}>
                        <p className="font-semibold">{item.nombre}</p>
                        <p className="text-sm text-muted-foreground">{item.descripcion}</p>
                      </div>
                    ))}
                  </div>
                </div>
                 <Separator />
                 <div>
                  <h4 className="font-semibold text-lg">Base de Seguidores</h4>
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