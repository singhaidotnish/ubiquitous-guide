import { useState, useEffect } from "react";
import { Check, AlertTriangle, TrendingUp, Brain, Shield, Zap, Plus, Trash2, BookOpen } from "lucide-react";

const COLORS = {
  bg: "#0a0a0f",
  surface: "#12121a",
  card: "#1a1a26",
  border: "#2a2a3d",
  accent: "#7c3aed",
  accentGlow: "#9d5cf6",
  green: "#22c55e",
  orange: "#f97316",
  red: "#ef4444",
  yellow: "#eab308",
  text: "#e2e8f0",
  muted: "#64748b",
  subtle: "#334155",
};

const EMOTIONS = ["😌 Calm", "😤 Frustrated", "😰 Anxious", "🤑 Greedy", "😴 Tired", "🔥 Confident", "😨 FOMO", "😑 Bored"];

const tabConfig = [
  { id: "premarket", label: "Pre-Market", icon: "☀️", color: "#3b82f6" },
  { id: "trade",     label: "Before Trade", icon: "⚡", color: "#22c55e" },
  { id: "posttrade", label: "Post-Trade",  icon: "📊", color: "#a855f7" },
  { id: "impulse",   label: "Impulse",     icon: "🛡️", color: "#f97316" },
  { id: "journal",   label: "Journal",     icon: "📓", color: "#ec4899" },
];

const emptyTrade = () => ({
  id: Date.now(),
  date: new Date().toLocaleDateString("en-IN"),
  time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  symbol: "",
  direction: "BUY",
  entry: "",
  exit: "",
  qty: "",
  pnl: "",
  emotion: "",
  followedPlan: null,
  note: "",
});

export default function ADHDTradingChecklist() {
  const [activeTab, setActiveTab] = useState("premarket");

  const [preMarketChecks, setPreMarketChecks] = useState({
    reviewedRules: false, setDailyLimit: false, checkedCalendar: false,
    mentalState: false, positionSized: false,
  });
  const [tradeChecks, setTradeChecks] = useState({
    waitedCooldown: false, wroteReason: false, checkedRisk: false,
    noFOMO: false, withinLimits: false,
  });
  const [postTradeChecks, setPostTradeChecks] = useState({
    loggedTrade: false, emotionNoted: false, followedPlan: false, reviewedMistake: false,
  });
  const [dailyStats, setDailyStats] = useState({ tradesCount: "", profitLoss: "", emotionalState: "" });
  const [impulseTriggers, setImpulseTriggers] = useState([
    { trigger: "Feeling FOMO",          action: "Close charts for 10 min",        checked: false },
    { trigger: "After a loss",           action: "Wait 30 min cooldown",           checked: false },
    { trigger: "Want to increase size",  action: "Write reason + wait 15 min",     checked: false },
    { trigger: "Market moving fast",     action: "Take 3 deep breaths",            checked: false },
    { trigger: "Bored/restless",         action: "Close trading app",              checked: false },
  ]);
  const [customTrigger, setCustomTrigger] = useState("");

  // Journal state — persisted to localStorage
  const [trades, setTrades]     = useState(() => JSON.parse(localStorage.getItem("adhd_trades") || "[]"));
  const [freeNotes, setFreeNotes] = useState(() => localStorage.getItem("adhd_freenotes") || "");
  const [newTrade, setNewTrade]   = useState(emptyTrade());
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [journalView, setJournalView] = useState("log"); // "log" | "notes"

  useEffect(() => { localStorage.setItem("adhd_trades", JSON.stringify(trades)); }, [trades]);
  useEffect(() => { localStorage.setItem("adhd_freenotes", freeNotes); }, [freeNotes]);

  const toggleCheck = (setter, key) => setter((p) => ({ ...p, [key]: !p[key] }));
  const toggleImpulse = (i) => setImpulseTriggers((p) => p.map((x, idx) => idx === i ? { ...x, checked: !x.checked } : x));
  const rate = (checks) => { const v = Object.values(checks); return Math.round((v.filter(Boolean).length / v.length) * 100); };

  const addTrade = () => {
    if (!newTrade.symbol) return;
    setTrades((p) => [{ ...newTrade, id: Date.now() }, ...p]);
    setNewTrade(emptyTrade());
    setShowTradeForm(false);
  };
  const deleteTrade = (id) => setTrades((p) => p.filter((t) => t.id !== id));

  const totalPnl = trades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'JetBrains Mono','Courier New',monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
        button { cursor: pointer; border: none; background: none; }
        input, textarea, select { outline: none; font-family: inherit; }
        .tab-btn { transition: all 0.2s; }
        .check-btn { transition: all 0.15s; }
        .check-btn:hover { transform: scale(1.05); }
        .card-hover { transition: border-color 0.2s; }
        .card-hover:hover { border-color: #7c3aed44 !important; }
        .inp { transition: border-color 0.2s; }
        .inp:focus { border-color: #7c3aed !important; }
        .del-btn { opacity: 0; transition: opacity 0.2s; }
        .trade-row:hover .del-btn { opacity: 1; }
      `}</style>

      {/* Header */}
      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "16px 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={20} color="white" />
          </div>
          <div>
            <h1 style={{ color: COLORS.text, fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>ADHD Trading System</h1>
            <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 1 }}>your external brain for disciplined trading</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            {[["PRE", rate(preMarketChecks), "#3b82f6"], ["TRADE", rate(tradeChecks), "#22c55e"], ["POST", rate(postTradeChecks), "#a855f7"]].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: c }}>{v}%</div>
                <div style={{ fontSize: 9, color: COLORS.muted }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warning */}
      <div style={{ background: "rgba(234,179,8,0.08)", borderBottom: `1px solid rgba(234,179,8,0.2)`, padding: "8px 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 8, alignItems: "center" }}>
          <AlertTriangle size={13} color={COLORS.yellow} />
          <p style={{ color: "#a16207", fontSize: 11 }}>
            <span style={{ color: COLORS.yellow, fontWeight: 600 }}>ADHD truth: </span>
            Your brain craves stimulation. Markets provide endless stimulation. This is your guardrail.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 14px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 3, marginBottom: 20, background: COLORS.surface, borderRadius: 12, padding: 4, border: `1px solid ${COLORS.border}` }}>
          {tabConfig.map((tab) => (
            <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, padding: "9px 2px", borderRadius: 9, fontSize: 10, fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif",
                background: activeTab === tab.id ? tab.color : "transparent",
                color: activeTab === tab.id ? "white" : COLORS.muted }}>
              <div>{tab.icon}</div>
              <div style={{ marginTop: 2, fontSize: 9 }}>{tab.label}</div>
            </button>
          ))}
        </div>

        {/* PRE-MARKET */}
        {activeTab === "premarket" && (
          <Section title="Morning Routine" rate={rate(preMarketChecks)} rateColor="#3b82f6" subtitle="Complete before market open">
            {[
              { key: "reviewedRules",   label: "Read my trading rules",               desc: "No rules = emotional decisions. ADHD brain needs reminders." },
              { key: "setDailyLimit",   label: "Set daily loss limit (write it down)", desc: "Stop trading if down ₹5,000 or 2% of capital." },
              { key: "checkedCalendar", label: "Check economic calendar / news",       desc: "Know what events might spike volatility today." },
              { key: "mentalState",     label: "Mental state check: Am I calm?",       desc: "Stressed / angry / overconfident? Don't trade today." },
              { key: "positionSized",   label: "Position size calculated for today",   desc: "Know your max position BEFORE you see opportunities." },
            ].map(({ key, label, desc }) => (
              <CheckItem key={key} checked={preMarketChecks[key]} onChange={() => toggleCheck(setPreMarketChecks, key)} label={label} desc={desc} color="#3b82f6" />
            ))}
          </Section>
        )}

        {/* BEFORE TRADE */}
        {activeTab === "trade" && (
          <Section title="Before Every Trade" rate={rate(tradeChecks)} rateColor="#22c55e" subtitle="Takes 2 min. Can't wait? It's impulse.">
            <div style={{ background: "rgba(239,68,68,0.08)", border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
              <p style={{ color: "#fca5a5", fontSize: 11, fontWeight: 600 }}>⛔ STOP — If you can't wait 2 minutes, you're trading on impulse.</p>
            </div>
            {[
              { key: "waitedCooldown", label: "Waited cooldown (if prev was a loss)", desc: "30 min minimum after loss. Revenge trading destroys accounts." },
              { key: "wroteReason",    label: "Wrote down WHY I'm taking this trade", desc: "Can't explain in one sentence? Don't take it." },
              { key: "checkedRisk",    label: "Risk calculated: Max loss is OK",      desc: "Can you lose this amount and sleep tonight?" },
              { key: "noFOMO",         label: "Honest: Is this FOMO or strategy?",    desc: "If you feel rushed or excited, it's probably FOMO." },
              { key: "withinLimits",   label: "Within my daily trade count limit",    desc: "ADHD = overtrading risk. Set max trades per day." },
            ].map(({ key, label, desc }) => (
              <CheckItem key={key} checked={tradeChecks[key]} onChange={() => toggleCheck(setTradeChecks, key)} label={label} desc={desc} color="#22c55e" />
            ))}
          </Section>
        )}

        {/* POST TRADE */}
        {activeTab === "posttrade" && (
          <Section title="After Every Trade" rate={rate(postTradeChecks)} rateColor="#a855f7" subtitle="Win or loss — always complete this">
            {[
              { key: "loggedTrade",      label: "Logged trade details immediately",      desc: "Entry, exit, size, reason, outcome. Before you forget." },
              { key: "emotionNoted",     label: "Noted my emotional state",              desc: "Excited? Angry? Calm? Matters more than P&L." },
              { key: "followedPlan",     label: "Did I follow my plan? (Honest)",        desc: "Even winning trades can break rules." },
              { key: "reviewedMistake",  label: "If I broke a rule, why? One sentence.", desc: "Find your ADHD triggers through patterns." },
            ].map(({ key, label, desc }) => (
              <CheckItem key={key} checked={postTradeChecks[key]} onChange={() => toggleCheck(setPostTradeChecks, key)} label={label} desc={desc} color="#a855f7" />
            ))}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 14, marginTop: 16 }}>
              <p style={{ color: COLORS.text, fontSize: 13, fontWeight: 600, marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif" }}>Daily Stats</p>
              {[["tradesCount","Trades today","number"],["profitLoss","Total P&L (e.g. +₹2500)","text"],["emotionalState","Overall emotion today","text"]].map(([k,ph,type]) => (
                <input key={k} type={type} placeholder={ph} className="inp"
                  value={dailyStats[k]} onChange={(e) => setDailyStats({ ...dailyStats, [k]: e.target.value })}
                  style={{ width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"9px 12px", color:COLORS.text, fontSize:12, marginBottom:8 }} />
              ))}
            </div>
          </Section>
        )}

        {/* IMPULSE */}
        {activeTab === "impulse" && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ color: COLORS.text, fontSize: 17, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>IF → THEN Controls</h2>
              <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 3 }}>When urges hit, use these automatic responses.</p>
            </div>
            <div style={{ background:"rgba(249,115,22,0.08)", border:`1px solid rgba(249,115,22,0.2)`, borderRadius:10, padding:"10px 14px", marginBottom:16, display:"flex", gap:8 }}>
              <Shield size={14} color={COLORS.orange} style={{ marginTop:1, flexShrink:0 }} />
              <p style={{ color:"#fdba74", fontSize:11 }}><strong style={{ color:COLORS.orange }}>Your ADHD superpower:</strong> Pattern recognition. Use it to spot your own self-sabotage.</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {impulseTriggers.map((item, i) => (
                <div key={i} className="card-hover" style={{ background:COLORS.card, border:`1px solid ${item.checked?"#22c55e44":COLORS.border}`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
                  <button className="check-btn" onClick={() => toggleImpulse(i)}
                    style={{ width:26, height:26, borderRadius:7, border:`2px solid ${item.checked?COLORS.green:COLORS.border}`, background:item.checked?COLORS.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {item.checked && <Check size={13} color="white" strokeWidth={3} />}
                  </button>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, color:COLORS.orange, fontWeight:600, marginBottom:2 }}>IF: {item.trigger}</div>
                    <div style={{ fontSize:11, color:COLORS.muted }}>THEN: {item.action}</div>
                  </div>
                  {item.checked && <Zap size={13} color={COLORS.green} />}
                </div>
              ))}
            </div>
            <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:14, marginTop:16 }}>
              <p style={{ color:COLORS.text, fontSize:12, fontWeight:600, marginBottom:8, fontFamily:"'Space Grotesk',sans-serif" }}>Add your own trigger</p>
              <textarea placeholder="IF I check my portfolio more than 3x in an hour, THEN I close all apps and walk..." value={customTrigger} onChange={(e) => setCustomTrigger(e.target.value)}
                style={{ width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"9px 12px", color:COLORS.text, fontSize:11, height:72, resize:"none", outline:"none" }} />
            </div>
          </div>
        )}

        {/* JOURNAL */}
        {activeTab === "journal" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <h2 style={{ color:COLORS.text, fontSize:17, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif" }}>Trading Journal</h2>
                <p style={{ color:COLORS.muted, fontSize:11, marginTop:3 }}>Saved locally on your device</p>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <div style={{ background:totalPnl >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border:`1px solid ${totalPnl >= 0 ? "#22c55e44" : "#ef444444"}`, borderRadius:8, padding:"6px 12px", textAlign:"center" }}>
                  <div style={{ fontSize:14, fontWeight:700, color: totalPnl >= 0 ? COLORS.green : COLORS.red }}>
                    {totalPnl >= 0 ? "+" : ""}₹{totalPnl.toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize:9, color:COLORS.muted }}>total P&L</div>
                </div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div style={{ display:"flex", gap:4, marginBottom:16, background:COLORS.surface, borderRadius:10, padding:3, border:`1px solid ${COLORS.border}` }}>
              {[["log","📋 Trade Log"],["notes","✍️ Free Notes"]].map(([id, label]) => (
                <button key={id} onClick={() => setJournalView(id)}
                  style={{ flex:1, padding:"8px", borderRadius:8, fontSize:11, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif",
                    background: journalView === id ? "#ec4899" : "transparent",
                    color: journalView === id ? "white" : COLORS.muted }}>
                  {label}
                </button>
              ))}
            </div>

            {/* TRADE LOG */}
            {journalView === "log" && (
              <div>
                <button onClick={() => setShowTradeForm(!showTradeForm)}
                  style={{ width:"100%", background: showTradeForm ? COLORS.card : "linear-gradient(135deg,#ec4899,#7c3aed)", border:`1px solid ${showTradeForm ? COLORS.border : "transparent"}`, borderRadius:12, padding:"11px", color:"white", fontSize:13, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:14 }}>
                  <Plus size={16} />
                  {showTradeForm ? "Cancel" : "Log a Trade"}
                </button>

                {/* Trade Form */}
                {showTradeForm && (
                  <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, padding:16, marginBottom:14 }}>
                    <p style={{ color:COLORS.text, fontSize:13, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif", marginBottom:12 }}>New Trade Entry</p>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                      <input className="inp" placeholder="Symbol (e.g. NIFTY)" value={newTrade.symbol} onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value.toUpperCase()})}
                        style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 10px", color:COLORS.text, fontSize:12 }} />
                      <select className="inp" value={newTrade.direction} onChange={(e) => setNewTrade({...newTrade, direction: e.target.value})}
                        style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 10px", color: newTrade.direction === "BUY" ? COLORS.green : COLORS.red, fontSize:12 }}>
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                      </select>
                      <input className="inp" placeholder="Entry price" value={newTrade.entry} onChange={(e) => setNewTrade({...newTrade, entry: e.target.value})}
                        style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 10px", color:COLORS.text, fontSize:12 }} />
                      <input className="inp" placeholder="Exit price" value={newTrade.exit} onChange={(e) => setNewTrade({...newTrade, exit: e.target.value})}
                        style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 10px", color:COLORS.text, fontSize:12 }} />
                      <input className="inp" placeholder="Qty / Lots" value={newTrade.qty} onChange={(e) => setNewTrade({...newTrade, qty: e.target.value})}
                        style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 10px", color:COLORS.text, fontSize:12 }} />
                      <input className="inp" placeholder="P&L (e.g. +2500)" value={newTrade.pnl} onChange={(e) => setNewTrade({...newTrade, pnl: e.target.value})}
                        style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 10px", color: parseFloat(newTrade.pnl) >= 0 ? COLORS.green : COLORS.red, fontSize:12 }} />
                    </div>
                    {/* Emotion picker */}
                    <p style={{ color:COLORS.muted, fontSize:11, marginBottom:6 }}>Emotion during trade:</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                      {EMOTIONS.map((e) => (
                        <button key={e} onClick={() => setNewTrade({...newTrade, emotion: e})}
                          style={{ padding:"5px 10px", borderRadius:20, fontSize:11, border:`1px solid ${newTrade.emotion===e?"#ec4899":COLORS.border}`, background: newTrade.emotion===e?"rgba(236,72,153,0.15)":"transparent", color: newTrade.emotion===e?"#ec4899":COLORS.muted }}>
                          {e}
                        </button>
                      ))}
                    </div>
                    {/* Followed plan */}
                    <p style={{ color:COLORS.muted, fontSize:11, marginBottom:6 }}>Followed the plan?</p>
                    <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                      {[["✅ Yes", true], ["❌ No", false]].map(([label, val]) => (
                        <button key={label} onClick={() => setNewTrade({...newTrade, followedPlan: val})}
                          style={{ flex:1, padding:"7px", borderRadius:8, fontSize:12, border:`1px solid ${newTrade.followedPlan===val?"#7c3aed":COLORS.border}`, background: newTrade.followedPlan===val?"rgba(124,58,237,0.15)":"transparent", color: newTrade.followedPlan===val?COLORS.accentGlow:COLORS.muted }}>
                          {label}
                        </button>
                      ))}
                    </div>
                    <textarea className="inp" placeholder="Quick note about this trade..." value={newTrade.note} onChange={(e) => setNewTrade({...newTrade, note: e.target.value})}
                      style={{ width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 10px", color:COLORS.text, fontSize:11, height:60, resize:"none", marginBottom:10 }} />
                    <button onClick={addTrade}
                      style={{ width:"100%", background:"linear-gradient(135deg,#ec4899,#7c3aed)", border:"none", borderRadius:10, padding:"11px", color:"white", fontSize:13, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>
                      Save Trade
                    </button>
                  </div>
                )}

                {/* Trade List */}
                {trades.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"40px 20px", color:COLORS.muted }}>
                    <BookOpen size={32} style={{ margin:"0 auto 12px", opacity:0.3 }} />
                    <p style={{ fontSize:13 }}>No trades logged yet.</p>
                    <p style={{ fontSize:11, marginTop:4 }}>Tap "Log a Trade" after each trade.</p>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {trades.map((t) => (
                      <div key={t.id} className="trade-row card-hover" style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:"12px 14px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                            <span style={{ fontSize:13, fontWeight:700, color:COLORS.text, fontFamily:"'Space Grotesk',sans-serif" }}>{t.symbol}</span>
                            <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background: t.direction==="BUY"?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)", color: t.direction==="BUY"?COLORS.green:COLORS.red }}>{t.direction}</span>
                            {t.followedPlan !== null && <span style={{ fontSize:10 }}>{t.followedPlan ? "✅" : "❌"}</span>}
                          </div>
                          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                            <span style={{ fontSize:14, fontWeight:700, color: parseFloat(t.pnl) >= 0 ? COLORS.green : COLORS.red }}>
                              {parseFloat(t.pnl) >= 0 ? "+" : ""}₹{parseFloat(t.pnl || 0).toLocaleString("en-IN")}
                            </span>
                            <button className="del-btn" onClick={() => deleteTrade(t.id)} style={{ color:COLORS.red }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:12, fontSize:10, color:COLORS.muted, marginBottom: t.note ? 6 : 0 }}>
                          <span>{t.date} {t.time}</span>
                          {t.entry && <span>Entry: {t.entry}</span>}
                          {t.exit && <span>Exit: {t.exit}</span>}
                          {t.qty && <span>Qty: {t.qty}</span>}
                          {t.emotion && <span>{t.emotion}</span>}
                        </div>
                        {t.note && <p style={{ fontSize:11, color:COLORS.subtle, marginTop:4, fontStyle:"italic" }}>"{t.note}"</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FREE NOTES */}
            {journalView === "notes" && (
              <div>
                <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, padding:14, marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <p style={{ color:COLORS.text, fontSize:13, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif" }}>Daily Notes</p>
                    <p style={{ color:COLORS.muted, fontSize:10 }}>auto-saved</p>
                  </div>
                  <textarea value={freeNotes} onChange={(e) => setFreeNotes(e.target.value)}
                    placeholder={`What's on your mind before trading today?\n\nPatterns you're noticing in yourself?\n\nEmotions to watch out for?\n\nOne thing you'll do differently today?`}
                    style={{ width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"12px", color:COLORS.text, fontSize:12, minHeight:300, resize:"vertical", outline:"none", lineHeight:1.7 }} />
                </div>
                <div style={{ background:"rgba(124,58,237,0.08)", border:`1px solid rgba(124,58,237,0.2)`, borderRadius:10, padding:"10px 14px" }}>
                  <p style={{ color:COLORS.accentGlow, fontSize:11, fontWeight:600, marginBottom:6 }}>📖 Weekly Reflection Prompts</p>
                  {["Which rules did I break most this week?","What emotion triggered my worst trade?","Did I overtrade? Count total trades.","One lesson to apply next week:","What ONE rule do I need to add?"].map((q, i) => (
                    <p key={i} style={{ color:COLORS.muted, fontSize:11, marginBottom:4 }}>• {q}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Weekly footer (non-journal tabs) */}
        {activeTab !== "journal" && (
          <div style={{ marginTop:24, background:"linear-gradient(135deg,#1e1040,#0f1f3d)", border:`1px solid #2a1f5a`, borderRadius:14, padding:"18px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <TrendingUp size={14} color="#818cf8" />
              <p style={{ color:"#818cf8", fontSize:11, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif", letterSpacing:"0.05em", textTransform:"uppercase" }}>Weekly Reflection — Every Sunday</p>
            </div>
            {["Which rules did I break most often?","What emotion triggered my worst trade?","Did I overtrade? (Count total trades)","One lesson I'll apply next week:","What ONE rule do I need to add?"].map((q, i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                <div style={{ width:18, height:18, borderRadius:5, background:"rgba(129,140,248,0.15)", border:"1px solid rgba(129,140,248,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:8, color:"#818cf8", fontWeight:700 }}>{i+1}</span>
                </div>
                <p style={{ color:"#94a3b8", fontSize:11 }}>{q}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, rate, rateColor, subtitle, children }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <h2 style={{ color:COLORS.text, fontSize:17, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif" }}>{title}</h2>
          <p style={{ color:COLORS.muted, fontSize:11, marginTop:3 }}>{subtitle}</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:26, fontWeight:700, color:rateColor, lineHeight:1 }}>{rate}%</div>
          <div style={{ fontSize:9, color:COLORS.muted, marginTop:2 }}>complete</div>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>{children}</div>
    </div>
  );
}

function CheckItem({ checked, onChange, label, desc, color }) {
  return (
    <div className="card-hover" style={{ background:COLORS.card, border:`1px solid ${checked?color+"44":COLORS.border}`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:12, transition:"border-color 0.2s" }}>
      <button className="check-btn" onClick={onChange}
        style={{ width:26, height:26, borderRadius:7, border:`2px solid ${checked?color:COLORS.border}`, background:checked?color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
        {checked && <Check size={13} color="white" strokeWidth={3} />}
      </button>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12, color:COLORS.text, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif", marginBottom:3, textDecoration:checked?"line-through":"none", opacity:checked?0.45:1 }}>{label}</div>
        <div style={{ fontSize:11, color:COLORS.muted, lineHeight:1.5 }}>{desc}</div>
      </div>
    </div>
  );
}


