import { useState, useEffect } from "react";
import {
  Check, AlertTriangle, TrendingUp, TrendingDown, Brain, Shield,
  Minus, Lock, CheckCircle, Target, ChevronDown, ChevronUp, BookOpen, ClipboardList
} from "lucide-react";

// ─────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────
const STRATEGIES = {
  "Bull Put Spread":  { emoji: "📈", need: "Market goes UP or stays flat" },
  "Bear Call Spread": { emoji: "📉", need: "Market goes DOWN or stays flat" },
  "Iron Condor":      { emoji: "➡️", need: "Market stays FLAT (range-bound)" },
  "Short Strangle":   { emoji: "🎯", need: "Market stays FLAT (wider range)" },
};

const VIEWS = [
  { label: "Bullish",  icon: TrendingUp,   color: "#10b981", value: "bullish"  },
  { label: "Bearish",  icon: TrendingDown,  color: "#ef4444", value: "bearish"  },
  { label: "Sideways", icon: Minus,         color: "#f59e0b", value: "sideways" },
];

const OUTCOMES  = [
  { label: "✅ Won",  value: "win",  color: "#10b981" },
  { label: "❌ Lost", value: "loss", color: "#ef4444" },
  { label: "⏳ Open", value: "open", color: "#f59e0b" },
];

const EMOTIONS = ["😌 Calm","😤 FOMO","😰 Anxious","😎 Confident","😑 Bored","😡 Frustrated"];

// palette
const C = {
  bg:       "#0f0f1a",
  surface:  "#1a1a2e",
  border:   "#ffffff12",
  muted:    "#94a3b8",
  accent:   "#6366f1",
  green:    "#10b981",
  red:      "#ef4444",
  amber:    "#f59e0b",
  white:    "#f0f0f0",
};

// ─────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────
function today()       { return new Date().toISOString().split("T")[0]; }
function fmtDate(d)    { return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }); }
function ls(k)         { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } }
function lsSet(k, v)   { localStorage.setItem(k, JSON.stringify(v)); }

// ─────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("checklist"); // checklist | journal

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:"100vh", background:C.bg, color:C.white, display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:72 }}>
        {screen === "checklist" ? <ChecklistScreen /> : <JournalScreen />}
      </div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100 }}>
        {[
          { key:"checklist", icon:ClipboardList, label:"Checklist" },
          { key:"journal",   icon:BookOpen,      label:"Journal"   },
        ].map(({ key, icon:Icon, label }) => (
          <button key={key} onClick={() => setScreen(key)} style={{
            flex:1, padding:"12px 0", border:"none", background:"transparent",
            color: screen===key ? C.accent : C.muted,
            cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
            fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:600, transition:"color 0.2s"
          }}>
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  CHECKLIST SCREEN
// ─────────────────────────────────────────
function ChecklistScreen() {
  const [tab, setTab] = useState("premarket");

  const [preMarket, setPreMarket] = useState(() => ls("chk_pre") || {
    reviewedRules:false, setDailyLimit:false, checkedCalendar:false, mentalState:false, positionSized:false
  });
  const [trade, setTrade] = useState(() => ls("chk_trade") || {
    waitedCooldown:false, wroteReason:false, checkedRisk:false, noFOMO:false, withinLimits:false
  });
  const [postTrade, setPostTrade] = useState(() => ls("chk_post") || {
    loggedTrade:false, emotionNoted:false, followedPlan:false, reviewedMistake:false
  });
  const [dailyStats, setDailyStats] = useState(() => ls("chk_stats") || {
    tradesCount:"", profitLoss:"", emotionalState:""
  });
  const [impulses, setImpulses] = useState(() => ls("chk_impulse") || [
    { trigger:"Feeling FOMO",             action:"Close charts for 10 min",      checked:false },
    { trigger:"After a loss",             action:"Wait 30 min cooldown",          checked:false },
    { trigger:"Want to increase size",    action:"Write reason + wait 15 min",    checked:false },
    { trigger:"Market moving fast",       action:"Take 3 deep breaths",           checked:false },
    { trigger:"Bored/restless",           action:"Close trading app",             checked:false },
  ]);

  useEffect(() => { lsSet("chk_pre",     preMarket);  }, [preMarket]);
  useEffect(() => { lsSet("chk_trade",   trade);      }, [trade]);
  useEffect(() => { lsSet("chk_post",    postTrade);  }, [postTrade]);
  useEffect(() => { lsSet("chk_stats",   dailyStats); }, [dailyStats]);
  useEffect(() => { lsSet("chk_impulse", impulses);   }, [impulses]);

  const toggle = (setter, key) => setter(p => ({ ...p, [key]: !p[key] }));
  const pct    = (obj) => Math.round(Object.values(obj).filter(Boolean).length / Object.keys(obj).length * 100);

  const TABS = [
    { key:"premarket", label:"Pre-Market" },
    { key:"trade",     label:"Before Trade" },
    { key:"posttrade", label:"Post-Trade" },
    { key:"impulse",   label:"Impulse" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ background:C.surface, padding:"20px 16px 0", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius:12, padding:8 }}>
            <Brain size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:17 }}>ADHD Trading System</div>
            <div style={{ fontSize:11, color:C.accent, fontFamily:"'DM Mono',monospace" }}>Your external brain</div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display:"flex", gap:2, overflowX:"auto" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flexShrink:0, padding:"10px 12px", border:"none", background:"transparent",
              color: tab===t.key ? C.accent : C.muted,
              borderBottom: tab===t.key ? `2px solid ${C.accent}` : "2px solid transparent",
              cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
              whiteSpace:"nowrap", transition:"all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px 16px", maxWidth:480, margin:"0 auto" }}>

        {/* ADHD truth banner */}
        <div style={{ background:"#f59e0b15", border:`1px solid #f59e0b40`, borderLeft:`4px solid ${C.amber}`, borderRadius:10, padding:"12px 14px", marginBottom:20, display:"flex", gap:10 }}>
          <AlertTriangle size={18} color={C.amber} style={{ flexShrink:0, marginTop:1 }} />
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:C.amber }}>ADHD Trading Truth</div>
            <div style={{ fontSize:12, color:"#fbbf24cc", marginTop:2 }}>Your brain craves stimulation. Markets provide endless stimulation. This checklist is your guardrail.</div>
          </div>
        </div>

        {/* Pre-Market */}
        {tab === "premarket" && (
          <div>
            <SectionHeader title="Morning Routine" pct={pct(preMarket)} color={C.accent} />
            <CItem checked={preMarket.reviewedRules}   onChange={() => toggle(setPreMarket,"reviewedRules")}   label="Read my trading rules (30 seconds)"        desc="No rules = emotional decisions. Your ADHD brain needs reminders." />
            <CItem checked={preMarket.setDailyLimit}   onChange={() => toggle(setPreMarket,"setDailyLimit")}   label="Set daily loss limit (write it down)"        desc="Example: Stop trading if down ₹5,000 or 2% of capital" />
            <CItem checked={preMarket.checkedCalendar} onChange={() => toggle(setPreMarket,"checkedCalendar")} label="Check economic calendar/news"                desc="Know what events might spike volatility today" />
            <CItem checked={preMarket.mentalState}     onChange={() => toggle(setPreMarket,"mentalState")}     label="Mental state check: Am I calm?"              desc="Stressed/angry/overconfident? Don't trade today." />
            <CItem checked={preMarket.positionSized}   onChange={() => toggle(setPreMarket,"positionSized")}   label="Position size calculated for today"          desc="Know your max position BEFORE you see opportunities" />
          </div>
        )}

        {/* Before Trade */}
        {tab === "trade" && (
          <div>
            <SectionHeader title="Before Every Trade" pct={pct(trade)} color={C.green} />
            <div style={{ background:"#ef444415", border:`1px solid #ef444430`, borderRadius:10, padding:"12px 14px", marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.red }}>STOP: This takes 2 minutes. If you can't wait 2 minutes, you're trading on impulse.</div>
            </div>
            <CItem checked={trade.waitedCooldown} onChange={() => toggle(setTrade,"waitedCooldown")} label="Waited cooldown (if previous trade was loss)" desc="30 min minimum after loss. Revenge trading destroys accounts." />
            <CItem checked={trade.wroteReason}    onChange={() => toggle(setTrade,"wroteReason")}    label="Wrote down WHY I'm taking this trade"       desc="If you can't explain it in one sentence, don't trade it" />
            <CItem checked={trade.checkedRisk}    onChange={() => toggle(setTrade,"checkedRisk")}    label="Risk calculated: Max loss is acceptable"    desc="Can you lose this amount and sleep tonight?" />
            <CItem checked={trade.noFOMO}         onChange={() => toggle(setTrade,"noFOMO")}         label="Honest check: Is this FOMO or strategy?"    desc="If you feel rushed or excited, it's probably FOMO" />
            <CItem checked={trade.withinLimits}   onChange={() => toggle(setTrade,"withinLimits")}   label="Within my daily trade count limit"          desc="ADHD = overtrading risk. Set max trades per day." />
          </div>
        )}

        {/* Post-Trade */}
        {tab === "posttrade" && (
          <div>
            <SectionHeader title="After Trade (Win or Loss)" pct={pct(postTrade)} color="#8b5cf6" />
            <CItem checked={postTrade.loggedTrade}      onChange={() => toggle(setPostTrade,"loggedTrade")}      label="Logged trade details immediately"          desc="Entry, exit, size, reason, outcome. Before you forget." />
            <CItem checked={postTrade.emotionNoted}     onChange={() => toggle(setPostTrade,"emotionNoted")}     label="Noted my emotional state"                  desc="Excited? Angry? Calm? This matters more than P&L" />
            <CItem checked={postTrade.followedPlan}     onChange={() => toggle(setPostTrade,"followedPlan")}     label="Did I follow my plan? (Honest answer)"     desc="Even winning trades can break rules. Track discipline." />
            <CItem checked={postTrade.reviewedMistake}  onChange={() => toggle(setPostTrade,"reviewedMistake")}  label="If I broke a rule, why? One sentence."     desc="Pattern recognition: Your ADHD has triggers. Find them." />

            <div style={{ background:"#6366f110", border:`1px solid #6366f130`, borderRadius:12, padding:16, marginTop:16 }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:12, color:C.accent }}>Daily Stats</div>
              {[
                ["tradesCount",    "number", "Number of trades today"],
                ["profitLoss",     "text",   "Total P&L (e.g. +₹2500 or -₹1200)"],
                ["emotionalState", "text",   "Overall emotional state"],
              ].map(([field, type, ph]) => (
                <input key={field} type={type} placeholder={ph} value={dailyStats[field]}
                  onChange={e => setDailyStats(p => ({ ...p, [field]: e.target.value }))}
                  style={{ width:"100%", padding:"11px 13px", borderRadius:9, border:`1px solid ${C.border}`, background:"#ffffff08", color:C.white, fontSize:13, fontFamily:"'DM Sans',sans-serif", marginBottom:8, boxSizing:"border-box", outline:"none" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Impulse Control */}
        {tab === "impulse" && (
          <div>
            <div style={{ fontWeight:700, fontSize:18, marginBottom:4 }}>IF-THEN Impulse Controls</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>When ADHD urges hit, use these automatic responses.</div>
            <div style={{ background:"#f59e0b10", borderLeft:`4px solid ${C.amber}`, borderRadius:8, padding:"12px 14px", marginBottom:16, display:"flex", gap:8 }}>
              <Shield size={16} color={C.amber} style={{ flexShrink:0, marginTop:1 }} />
              <div style={{ fontSize:12, color:"#fbbf24cc" }}><strong>Your ADHD superpower:</strong> Pattern recognition. Use it to recognize your own patterns of self-sabotage.</div>
            </div>
            {impulses.map((item, i) => (
              <div key={i} style={{ background:"#ffffff06", border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"flex-start", gap:12 }}>
                <button onClick={() => setImpulses(p => p.map((x,j) => j===i ? {...x,checked:!x.checked} : x))}
                  style={{ width:24, height:24, borderRadius:6, border:`2px solid`, borderColor: item.checked ? C.green : "#ffffff30", background: item.checked ? C.green : "transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, marginTop:2 }}>
                  {item.checked && <Check size={14} color="white" />}
                </button>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>IF: {item.trigger}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>THEN: {item.action}</div>
                </div>
              </div>
            ))}

            {/* Weekly reflection */}
            <div style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius:14, padding:20, marginTop:20 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
                <TrendingUp size={16} /> Weekly Reflection (Every Sunday)
              </div>
              {[
                "Which rules did I break most often this week?",
                "What emotion triggered my worst trade?",
                "Did I overtrade? (Count total trades)",
                "One Innerworth lesson I'll apply next week:",
                "What ONE system/rule do I need to add?",
              ].map((q,i) => <div key={i} style={{ fontSize:13, marginBottom:6, opacity:0.9 }}>• {q}</div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  JOURNAL SCREEN
// ─────────────────────────────────────────
function JournalScreen() {
  const [jTab, setJTab]   = useState("journal"); // journal | history | stats
  const [entries, setEntries] = useState(() => ls("nish_trade_journal") || []);

  const [step, setStep]                     = useState(1);
  const [view, setView]                     = useState(null);
  const [thesis, setThesis]                 = useState("");
  const [strategy, setStrategy]             = useState(null);
  const [soldStrike, setSoldStrike]         = useState("");
  const [boughtStrike, setBoughtStrike]     = useState("");
  const [niftyLevel, setNiftyLevel]         = useState("");
  const [emotion, setEmotion]               = useState("");
  const [outcome, setOutcome]               = useState(null);
  const [outcomePL, setOutcomePL]           = useState("");
  const [predRight, setPredRight]           = useState(null);
  const [expandedEntry, setExpandedEntry]   = useState(null);

  useEffect(() => { lsSet("nish_trade_journal", entries); }, [entries]);

  const todayEntry = entries.find(e => e.date === today());

  const resetForm = () => {
    setStep(1); setView(null); setThesis(""); setStrategy(null);
    setSoldStrike(""); setBoughtStrike(""); setNiftyLevel("");
    setEmotion(""); setOutcome(null); setOutcomePL(""); setPredRight(null);
  };

  const saveEntry = () => {
    const entry = { id:Date.now(), date:today(), view, thesis, strategy, soldStrike, boughtStrike, niftyLevel, emotion, outcome, outcomePL, predictionCorrect:predRight };
    setEntries(p => [entry, ...p.filter(e => e.date !== today())]);
    setStep(5);
  };

  // Stats
  const closed    = entries.filter(e => e.outcome && e.outcome !== "open");
  const wins      = closed.filter(e => e.outcome === "win").length;
  const losses    = closed.filter(e => e.outcome === "loss").length;
  const winRate   = closed.length ? Math.round(wins/closed.length*100) : 0;
  const predDone  = entries.filter(e => e.predictionCorrect !== null);
  const predAcc   = predDone.length ? Math.round(predDone.filter(e=>e.predictionCorrect).length/predDone.length*100) : 0;

  const JTABS = [["journal","📝 Today"],["history","📅 History"],["stats","📊 Stats"]];

  return (
    <div>
      {/* Header */}
      <div style={{ background:C.surface, padding:"20px 16px 0", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius:12, padding:8 }}>
            <Target size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:17 }}>Trade Journal</div>
            <div style={{ fontSize:11, color:C.accent, fontFamily:"'DM Mono',monospace" }}>NIFTY Paper Trading</div>
          </div>
          <div style={{ marginLeft:"auto", textAlign:"right" }}>
            <div style={{ fontSize:11, color:C.muted }}>Streak</div>
            <div style={{ fontSize:20, fontWeight:700, color:C.amber }}>🔥 {entries.length}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {JTABS.map(([key,label]) => (
            <button key={key} onClick={() => setJTab(key)} style={{
              flex:1, padding:"10px 4px", border:"none", cursor:"pointer",
              background: jTab===key ? C.accent : "transparent",
              color: jTab===key ? "white" : C.muted,
              borderRadius:"8px 8px 0 0", fontSize:13, fontWeight:600,
              fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s"
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px 16px", maxWidth:480, margin:"0 auto" }}>

        {/* TODAY */}
        {jTab === "journal" && (
          <>
            {todayEntry && step !== 5 ? (
              <TodayDone entry={todayEntry} onEdit={resetForm} />
            ) : step === 5 ? (
              <div style={{ textAlign:"center", padding:"40px 20px" }}>
                <div style={{ fontSize:60, marginBottom:16 }}>🎯</div>
                <div style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>Logged!</div>
                <div style={{ color:C.muted, fontSize:14, marginBottom:24 }}>Trade journalled for today. Come back tomorrow.</div>
                <Btn color={C.accent} onClick={() => { resetForm(); setJTab("history"); }}>See History →</Btn>
              </div>
            ) : (
              <>
                {/* Progress dots */}
                <div style={{ display:"flex", gap:4, marginBottom:24 }}>
                  {[1,2,3,4].map(s => (
                    <div key={s} style={{ flex:1, height:4, borderRadius:2, background: step>s ? C.accent : step===s ? "#8b5cf6" : "#ffffff15", transition:"background 0.3s" }} />
                  ))}
                </div>

                {/* STEP 1 — View */}
                {step === 1 && (
                  <Card>
                    <Step n={1} text="What is NIFTY doing today?" />
                    <p style={{ color:C.muted, fontSize:13, marginBottom:16 }}>Look at the chart. Trust your gut. Pick one.</p>
                    {VIEWS.map(v => (
                      <button key={v.value} onClick={() => setView(v.value)} style={{
                        display:"flex", alignItems:"center", gap:12, padding:16, width:"100%",
                        border:`2px solid`, borderColor: view===v.value ? C.accent : C.border,
                        borderRadius:12, background: view===v.value ? "#6366f115" : "#ffffff05",
                        cursor:"pointer", color:C.white, fontFamily:"'DM Sans',sans-serif",
                        fontWeight:600, fontSize:15, marginBottom:8, transition:"all 0.2s"
                      }}>
                        <v.icon size={20} color={v.color} />
                        {v.label}
                        {view===v.value && <CheckCircle size={16} color={C.accent} style={{ marginLeft:"auto" }} />}
                      </button>
                    ))}
                    {view && <Btn color={C.accent} onClick={() => setStep(2)} style={{ marginTop:8 }}>Next →</Btn>}
                  </Card>
                )}

                {/* STEP 2 — Thesis */}
                {step === 2 && (
                  <Card>
                    <Step n={2} text="Write your thesis" />
                    <p style={{ color:C.muted, fontSize:13, marginBottom:4 }}>One sentence. Why do you think NIFTY is {view}?</p>
                    <p style={{ color:C.accent, fontSize:12, marginBottom:12, fontFamily:"'DM Mono',monospace" }}>e.g. "VIX is calm and chart is bouncing from support"</p>
                    <textarea value={thesis} onChange={e => setThesis(e.target.value)}
                      placeholder="I think NIFTY will _____ because _____"
                      style={{ width:"100%", minHeight:90, padding:14, borderRadius:10, border:`2px solid ${C.border}`, background:"#ffffff08", color:C.white, fontSize:14, fontFamily:"'DM Sans',sans-serif", resize:"none", boxSizing:"border-box", outline:"none" }}
                    />
                    {/* Strategy hint */}
                    {view && (
                      <div style={{ marginTop:12, padding:12, background:"#6366f110", borderRadius:10, border:`1px solid #6366f130` }}>
                        <div style={{ fontSize:12, color:C.accent, fontWeight:600, marginBottom:8 }}>💡 Strategies for {view} view:</div>
                        {Object.entries(STRATEGIES).filter(([,v]) => {
                          if (view==="bullish")  return v.need.includes("UP");
                          if (view==="bearish")  return v.need.includes("DOWN");
                          return v.need.includes("FLAT");
                        }).map(([name,v]) => (
                          <div key={name} style={{ fontSize:13, color:"#e2e8f0", marginBottom:3 }}>{v.emoji} {name}</div>
                        ))}
                      </div>
                    )}
                    <div style={{ display:"flex", gap:8, marginTop:14 }}>
                      <Btn color="#ffffff20" onClick={() => setStep(1)}>← Back</Btn>
                      <Btn color={C.accent} onClick={() => setStep(3)} disabled={thesis.trim().length < 10} style={{ flex:1, opacity: thesis.trim().length<10 ? 0.4 : 1 }}>
                        {thesis.trim().length < 10 ? <><Lock size={14}/> Write more...</> : "Next →"}
                      </Btn>
                    </div>
                  </Card>
                )}

                {/* STEP 3 — Strategy + trade */}
                {step === 3 && (
                  <Card>
                    <Step n={3} text="Log your paper trade" />
                    <Label>Strategy</Label>
                    {Object.entries(STRATEGIES).map(([name,v]) => (
                      <button key={name} onClick={() => setStrategy(name)} style={{
                        display:"flex", alignItems:"center", gap:10, padding:"12px 14px", width:"100%",
                        border:`2px solid`, borderColor: strategy===name ? C.accent : C.border,
                        borderRadius:10, background: strategy===name ? "#6366f115" : "#ffffff05",
                        cursor:"pointer", color:C.white, fontFamily:"'DM Sans',sans-serif",
                        fontSize:13, fontWeight:500, textAlign:"left", marginBottom:8, transition:"all 0.2s"
                      }}>
                        <span style={{ fontSize:18 }}>{v.emoji}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600 }}>{name}</div>
                          <div style={{ fontSize:11, color:C.muted }}>{v.need}</div>
                        </div>
                        {strategy===name && <CheckCircle size={16} color={C.accent} />}
                      </button>
                    ))}

                    <Label style={{ marginTop:8 }}>NIFTY at entry</Label>
                    <TInput value={niftyLevel} onChange={e => setNiftyLevel(e.target.value)} placeholder="e.g. 24332" />

                    <div style={{ display:"flex", gap:10 }}>
                      <div style={{ flex:1 }}>
                        <Label>Sold Strike</Label>
                        <TInput value={soldStrike} onChange={e => setSoldStrike(e.target.value)} placeholder="e.g. 24000 PE" />
                      </div>
                      <div style={{ flex:1 }}>
                        <Label>Bought Strike</Label>
                        <TInput value={boughtStrike} onChange={e => setBoughtStrike(e.target.value)} placeholder="e.g. 23850 PE" />
                      </div>
                    </div>

                    <Label>Your emotion right now</Label>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
                      {EMOTIONS.map(em => (
                        <button key={em} onClick={() => setEmotion(em)} style={{
                          padding:"8px 12px", borderRadius:8, border:`2px solid`,
                          borderColor: emotion===em ? C.accent : C.border,
                          background: emotion===em ? "#6366f120" : "transparent",
                          color:C.white, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif"
                        }}>{em}</button>
                      ))}
                    </div>

                    <div style={{ display:"flex", gap:8 }}>
                      <Btn color="#ffffff20" onClick={() => setStep(2)}>← Back</Btn>
                      <Btn color={C.accent} onClick={() => setStep(4)} disabled={!strategy || !niftyLevel} style={{ flex:1, opacity:(!strategy||!niftyLevel)?0.4:1 }}>Next →</Btn>
                    </div>
                  </Card>
                )}

                {/* STEP 4 — Outcome */}
                {step === 4 && (
                  <Card>
                    <Step n={4} text="How did it go?" />
                    <p style={{ color:C.muted, fontSize:13, marginBottom:14 }}>Still open? Mark it Open and update later.</p>
                    <Label>Outcome</Label>
                    <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                      {OUTCOMES.map(o => (
                        <button key={o.value} onClick={() => setOutcome(o.value)} style={{
                          flex:1, padding:12, borderRadius:10, border:`2px solid`,
                          borderColor: outcome===o.value ? C.accent : C.border,
                          background: outcome===o.value ? "#6366f120" : "transparent",
                          color:C.white, cursor:"pointer", fontSize:13, fontWeight:600,
                          fontFamily:"'DM Sans',sans-serif"
                        }}>{o.label}</button>
                      ))}
                    </div>

                    {outcome && outcome !== "open" && (
                      <>
                        <Label>P&L (paper)</Label>
                        <TInput value={outcomePL} onChange={e => setOutcomePL(e.target.value)} placeholder="e.g. +₹1200 or -₹800" />
                        <Label>Was your NIFTY prediction correct?</Label>
                        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                          {[["✅ Yes",true],["❌ No",false]].map(([label,val]) => (
                            <button key={label} onClick={() => setPredRight(val)} style={{
                              flex:1, padding:12, borderRadius:10, border:`2px solid`,
                              borderColor: predRight===val ? C.accent : C.border,
                              background: predRight===val ? "#6366f120" : "transparent",
                              color:C.white, cursor:"pointer", fontSize:14, fontWeight:600,
                              fontFamily:"'DM Sans',sans-serif"
                            }}>{label}</button>
                          ))}
                        </div>
                      </>
                    )}

                    <div style={{ display:"flex", gap:8 }}>
                      <Btn color="#ffffff20" onClick={() => setStep(3)}>← Back</Btn>
                      <Btn color={C.green} onClick={saveEntry} disabled={!outcome} style={{ flex:1, opacity:!outcome?0.4:1 }}>💾 Save Entry</Btn>
                    </div>
                  </Card>
                )}
              </>
            )}
          </>
        )}

        {/* HISTORY */}
        {jTab === "history" && (
          <div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Trade History</div>
            {entries.length === 0
              ? <Empty text="No entries yet. Log your first trade!" />
              : entries.map(e => (
                <div key={e.id} style={{ background:"#ffffff08", borderRadius:14, marginBottom:12, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <button onClick={() => setExpandedEntry(expandedEntry===e.id ? null : e.id)} style={{
                    width:"100%", padding:"14px 16px", display:"flex", alignItems:"center",
                    gap:10, background:"transparent", border:"none", color:C.white, cursor:"pointer", fontFamily:"'DM Sans',sans-serif"
                  }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
                      background: e.outcome==="win" ? C.green : e.outcome==="loss" ? C.red : C.amber }} />
                    <div style={{ textAlign:"left", flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14 }}>{fmtDate(e.date)}</div>
                      <div style={{ fontSize:12, color:C.muted }}>{e.strategy} · {e.view}</div>
                    </div>
                    {e.outcomePL && <div style={{ fontSize:13, fontWeight:700, color: e.outcomePL.includes("-") ? C.red : C.green }}>{e.outcomePL}</div>}
                    {expandedEntry===e.id ? <ChevronUp size={16} color={C.muted}/> : <ChevronDown size={16} color={C.muted}/>}
                  </button>
                  {expandedEntry===e.id && (
                    <div style={{ padding:"0 16px 16px", borderTop:`1px solid ${C.border}` }}>
                      <div style={{ marginTop:12, fontSize:13, color:"#cbd5e1", lineHeight:1.8 }}>
                        <div><span style={{ color:C.muted }}>Thesis:</span> {e.thesis}</div>
                        <div><span style={{ color:C.muted }}>NIFTY at entry:</span> {e.niftyLevel}</div>
                        <div><span style={{ color:C.muted }}>Sold:</span> {e.soldStrike} · <span style={{ color:C.muted }}>Bought:</span> {e.boughtStrike}</div>
                        <div><span style={{ color:C.muted }}>Emotion:</span> {e.emotion}</div>
                        {e.predictionCorrect !== null && <div><span style={{ color:C.muted }}>Prediction correct?</span> {e.predictionCorrect ? "✅ Yes" : "❌ No"}</div>}
                      </div>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        )}

        {/* STATS */}
        {jTab === "stats" && (
          <div>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Your Progress</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              <StatCard label="Total Trades"    value={entries.length}               color={C.accent} />
              <StatCard label="Win Rate"         value={closed.length ? `${winRate}%` : "—"} color={C.green} />
              <StatCard label="Prediction Acc."  value={predDone.length ? `${predAcc}%` : "—"} color={C.amber} />
              <StatCard label="Wins / Losses"    value={`${wins} / ${losses}`}        color="#8b5cf6" />
            </div>

            {entries.length > 0 && (
              <div style={{ background:"#ffffff08", borderRadius:14, padding:16, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:12, fontWeight:600, marginBottom:12, color:C.muted, textTransform:"uppercase", letterSpacing:"0.5px" }}>Strategies Used</div>
                {Object.entries(STRATEGIES).map(([s,v]) => {
                  const count = entries.filter(e => e.strategy===s).length;
                  if (!count) return null;
                  return (
                    <div key={s} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                      <div style={{ fontSize:13, flex:1, color:"#e2e8f0" }}>{v.emoji} {s}</div>
                      <div style={{ fontSize:13, fontFamily:"'DM Mono',monospace", color:C.accent }}>{count}x</div>
                      <div style={{ width:60, height:6, borderRadius:3, background:"#ffffff10" }}>
                        <div style={{ width:`${(count/entries.length)*100}%`, height:"100%", borderRadius:3, background:C.accent }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {entries.length === 0 && <Empty text="Log trades to see your stats here." />}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
//  SHARED SUB-COMPONENTS
// ─────────────────────────────────────────
function Card({ children }) {
  return <div style={{ background:"#ffffff08", borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>{children}</div>;
}

function Step({ n, text }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
      <div style={{ width:28, height:28, borderRadius:"50%", background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>{n}</div>
      <div style={{ fontWeight:700, fontSize:16 }}>{text}</div>
    </div>
  );
}

function SectionHeader({ title, pct, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
      <div style={{ fontWeight:700, fontSize:18 }}>{title}</div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontSize:24, fontWeight:800, color, fontFamily:"'DM Mono',monospace" }}>{pct}%</div>
        <div style={{ fontSize:11, color:C.muted }}>Complete</div>
      </div>
    </div>
  );
}

function CItem({ checked, onChange, label, desc }) {
  return (
    <div onClick={onChange} style={{ background:"#ffffff06", border:`1px solid`, borderColor: checked ? "#6366f140" : C.border, borderRadius:12, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer", transition:"all 0.2s" }}>
      <div style={{ width:24, height:24, borderRadius:7, border:`2px solid`, borderColor: checked ? C.green : "#ffffff30", background: checked ? C.green : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, transition:"all 0.2s" }}>
        {checked && <Check size={14} color="white" />}
      </div>
      <div>
        <div style={{ fontWeight:600, fontSize:14, color:C.white }}>{label}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{desc}</div>
      </div>
    </div>
  );
}

function Label({ children, style }) {
  return <div style={{ fontSize:12, color:C.muted, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", ...style }}>{children}</div>;
}

function TInput({ value, onChange, placeholder }) {
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} style={{
      width:"100%", padding:"12px 14px", borderRadius:10, border:`2px solid ${C.border}`,
      background:"#ffffff08", color:C.white, fontSize:14, fontFamily:"'DM Sans',sans-serif",
      boxSizing:"border-box", outline:"none", marginBottom:12
    }} />
  );
}

function Btn({ children, color, onClick, disabled, style }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding:"13px 18px", borderRadius:12, border:"none", background:color,
      color:"white", fontWeight:700, fontSize:14, cursor: disabled?"not-allowed":"pointer",
      fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center",
      justifyContent:"center", gap:6, width:"100%", transition:"opacity 0.2s", ...style
    }}>{children}</button>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background:"#ffffff08", borderRadius:14, padding:"16px 14px", border:`1px solid ${C.border}`, textAlign:"center" }}>
      <div style={{ fontSize:26, fontWeight:800, color, fontFamily:"'DM Mono',monospace" }}>{value}</div>
      <div style={{ fontSize:11, color:C.muted, marginTop:4, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</div>
    </div>
  );
}

function TodayDone({ entry, onEdit }) {
  return (
    <div style={{ background:"#10b98115", borderRadius:16, padding:20, border:"1px solid #10b98130", textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:8 }}>✅</div>
      <div style={{ fontWeight:700, fontSize:18, marginBottom:4 }}>Done for today!</div>
      <div style={{ color:C.muted, fontSize:13, marginBottom:20 }}>You logged your trade. Come back tomorrow.</div>
      <div style={{ background:"#ffffff08", borderRadius:12, padding:14, textAlign:"left", marginBottom:16 }}>
        <div style={{ fontSize:13, color:"#cbd5e1", lineHeight:1.8 }}>
          <div><span style={{ color:C.muted }}>View:</span> {entry.view}</div>
          <div><span style={{ color:C.muted }}>Strategy:</span> {entry.strategy}</div>
          <div><span style={{ color:C.muted }}>Thesis:</span> {entry.thesis}</div>
        </div>
      </div>
      <Btn color="#ffffff15" onClick={onEdit} style={{ fontSize:13 }}>Edit today's entry</Btn>
    </div>
  );
}

function Empty({ text }) {
  return <div style={{ textAlign:"center", padding:"40px 0", color:C.muted }}>{text}</div>;
}
