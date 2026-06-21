import { useState, useEffect } from "react";

// ── Data ─────────────────────────────────────────────────────────
const AFFIRMATIONS = [
  { quote: "Short-term pain. Long-term gain. Every rep, every meal, every choice compounds.", tag: "DISCIPLINE" },
  { quote: "Health is the only wealth that can't be outsourced. Protect it like it's everything — because it is.", tag: "MINDSET" },
  { quote: "You didn't come this far to only come this far.", tag: "CONSISTENCY" },
  { quote: "The version of you that quits and the version that doesn't — same effort, different decision.", tag: "GRIT" },
  { quote: "HIIT 3x a week. IF 16:8. You already have the hardest parts locked. The rest is just noise.", tag: "FOCUS" },
  { quote: "You can do this. Not tomorrow. Right now, with what you have.", tag: "ACTION" },
  { quote: "Saying no to one bad meal isn't suffering. It's the most powerful thing you can do today.", tag: "WILLPOWER" },
  { quote: "Every time you choose the right food, you are voting for the person you're becoming.", tag: "IDENTITY" },
  { quote: "Winners aren't born. They just refuse to stop showing up.", tag: "COMPETE" },
  { quote: "Your body keeps the score. Make sure the scorecard is one you're proud of.", tag: "RESULTS" },
  { quote: "Competitive edge isn't talent. It's the Monday you trained when no one else did.", tag: "EDGE" },
  { quote: "Black coffee. Water. Fasting window. You're already halfway there before 1pm.", tag: "IF KING" },
  { quote: "Progress is invisible until it isn't. Trust the process even when you can't see it.", tag: "TRUST" },
  { quote: "You chose HIIT. You chose IF. You're not someone who gives up. Eat like that person.", tag: "CHARACTER" },
  { quote: "The plate in front of you is a decision about who you'll be in six months.", tag: "FUTURE SELF" },
];

const FOODS = [
  { hero: "🥩", name: "Chicken Thighs", why: "High protein, keeps you full deep into your eating window. Pair with rice and you've got the cleanest meal you can make in 20 min.", macros: "~26g protein per 100g", tip: "Marinate in soy, garlic, ginger. Air fry or grill. Done.", category: "PROTEIN" },
  { hero: "🥦", name: "Broccoli", why: "High volume, low calorie. Fills your plate and your stomach. Anti-inflammatory, supports recovery after HIIT.", macros: "~2.8g protein, ~34 kcal per 100g", tip: "Steam or roast with olive oil and garlic. Eat as much as you want — it won't touch your goals.", category: "VEG" },
  { hero: "🍚", name: "White Rice", why: "Fast-digesting carbs = perfect post-HIIT fuel. Not the enemy. Portion it right and it rebuilds muscle.", macros: "~130 kcal per 100g cooked", tip: "100–150g cooked with your protein. That's the sweet spot.", category: "CARBS" },
  { hero: "🥚", name: "Eggs", why: "The most complete protein source on the planet. 6g protein each, every amino acid you need, cheap as chips.", macros: "~6g protein per egg", tip: "3–4 scrambled at 1pm to break your fast. Keeps hunger quiet for hours.", category: "PROTEIN" },
  { hero: "🫙", name: "Greek Yogurt", why: "Slow-digesting casein protein — ideal late in your eating window. Gut health bonus.", macros: "~17g protein per 170g serving", tip: "Full fat, plain. Add blueberries. That's dessert AND protein.", category: "PROTEIN" },
  { hero: "🥑", name: "Avocado", why: "Healthy fats that keep hormone levels optimised — critical for recovery and muscle retention.", macros: "~15g healthy fat per half", tip: "Half an avo with eggs at 1pm is a god-tier meal to break your fast.", category: "FATS" },
  { hero: "🐟", name: "Salmon", why: "Omega-3s reduce inflammation from HIIT. High protein. One of the most powerful foods for your goals.", macros: "~25g protein per 100g", tip: "Bake at 200°C for 15 min. Lemon, salt, done. Once or twice a week.", category: "PROTEIN" },
  { hero: "🫘", name: "Lentils", why: "Plant protein + fibre combo. Keeps blood sugar stable so you don't get cravings at 8pm.", macros: "~9g protein per 100g cooked", tip: "Batch cook Sunday — eat all week. Zero willpower needed mid-week.", category: "PROTEIN + FIBRE" },
  { hero: "🫐", name: "Blueberries", why: "Antioxidants that speed up recovery. Low sugar for a fruit. High satisfaction per calorie.", macros: "~57 kcal per 100g", tip: "Keep a bag in the fridge. When you want something sweet at 8pm — this is it.", category: "RECOVERY" },
  { hero: "🥬", name: "Spinach", why: "Iron, magnesium, vitamin K. Magnesium alone improves sleep quality and HIIT recovery.", macros: "~23 kcal per 100g", tip: "Throw a big handful into anything. Eggs, stir fry, smoothie. Just do it.", category: "VEG" },
  { hero: "🥜", name: "Almonds", why: "Protein and healthy fat in one grab-and-go. Stops the 'I'll eat whatever is nearest' moment.", macros: "~6g protein per 30g", tip: "Keep a small portion (30g) ready. When hunger hits at 12:50pm — eat these.", category: "FATS" },
  { hero: "🧄", name: "Garlic", why: "Anti-inflammatory, immune support, makes every healthy meal taste actually good.", macros: "Negligible", tip: "Use it everywhere. The secret weapon for eating healthy without hating your life.", category: "FLAVOUR HERO" },
  { hero: "🫙", name: "Cottage Cheese", why: "Casein protein — slow release, perfect before your 9pm eating window closes.", macros: "~11g protein per 100g", tip: "Eat it plain or with cherry tomatoes and black pepper before 9pm.", category: "PROTEIN" },
  { hero: "🌾", name: "Oats", why: "Complex carbs + fibre. Steady energy release — great first meal option if you train mornings.", macros: "~307 kcal per 100g dry", tip: "Overnight oats prepped the night before = zero excuses at 1pm.", category: "CARBS" },
];

const CATEGORY_COLORS = {
  PROTEIN: "#FF6B35",
  VEG: "#2ECC71",
  CARBS: "#F4D03F",
  FATS: "#A8E6CF",
  RECOVERY: "#9B59B6",
  "PROTEIN + FIBRE": "#E67E22",
  "FLAVOUR HERO": "#BDC3C7",
};

// ── Storage helpers ───────────────────────────────────────────────
function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function getToday() { return new Date().toISOString().split("T")[0]; }
function getDayOfYear() {
  const n = new Date(), s = new Date(n.getFullYear(), 0, 0);
  return Math.floor((n - s) / 86400000);
}

// ── AI call ───────────────────────────────────────────────────────
async function callAI(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, system, messages }),
  });
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "You've got this. Keep going.";
}

// ── Notification helper ───────────────────────────────────────────
async function requestNotifications() {
  if (!window.OneSignal) return false;
  try {
    await window.OneSignal.Notifications.requestPermission();
    return true;
  } catch { return false; }
}

// ════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("home");
  const [streak, setStreak] = useState(() => lsGet("hg_streak", 0));
  const [checkins, setCheckins] = useState(() => lsGet("hg_checkins", []));
  const [todayDone, setTodayDone] = useState(() => lsGet("hg_last_checkin", "") === getToday());
  const [affIdx, setAffIdx] = useState(() => lsGet("hg_aff_idx", getDayOfYear() % AFFIRMATIONS.length));
  const [foodIdx, setFoodIdx] = useState(() => lsGet("hg_food_idx", getDayOfYear() % FOODS.length));
  const [chat, setChat] = useState(() => lsGet("hg_chat", []));
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [dayLog, setDayLog] = useState(() => lsGet("hg_day_log", { hiit: false, water: false, fast: false }));
  const [toast, setToast] = useState("");
  const [aiAff, setAiAff] = useState("");
  const [affLoading, setAffLoading] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleCheckin = () => {
    if (todayDone) return;
    const today = getToday();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = (checkins.includes(yesterday) || checkins.length === 0) ? streak + 1 : 1;
    const newCheckins = [...checkins, today];
    const newAffIdx = (affIdx + 1) % AFFIRMATIONS.length;
    const newFoodIdx = (foodIdx + 1) % FOODS.length;

    setStreak(newStreak); lsSet("hg_streak", newStreak);
    setCheckins(newCheckins); lsSet("hg_checkins", newCheckins);
    setTodayDone(true); lsSet("hg_last_checkin", today);
    setAffIdx(newAffIdx); lsSet("hg_aff_idx", newAffIdx);
    setFoodIdx(newFoodIdx); lsSet("hg_food_idx", newFoodIdx);
    lsSet("hg_day_log", dayLog);
    showToast(`🔥 Day ${newStreak} locked in. Keep going.`);
  };

  const toggleLog = (key) => {
    const updated = { ...dayLog, [key]: !dayLog[key] };
    setDayLog(updated); lsSet("hg_day_log", updated);
  };

  const sendChat = async () => {
    if (!input.trim() || aiLoading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newChat = [...chat, userMsg];
    setChat(newChat); setInput(""); setAiLoading(true);
    const system = `You are a brutally honest, deeply motivating health coach AI. Your user:
- Does HIIT 2-3x per week
- Follows 16:8 intermittent fasting (eats 1pm–9pm only)
- Drinks water and black coffee during fast
- Is competitive, responds well to challenge and directness
- Struggles with willpower around food and portion control
- Wants to lose weight and build long-term healthy habits
- Current streak: ${streak} days
Be concise, punchy, real. Max 3–4 sentences unless they ask for detail. No fluff.`;
    try {
      const reply = await callAI(newChat, system);
      const updated = [...newChat, { role: "assistant", content: reply }];
      setChat(updated); lsSet("hg_chat", updated.slice(-20));
    } catch {
      setChat([...newChat, { role: "assistant", content: "Connection blip. But you already know what to do. Make the right call." }]);
    }
    setAiLoading(false);
  };

  const getPersonalisedAff = async () => {
    setAffLoading(true);
    const system = `Generate ONE powerful, personalised motivational affirmation for:
- HIIT 2-3x/week athlete
- 16:8 intermittent fasting (1pm–9pm eating window)
- Competitive personality who struggles with food willpower
- Current streak: ${streak} days
- Today logged: HIIT=${dayLog.hiit}, Water=${dayLog.water}, Fasting=${dayLog.fast}
Bold, direct, 1-2 sentences max. No hashtags. No emoji. Pure fire.`;
    try {
      const aff = await callAI([{ role: "user", content: "Give me my affirmation for today." }], system);
      setAiAff(aff);
    } catch { setAiAff("You already have everything you need. Now act like it."); }
    setAffLoading(false);
  };

  const enableNotifications = async () => {
    const granted = await requestNotifications();
    if (granted) { setNotifEnabled(true); showToast("🔔 Notifications enabled!"); }
    else showToast("Enable notifications in your browser settings");
  };

  const aff = AFFIRMATIONS[affIdx];
  const food = FOODS[foodIdx];
  const catColor = CATEGORY_COLORS[food.category] || "#FF6B35";

  const S = {
    wrap: { background: "#000", minHeight: "100vh", maxWidth: 480, margin: "0 auto", paddingBottom: 80, position: "relative" },
    header: { padding: "52px 20px 0" },
    label: { fontSize: 11, letterSpacing: 3, color: "#555", fontWeight: 700 },
    title: { fontSize: 28, fontWeight: 800, letterSpacing: -1, marginTop: 4 },
    divider: { height: 1, background: "#111", margin: "20px 0" },
    card: { background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 16, padding: "20px" },
    orange: "#FF6B35",
  };

  return (
    <div style={S.wrap}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          background: S.orange, color: "#000", padding: "12px 24px",
          borderRadius: 40, fontWeight: 700, fontSize: 14, zIndex: 999,
          letterSpacing: 0.5, boxShadow: "0 4px 24px rgba(255,107,53,0.5)",
          animation: "fadeInDown 0.2s ease", whiteSpace: "nowrap",
        }}>{toast}</div>
      )}

      {/* ── HOME ── */}
      {tab === "home" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={S.header}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={S.label}>HEALTH GURU</div>
                <div style={S.title}>{new Date().toLocaleDateString("en-GB", { weekday: "long" }).toUpperCase()}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: S.orange, lineHeight: 1 }}>{streak}</div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", marginTop: 2 }}>DAY STREAK</div>
              </div>
            </div>
          </div>
          <div style={S.divider} />

          {/* Affirmation */}
          <div style={{ padding: "0 20px" }}>
            <div style={{ ...S.label, marginBottom: 10 }}>TODAY'S AFFIRMATION</div>
            <div style={{ ...S.card, position: "relative", overflow: "hidden", padding: "24px 20px" }}>
              <div style={{ position: "absolute", top: -20, right: -10, fontSize: 100, opacity: 0.04, fontWeight: 900, color: S.orange, lineHeight: 1 }}>"</div>
              <div style={{ fontSize: 10, letterSpacing: 3, color: S.orange, fontWeight: 700, marginBottom: 14 }}>{aff.tag}</div>
              <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.6, letterSpacing: -0.3 }}>{aiAff || aff.quote}</div>
              <button onClick={getPersonalisedAff} disabled={affLoading} style={{
                marginTop: 16, background: "transparent", border: "1px solid #222",
                color: affLoading ? "#444" : "#666", fontSize: 11, letterSpacing: 2,
                padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontWeight: 600,
              }}>{affLoading ? "GENERATING..." : "✦ PERSONALISE FOR ME"}</button>
            </div>
          </div>

          {/* Day log */}
          <div style={{ padding: "20px 20px 0" }}>
            <div style={{ ...S.label, marginBottom: 10 }}>TODAY'S LOG</div>
            <div style={S.card}>
              {[
                { key: "hiit", label: "HIIT Done", emoji: "⚡" },
                { key: "water", label: "2L Water", emoji: "💧" },
                { key: "fast", label: "Fasting Window Kept", emoji: "⏱" },
              ].map(({ key, label, emoji }, i, arr) => (
                <div key={key} onClick={() => toggleLog(key)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #111" : "none",
                  cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: dayLog[key] ? "#fff" : "#444" }}>{label}</span>
                  </div>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: dayLog[key] ? S.orange : "#111",
                    border: dayLog[key] ? "none" : "1px solid #2a2a2a",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, color: "#000", fontWeight: 700, transition: "all 0.2s",
                  }}>{dayLog[key] ? "✓" : ""}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lock in */}
          <div style={{ padding: "16px 20px 0" }}>
            <button onClick={handleCheckin} disabled={todayDone} style={{
              width: "100%", padding: "18px 0",
              background: todayDone ? "#0a0a0a" : S.orange,
              color: todayDone ? "#333" : "#000",
              border: todayDone ? "1px solid #1a1a1a" : "none",
              borderRadius: 16, fontSize: 15, fontWeight: 800,
              letterSpacing: 2, cursor: todayDone ? "default" : "pointer",
              transition: "all 0.2s",
            }}>{todayDone ? `✓ DAY ${streak} LOCKED IN` : "LOCK IN TODAY ↗"}</button>
          </div>

          {/* IF Window */}
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{ ...S.card }}>
              <div style={{ ...S.label, marginBottom: 12 }}>YOUR EATING WINDOW</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#2ECC71" }}>1PM</div>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 1, marginTop: 2 }}>OPEN</div>
                </div>
                <div style={{ flex: 1, margin: "0 16px", textAlign: "center" }}>
                  <div style={{ height: 1, background: "#222", position: "relative" }}>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#000", padding: "0 8px", fontSize: 10, color: "#444", letterSpacing: 2, whiteSpace: "nowrap" }}>16:8 IF</div>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: S.orange }}>9PM</div>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: 1, marginTop: 2 }}>CLOSE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications CTA */}
          {!notifEnabled && (
            <div style={{ padding: "16px 20px 0" }}>
              <button onClick={enableNotifications} style={{
                width: "100%", padding: "14px 0",
                background: "transparent", border: "1px solid #222",
                color: "#555", borderRadius: 16, fontSize: 13,
                fontWeight: 600, letterSpacing: 1, cursor: "pointer",
              }}>🔔 ENABLE DAILY NOTIFICATIONS</button>
            </div>
          )}
        </div>
      )}

      {/* ── FUEL ── */}
      {tab === "fuel" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={S.header}>
            <div style={S.label}>DAILY FUEL</div>
            <div style={S.title}>FOOD INTEL</div>
          </div>
          <div style={S.divider} />

          <div style={{ padding: "0 20px" }}>
            <div style={{ ...S.label, marginBottom: 10 }}>TODAY'S POWER FOOD</div>
            <div style={{ background: "#0a0a0a", border: `1px solid ${catColor}33`, borderRadius: 20, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -10, right: 10, fontSize: 90, opacity: 0.12 }}>{food.hero}</div>
              <div style={{ display: "inline-block", background: catColor + "22", color: catColor, fontSize: 10, letterSpacing: 3, fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 12 }}>{food.category}</div>
              <div style={{ fontSize: 36 }}>{food.hero}</div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginTop: 8 }}>{food.name}</div>
              <div style={{ fontSize: 14, color: "#999", lineHeight: 1.7, marginTop: 12 }}>{food.why}</div>
              <div style={{ marginTop: 16, padding: "12px 16px", background: "#111", borderRadius: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: catColor, fontWeight: 700, marginBottom: 4 }}>MACROS</div>
                <div style={{ fontSize: 13, color: "#ccc" }}>{food.macros}</div>
              </div>
              <div style={{ marginTop: 10, padding: "12px 16px", background: "#111", borderRadius: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: S.orange, fontWeight: 700, marginBottom: 4 }}>COACH SAYS</div>
                <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{food.tip}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: "24px 20px 0" }}>
            <div style={{ ...S.label, marginBottom: 12 }}>YOUR ARSENAL</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {FOODS.map((f, i) => (
                <div key={i} onClick={() => setFoodIdx(i)} style={{
                  background: i === foodIdx ? "#0f0f0f" : "#050505",
                  border: `1px solid ${i === foodIdx ? (CATEGORY_COLORS[f.category] || S.orange) + "55" : "#111"}`,
                  borderRadius: 14, padding: "14px", cursor: "pointer", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 26 }}>{f.hero}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>{f.name}</div>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: CATEGORY_COLORS[f.category] || "#666", fontWeight: 700, marginTop: 4 }}>{f.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── COACH ── */}
      {tab === "coach" && (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", animation: "fadeIn 0.3s ease" }}>
          <div style={S.header}>
            <div style={S.label}>AI COACH</div>
            <div style={S.title}>YOUR GURU</div>
            <div style={{ fontSize: 13, color: "#444", marginTop: 4 }}>Streak: {streak} days · IF 16:8 · HIIT warrior</div>
          </div>
          <div style={S.divider} />

          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
            {chat.length === 0 && (
              <div style={{ color: "#444", fontSize: 14, lineHeight: 1.9 }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>👋</div>
                I know you. HIIT beast. IF locked in. The food is where we need to work.<br /><br />
                Ask me anything — cravings, meal ideas, motivation, whether to eat that thing you're thinking about right now.
              </div>
            )}
            {chat.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div style={{
                  maxWidth: "85%",
                  background: msg.role === "user" ? S.orange : "#111",
                  color: msg.role === "user" ? "#000" : "#ddd",
                  borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  padding: "12px 16px", fontSize: 14, lineHeight: 1.6,
                  fontWeight: msg.role === "user" ? 600 : 400,
                }}>{msg.content}</div>
              </div>
            ))}
            {aiLoading && (
              <div style={{ display: "flex", gap: 6, padding: "8px 0" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: S.orange, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}
          </div>

          {chat.length === 0 && (
            <div style={{ padding: "0 20px 12px" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["I want to eat badly right now", "Give me a 1pm meal idea", "I missed my HIIT today", "I'm struggling with portions"].map((q, i) => (
                  <button key={i} onClick={() => setInput(q)} style={{
                    background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#666",
                    fontSize: 12, padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontWeight: 500,
                  }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: "12px 20px", borderTop: "1px solid #111", display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder="Talk to your coach..."
              style={{
                flex: 1, background: "#0a0a0a", border: "1px solid #1a1a1a",
                borderRadius: 24, padding: "12px 18px", color: "#fff",
                fontSize: 14, outline: "none",
              }}
            />
            <button onClick={sendChat} disabled={aiLoading || !input.trim()} style={{
              background: input.trim() ? S.orange : "#111", border: "none",
              borderRadius: "50%", width: 46, height: 46, cursor: "pointer",
              fontSize: 20, transition: "all 0.2s", display: "flex",
              alignItems: "center", justifyContent: "center", color: "#000",
            }}>↗</button>
          </div>
        </div>
      )}

      {/* ── STREAKS ── */}
      {tab === "streaks" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={S.header}>
            <div style={S.label}>PROGRESS</div>
            <div style={S.title}>YOUR RECORD</div>
          </div>
          <div style={S.divider} />

          <div style={{ textAlign: "center", padding: "36px 20px" }}>
            <div style={{ fontSize: 100, fontWeight: 900, color: S.orange, lineHeight: 1, letterSpacing: -4, textShadow: "0 0 80px rgba(255,107,53,0.25)" }}>{streak}</div>
            <div style={{ fontSize: 12, letterSpacing: 4, color: "#444", marginTop: 8, fontWeight: 700 }}>DAY STREAK</div>
            {streak >= 30 && <div style={{ fontSize: 13, color: S.orange, marginTop: 12, fontWeight: 600 }}>🔥 30 days. You've built a habit. This is who you are now.</div>}
            {streak >= 7 && streak < 30 && <div style={{ fontSize: 13, color: "#2ECC71", marginTop: 12, fontWeight: 600 }}>🏆 One week strong. Most people quit before this.</div>}
            {streak === 0 && <div style={{ fontSize: 13, color: "#444", marginTop: 12 }}>Check in today to start your streak.</div>}
          </div>

          <div style={{ padding: "0 20px" }}>
            <div style={{ ...S.label, marginBottom: 14 }}>MILESTONES</div>
            {[
              { days: 3, label: "3 Days — First momentum", reward: "You showed up. That's everything." },
              { days: 7, label: "7 Days — One week", reward: "Habits take 21 days. You're building one." },
              { days: 14, label: "14 Days — Two weeks", reward: "This is starting to feel like you." },
              { days: 21, label: "21 Days — Habit formed", reward: "Science says 21 days. You've done it." },
              { days: 30, label: "30 Days — One month", reward: "Your body has changed. Look in the mirror." },
              { days: 60, label: "60 Days — Unstoppable", reward: "This isn't a phase. This is your life now." },
            ].map(({ days, label, reward }) => (
              <div key={days} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 0", borderBottom: "1px solid #0d0d0d",
                opacity: streak >= days ? 1 : 0.3, transition: "opacity 0.3s",
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                  background: streak >= days ? S.orange : "#111",
                  border: streak >= days ? "none" : "1px solid #222",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: streak >= days ? 16 : 12, fontWeight: 800,
                  color: streak >= days ? "#000" : "#333",
                }}>{streak >= days ? "✓" : days}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: streak >= days ? "#fff" : "#444" }}>{label}</div>
                  <div style={{ fontSize: 12, color: streak >= days ? S.orange : "#333", marginTop: 2 }}>{reward}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "24px 20px 0" }}>
            <div style={{ ...S.label, marginBottom: 14 }}>LAST 14 DAYS</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Array.from({ length: 14 }).map((_, i) => {
                const d = new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0];
                const done = checkins.includes(d);
                return (
                  <div key={i} style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: done ? S.orange : "#0a0a0a",
                    border: done ? "none" : "1px solid #1a1a1a",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: done ? "#000" : "#333", fontWeight: 700,
                  }}>{done ? "✓" : new Date(d).getDate()}</div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "#000",
        borderTop: "1px solid #111", display: "flex", padding: "10px 0 20px",
        zIndex: 100,
      }}>
        {[
          { key: "home", icon: "⊕", label: "HOME" },
          { key: "fuel", icon: "◎", label: "FUEL" },
          { key: "coach", icon: "✦", label: "COACH" },
          { key: "streaks", icon: "▲", label: "STREAKS" },
        ].map(({ key, icon, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <div style={{ fontSize: 22, color: tab === key ? S.orange : "#2a2a2a", transition: "color 0.2s" }}>{icon}</div>
            <div style={{ fontSize: 9, letterSpacing: 2, fontWeight: 700, color: tab === key ? S.orange : "#2a2a2a", transition: "color 0.2s" }}>{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
