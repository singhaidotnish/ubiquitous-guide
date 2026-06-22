// Vercel serverless function — GET /api/insights
// Reads from Neon. Frontend (src/insights.js) falls back to the static
// file automatically if this route errors or isn't deployed yet.

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT id, tag, title, body FROM insights ORDER BY id ASC`;

    // Cache for 5 min at the edge — insights don't change often, no need
    // to hit Neon on every page load.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(rows);
  } catch (err) {
    console.error('GET /api/insights failed:', err);
    return res.status(500).json({ error: 'Failed to fetch insights' });
  }
}
