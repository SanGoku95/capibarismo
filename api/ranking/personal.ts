import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob'; // Import list directly
import { listCandidates } from '../candidates-data.js';
import { INITIAL_ELO, updateElo } from '../elo.js';
import { VoteRecord } from '../types.js'; // Assuming types.ts is correct

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Added for consistency

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end(); // Explicitly handle GET

  const sessionId = req.query.sessionId as string;
  if (!sessionId) return res.status(400).json({ error: 'Session ID required' });

  try {
    // --- START TEMPORARY FIX ---
    // This logic should be in `storage.ts`, but we apply it here to get the test working.
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('Blob read/write token is missing');
    }

    const { blobs } = await list({
      prefix: `sessions/${sessionId}/votes/`,
      limit: 1000,
      token, // The crucial fix
    });

    const history: VoteRecord[] = (
      await Promise.all(
        blobs.map(async (blob) => {
          try {
            const res = await fetch(blob.url, { cache: 'no-store' });
            if (!res.ok) return null;
            return (await res.json()) as VoteRecord;
          } catch {
            return null;
          }
        }),
      )
    )
      .filter((v): v is VoteRecord => v !== null)
      .sort((a, b) => a.timestamp - b.timestamp);
    // --- END TEMPORARY FIX ---

    const candidates = listCandidates();

    // Initialize ratings and stats
    const localRatings: Record<string, number> = {};
    const stats: Record<string, { wins: number; losses: number; matches: number }> = {};

    candidates.forEach((c) => {
      localRatings[c.id] = INITIAL_ELO;
      stats[c.id] = { wins: 0, losses: 0, matches: 0 };
    });

    // Replay vote history
    for (const vote of history) {
      const rA = localRatings[vote.winnerId] || INITIAL_ELO;
      const rB = localRatings[vote.loserId] || INITIAL_ELO;
      const [newA, newB] = updateElo(rA, rB, true);

      localRatings[vote.winnerId] = newA;
      localRatings[vote.loserId] = newB;

      // Track stats
      if (stats[vote.winnerId]) {
        stats[vote.winnerId].wins++;
        stats[vote.winnerId].matches++;
      }
      if (stats[vote.loserId]) {
        stats[vote.loserId].losses++;
        stats[vote.loserId].matches++;
      }
    }

    // Build ranking with only necessary fields
    const ranking = candidates
      .map((c) => {
        const s = stats[c.id];
        const rating = Math.round(localRatings[c.id]);
        const winRate = s.matches > 0 ? Math.round((s.wins / s.matches) * 100) : 0;

        return {
          rank: 0, // Set after sorting
          candidateId: c.id,
          name: c.nombre,
          ideologia: c.ideologia,
          rating,
          score: rating,
          wins: s.wins,
          losses: s.losses,
          games: s.matches,
          winRate,
          rd: 0,
        };
      })
      .sort((a, b) => b.rating - a.rating)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return res.status(200).json(ranking);
  } catch (error) {
    console.error('[personal] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}