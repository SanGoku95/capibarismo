// API endpoint: GET /api/candidate/[id]
// Returns compact candidate metadata

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCandidateById } from '../candidates-data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const id = req.query.id as string;
    
    if (!id) {
      return res.status(400).json({ error: 'id required' });
    }
    
    const candidate = getCandidateById(id);
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Return candidate data
    return res.status(200).json(candidate);
  } catch (error) {
    console.error('Error in /api/candidate/[id]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
