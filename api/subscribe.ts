import { createClient } from 'redis';

// This interface is for Vercel Serverless Functions, which is similar to Next.js
export interface Request {
  body: { email?: string };
}

export interface Response {
  status: (code: number) => {
    json: (data: Record<string, any>) => void;
  };
}

// Basic email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: Request, res: Response) {
  if (!process.env.REDIS_URL) {
    console.error("REDIS_URL environment variable not set.");
    return res.status(500).json({ message: 'Error de configuración del servidor.' });
  }

  const { email } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Por favor, provee un correo válido.' });
  }

  try {
    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();

    // SADD adds the email to a set. If it's already a member, it does nothing.
    // This is a great way to store unique emails.
    const result = await redis.sAdd('newsletter_subscribers', email);

    await redis.quit();

    if (result === 0) {
      // The email was already in the set
      return res.status(200).json({ message: 'Ya estás suscrito.' });
    }

    return res.status(201).json({ message: 'Suscripción exitosa.' });

  } catch (error) {
    console.error('Redis Error:', error);
    return res.status(500).json({ message: 'No se pudo procesar la suscripción.' });
  }
}