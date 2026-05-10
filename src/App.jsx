import React, { useState } from 'react';
import { Check, AlertTriangle, TrendingUp, Brain, Shield, Lock, ExternalLink } from 'lucide-react';

export default function ADHDTradingChecklist() {
  const [activeTab, setActiveTab] = useState('marketview');

  // Market View state
  const [trend, setTrendState] = useState(null); // 'up' | 'down' | 'side'
  const [vix, setVixState] = useState(null); // 'low' | 'mid' | 'high'
  const [eventsChecked, setEventsChecked] = useState(false);
  const [thesis, setThesis] = useState('');
  const marketViewComplete = trend && vix && eventsChecked && thesis.trim().length > 10;

  const [preMarketChecks, setPreMarketChecks] = useState({
    reviewedRules: false,
    setDailyLimit: false,
    checkedCalendar: false,
    mentalState: false,
    positionSized: false
  });

  const [tradeChecks, setTradeChecks] = useState({
    waitedCooldown: false,
    wroteReason: false,
    checkedRisk: false,
    noFOMO: false,
    withinLimits: false
  });

  const [postTradeChecks, setPostTradeChecks] = useState({
    loggedTrade: false,
    emotionNoted: false,
    followedPlan: false,
    reviewedMistake: false
  });

  const [dailyStats, setDailyStats] = useState({
    tradesCount: 0,
    profitLoss: '',
    emotionalState: ''
  });

  const [impulseTriggers, setImpulseTriggers] = useState([
    { trigger: 'Feeling FOMO', action: 'Close charts for 10 min', checked: false },
    { trigger: 'After a loss', action: 'Wait 30 min cooldown', checked: false },
    { trigger: 'Want to increase size', action: 'Write reason + wait 15 min', checked: false },
    { trigger: 'Market moving fast', action: 'Take 3 deep breaths', checked: false },
    { trigger: 'Bored/restless', action: 'Close trading app', checked: false }
  ]);

  const toggleCheck = (category, key) => {
    if (category === 'premarket') setPreMarketChecks(prev => ({ ...prev, [key]: !prev[key] }));
    else if (category === 'trade') setTradeChecks(prev => ({ ...prev, [key]: !prev[key] }));
    else if (category === 'posttrade') setPostTradeChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleImpulseTrigger = (index) => {
    setImpulseTriggers(prev => prev.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };

  const getCompletionRate = (checks) => {
    const total = Object.keys(checks).length;
    const completed = Object.values(checks).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const preMarketRate = getCompletionRate(preMarketChecks);
  const tradeRate = getCompletionRate(tradeChecks);
  const postTradeRate = getCompletionRate(postTradeChecks);

  const marketViewProgress = [trend, vix, eventsChecked].filter(Boolean).length;

  const scanSuggestion = {
    up: '📈 Bullish → Streak scan: "Price above 20 EMA + RSI above 50" — look for Bull Put Spread setups.',
    down: '📉 Bearish → Streak scan: "Price below 20 EMA + RSI below 50" — look for Bear Call Spread setups.',
    side: '↔️ Sideways → Streak scan: "RSI between 40–60 + Bollinger Band squeeze" — look for Iron Condor setups.'
  };

  const tabs = [
    { id: 'marketview', label: '🧭 Market View', locked: false },
    { id: 'premarket', label: 'Pre-Market', locked: !marketViewComplete },
    { id: 'trade', label: 'Before Trade', locked: !marketViewComplete },
    { id: 'posttrade', label: 'Post-Trade', locked: false },
    { id: 'impulse', label: 'Impulse Control', locked: false },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ADHD Trading System</h1>
            <p className="text-sm text-gray-600">Your external brain for disciplined trading</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800">Rule #1: Market view before everything</p>
              <p className="text-sm text-yellow-700">No thesis = no trade. Complete Market View to unlock the rest.</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => !tab.locked && setActiveTab(tab.id)}
              className={`px-3 py-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : tab.locked
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.locked && <Lock className="w-3 h-3" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── MARKET VIEW TAB ── */}
        {activeTab === 'marketview' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-800">Market View</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">{Math.round((marketViewProgress / 3) * 100)}%</div>
                <div className="text-xs text-gray-500">Steps done</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((marketViewProgress / 3) * 100)}%` }}
              />
            </div>

            {/* Step 1: NIFTY Trend */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-1">Step 1 — NIFTY direction this week</p>
              <p className="text-sm text-gray-500 mb-3">Look at the weekly chart. Pick one.</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {[
                  { val: 'up', label: '↑ Uptrend', sel: 'bg-green-100 border-green-600 text-green-800' },
                  { val: 'side', label: '→ Sideways', sel: 'bg-yellow-100 border-yellow-600 text-yellow-800' },
                  { val: 'down', label: '↓ Downtrend', sel: 'bg-red-100 border-red-600 text-red-800' },
                ].map(({ val, label, sel }) => (
                  <button
                    key={val}
                    onClick={() => setTrendState(val)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                      trend === val ? sel : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                <a href="https://in.tradingview.com/chart/?symbol=NSE%3ANIFTY" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                  <ExternalLink className="w-3 h-3" /> TradingView NIFTY
                </a>
                <a href="https://www.nseindia.com/market-data/live-market-indices" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                  <ExternalLink className="w-3 h-3" /> NSE Live
                </a>
              </div>
              {trend && (
                <div className="mt-3 bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm text-teal-800">
                  {scanSuggestion[trend]}
                  <a href="https://streak.world/scanner" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                    <ExternalLink className="w-3 h-3" /> Open Streak Scanner
                  </a>
                </div>
              )}
            </div>

            {/* Step 2: VIX */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-1">Step 2 — India VIX (fear gauge)</p>
              <p className="text-sm text-gray-500 mb-3">Below 15 = calm. 15–20 = moderate. Above 20 = high fear, trade smaller.</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {[
                  { val: 'low', label: 'Below 15 — calm' },
                  { val: 'mid', label: '15–20 — moderate' },
                  { val: 'high', label: 'Above 20 — high fear' },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setVixState(val)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                      vix === val
                        ? 'bg-blue-100 border-blue-600 text-blue-800'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <a href="https://www.nseindia.com/market-data/india-vix" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                <ExternalLink className="w-3 h-3" /> India VIX — NSE
              </a>
            </div>

            {/* Step 3: Events */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-3">Step 3 — Big events this week</p>
              <div className="space-y-2 mb-4">
                {[
                  { label: 'RBI policy / MPC meeting', href: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx', link: 'RBI site' },
                  { label: 'US Fed / global macro events', href: 'https://www.forexfactory.com/calendar', link: 'Forex Factory' },
                  { label: 'NSE earnings announcements', href: 'https://www.nseindia.com/companies-listing/corporate-filings-financial-results', link: 'NSE results' },
                  { label: 'Expiry day (every Thursday)', href: null, link: null },
                ].map(({ label, href, link }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{label}</span>
                    {href && (
                      <a href={href} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                        <ExternalLink className="w-3 h-3" /> {link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEventsChecked(e => !e)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    eventsChecked ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {eventsChecked && <Check className="w-4 h-4 text-white" />}
                </button>
                <span className="text-sm font-medium text-gray-700">I've checked for events this week</span>
              </div>
            </div>

            {/* Step 4: Thesis - locked until steps 1-3 done */}
            <div className="border rounded-lg p-4">
              <p className="font-semibold text-gray-800 mb-1">Step 4 — Write your thesis</p>
              <p className="text-sm text-gray-500 mb-3">Complete steps 1–3 first. Then write your view in one sentence.</p>
              {marketViewProgress < 3 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-400 text-sm">
                  <Lock className="w-5 h-5 mx-auto mb-2" />
                  Complete steps 1, 2 and 3 to unlock
                </div>
              ) : (
                <>
                  <textarea
                    className="w-full border-2 border-gray-200 focus:border-blue-400 outline-none rounded-lg p-3 text-sm resize-none h-20"
                    placeholder='Example: "NIFTY is bullish this week, VIX is calm, no major events — I will look for Bull Put Spread setups."'
                    value={thesis}
                    onChange={e => setThesis(e.target.value)}
                  />
                  {marketViewComplete && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 font-medium">
                      ✅ Market view complete — Pre-Market and Before Trade tabs are now unlocked.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ── PRE-MARKET TAB ── */}
        {activeTab === 'premarket' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Morning Routine</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{preMarketRate}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>
            <ChecklistItem checked={preMarketChecks.reviewedRules} onChange={() => toggleCheck('premarket', 'reviewedRules')} label="Read my trading rules (30 seconds)" description="No rules = emotional decisions. Your ADHD brain needs reminders." />
            <ChecklistItem checked={preMarketChecks.setDailyLimit} onChange={() => toggleCheck('premarket', 'setDailyLimit')} label="Set daily loss limit (write it down)" description="Example: Stop trading if down ₹5,000 or 2% of capital" />
            <ChecklistItem checked={preMarketChecks.checkedCalendar} onChange={() => toggleCheck('premarket', 'checkedCalendar')} label="Check economic calendar/news" description="Know what events might spike volatility today" />
            <ChecklistItem checked={preMarketChecks.mentalState} onChange={() => toggleCheck('premarket', 'mentalState')} label="Mental state check: Am I calm?" description="Stressed/angry/overconfident? Don't trade today." />
            <ChecklistItem checked={preMarketChecks.positionSized} onChange={() => toggleCheck('premarket', 'positionSized')} label="Position size calculated for today" description="Know your max position BEFORE you see opportunities" />
          </div>
        )}

        {/* ── BEFORE TRADE TAB ── */}
        {activeTab === 'trade' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Before Every Trade</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{tradeRate}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-red-800">STOP: This takes 2 minutes. If you can't wait 2 minutes, you're trading on impulse.</p>
            </div>
            <ChecklistItem checked={tradeChecks.waitedCooldown} onChange={() => toggleCheck('trade', 'waitedCooldown')} label="Waited cooldown period (if previous trade was loss)" description="30 min minimum after loss. Revenge trading destroys accounts." />
            <ChecklistItem checked={tradeChecks.wroteReason} onChange={() => toggleCheck('trade', 'wroteReason')} label="Wrote down WHY I'm taking this trade" description="If you can't explain it in one sentence, don't trade it" />
            <ChecklistItem checked={tradeChecks.checkedRisk} onChange={() => toggleCheck('trade', 'checkedRisk')} label="Risk calculated: Max loss is acceptable" description="Can you lose this amount and sleep tonight?" />
            <ChecklistItem checked={tradeChecks.noFOMO} onChange={() => toggleCheck('trade', 'noFOMO')} label="Honest check: Is this FOMO or strategy?" description="If you feel rushed or excited, it's probably FOMO" />
            <ChecklistItem checked={tradeChecks.withinLimits} onChange={() => toggleCheck('trade', 'withinLimits')} label="Within my daily trade count limit" description="ADHD = overtrading risk. Set max trades per day." />
          </div>
        )}

        {/* ── POST-TRADE TAB ── */}
        {activeTab === 'posttrade' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">After Trade (Win or Loss)</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{postTradeRate}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>
            <ChecklistItem checked={postTradeChecks.loggedTrade} onChange={() => toggleCheck('posttrade', 'loggedTrade')} label="Logged trade details immediately" description="Entry, exit, size, reason, outcome. Before you forget." />
            <ChecklistItem checked={postTradeChecks.emotionNoted} onChange={() => toggleCheck('posttrade', 'emotionNoted')} label="Noted my emotional state" description="Excited? Angry? Calm? This matters more than P&L" />
            <ChecklistItem checked={postTradeChecks.followedPlan} onChange={() => toggleCheck('posttrade', 'followedPlan')} label="Did I follow my plan? (Honest answer)" description="Even winning trades can break rules. Track discipline." />
            <ChecklistItem checked={postTradeChecks.reviewedMistake} onChange={() => toggleCheck('posttrade', 'reviewedMistake')} label="If I broke a rule, why? One sentence." description="Pattern recognition: Your ADHD has triggers. Find them." />
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Daily Trading Stats</h3>
              <div className="space-y-2">
                <input type="number" placeholder="Number of trades today" className="w-full p-2 border rounded" value={dailyStats.tradesCount} onChange={(e) => setDailyStats({ ...dailyStats, tradesCount: e.target.value })} />
                <input type="text" placeholder="Total P&L (e.g., +₹2500 or -₹1200)" className="w-full p-2 border rounded" value={dailyStats.profitLoss} onChange={(e) => setDailyStats({ ...dailyStats, profitLoss: e.target.value })} />
                <input type="text" placeholder="Overall emotional state" className="w-full p-2 border rounded" value={dailyStats.emotionalState} onChange={(e) => setDailyStats({ ...dailyStats, emotionalState: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {/* ── IMPULSE CONTROL TAB ── */}
        {activeTab === 'impulse' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">IF-THEN Impulse Controls</h2>
              <p className="text-sm text-gray-600">When ADHD urges hit, use these automatic responses.</p>
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <p className="text-sm text-orange-800"><strong>Your ADHD superpower:</strong> Pattern recognition. Use it to recognize your own patterns of self-sabotage.</p>
              </div>
            </div>
            {impulseTriggers.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleImpulseTrigger(index)} className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}>
                    {item.checked && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">IF: {item.trigger}</div>
                    <div className="text-sm text-gray-600 mt-1">THEN: {item.action}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Add Your Own Triggers</h3>
              <textarea placeholder="Example: IF I check my portfolio more than 3 times in an hour, THEN I close all apps and go for a walk" className="w-full p-3 border rounded-lg h-24" />
            </div>
          </div>
        )}
      </div>

      {/* Weekly Reflection */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Weekly Reflection (Every Sunday)
        </h3>
        <ul className="space-y-2 text-sm">
          <li>• Which rules did I break most often this week?</li>
          <li>• What emotion triggered my worst trade?</li>
          <li>• Did I overtrade? (Count total trades)</li>
          <li>• One Varsity lesson I'll apply next week:</li>
          <li>• What ONE system/rule do I need to add?</li>
        </ul>
      </div>
    </div>
  );
}

function ChecklistItem({ checked, onChange, label, description }) {
  return (
    <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-3">
        <button onClick={onChange} className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'}`}>
          {checked && <Check className="w-4 h-4 text-white" />}
        </button>
        <div className="flex-1">
          <div className="font-semibold text-gray-800">{label}</div>
          <div className="text-sm text-gray-600 mt-1">{description}</div>
        </div>
      </div>
    </div>
  );
}
