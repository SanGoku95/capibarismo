import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState, useRef } from "react";
import { getCandidateProfile } from '@/data';
import NotFound from './NotFound';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, GraduationCap, Building2, Gavel, Wallet, Home, Car } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { usePersonSEO } from '@/lib/useSEO';
import type { CandidateProfile as CandidateProfileType } from '@/data/types';

// Helper para formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper para obtener badge de fallo de sentencia
const getFalloBadge = (fallo: string) => {
  const falloLower = fallo.toLowerCase();
  if (falloLower.includes('absuelto') || falloLower.includes('sobreseida')) {
    return { className: 'bg-emerald-600/90 text-white', label: fallo };
  }
  if (falloLower.includes('pena privativa') || falloLower.includes('condena')) {
    return { className: 'bg-red-600/90 text-white', label: fallo };
  }
  return { className: 'bg-amber-500/90 text-black', label: fallo };
};

export function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const profile = id ? getCandidateProfile(id) : null;

  type CandidateView = CandidateProfileType['base'] & Pick<CandidateProfileType,
    'educacion' | 'experienciaLaboral' | 'sentencias' | 'propiedades' | 'ingresos'
  >;

  const candidate = useMemo<CandidateView | null>(() => (
    profile?.base
      ? {
          ...profile.base,
          educacion: profile.educacion,
          experienciaLaboral: profile.experienciaLaboral,
          sentencias: profile.sentencias,
          propiedades: profile.propiedades,
          ingresos: profile.ingresos,
        }
      : null
  ), [profile]);

  const lastProcessedHash = useRef<string>('');

  useEffect(() => {
    if (!candidate) return;

    const hash = location.hash.substring(1);

    if (hash === lastProcessedHash.current) {
      return;
    }

    lastProcessedHash.current = hash;

    if (hash) {
      // Handle section scrolling
      if (hash.startsWith('tray-') || ['trayectoria', 'sentencias', 'patrimonio'].includes(hash)) {
        const sectionEl = document.getElementById(hash);
        if (sectionEl) {
          setTimeout(() => {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
        return;
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, candidate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  usePersonSEO(
    candidate?.nombre || 'Candidato',
    candidate ? `${candidate.nombre} - ${candidate.ideologia ?? ''}. Perfil de candidato presidencial Perú 2026`.trim() : 'Perfil de candidato',
    'Candidato Presidencial de Perú 2026',
    candidate?.headshot ? `https://capibarismo.com${candidate.headshot}` : undefined,
    candidate?.partido,
    []
  );

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
                  <p className="text-center text-muted-foreground font-medium">{candidate.partido}</p>
                  {candidate.ideologia && (
                    <p className="text-center text-sm text-muted-foreground/70">{candidate.ideologia}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Trayectoria - Educación y Experiencia Laboral */}
            <Card className="fighting-game-card scroll-mt-24" id="trayectoria">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase size={20} /> Trayectoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sección Educación */}
                <section id="tray-educacion" className="scroll-mt-28">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <GraduationCap size={18} className="opacity-80" /> Educación
                  </h4>
                  {candidate.educacion ? (
                    <div className="space-y-4">
                      {/* Educación Básica */}
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Educación básica:</span>{' '}
                        Primaria: {candidate.educacion.basica.primaria} | Secundaria: {candidate.educacion.basica.secundaria}
                      </div>

                      {/* Universitaria */}
                      {candidate.educacion.universitaria.length > 0 && (
                        <div>
                          <p className="font-medium text-sm mb-2">Estudios Universitarios</p>
                          <div className="space-y-2">
                            {candidate.educacion.universitaria.map((uni, idx) => (
                              <div key={idx} className="pl-4 border-l-2 border-primary/30">
                                <p className="text-muted-foreground">{uni.carrera}</p>
                                <p className="text-sm text-muted-foreground/70">{uni.universidad} {uni.año !== 'None' && `(${uni.año})`}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Postgrado */}
                      {candidate.educacion.postgrado.length > 0 && (
                        <div>
                          <p className="font-medium text-sm mb-2">Postgrado</p>
                          <div className="space-y-2">
                            {candidate.educacion.postgrado.map((pg, idx) => (
                              <div key={idx} className="pl-4 border-l-2 border-primary/30">
                                <p className="text-muted-foreground">
                                  <Badge variant="outline" className="mr-2 text-xs">{pg.tipo}</Badge>
                                  {pg.especialidad}
                                </p>
                                <p className="text-sm text-muted-foreground/70">{pg.institucion} {pg.año !== 'None' && `(${pg.año})`}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sin información de educación disponible</p>
                  )}
                </section>

                <Separator />

                {/* Sección Experiencia Laboral */}
                <section id="tray-experiencia" className="scroll-mt-28">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Building2 size={18} className="opacity-80" /> Experiencia Laboral
                  </h4>
                  {candidate.experienciaLaboral && candidate.experienciaLaboral.length > 0 ? (
                    <div className="space-y-3">
                      {candidate.experienciaLaboral.map((trabajo, idx) => (
                        <div key={idx} className="pl-4 border-l-2 border-primary/30">
                          <p className="font-medium">{trabajo.puesto}</p>
                          <p className="text-muted-foreground">{trabajo.empresa}</p>
                          <p className="text-sm text-muted-foreground/70">
                            {trabajo.periodo} • {trabajo.ubicacion}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sin información de experiencia laboral disponible</p>
                  )}
                </section>
              </CardContent>
            </Card>

            {/* Sentencias */}
            <Card className="fighting-game-card scroll-mt-24" id="sentencias">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gavel size={20} /> Sentencias Judiciales</CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.sentencias && candidate.sentencias.length > 0 ? (
                  <div className="space-y-4">
                    {candidate.sentencias.map((sentencia, idx) => {
                      const falloBadge = getFalloBadge(sentencia.fallo);
                      return (
                        <div key={idx} className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline">{sentencia.año}</Badge>
                            <Badge className={falloBadge.className}>{falloBadge.label}</Badge>
                          </div>
                          <p className="font-medium">{sentencia.delito}</p>
                          <p className="text-sm text-muted-foreground mt-1">{sentencia.organo}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Gavel size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-muted-foreground">Sin sentencias judiciales registradas</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground/70 mt-4">
                  Fuente: Declaración Jurada de Hoja de Vida - JNE
                </p>
              </CardContent>
            </Card>

            {/* Patrimonio */}
            <Card className="fighting-game-card scroll-mt-24" id="patrimonio">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet size={20} /> Patrimonio Declarado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Propiedades */}
                <section>
                  <h4 className="font-semibold text-lg mb-3">Bienes</h4>
                  {candidate.propiedades ? (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                        <Home size={24} className="mx-auto mb-2 opacity-70" />
                        <p className="text-2xl font-bold">{candidate.propiedades.inmuebles}</p>
                        <p className="text-sm text-muted-foreground">Inmuebles</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                        <Car size={24} className="mx-auto mb-2 opacity-70" />
                        <p className="text-2xl font-bold">{candidate.propiedades.vehiculos}</p>
                        <p className="text-sm text-muted-foreground">Vehículos</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                        <Wallet size={24} className="mx-auto mb-2 opacity-70" />
                        <p className="text-2xl font-bold">{candidate.propiedades.otros}</p>
                        <p className="text-sm text-muted-foreground">Otros</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sin información de propiedades disponible</p>
                  )}
                </section>

                <Separator />

                {/* Ingresos */}
                <section>
                  <h4 className="font-semibold text-lg mb-3">Ingresos Anuales</h4>
                  {candidate.ingresos && candidate.ingresos.length > 0 ? (
                    <div className="space-y-3">
                      {candidate.ingresos.map((ingreso, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline">{ingreso.año}</Badge>
                            <span className="text-xl font-bold text-primary">{formatCurrency(ingreso.total)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Sector Público</p>
                              <p className="font-medium">{formatCurrency(ingreso.publico)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Sector Privado</p>
                              <p className="font-medium">{formatCurrency(ingreso.privado)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sin información de ingresos disponible</p>
                  )}
                </section>

                <p className="text-xs text-muted-foreground/70 mt-4">
                  Fuente: Declaración Jurada de Hoja de Vida - JNE
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
