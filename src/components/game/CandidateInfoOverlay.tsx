import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGameUIStore } from '@/store/useGameUIStore';
import { getCandidateProfile } from '@/data';
import { ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CandidateInfoOverlay() {
  const { candidateInfoOpen, selectedCandidateId, closeCandidateInfo } = useGameUIStore();
  
  if (!selectedCandidateId) return null;
  
  const profile = getCandidateProfile(selectedCandidateId);
  
  if (!profile) return null;
  
  return (
    <Sheet open={candidateInfoOpen} onOpenChange={(open) => !open && closeCandidateInfo()}>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start gap-4">
            <img
              src={profile.base.headshot}
              alt={profile.base.nombre}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <SheetTitle className="text-2xl">{profile.base.nombre}</SheetTitle>
              <SheetDescription>{profile.base.ideologia}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Proyecto Político */}
          {profile.proyectoPolitico && (
            <section>
              <h3 className="text-lg font-semibold mb-2">{profile.proyectoPolitico.titulo}</h3>
              <p className="text-sm text-muted-foreground mb-3">{profile.proyectoPolitico.resumen}</p>
              {profile.proyectoPolitico.detalles && profile.proyectoPolitico.detalles.length > 0 && (
                <div className="space-y-2">
                  {profile.proyectoPolitico.detalles.slice(0, 2).map((detalle, idx) => (
                    <div key={idx} className="border-l-2 border-primary pl-3">
                      <h4 className="font-medium text-sm">{detalle.subtitulo}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{detalle.texto}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          
          {/* Creencias Clave */}
          {profile.creenciasClave && profile.creenciasClave.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold mb-3">Creencias Clave</h3>
              <div className="space-y-2">
                {profile.creenciasClave.slice(0, 3).map((creencia) => (
                  <div key={creencia.id} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">{creencia.nombre}</h4>
                    <p className="text-xs text-muted-foreground">{creencia.resumen}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Presencia Digital */}
          {profile.presenciaDigital && (
            <section>
              <h3 className="text-lg font-semibold mb-3">Presencia Digital</h3>
              <div className="flex flex-wrap gap-2">
                {profile.presenciaDigital.plataformas.slice(0, 4).map((plat, idx) => (
                  <Badge key={idx} variant="outline" className="gap-1">
                    {plat.nombre}
                    {plat.handle && ` @${plat.handle}`}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>
        
        <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
          <Button onClick={closeCandidateInfo} className="w-full sm:w-auto">
            Volver al juego
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to={`/candidate/${profile.base.id}`} target="_blank">
              Ver perfil completo
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
