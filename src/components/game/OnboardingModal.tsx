import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gamepad2, AlertTriangle, Swords } from "lucide-react";

export function OnboardingModal() {
  const [open, setOpen] = useState(true);

  const handleStart = () => {
    setOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleStart();
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-950 border-2 border-accent/80 shadow-[0_0_20px_rgba(255,193,7,0.3)] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[95vw] sm:w-full">
        <DialogHeader className="space-y-3 sm:space-y-4">
          <div className="mx-auto bg-accent/10 p-2 sm:p-3 rounded-full border-2 border-accent/20 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center animate-pulse">
            <Swords className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          </div>
          <DialogTitle className="text-center text-base sm:text-xl md:text-2xl leading-tight sm:leading-normal text-white uppercase tracking-wide sm:tracking-widest" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            <span className="text-accent drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">ARENA POLÍTICA</span>
            <br />
            <span className="text-[10px] sm:text-sm mt-1 sm:mt-2 block opacity-90">REGLAS DEL TORNEO</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-6 py-3 sm:py-4">
          <p className="text-center text-white/90 font-sans text-sm sm:text-base md:text-lg leading-relaxed">
            Te enfrentarás a duelos <span className="font-bold text-accent">1 vs 1</span> entre candidatos.
          </p>

          <div className="bg-red-950/40 border border-red-500/30 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-100/90 font-sans">
              <span className="font-bold text-red-400 block mb-1 uppercase text-[10px] sm:text-xs tracking-wider">Regla de Oro</span>
              No hay empates ni votos en blanco. Debes elegir una opción para avanzar.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-purple-100/90 font-sans leading-relaxed">
              <span className="font-bold text-purple-300 block mb-1.5 sm:mb-2 text-xs sm:text-sm">💡 Vota con criterio, no por rechazo</span>
              Tu voto es tu voz. No votes en contra de todos ni evadas tu responsabilidad. <span className="font-semibold text-white">Infórmate, compara y elige</span> al candidato que mejor represente tus valores. El cambio empieza con decisiones conscientes.
            </p>
          </div>

          <div className="text-center bg-blue-950/30 border border-blue-500/20 rounded-lg p-2.5 sm:p-3">
             <p className="text-[10px] sm:text-xs md:text-sm text-blue-100/80 font-sans">
               Tus decisiones construirán tu <span className="text-blue-300 font-bold">Ranking Personal</span>.
             </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-center pt-2 sm:pt-0">
          <Button 
            onClick={handleStart}
            className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 sm:py-6 text-base sm:text-lg border-2 border-white/20 hover:border-white/50 shadow-[0_4px_0_rgb(0,0,0,0.5)] hover:shadow-[0_2px_0_rgb(0,0,0,0.5)] hover:translate-y-[2px] transition-all uppercase tracking-wide sm:tracking-widest relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.6rem, 2.5vw, 0.8rem)' }}>
              <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
              ¡EMPEZAR!
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
