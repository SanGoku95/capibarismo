import { useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameUIStore } from '@/store/useGameUIStore';
import { getCandidateProfile } from '@/data';

export function CandidateInfoOverlay() {
  const { candidateInfoOpen, selectedCandidateId, closeCandidateInfo } = useGameUIStore();
  const profile = useMemo(() => {
    if (!selectedCandidateId) return null;
    return getCandidateProfile(selectedCandidateId);
  }, [selectedCandidateId]);
  
  if (!selectedCandidateId) return null;
  
  return (
    <Sheet open={candidateInfoOpen} onOpenChange={(open) => !open && closeCandidateInfo()}>
      <SheetContent className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Información del candidato</SheetTitle>
        </SheetHeader>
        
        {!profile ? (
          <div className="text-sm text-muted-foreground">
            No se encontró información adicional para este candidato.
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6">
              <div className="flex gap-4">
                {profile.base.fullBody || profile.base.headshot ? (
                  <img
                    src={profile.base.fullBody || profile.base.headshot}
                    alt={profile.base.nombre}
                    className="w-24 h-32 object-cover rounded-md border border-white/10"
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div>
                  <p className="text-sm uppercase text-muted-foreground">Nombre</p>
                  <p className="text-2xl font-semibold text-white">{profile.base.nombre}</p>
                  {profile.base.ideologia && (
                    <Badge variant="outline" className="mt-2">
                      {profile.base.ideologia}
                    </Badge>
                  )}
                </div>
              </div>

              {profile.trayectoria && (
                <section>
                  <h3 className="text-lg font-semibold">Trayectoria</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {profile.trayectoria.resumen_corto}
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Educación</p>
                      <p className="text-muted-foreground">{profile.trayectoria.educacion.formacion || 'Sin registro'}</p>
                      <p className="text-xs text-muted-foreground">{profile.trayectoria.educacion.instituciones || ''}</p>
                    </div>
                    <div>
                      <p className="font-medium">Sector público</p>
                      <p className="text-muted-foreground">{profile.trayectoria.sector_publico.cargos_roles || 'Sin registro'}</p>
                      <p className="text-xs text-muted-foreground">{profile.trayectoria.sector_publico.periodo || ''}</p>
                    </div>
                  </div>
                </section>
              )}

              {profile.proyectoPolitico && (
                <section>
                  <h3 className="text-lg font-semibold">Proyecto político</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {profile.proyectoPolitico.resumen}
                  </p>
                  {profile.proyectoPolitico.detalles?.map((detalle) => (
                    <div key={detalle.subtitulo} className="mb-3">
                      <p className="font-medium">{detalle.subtitulo}</p>
                      <p className="text-sm text-muted-foreground">{detalle.texto}</p>
                    </div>
                  ))}
                </section>
              )}

              {profile.creenciasClave.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold">Creencias clave</h3>
                  <div className="space-y-3">
                    {profile.creenciasClave.map((creencia) => (
                      <div key={creencia.id} className="p-3 rounded-md border border-white/10">
                        <p className="font-medium">{creencia.nombre}</p>
                        <p className="text-sm text-muted-foreground">{creencia.resumen}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {profile.controversias && profile.controversias.length > 0 && (
                <section>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Controversias</h3>
                    <span className="text-xs text-muted-foreground">{profile.controversias.length}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="space-y-3">
                    {profile.controversias.map((controversia) => (
                      <div key={controversia.id} className="space-y-1">
                        <p className="font-medium">{controversia.titulo}</p>
                        <p className="text-sm text-muted-foreground">{controversia.descripcion}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </ScrollArea>
        )}
        
        <Button onClick={closeCandidateInfo} className="mt-2 self-end">
          Cerrar
        </Button>
      </SheetContent>
    </Sheet>
  );
}
