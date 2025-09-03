// Serverless (Node.js) Vercel Function with streaming
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { streamText } from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import 'dotenv/config';

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(m => m && typeof m === 'object')
    .map(m => {
      const role = (m as any).role;
      const content = (m as any).content;
      if ((role === 'user' || role === 'assistant' || role === 'system') && typeof content === 'string') {
        return { role, content };
      }
      return null;
    })
    .filter(Boolean) as ChatMessage[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'object' && req.body ? req.body : JSON.parse(String(req.body || '{}'));
    const userMessages = normalizeMessages(body.messages);

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'Eres un asistente experto en política peruana. Sé claro, neutral, con contexto y evita desinformación.',
      },
      ...userMessages.filter(m => m.role !== 'system'),
    ];

    if (messages.length === 1) {
      return res.status(400).json({ error: 'No messages provided.' });
    }

    const result = streamText({
      // DeepSeek via AI Gateway (make sure the provider+model is enabled in your Gateway dashboard)
      model: gateway('deepseek/deepseek-v3.1'),
      messages,
      // temperature: 0.7,
    });

    return result.pipeTextStreamToResponse(res, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('deepseek error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}