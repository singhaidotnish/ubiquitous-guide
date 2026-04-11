import { useState } from "react";
import { Check, AlertTriangle, TrendingUp, Brain, Shield, Zap } from "lucide-react";

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

const tabConfig = [
  { id: "premarket", label: "Pre-Market", icon: "☀️", color: "#3b82f6" },
  { id: "trade", label: "Before Trade", icon: "⚡", color: "#22c55e" },
  { id: "posttrade", label: "Post-Trade", icon: "📊", color: "#a855f7" },
  { id: "impulse", label: "Impulse", icon: "🛡️", color: "#f97316" },
];

export default function ADHDTradingChecklist() {
  const [activeTab, setActiveTab] = useState("premarket");
  const [preMarketChecks, setPreMarketChecks] = useState({
    reviewedRules: false,
    setDailyLimit: false,
    checkedCalendar: false,
    mentalState: false,
    positionSized: false,
  });
  const [tradeChecks, setTradeChecks] = useState({
    waitedCooldown: false,
    wroteReason: false,
    checkedRisk: false,
    noFOMO: false,
    withinLimits: false,
  });
  const [postTradeChecks, setPostTradeChecks] = useState({
    loggedTrade: false,
    emotionNoted: false,
    followedPlan: false,
    reviewedMistake: false,
  });
  const [dailyStats, setDailyStats] = useState({
    tradesCount: "",
    profitLoss: "",
    emotionalState: "",
  });
  const [impulseTriggers, setImpulseTriggers] = useState([
    { trigger: "Feeling FOMO", action: "Close charts for 10 min", checked: false },
    { trigger: "After a loss", action: "Wait 30 min cooldown", checked: false },
    { trigger: "Want to increase size", action: "Write reason + wait 15 min", checked: false },
    { trigger: "Market moving fast", action: "Take 3 deep breaths", checked: false },
    { trigger: "Bored/restless", action: "Close trading app", checked: false },
  ]);
  const [customTrigger, setCustomTrigger] = useState("");

  const toggleCheck = (setter, key) => setter((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleImpulse = (i) =>
    setImpulseTriggers((prev) => prev.map((item, idx) => (idx === i ? { ...item, checked: !item.checked } : item)));

  const rate = (checks) => {
    const vals = Object.values(checks);
    return Math.round((vals.filter(Boolean).length / vals.length) * 100);
  };

  const preRate = rate(preMarketChecks);
  const tradeRate = rate(tradeChecks);
  const postRate = rate(postTradeChecks);

  const activeColor = tabConfig.find((t) => t.id === activeTab)?.color || COLORS.accent;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'JetBrains Mono', 'Courier New', monospace", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
        .tab-btn { background: none; border: none; cursor: pointer; transition: all 0.2s; }
        .tab-btn:hover { opacity: 0.8; }
        .check-btn { cursor: pointer; border: none; transition: all 0.15s; }
        .check-btn:hover { transform: scale(1.05); }
        .impulse-card { transition: border-color 0.2s, background 0.2s; }
        .impulse-card:hover { border-color: ${COLORS.accentGlow} !important; background: rgba(124,58,237,0.05) !important; }
        .stat-input { outline: none; transition: border-color 0.2s; }
        .stat-input:focus { border-color: ${COLORS.accentGlow} !important; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .glow { box-shadow: 0 0 20px rgba(124,58,237,0.3); }
      `}</style>

      {/* Header */}
      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "20px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={22} color="white" />
          </div>
          <div>
            <h1 style={{ color: COLORS.text, fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
              ADHD Trading System
            </h1>
            <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>your external brain for disciplined trading</p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 4 }}>TODAY</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[["PRE", preRate, "#3b82f6"], ["TRADE", tradeRate, "#22c55e"], ["POST", postRate, "#a855f7"]].map(([label, val, color]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color }}>{val}%</div>
                  <div style={{ fontSize: 9, color: COLORS.muted }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div style={{ background: "rgba(234,179,8,0.08)", borderBottom: `1px solid rgba(234,179,8,0.2)`, padding: "10px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={14} color={COLORS.yellow} />
          <p style={{ color: "#a16207", fontSize: 12 }}>
            <span style={{ color: COLORS.yellow, fontWeight: 600 }}>ADHD truth: </span>
            Your brain craves stimulation. Markets provide endless stimulation. This checklist is your guardrail.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.surface, borderRadius: 12, padding: 4, border: `1px solid ${COLORS.border}` }}>
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              className="tab-btn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: "10px 4px", borderRadius: 9, fontSize: 11, fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                background: activeTab === tab.id ? tab.color : "transparent",
                color: activeTab === tab.id ? "white" : COLORS.muted,
              }}
            >
              <div>{tab.icon}</div>
              <div style={{ marginTop: 2 }}>{tab.label}</div>
            </button>
          ))}
        </div>

        {/* Pre-Market */}
        {activeTab === "premarket" && (
          <Section title="Morning Routine" rate={preRate} rateColor="#3b82f6" subtitle="Complete before market open">
            {[
              { key: "reviewedRules", label: "Read my trading rules", desc: "No rules = emotional decisions. Your ADHD brain needs reminders." },
              { key: "setDailyLimit", label: "Set daily loss limit (write it down)", desc: "Stop trading if down ₹5,000 or 2% of capital." },
              { key: "checkedCalendar", label: "Check economic calendar / news", desc: "Know what events might spike volatility today." },
              { key: "mentalState", label: "Mental state check: Am I calm?", desc: "Stressed / angry / overconfident? Don't trade today." },
              { key: "positionSized", label: "Position size calculated for today", desc: "Know your max position BEFORE you see opportunities." },
            ].map(({ key, label, desc }) => (
              <CheckItem key={key} checked={preMarketChecks[key]} onChange={() => toggleCheck(setPreMarketChecks, key)} label={label} desc={desc} color="#3b82f6" />
            ))}
          </Section>
        )}

        {/* Before Trade */}
        {activeTab === "trade" && (
          <Section title="Before Every Trade" rate={tradeRate} rateColor="#22c55e" subtitle="Takes 2 minutes. If you can't wait, it's impulse.">
            <div style={{ background: "rgba(239,68,68,0.08)", border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
              <p style={{ color: "#fca5a5", fontSize: 12, fontWeight: 600 }}>
                ⛔ STOP — If you can't wait 2 minutes to check this, you're trading on impulse.
              </p>
            </div>
            {[
              { key: "waitedCooldown", label: "Waited cooldown (if previous was a loss)", desc: "30 min minimum after loss. Revenge trading destroys accounts." },
              { key: "wroteReason", label: "Wrote down WHY I'm taking this trade", desc: "If you can't explain in one sentence, don't take it." },
              { key: "checkedRisk", label: "Risk calculated: Max loss is acceptable", desc: "Can you lose this amount and sleep tonight?" },
              { key: "noFOMO", label: "Honest check: Is this FOMO or strategy?", desc: "If you feel rushed or excited, it's probably FOMO." },
              { key: "withinLimits", label: "Within my daily trade count limit", desc: "ADHD = overtrading risk. Set max trades per day." },
            ].map(({ key, label, desc }) => (
              <CheckItem key={key} checked={tradeChecks[key]} onChange={() => toggleCheck(setTradeChecks, key)} label={label} desc={desc} color="#22c55e" />
            ))}
          </Section>
        )}

        {/* Post Trade */}
        {activeTab === "posttrade" && (
          <Section title="After Every Trade" rate={postRate} rateColor="#a855f7" subtitle="Win or loss — always complete this">
            {[
              { key: "loggedTrade", label: "Logged trade details immediately", desc: "Entry, exit, size, reason, outcome. Before you forget." },
              { key: "emotionNoted", label: "Noted my emotional state", desc: "Excited? Angry? Calm? This matters more than P&L." },
              { key: "followedPlan", label: "Did I follow my plan? (Honest answer)", desc: "Even winning trades can break rules. Track discipline." },
              { key: "reviewedMistake", label: "If I broke a rule, why? One sentence.", desc: "Pattern recognition: Your ADHD has triggers. Find them." },
            ].map(({ key, label, desc }) => (
              <CheckItem key={key} checked={postTradeChecks[key]} onChange={() => toggleCheck(setPostTradeChecks, key)} label={label} desc={desc} color="#a855f7" />
            ))}

            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, marginTop: 20 }}>
              <p style={{ color: COLORS.text, fontSize: 13, fontWeight: 600, marginBottom: 12, fontFamily: "'Space Grotesk', sans-serif" }}>Daily Stats</p>
              {[
                { key: "tradesCount", placeholder: "Number of trades today", type: "number" },
                { key: "profitLoss", placeholder: "Total P&L  (e.g. +₹2500 or -₹1200)" },
                { key: "emotionalState", placeholder: "Overall emotional state today" },
              ].map(({ key, placeholder, type }) => (
                <input
                  key={key}
                  type={type || "text"}
                  placeholder={placeholder}
                  className="stat-input"
                  value={dailyStats[key]}
                  onChange={(e) => setDailyStats({ ...dailyStats, [key]: e.target.value })}
                  style={{
                    width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 12,
                    fontFamily: "'JetBrains Mono', monospace", marginBottom: 8,
                  }}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Impulse Control */}
        {activeTab === "impulse" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ color: COLORS.text, fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>IF → THEN Controls</h2>
              <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>When urges hit, use these automatic responses.</p>
            </div>

            <div style={{ background: "rgba(249,115,22,0.08)", border: `1px solid rgba(249,115,22,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Shield size={16} color={COLORS.orange} style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ color: "#fdba74", fontSize: 12 }}>
                <strong style={{ color: COLORS.orange }}>Your ADHD superpower:</strong> Pattern recognition. Use it to spot your own self-sabotage patterns.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {impulseTriggers.map((item, i) => (
                <div
                  key={i}
                  className="impulse-card"
                  style={{ background: COLORS.card, border: `1px solid ${item.checked ? "#22c55e44" : COLORS.border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}
                >
                  <button
                    className="check-btn"
                    onClick={() => toggleImpulse(i)}
                    style={{ width: 28, height: 28, borderRadius: 8, border: `2px solid ${item.checked ? COLORS.green : COLORS.border}`, background: item.checked ? COLORS.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >
                    {item.checked && <Check size={14} color="white" strokeWidth={3} />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: COLORS.orange, fontWeight: 600, marginBottom: 2 }}>IF: {item.trigger}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>THEN: {item.action}</div>
                  </div>
                  {item.checked && <Zap size={14} color={COLORS.green} />}
                </div>
              ))}
            </div>

            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, marginTop: 20 }}>
              <p style={{ color: COLORS.text, fontSize: 13, fontWeight: 600, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>Add your own trigger</p>
              <textarea
                placeholder="IF I check my portfolio more than 3 times in an hour, THEN I close all apps and go for a walk..."
                value={customTrigger}
                onChange={(e) => setCustomTrigger(e.target.value)}
                style={{ width: "100%", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", height: 80, resize: "none", outline: "none" }}
              />
            </div>
          </div>
        )}

        {/* Weekly Reflection */}
        <div style={{ marginTop: 28, background: "linear-gradient(135deg, #1e1040, #0f1f3d)", border: `1px solid #2a1f5a`, borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <TrendingUp size={16} color="#818cf8" />
            <p style={{ color: "#818cf8", fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Weekly Reflection — Every Sunday
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Which rules did I break most often this week?",
              "What emotion triggered my worst trade?",
              "Did I overtrade? (Count total trades)",
              "One lesson I'll apply next week:",
              "What ONE rule do I need to add?",
            ].map((q, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(129,140,248,0.15)", border: "1px solid rgba(129,140,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 9, color: "#818cf8", fontWeight: 700 }}>{i + 1}</span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 12 }}>{q}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, rate, rateColor, subtitle, children }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
          <p style={{ color: "#64748b", fontSize: 12, marginTop: 3 }}>{subtitle}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: rateColor, lineHeight: 1 }}>{rate}%</div>
          <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>complete</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function CheckItem({ checked, onChange, label, desc, color }) {
  return (
    <div style={{ background: "#1a1a26", border: `1px solid ${checked ? color + "44" : "#2a2a3d"}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14, transition: "border-color 0.2s" }}>
      <button
        className="check-btn"
        onClick={onChange}
        style={{ width: 28, height: 28, borderRadius: 8, border: `2px solid ${checked ? color : "#2a2a3d"}`, background: checked ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}
      >
        {checked && <Check size={14} color="white" strokeWidth={3} />}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4, textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.5 : 1 }}>{label}</div>
        <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}
