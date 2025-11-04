// API endpoint: GET /api/candidate/[id]
// Returns compact candidate metadata

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCandidateProfile } from '../../src/data';

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
    
    const profile = getCandidateProfile(id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // Return compact metadata for overlay
    return res.status(200).json({
      id: profile.base.id,
      nombre: profile.base.nombre,
      ideologia: profile.base.ideologia,
      headshot: profile.base.headshot,
      fullBody: profile.base.fullBody,
      proyectoPolitico: profile.proyectoPolitico,
      creenciasClave: profile.creenciasClave?.slice(0, 3), // Top 3 beliefs
      presenciaDigital: profile.presenciaDigital,
    });
  } catch (error) {
    console.error('Error in /api/candidate/[id]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
