import { useState } from "react";

const sections = [
  {
    id: "gtts",
    label: "GTT Audit",
    emoji: "🎯",
    items: [
      { id: "g1", text: "Open Kite → GTT orders → list all active GTTs" },
      { id: "g2", text: "Cancel any GTT set impulsively this week (gut check: would sober-Monday-me agree?)" },
      { id: "g3", text: "Cancel duplicate GTTs on the same stock" },
      { id: "g4", text: "Confirm remaining GTTs still have capital backing if ALL trigger at once" },
    ],
  },
  {
    id: "positions",
    label: "Open Positions",
    emoji: "📊",
    items: [
      { id: "p1", text: "Review each holding — is the thesis still intact?" },
      { id: "p2", text: "Any stop-loss levels to update over the weekend?" },
      { id: "p3", text: "Check daily RSI on holdings showing weakness" },
      { id: "p4", text: "No averaging down decisions without sector context check" },
    ],
  },
  {
    id: "week",
    label: "Week Debrief",
    emoji: "🪞",
    items: [
      { id: "w1", text: "How many trades this week? (target ≤ planned entries)" },
      { id: "w2", text: "Any trade taken outside a pre-set GTT level?" },
      { id: "w3", text: "Did a winning streak trigger overconfidence?" },
      { id: "w4", text: "One thing I did well. One thing to fix next week." },
    ],
  },
  {
    id: "monday",
    label: "Monday Setup",
    emoji: "☀️",
    items: [
      { id: "m1", text: "Pick ONE high-conviction setup from watchlist for Monday" },
      { id: "m2", text: "Write the thesis in one sentence (if you can't, it's not ready)" },
      { id: "m3", text: "Note the entry level — set GTT on Monday morning, not now" },
      { id: "m4", text: "Close Kite. Weekend starts." },
    ],
  },
];

const rulesBanner = [
  "🚫 No new GTTs today",
  "👀 Review only",
  "☕ Make a coffee first",
];

export default function FridayReview() {
  const [checked, setChecked] = useState({});
  const [mondaySetup, setMondaySetup] = useState({ stock: "", thesis: "", level: "" });
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const totalItems = sections.flatMap((s) => s.items).length;
  const doneCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((doneCount / totalItems) * 100);

  const allDone = doneCount === totalItems;

  const reset = () => {
    setChecked({});
    setMondaySetup({ stock: "", thesis: "", level: "" });
    setSubmitted(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f1117",
      color: "#e8e8e8",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: "24px 16px",
      maxWidth: 520,
      margin: "0 auto",
    }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>📋</span>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px", color: "#fff" }}>
            Friday Review
          </h1>
          <span style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 600,
            background: "#1e2330",
            color: "#6b7db3",
            padding: "3px 8px",
            borderRadius: 6,
            letterSpacing: "0.5px",
          }}>REVIEW ONLY</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#5a6a8a", lineHeight: 1.5 }}>
          No new GTTs today. Review, reflect, pick one setup for Monday.
        </p>
      </div>

      {/* Rules Banner */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 24,
        flexWrap: "wrap",
      }}>
        {rulesBanner.map((r, i) => (
          <span key={i} style={{
            fontSize: 12,
            fontWeight: 600,
            background: "#1a1f2e",
            border: "1px solid #2a3050",
            color: "#8899cc",
            padding: "5px 10px",
            borderRadius: 20,
          }}>{r}</span>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#5a6a8a" }}>Progress</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: progress === 100 ? "#4ade80" : "#8899cc" }}>
            {doneCount}/{totalItems}
          </span>
        </div>
        <div style={{ height: 4, background: "#1e2330", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: progress === 100 ? "#4ade80" : "#3b5bdb",
            borderRadius: 4,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const sectionDone = section.items.every((i) => checked[i.id]);
        return (
          <div key={section.id} style={{
            marginBottom: 20,
            background: "#141820",
            borderRadius: 12,
            border: `1px solid ${sectionDone ? "#1e3a2a" : "#1e2330"}`,
            overflow: "hidden",
            transition: "border-color 0.3s",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderBottom: "1px solid #1a1f2e",
              background: sectionDone ? "#0d1f15" : "transparent",
            }}>
              <span style={{ fontSize: 16 }}>{section.emoji}</span>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: sectionDone ? "#4ade80" : "#aabbdd",
                letterSpacing: "0.2px",
              }}>{section.label}</span>
              {sectionDone && <span style={{ marginLeft: "auto", fontSize: 13, color: "#4ade80" }}>✓</span>}
            </div>
            <div style={{ padding: "8px 0" }}>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "10px 16px",
                    cursor: "pointer",
                    background: checked[item.id] ? "#0d1a10" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `2px solid ${checked[item.id] ? "#4ade80" : "#2a3050"}`,
                    background: checked[item.id] ? "#4ade80" : "transparent",
                    flexShrink: 0,
                    marginTop: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {checked[item.id] && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#0f1117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: checked[item.id] ? "#3a5a3a" : "#8899bb",
                    textDecoration: checked[item.id] ? "line-through" : "none",
                    transition: "all 0.15s",
                  }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Monday One Setup Card */}
      {!submitted ? (
        <div style={{
          marginBottom: 20,
          background: "#141820",
          borderRadius: 12,
          border: "1px solid #2a3050",
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            borderBottom: "1px solid #1a1f2e",
          }}>
            <span style={{ fontSize: 16 }}>🎯</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#aabbdd" }}>Monday's One Setup</span>
            <span style={{
              marginLeft: "auto",
              fontSize: 10,
              color: "#3b5bdb",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}>GTT ON MONDAY</span>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "#5a6a8a", fontWeight: 600, letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
                STOCK
              </label>
              <input
                value={mondaySetup.stock}
                onChange={(e) => setMondaySetup((p) => ({ ...p, stock: e.target.value }))}
                placeholder="e.g. LTTS, Persistent, Coforge..."
                style={{
                  width: "100%",
                  background: "#0f1117",
                  border: "1px solid #2a3050",
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: "#e8e8e8",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#5a6a8a", fontWeight: 600, letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
                THESIS (one sentence)
              </label>
              <input
                value={mondaySetup.thesis}
                onChange={(e) => setMondaySetup((p) => ({ ...p, thesis: e.target.value }))}
                placeholder="Why this stock, why now..."
                style={{
                  width: "100%",
                  background: "#0f1117",
                  border: "1px solid #2a3050",
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: "#e8e8e8",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#5a6a8a", fontWeight: 600, letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>
                ENTRY LEVEL
              </label>
              <input
                value={mondaySetup.level}
                onChange={(e) => setMondaySetup((p) => ({ ...p, level: e.target.value }))}
                placeholder="e.g. ₹4,200 — set GTT Monday morning"
                style={{
                  width: "100%",
                  background: "#0f1117",
                  border: "1px solid #2a3050",
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: "#e8e8e8",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              onClick={() => mondaySetup.stock && mondaySetup.thesis && setSubmitted(true)}
              style={{
                marginTop: 4,
                background: mondaySetup.stock && mondaySetup.thesis ? "#3b5bdb" : "#1e2330",
                color: mondaySetup.stock && mondaySetup.thesis ? "#fff" : "#3a4a6a",
                border: "none",
                borderRadius: 8,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: mondaySetup.stock && mondaySetup.thesis ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              Lock In Setup →
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          marginBottom: 20,
          background: "#0d1f15",
          borderRadius: 12,
          border: "1px solid #1e3a2a",
          padding: "16px",
        }}>
          <div style={{ fontSize: 13, color: "#4ade80", fontWeight: 700, marginBottom: 10 }}>
            ✓ Monday Setup Locked
          </div>
          <div style={{ fontSize: 13, color: "#aabbdd", marginBottom: 4 }}>
            <strong style={{ color: "#fff" }}>{mondaySetup.stock}</strong>
          </div>
          <div style={{ fontSize: 12, color: "#6b8a6b", marginBottom: 4, lineHeight: 1.5 }}>
            {mondaySetup.thesis}
          </div>
          {mondaySetup.level && (
            <div style={{ fontSize: 12, color: "#3b7a5b" }}>
              Entry: {mondaySetup.level}
            </div>
          )}
          <button
            onClick={() => setSubmitted(false)}
            style={{
              marginTop: 12,
              background: "transparent",
              border: "1px solid #1e3a2a",
              color: "#3a5a3a",
              borderRadius: 6,
              padding: "5px 10px",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>
      )}

      {/* Completion State */}
      {allDone && submitted && (
        <div style={{
          textAlign: "center",
          padding: "24px 16px",
          background: "#0d1f15",
          borderRadius: 12,
          border: "1px solid #1e3a2a",
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>
            Friday Review Done
          </div>
          <div style={{ fontSize: 13, color: "#4a7a4a", marginBottom: 16 }}>
            Close Kite. Weekend starts. See you Monday.
          </div>
          <button
            onClick={reset}
            style={{
              background: "transparent",
              border: "1px solid #1e3a2a",
              color: "#3a5a3a",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Reset for next week
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: 11, color: "#2a3050", paddingTop: 8 }}>
        Your GTTs are your sober self talking to your excited self.
      </div>
    </div>
  );
}
