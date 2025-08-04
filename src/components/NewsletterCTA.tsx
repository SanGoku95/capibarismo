import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error('Por favor, ingresa tu correo electrónico.');
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Algo salió mal.');
      }

      toast.success('¡Gracias por suscribirte! Revisa tu bandeja de entrada.');
      setEmail('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="fighting-game-card border-primary/50 border-2 mt-20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl font-display text-accent">
          Mira la Verdad Electoral
        </CardTitle>
        <CardDescription className="max-w-xl mx-auto text-base mt-2">
          <p className="mb-4">
            Otros medios te muestran su versión de la historia, nosotros te damos el menú completo. Recibe en tu correo:
          </p>
          <ul className="list-disc list-inside text-left space-y-1 inline-block">
            <li>Análisis imparciales.</li>
            <li>Alertas de noticias clave.</li>
            <li>Sin sesgos ni agendas ocultas.</li>
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="tu.correo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="text-base"
          />
          <Button type="submit" disabled={isLoading} className="font-bold">
            {isLoading ? 'Enviando...' : 'Suscribirme'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}