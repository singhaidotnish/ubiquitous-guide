import React, { useState } from 'react';
import { Check, X, AlertTriangle, TrendingUp, Brain, Shield } from 'lucide-react';

export default function ADHDTradingChecklist() {
  const [activeTab, setActiveTab] = useState('premarket');
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
    emotionalState: '',
    biggestWin: '',
    biggestLoss: ''
  });

  const [impulseTriggers, setImpulseTriggers] = useState([
    { trigger: 'Feeling FOMO', action: 'Close charts for 10 min', checked: false },
    { trigger: 'After a loss', action: 'Wait 30 min cooldown', checked: false },
    { trigger: 'Want to increase size', action: 'Write reason + wait 15 min', checked: false },
    { trigger: 'Market moving fast', action: 'Take 3 deep breaths', checked: false },
    { trigger: 'Bored/restless', action: 'Close trading app', checked: false }
  ]);

  const toggleCheck = (category, key) => {
    if (category === 'premarket') {
      setPreMarketChecks(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (category === 'trade') {
      setTradeChecks(prev => ({ ...prev, [key]: !prev[key] }));
    } else if (category === 'posttrade') {
      setPostTradeChecks(prev => ({ ...prev, [key]: !prev[key] }));
    }
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
              <p className="font-semibold text-yellow-800">ADHD Trading Truth</p>
              <p className="text-sm text-yellow-700">Your brain craves stimulation. Markets provide endless stimulation. This checklist is your guardrail.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('premarket')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'premarket'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pre-Market
          </button>
          <button
            onClick={() => setActiveTab('trade')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'trade'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Before Trade
          </button>
          <button
            onClick={() => setActiveTab('posttrade')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'posttrade'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Post-Trade
          </button>
          <button
            onClick={() => setActiveTab('impulse')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'impulse'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Impulse Control
          </button>
        </div>

        {activeTab === 'premarket' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Morning Routine</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{preMarketRate}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>

            <ChecklistItem
              checked={preMarketChecks.reviewedRules}
              onChange={() => toggleCheck('premarket', 'reviewedRules')}
              label="Read my trading rules (30 seconds)"
              description="No rules = emotional decisions. Your ADHD brain needs reminders."
            />
            <ChecklistItem
              checked={preMarketChecks.setDailyLimit}
              onChange={() => toggleCheck('premarket', 'setDailyLimit')}
              label="Set daily loss limit (write it down)"
              description="Example: Stop trading if down ₹5,000 or 2% of capital"
            />
            <ChecklistItem
              checked={preMarketChecks.checkedCalendar}
              onChange={() => toggleCheck('premarket', 'checkedCalendar')}
              label="Check economic calendar/news"
              description="Know what events might spike volatility today"
            />
            <ChecklistItem
              checked={preMarketChecks.mentalState}
              onChange={() => toggleCheck('premarket', 'mentalState')}
              label="Mental state check: Am I calm?"
              description="Stressed/angry/overconfident? Don't trade today."
            />
            <ChecklistItem
              checked={preMarketChecks.positionSized}
              onChange={() => toggleCheck('premarket', 'positionSized')}
              label="Position size calculated for today"
              description="Know your max position BEFORE you see opportunities"
            />
          </div>
        )}

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

            <ChecklistItem
              checked={tradeChecks.waitedCooldown}
              onChange={() => toggleCheck('trade', 'waitedCooldown')}
              label="Waited cooldown period (if previous trade was loss)"
              description="30 min minimum after loss. Revenge trading destroys accounts."
            />
            <ChecklistItem
              checked={tradeChecks.wroteReason}
              onChange={() => toggleCheck('trade', 'wroteReason')}
              label="Wrote down WHY I'm taking this trade"
              description="If you can't explain it in one sentence, don't trade it"
            />
            <ChecklistItem
              checked={tradeChecks.checkedRisk}
              onChange={() => toggleCheck('trade', 'checkedRisk')}
              label="Risk calculated: Max loss is acceptable"
              description="Can you lose this amount and sleep tonight?"
            />
            <ChecklistItem
              checked={tradeChecks.noFOMO}
              onChange={() => toggleCheck('trade', 'noFOMO')}
              label="Honest check: Is this FOMO or strategy?"
              description="If you feel rushed or excited, it's probably FOMO"
            />
            <ChecklistItem
              checked={tradeChecks.withinLimits}
              onChange={() => toggleCheck('trade', 'withinLimits')}
              label="Within my daily trade count limit"
              description="ADHD = overtrading risk. Set max trades per day."
            />
          </div>
        )}

        {activeTab === 'posttrade' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">After Trade (Win or Loss)</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{postTradeRate}%</div>
                <div className="text-xs text-gray-600">Complete</div>
              </div>
            </div>

            <ChecklistItem
              checked={postTradeChecks.loggedTrade}
              onChange={() => toggleCheck('posttrade', 'loggedTrade')}
              label="Logged trade details immediately"
              description="Entry, exit, size, reason, outcome. Before you forget."
            />
            <ChecklistItem
              checked={postTradeChecks.emotionNoted}
              onChange={() => toggleCheck('posttrade', 'emotionNoted')}
              label="Noted my emotional state"
              description="Excited? Angry? Calm? This matters more than P&L"
            />
            <ChecklistItem
              checked={postTradeChecks.followedPlan}
              onChange={() => toggleCheck('posttrade', 'followedPlan')}
              label="Did I follow my plan? (Honest answer)"
              description="Even winning trades can break rules. Track discipline."
            />
            <ChecklistItem
              checked={postTradeChecks.reviewedMistake}
              onChange={() => toggleCheck('posttrade', 'reviewedMistake')}
              label="If I broke a rule, why? One sentence."
              description="Pattern recognition: Your ADHD has triggers. Find them."
            />

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Daily Trading Stats</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Number of trades today"
                  className="w-full p-2 border rounded"
                  value={dailyStats.tradesCount}
                  onChange={(e) => setDailyStats({...dailyStats, tradesCount: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Total P&L (e.g., +₹2500 or -₹1200)"
                  className="w-full p-2 border rounded"
                  value={dailyStats.profitLoss}
                  onChange={(e) => setDailyStats({...dailyStats, profitLoss: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Overall emotional state"
                  className="w-full p-2 border rounded"
                  value={dailyStats.emotionalState}
                  onChange={(e) => setDailyStats({...dailyStats, emotionalState: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'impulse' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">IF-THEN Impulse Controls</h2>
              <p className="text-sm text-gray-600">When ADHD urges hit, use these automatic responses. Check them off as you use them.</p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                <p className="text-sm text-orange-800">
                  <strong>Your ADHD superpower:</strong> Pattern recognition. Use it to recognize your own patterns of self-sabotage.
                </p>
              </div>
            </div>

            {impulseTriggers.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleImpulseTrigger(index)}
                    className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      item.checked
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {item.checked && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      IF: {item.trigger}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      THEN: {item.action}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Add Your Own Triggers</h3>
              <p className="text-sm text-gray-700 mb-3">As you read Innerworth, add more IF-THEN rules here based on what you learn about yourself.</p>
              <textarea
                placeholder="Example: IF I check my portfolio more than 3 times in an hour, THEN I close all apps and go for a walk"
                className="w-full p-3 border rounded-lg h-24"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Weekly Reflection (Every Sunday)
        </h3>
        <ul className="space-y-2 text-sm">
          <li>• Which rules did I break most often this week?</li>
          <li>• What emotion triggered my worst trade?</li>
          <li>• Did I overtrade? (Count total trades)</li>
          <li>• One Innerworth lesson I'll apply next week:</li>
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
        <button
          onClick={onChange}
          className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            checked
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
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