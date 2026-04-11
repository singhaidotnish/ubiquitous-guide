import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are a brutally honest, deeply empathetic trading psychology coach for Nish — a 53-year-old options trader with ADHD who is in a recovery phase after significant losses (₹32 lakh in assigned positions in BAJAJ-AUTO and TRENT). He is on a 90+ day break from live trading, studying Zerodha Varsity, and building trading tools.

KEY FACTS ABOUT NISH:
- Has ADHD: hyperfocus, impulse control challenges, emotional dysregulation in trading
- Previously overtrade and revenge-traded, leading to his losses
- Trades Indian markets (NSE/BSE), uses Zerodha and Sensibull
- Is working on theta strategies (short strangles, iron condors) for the future
- Has high intelligence and pattern recognition — his ADHD is a superpower when channeled
- Currently NOT trading live — he is in education/recovery mode

YOUR ROLE:
- When he asks about a trade or market situation: Give a SHORT, DIRECT answer. No fluff. Max 3-4 sentences.
- When he's feeling impulsive: Name the emotion, validate it, then redirect him firmly but kindly.
- When he doubts himself: Remind him of his discipline so far (90+ days!)
- When he asks a technical question about options: Explain clearly with an analogy if needed.
- ALWAYS end with ONE concrete action he should take right now.

TONE: Like a wise friend who is also a trading expert. Direct. Warm. No lectures. No bullet point walls. Short paragraphs.

CRITICAL RULES:
- Never tell him to make a trade he hasn't planned
- If he seems to be about to break his trading break, say "SHIELDS UP" and redirect
- Keep responses SHORT — ADHD brains need brevity
- End every response with: "→ Right now: [one specific action]"`;

const STARTER_PROMPTS = [
  "I feel like I'm missing out on today's big NIFTY move 😤",
  "Should I sell a covered call on my BAJAJ-AUTO position?",
  "I checked my portfolio 5 times this hour. Help.",
  "What does IV 16 mean on the option chain I see?",
  "I'm feeling motivated today. Is it safe to paper trade?",
];

export default function ADHDTradingCompanion() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey Nish. I'm here. What's going on in your head right now — market, emotion, or a question?\n\n→ Right now: Type anything. No judgment.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const reply = data.content?.find((b) => b.type === "text")?.text || "I'm here. Try again.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Network hiccup. But hey — that pause was free impulse control. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const moodColors = {
    calm: "#22c55e",
    tempted: "#f59e0b",
    frustrated: "#ef4444",
    focused: "#3b82f6",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', serif",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
      maxWidth: 680,
      margin: "0 auto",
      padding: "0 0 80px",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid #1e293b",
        background: "linear-gradient(180deg, #0f172a 0%, #0a0a0f 100%)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44,
            background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
            boxShadow: "0 0 20px rgba(124,58,237,0.3)",
          }}>🧠</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>Ask Claude</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Your trading psychology mirror • NIFTY 24050 +1.16%</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {Object.entries(moodColors).map(([m, c]) => (
              <button
                key={m}
                onClick={() => setMood(mood === m ? null : m)}
                style={{
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 20,
                  border: `1px solid ${mood === m ? c : "#334155"}`,
                  background: mood === m ? c + "22" : "transparent",
                  color: mood === m ? c : "#64748b",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                }}
              >{m}</button>
            ))}
          </div>
        </div>

        {/* Mood banner */}
        {mood === "tempted" && (
          <div style={{
            background: "#78350f22",
            border: "1px solid #92400e",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: "#fcd34d",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            🛡️ <strong>SHIELDS UP</strong> — You marked yourself as tempted. Close the terminal. Walk away.
          </div>
        )}
        {mood === "frustrated" && (
          <div style={{
            background: "#7f1d1d22",
            border: "1px solid #991b1b",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: "#fca5a5",
          }}>
            ⏸️ 30-minute cooldown rule is active. You know what to do.
          </div>
        )}
        {mood === "calm" && (
          <div style={{
            background: "#14532d22",
            border: "1px solid #166534",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: "#86efac",
          }}>
            ✅ Calm mode. Great time to study, not to trade. Open Varsity.
          </div>
        )}
        {mood === "focused" && (
          <div style={{
            background: "#1e3a5f22",
            border: "1px solid #1d4ed8",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: "#93c5fd",
          }}>
            🎯 Focused. Use it for analysis, journaling, or tool building — not live trades.
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          }}>
            {m.role === "assistant" && (
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, marginRight: 10, flexShrink: 0, marginTop: 4,
              }}>🧠</div>
            )}
            <div style={{
              maxWidth: "78%",
              padding: "12px 16px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              background: m.role === "user"
                ? "linear-gradient(135deg, #1d4ed8, #2563eb)"
                : "#1e293b",
              border: m.role === "assistant" ? "1px solid #334155" : "none",
              fontSize: 14,
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
              boxShadow: m.role === "user" ? "0 2px 12px rgba(29,78,216,0.3)" : "none",
            }}>
              {m.content.split("→ Right now:").map((part, idx) =>
                idx === 0 ? (
                  <span key={idx}>{part}</span>
                ) : (
                  <div key={idx} style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid #334155",
                    color: "#34d399",
                    fontWeight: 600,
                  }}>→ Right now:{part}</div>
                )
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>🧠</div>
            <div style={{
              padding: "12px 16px", background: "#1e293b",
              border: "1px solid #334155", borderRadius: "4px 18px 18px 18px",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#475569",
                  animation: "pulse 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div style={{ padding: "16px 20px 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {STARTER_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => sendMessage(p)}
              style={{
                fontSize: 12,
                padding: "7px 12px",
                borderRadius: 20,
                border: "1px solid #334155",
                background: "#1e293b",
                color: "#94a3b8",
                cursor: "pointer",
                transition: "all 0.15s",
                textAlign: "left",
              }}
              onMouseEnter={e => e.target.style.borderColor = "#3b82f6"}
              onMouseLeave={e => e.target.style.borderColor = "#334155"}
            >{p}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 680,
        padding: "12px 16px",
        background: "#0a0a0f",
        borderTop: "1px solid #1e293b",
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="What's happening? Trade idea, emotion, question…"
            rows={1}
            style={{
              flex: 1,
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 14,
              padding: "12px 16px",
              fontSize: 14,
              color: "#e2e8f0",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
              fontFamily: "inherit",
              maxHeight: 120,
              overflowY: "auto",
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: loading || !input.trim()
                ? "#1e293b"
                : "linear-gradient(135deg, #1d4ed8, #7c3aed)",
              border: "none",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              color: "#fff",
              fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s",
              boxShadow: loading || !input.trim() ? "none" : "0 0 16px rgba(124,58,237,0.4)",
            }}
          >↑</button>
        </div>
        <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 8 }}>
          90+ days strong • BAJAJ-AUTO & TRENT holding • You're doing the work
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
