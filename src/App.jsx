import React, { useState } from 'react';
import { Check, AlertTriangle, TrendingUp, Brain, Shield, Lock, ExternalLink } from 'lucide-react';

const C = {
  bg: '#f8fafc',
  white: '#ffffff',
  border: '#e2e8f0',
  borderHover: '#93c5fd',
  text: '#1e293b',
  muted: '#64748b',
  hint: '#94a3b8',
  green: '#16a34a',
  greenBg: '#f0fdf4',
  greenBorder: '#86efac',
  blue: '#2563eb',
  blueBg: '#eff6ff',
  blueBorder: '#93c5fd',
  teal: '#0f766e',
  tealBg: '#f0fdfa',
  tealBorder: '#5eead4',
  red: '#dc2626',
  redBg: '#fef2f2',
  redBorder: '#fca5a5',
  yellow: '#d97706',
  yellowBg: '#fffbeb',
  yellowBorder: '#fcd34d',
  orange: '#ea580c',
  orangeBg: '#fff7ed',
  purple: '#7c3aed',
  purpleBg: '#faf5ff',
  purpleBorder: '#c4b5fd',
  gray: '#6b7280',
  grayBg: '#f9fafb',
  grayBorder: '#d1d5db',
};

const card = {
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: '16px 20px',
  marginBottom: 12,
};

const pill = (selected, selBg, selBorder, selText) => ({
  padding: '8px 18px',
  borderRadius: 999,
  border: `2px solid ${selected ? selBorder : C.border}`,
  background: selected ? selBg : C.white,
  color: selected ? selText : C.muted,
  fontWeight: 500,
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all 0.15s',
});

const linkPill = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 12,
  color: C.blue,
  background: C.blueBg,
  border: `1px solid ${C.blueBorder}`,
  borderRadius: 999,
  padding: '4px 12px',
  marginRight: 6,
  marginTop: 8,
  textDecoration: 'none',
  cursor: 'pointer',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('marketview');
  const [trend, setTrend] = useState(null);
  const [vix, setVix] = useState(null);
  const [eventsChecked, setEventsChecked] = useState(false);
  const [thesis, setThesis] = useState('');

  const [preMarket, setPreMarket] = useState({ reviewedRules: false, setDailyLimit: false, checkedCalendar: false, mentalState: false, positionSized: false });
  const [trade, setTrade] = useState({ waitedCooldown: false, wroteReason: false, checkedRisk: false, noFOMO: false, withinLimits: false });
  const [postTrade, setPostTrade] = useState({ loggedTrade: false, emotionNoted: false, followedPlan: false, reviewedMistake: false });
  const [stats, setStats] = useState({ trades: '', pnl: '', emotion: '' });
  const [impulse, setImpulse] = useState([
    { trigger: 'Feeling FOMO', action: 'Close charts for 10 min', checked: false },
    { trigger: 'After a loss', action: 'Wait 30 min cooldown', checked: false },
    { trigger: 'Want to increase size', action: 'Write reason + wait 15 min', checked: false },
    { trigger: 'Market moving fast', action: 'Take 3 deep breaths', checked: false },
    { trigger: 'Bored/restless', action: 'Close trading app', checked: false },
  ]);

  const mvSteps = [trend, vix, eventsChecked].filter(Boolean).length;
  const mvPct = Math.round((mvSteps / 3) * 100);
  const mvComplete = mvSteps === 3 && thesis.trim().length > 10;

  const rate = (obj) => {
    const vals = Object.values(obj);
    return Math.round((vals.filter(Boolean).length / vals.length) * 100);
  };

  const toggle = (setter, key) => setter(prev => ({ ...prev, [key]: !prev[key] }));

  const scanTip = {
    up: '📈 Bullish → Streak scan: "Price above 20 EMA + RSI above 50" — look for Bull Put Spread setups.',
    down: '📉 Bearish → Streak scan: "Price below 20 EMA + RSI below 50" — look for Bear Call Spread setups.',
    side: '↔️ Sideways → Streak scan: "RSI between 40–60 + Bollinger Band squeeze" — look for Iron Condor setups.',
  };

  const tabs = [
    { id: 'marketview', label: '🧭 Market View', locked: false },
    { id: 'premarket', label: '📋 Pre-Market', locked: !mvComplete },
    { id: 'trade', label: '⚡ Before Trade', locked: !mvComplete },
    { id: 'posttrade', label: '📝 Post-Trade', locked: false },
    { id: 'impulse', label: '🛡 Impulse', locked: false },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '16px 12px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Brain style={{ color: C.purple, width: 32, height: 32, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>ADHD Trading System</div>
            <div style={{ fontSize: 13, color: C.muted }}>Your external brain for disciplined trading</div>
          </div>
        </div>

        {/* Banner */}
        <div style={{ background: C.yellowBg, borderLeft: `4px solid ${C.yellow}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10 }}>
          <AlertTriangle style={{ color: C.yellow, width: 18, height: 18, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600, color: '#92400e', fontSize: 14 }}>Rule #1: Market view before everything</div>
            <div style={{ fontSize: 13, color: '#b45309' }}>No thesis = no trade. Complete Market View to unlock the rest.</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: 4, marginBottom: 16, paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => !t.locked && setActiveTab(t.id)}
              style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', cursor: t.locked ? 'not-allowed' : 'pointer',
                background: activeTab === t.id ? C.blueBg : 'transparent',
                color: activeTab === t.id ? C.blue : t.locked ? C.hint : C.muted,
                borderBottom: activeTab === t.id ? `2px solid ${C.blue}` : '2px solid transparent',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
              {t.locked && <Lock style={{ width: 11, height: 11 }} />}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── MARKET VIEW ── */}
        {activeTab === 'marketview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Market View</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.teal }}>{mvPct}%</div>
                <div style={{ fontSize: 11, color: C.muted }}>Steps done</div>
              </div>
            </div>

            {/* Progress */}
            <div style={{ background: C.grayBorder, borderRadius: 4, height: 6, marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ width: `${mvPct}%`, height: '100%', background: C.teal, borderRadius: 4, transition: 'width 0.3s' }} />
            </div>

            {/* Step 1 */}
            <div style={card}>
              <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>Step 1 — NIFTY direction this week</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Look at the weekly chart. Pick one.</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <button onClick={() => setTrend('up')} style={pill(trend === 'up', C.greenBg, C.green, C.green)}>↑ Uptrend</button>
                <button onClick={() => setTrend('side')} style={pill(trend === 'side', C.yellowBg, C.yellow, C.yellow)}>→ Sideways</button>
                <button onClick={() => setTrend('down')} style={pill(trend === 'down', C.redBg, C.red, C.red)}>↓ Downtrend</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <a href="https://in.tradingview.com/chart/?symbol=NSE%3ANIFTY" target="_blank" rel="noreferrer" style={linkPill}><ExternalLink style={{ width: 11, height: 11 }} /> TradingView NIFTY</a>
                <a href="https://www.nseindia.com/market-data/live-market-indices" target="_blank" rel="noreferrer" style={linkPill}><ExternalLink style={{ width: 11, height: 11 }} /> NSE Live</a>
              </div>
              {trend && (
                <div style={{ marginTop: 12, background: C.tealBg, border: `1px solid ${C.tealBorder}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.teal }}>
                  {scanTip[trend]}
                  <div><a href="https://streak.world/scanner" target="_blank" rel="noreferrer" style={linkPill}><ExternalLink style={{ width: 11, height: 11 }} /> Open Streak Scanner</a></div>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div style={card}>
              <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>Step 2 — India VIX (fear gauge)</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Below 15 = calm. 15–20 = moderate. Above 20 = high fear, trade smaller.</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                <button onClick={() => setVix('low')} style={pill(vix === 'low', C.blueBg, C.blue, C.blue)}>Below 15 — calm</button>
                <button onClick={() => setVix('mid')} style={pill(vix === 'mid', C.blueBg, C.blue, C.blue)}>15–20 — moderate</button>
                <button onClick={() => setVix('high')} style={pill(vix === 'high', C.blueBg, C.blue, C.blue)}>Above 20 — high fear</button>
              </div>
              <a href="https://www.nseindia.com/market-data/india-vix" target="_blank" rel="noreferrer" style={linkPill}><ExternalLink style={{ width: 11, height: 11 }} /> India VIX — NSE</a>
            </div>

            {/* Step 3 */}
            <div style={card}>
              <div style={{ fontWeight: 600, color: C.text, marginBottom: 12 }}>Step 3 — Big events this week</div>
              {[
                { label: 'RBI policy / MPC meeting', href: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx', link: 'RBI site' },
                { label: 'US Fed / global macro events', href: 'https://www.forexfactory.com/calendar', link: 'Forex Factory' },
                { label: 'NSE earnings announcements', href: 'https://www.nseindia.com/companies-listing/corporate-filings-financial-results', link: 'NSE results' },
                { label: 'Expiry day (every Thursday)', href: null },
              ].map(({ label, href, link }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.text }}>{label}</span>
                  {href && <a href={href} target="_blank" rel="noreferrer" style={linkPill}><ExternalLink style={{ width: 11, height: 11 }} /> {link}</a>}
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                <button onClick={() => setEventsChecked(e => !e)}
                  style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${eventsChecked ? C.green : C.grayBorder}`, background: eventsChecked ? C.green : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  {eventsChecked && <Check style={{ width: 14, height: 14, color: 'white' }} />}
                </button>
                <span style={{ fontSize: 14, color: C.text }}>I've checked for events this week</span>
              </div>
            </div>

            {/* Step 4 Thesis */}
            <div style={card}>
              <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>Step 4 — Write your thesis</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Complete steps 1–3 first. Then write your view in one sentence.</div>
              {mvSteps < 3 ? (
                <div style={{ background: C.grayBg, border: `1px solid ${C.grayBorder}`, borderRadius: 8, padding: 24, textAlign: 'center', color: C.hint, fontSize: 14 }}>
                  <Lock style={{ width: 20, height: 20, margin: '0 auto 8px', display: 'block' }} />
                  Complete steps 1, 2 and 3 to unlock
                </div>
              ) : (
                <>
                  <textarea
                    value={thesis}
                    onChange={e => setThesis(e.target.value)}
                    placeholder='Example: "NIFTY is bullish this week, VIX is calm, no major events — I will look for Bull Put Spread setups."'
                    style={{ width: '100%', border: `2px solid ${thesis.trim().length > 10 ? C.green : C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'none', minHeight: 80, outline: 'none', color: C.text, background: C.white, boxSizing: 'border-box' }}
                  />
                  {mvComplete && (
                    <div style={{ marginTop: 10, background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.green, fontWeight: 600 }}>
                      ✅ Market view complete — Pre-Market and Before Trade tabs are now unlocked.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ── PRE-MARKET ── */}
        {activeTab === 'premarket' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Morning Routine</div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 24, fontWeight: 700, color: C.blue }}>{rate(preMarket)}%</div><div style={{ fontSize: 11, color: C.muted }}>Complete</div></div>
            </div>
            {[
              { key: 'reviewedRules', label: 'Read my trading rules (30 seconds)', desc: 'No rules = emotional decisions. Your ADHD brain needs reminders.' },
              { key: 'setDailyLimit', label: 'Set daily loss limit (write it down)', desc: 'Example: Stop trading if down ₹5,000 or 2% of capital' },
              { key: 'checkedCalendar', label: 'Check economic calendar/news', desc: 'Know what events might spike volatility today' },
              { key: 'mentalState', label: 'Mental state check: Am I calm?', desc: 'Stressed/angry/overconfident? Don\'t trade today.' },
              { key: 'positionSized', label: 'Position size calculated for today', desc: 'Know your max position BEFORE you see opportunities' },
            ].map(({ key, label, desc }) => (
              <CheckItem key={key} checked={preMarket[key]} onChange={() => toggle(setPreMarket, key)} label={label} desc={desc} />
            ))}
          </div>
        )}

        {/* ── BEFORE TRADE ── */}
        {activeTab === 'trade' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Before Every Trade</div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 24, fontWeight: 700, color: C.green }}>{rate(trade)}%</div><div style={{ fontSize: 11, color: C.muted }}>Complete</div></div>
            </div>
            <div style={{ background: C.redBg, border: `1px solid ${C.redBorder}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, fontWeight: 600, color: C.red }}>
              STOP: This takes 2 minutes. If you can't wait 2 minutes, you're trading on impulse.
            </div>
            {[
              { key: 'waitedCooldown', label: 'Waited cooldown period (if previous trade was loss)', desc: '30 min minimum after loss. Revenge trading destroys accounts.' },
              { key: 'wroteReason', label: 'Wrote down WHY I\'m taking this trade', desc: 'If you can\'t explain it in one sentence, don\'t trade it' },
              { key: 'checkedRisk', label: 'Risk calculated: Max loss is acceptable', desc: 'Can you lose this amount and sleep tonight?' },
              { key: 'noFOMO', label: 'Honest check: Is this FOMO or strategy?', desc: 'If you feel rushed or excited, it\'s probably FOMO' },
              { key: 'withinLimits', label: 'Within my daily trade count limit', desc: 'ADHD = overtrading risk. Set max trades per day.' },
            ].map(({ key, label, desc }) => (
              <CheckItem key={key} checked={trade[key]} onChange={() => toggle(setTrade, key)} label={label} desc={desc} />
            ))}
          </div>
        )}

        {/* ── POST-TRADE ── */}
        {activeTab === 'posttrade' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>After Trade (Win or Loss)</div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 24, fontWeight: 700, color: C.purple }}>{rate(postTrade)}%</div><div style={{ fontSize: 11, color: C.muted }}>Complete</div></div>
            </div>
            {[
              { key: 'loggedTrade', label: 'Logged trade details immediately', desc: 'Entry, exit, size, reason, outcome. Before you forget.' },
              { key: 'emotionNoted', label: 'Noted my emotional state', desc: 'Excited? Angry? Calm? This matters more than P&L' },
              { key: 'followedPlan', label: 'Did I follow my plan? (Honest answer)', desc: 'Even winning trades can break rules. Track discipline.' },
              { key: 'reviewedMistake', label: 'If I broke a rule, why? One sentence.', desc: 'Pattern recognition: Your ADHD has triggers. Find them.' },
            ].map(({ key, label, desc }) => (
              <CheckItem key={key} checked={postTrade[key]} onChange={() => toggle(setPostTrade, key)} label={label} desc={desc} />
            ))}
            <div style={{ ...card, background: C.blueBg, border: `1px solid ${C.blueBorder}`, marginTop: 8 }}>
              <div style={{ fontWeight: 600, color: C.blue, marginBottom: 12 }}>Daily Trading Stats</div>
              {[
                { field: 'trades', placeholder: 'Number of trades today' },
                { field: 'pnl', placeholder: 'Total P&L (e.g., +₹2500 or -₹1200)' },
                { field: 'emotion', placeholder: 'Overall emotional state' },
              ].map(({ field, placeholder }) => (
                <input key={field} value={stats[field]} onChange={e => setStats(s => ({ ...s, [field]: e.target.value }))} placeholder={placeholder}
                  style={{ width: '100%', border: `1px solid ${C.blueBorder}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, marginBottom: 8, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: C.white }} />
              ))}
            </div>
          </div>
        )}

        {/* ── IMPULSE ── */}
        {activeTab === 'impulse' && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>IF-THEN Impulse Controls</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>When ADHD urges hit, use these automatic responses.</div>
            <div style={{ background: C.orangeBg, borderLeft: `4px solid ${C.orange}`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10 }}>
              <Shield style={{ color: C.orange, width: 18, height: 18, flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 13, color: '#9a3412' }}><strong>Your ADHD superpower:</strong> Pattern recognition. Use it to spot your own self-sabotage patterns.</div>
            </div>
            {impulse.map((item, i) => (
              <div key={i} style={{ ...card, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <button onClick={() => setImpulse(prev => prev.map((x, j) => j === i ? { ...x, checked: !x.checked } : x))}
                  style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${item.checked ? C.green : C.grayBorder}`, background: item.checked ? C.green : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 2 }}>
                  {item.checked && <Check style={{ width: 14, height: 14, color: 'white' }} />}
                </button>
                <div>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>IF: {item.trigger}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>THEN: {item.action}</div>
                </div>
              </div>
            ))}
            <div style={{ ...card, background: C.purpleBg, border: `1px solid ${C.purpleBorder}` }}>
              <div style={{ fontWeight: 600, color: C.purple, marginBottom: 6 }}>Add Your Own Triggers</div>
              <textarea placeholder="Example: IF I check my portfolio more than 3 times in an hour, THEN I close all apps and go for a walk"
                style={{ width: '100%', border: `1px solid ${C.purpleBorder}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'none', minHeight: 80, outline: 'none', boxSizing: 'border-box', background: C.white }} />
            </div>
          </div>
        )}

        {/* Weekly Reflection */}
        <div style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', borderRadius: 12, padding: '20px 24px', marginTop: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp style={{ width: 18, height: 18 }} /> Weekly Reflection (Every Sunday)
          </div>
          {['Which rules did I break most often this week?', 'What emotion triggered my worst trade?', 'Did I overtrade? (Count total trades)', 'One Varsity lesson I\'ll apply next week:', 'What ONE system/rule do I need to add?'].map(q => (
            <div key={q} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>• {q}</div>
          ))}
        </div>

      </div>
    </div>
  );
}

function CheckItem({ checked, onChange, label, desc }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${checked ? '#86efac' : '#e2e8f0'}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', transition: 'border-color 0.15s' }} onClick={onChange}>
      <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${checked ? '#16a34a' : '#d1d5db'}`, background: checked ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        {checked && <Check style={{ width: 14, height: 14, color: 'white' }} />}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{label}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{desc}</div>
      </div>
    </div>
  );
}
