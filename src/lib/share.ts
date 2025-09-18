import { toast } from "@/hooks/use-toast";

interface SharePayload {
  title: string;
  text: string;
  url: string;
}

export async function shareOrCopy({ title, text, url }: SharePayload) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return true;
    }
  } catch (error) {
    console.warn('Web Share API failed, falling back to clipboard', error);
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`.trim());
    toast({
      title: "Enlace copiado",
      description: "Listo para compartir en tus redes.",
    });
    return true;
  } catch (error) {
    console.error('No se pudo copiar el enlace', error);
    toast({
      title: "No se pudo compartir",
      description: "Intenta nuevamente desde un navegador compatible.",
      variant: "destructive",
    });
    return false;
  }
}

