import { useState } from 'react';
import { PoliticalCompass, Axis } from '@/components/political-compass/PoliticalCompass';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Definimos los ejes disponibles para que sean reutilizables
const availableAxes: { key: Axis; label: string }[] = [
  { key: 'econ', label: 'Eje Económico' },
  { key: 'social', label: 'Eje Social' },
  { key: 'territorial', label: 'Eje Territorial' },
  { key: 'power', label: 'Estilo de Poder' },
];

// Componente para los controles de selección de ejes
function AxisControls({ xAxis, yAxis, onXChange, onYChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 p-4 rounded-lg fighting-game-card border-2 border-accent/50 max-w-lg mx-auto">
      <div className="w-full sm:w-1/2">
        <label htmlFor="x-axis-select" className="block text-sm font-display text-accent mb-2">
          EJE X
        </label>
        <Select value={xAxis} onValueChange={onXChange}>
          <SelectTrigger id="x-axis-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableAxes.map(axis => (
              <SelectItem key={axis.key} value={axis.key} disabled={axis.key === yAxis}>
                {axis.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-1/2">
        <label htmlFor="y-axis-select" className="block text-sm font-display text-accent mb-2">
          EJE Y
        </label>
        <Select value={yAxis} onValueChange={onYChange}>
          <SelectTrigger id="y-axis-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableAxes.map(axis => (
              <SelectItem key={axis.key} value={axis.key} disabled={axis.key === xAxis}>
                {axis.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function PoliticalCompassPage() {
  const [xAxis, setXAxis] = useState<Axis>('econ');
  const [yAxis, setYAxis] = useState<Axis>('social');

  return (
    <div className="min-h-screen fighting-game-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display text-accent mb-4">
            Mapa Ideológico
          </h1>
          <p className="text-lg text-foreground/90 max-w-3xl mx-auto">
            Crea tu propio cuadrilátero. Cambia los ejes para cruzar posturas y descubrir nuevas perspectivas.
          </p>
        </div>

        {/* Axis Selection Controls */}
        <AxisControls 
          xAxis={xAxis} 
          yAxis={yAxis} 
          onXChange={setXAxis} 
          onYChange={setYAxis} 
        />

        {/* ==================================================================== */}
        {/* AJUSTE 3: EXPLICACIÓN DE EJES MOVIDA ARRIBA DEL GRÁFICO */}
        {/* ==================================================================== */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-8">
          <Card className="fighting-game-card">
            <CardHeader><CardTitle className="text-accent font-display">Eje Económico</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Izquierda:</strong> Mayor intervención estatal, regulación.</p>
              <p><strong>Derecha:</strong> Libre mercado, menor intervención.</p>
            </CardContent>
          </Card>
          <Card className="fighting-game-card">
            <CardHeader><CardTitle className="text-accent font-display">Eje Social</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Libertario:</strong> Máximas libertades individuales.</p>
              <p><strong>Autoritario:</strong> Mayor control social, orden.</p>
            </CardContent>
          </Card>
          <Card className="fighting-game-card">
            <CardHeader><CardTitle className="text-accent font-display">Eje Territorial</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Regionalista:</strong> Mayor poder a las regiones.</p>
              <p><strong>Centralista:</strong> Poder concentrado en Lima.</p>
            </CardContent>
          </Card>
          <Card className="fighting-game-card">
            <CardHeader><CardTitle className="text-accent font-display">Estilo de Poder</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Populista:</strong> Desafía a las instituciones.</p>
              <p><strong>Institucionalista:</strong> Respeta las reglas del sistema.</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Compass */}
        <div className="max-w-5xl mx-auto mb-8">
          <PoliticalCompass 
            width={600} 
            height={600} 
            xAxisKey={xAxis} 
            yAxisKey={yAxis} 
          />
        </div>

      </div>
    </div>
  );
}

export default PoliticalCompassPage;