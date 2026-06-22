// Daily trading insights — bite-sized "why this matters" notes.
//
// DATA SOURCE: tries /api/insights (Neon-backed Vercel function) first.
// If that route doesn't exist yet or fails, falls back to FALLBACK_INSIGHTS below.
// This means: today you're on the file. Later, drop in an /api/insights.js
// serverless function backed by Neon and this swaps over automatically —
// no changes needed here or in App.jsx.
//
// Shape expected from either source: array of { id, tag, title, body }

const FALLBACK_INSIGHTS = [
  {
    id: 1,
    tag: 'Scanners',
    title: 'Why daily candles, not 1-minute',
    body: "1-min/3-min charts need a live Kite login because they're real-time ticks — Streak has to pull live data, not settled EOD data. Daily charts don't need this since they're locked in at market close.",
  },
  {
    id: 2,
    tag: 'Scanners',
    title: '"Down from 52-week high" only works on daily charts',
    body: "A 15% drop from the 52-week high only makes sense measured day-to-day. On a 1-min chart you'd be comparing today's high to a random minute from a year ago — meaningless.",
  },
  {
    id: 3,
    tag: 'RSI',
    title: 'RSI(14) < 40 — momentum, not price',
    body: "RSI measures momentum, not how cheap something is. A stock can be down 20% but still have RSI 60 — meaning sellers already lost control. RSI < 40 catches stocks where selling pressure is still active right now. That's your actual entry signal, not just 'it's down.'",
  },
  {
    id: 4,
    tag: 'EMA',
    title: 'The 50 EMA filter stops you catching falling knives',
    body: "15% off highs + RSI 35 could be a healthy pullback OR a structural breakdown. If price is still within 5% of the 50-day EMA → pullback. If it's crashed way below the 50 EMA → the trend itself broke. Different risk profile, not a dip-buy setup anymore.",
  },
  {
    id: 5,
    tag: 'Discipline',
    title: 'High confidence = smaller size, not larger',
    body: "Feeling certain about a trade is not the same as the trade being safe. Conviction has caused more blow-ups than doubt ever has — size down when you feel most sure, that's exactly when you're least likely to check your own logic.",
  },
  {
    id: 6,
    tag: 'Discipline',
    title: 'Winning streaks are a risk signal, not a safety signal',
    body: "A run of wins makes the next trade feel like it can't fail. That feeling is the danger — not the market. Treat a hot streak as a cue to tighten rules, not loosen them.",
  },
];

// Fetches insights from /api/insights if available, otherwise returns the
// static fallback list. Always resolves — never throws — so callers don't
// need their own try/catch.
export async function fetchInsights() {
  try {
    const res = await fetch('/api/insights');
    if (!res.ok) throw new Error('no api route yet');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('empty response');
    return data;
  } catch {
    return FALLBACK_INSIGHTS;
  }
}

// Deterministic "insight of the day" — same insight all day, rotates daily.
// Takes the resolved insights list (from fetchInsights) so it works with
// either data source.
export function getTodayInsight(insights) {
  if (!insights || insights.length === 0) return null;
  const dayIndex = Math.floor(Date.now() / 86400000); // days since epoch
  const idx = dayIndex % insights.length;
  return insights[idx];
}

export default FALLBACK_INSIGHTS;
