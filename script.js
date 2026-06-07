if ("scrollRestoration" in history) history.scrollRestoration = "manual";
function forcePageTop() {
  const previousBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = previousBehavior;
  });
}
if (location.hash) history.replaceState(null, "", `${location.pathname}${location.search}`);
forcePageTop();
window.addEventListener("DOMContentLoaded", forcePageTop);
window.addEventListener("load", forcePageTop);
window.addEventListener("pageshow", forcePageTop);

const STORAGE_KEY = "zaiGlowUpDashboard.v1";
const CHECKIN_KEY = "glowCheckins";
const HABIT_UPDATE_KEY = "glowHabitUpdates";
const EVENING_KEY = "glowEveningReflections";
const TODAY_KEY = dateKey(new Date());

const categoryMeta = {
  body: { label: "Body", icon: "✦", group: "Body" },
  waist: { label: "Waist", icon: "♡", group: "Body" },
  glutes: { label: "Glutes", icon: "◐", group: "Body" },
  posture: { label: "Posture", icon: "↑", group: "Body" },
  hair: { label: "Hair", icon: "☾", group: "Beauty" },
  beauty: { label: "Skin / Beauty", icon: "✧", group: "Beauty" },
  food: { label: "Food / Protein", icon: "◇", group: "Body" },
  water: { label: "Water", icon: "♧", group: "Body" },
  sleep: { label: "Sleep", icon: "☁", group: "Soul" },
  career: { label: "Dissertation / Career", icon: "§", group: "Work" },
  creativity: { label: "Creativity", icon: "✎", group: "Soul" },
  social: { label: "Relationship / Social", icon: "♡", group: "Social" },
  money: { label: "Money / Admin", icon: "₊", group: "Work" },
  soul: { label: "Soul / God / Mind", icon: "✦", group: "Soul" }
};

const habits = [
  ritual("nutrition-0", "Protein first", "food", "daily", "Hit 100–120g protein to keep curves while revealing the waist.", "Protects muscle and supports the waist goal without crash dieting."),
  ritual("nutrition-1", "2.5L water", "water", "daily", "Hydrate before the day gets dramatic.", "Supports energy, digestion, skin, and recovery."),
  ritual("nutrition-2", "No chaotic grazing", "food", "daily", "Three solid meals and one controlled protein snack.", "Keeps energy steady and decisions intentional."),
  ritual("nutrition-3", "Smart carbs only", "food", "daily", "Rice, potatoes, oats or fruit.", "Fuels training without turning meals into chaos."),
  ritual("nutrition-4", "No crash dieting", "body", "daily", "Eat for the woman you are becoming.", "Consistency protects health, hair, curves, and concentration."),
  ritual("training-0", "Glute-focused training", "glutes", "weekly", "Hip thrusts, RDLs, kickbacks or glute bridges.", "Glutes are built, not wished for."),
  ritual("training-1", "Walk the waist", "waist", "daily", "8–12k steps or 20 minutes incline walking.", "Daily movement supports health, mood, and body composition."),
  ritual("training-2", "Core control", "waist", "weekly", "Dead bugs, planks, reverse crunches or leg raises.", "Builds a stable, elegant centre without punishment."),
  ritual("training-3", "Progressive overload", "glutes", "weekly", "Add a rep, a set, better form or a little weight.", "Small progress compounds into visible strength."),
  ritual("training-4", "Recovery respected", "body", "daily", "No ego lifting when your body asks for grace.", "Recovery is part of the programme."),
  ritual("posture-0", "Wall angels", "posture", "daily", "Two sets of ten. Ribs down, neck long.", "Opens the chest and teaches better shoulder position."),
  ritual("posture-1", "Doorway stretch", "posture", "daily", "Sixty seconds each side to open the chest.", "Counteracts desk and phone posture."),
  ritual("posture-2", "Chin tucks", "posture", "daily", "Two sets of ten. Elegant swan neck loading.", "Supports a stronger neck and cleaner posture line."),
  ritual("posture-3", "Upper body posture training", "posture", "weekly", "Rows or face pulls with controlled form.", "Strength makes good posture easier to keep."),
  ritual("posture-4", "Phone posture", "posture", "daily", "Every unlock: crown lifted, shoulders down and wide.", "Turns a frequent trigger into a posture ritual."),
  ritual("hair-0", "Gentle hair check", "hair", "daily", "No ripping. Start at ends and work upward.", "Prevents avoidable breakage."),
  ritual("hair-1", "Scalp massage", "hair", "daily", "Two minutes to tell the follicles we are serious.", "Supports a consistent scalp-care routine."),
  ritual("hair-2", "No tight style", "hair", "daily", "Protect the hairline.", "Beauty is not traction alopecia."),
  ritual("hair-3", "Heat discipline", "hair", "daily", "Air dry or protect before heat.", "Reduces damage and preserves length."),
  ritual("hair-4", "Hair oil or mask", "hair", "weekly", "Give the lengths deliberate care.", "Weekly maintenance supports softness and retention."),
  ritual("life-0", "Dissertation or career block", "career", "daily", "One meaningful step: reading, fieldwork, coding or writing.", "Your future career is built in focused blocks."),
  ritual("life-1", "Portfolio and career review", "career", "weekly", "Review progress and choose the next visible move.", "Keeps your work legible, strategic, and moving."),
  ritual("life-2", "Creative skill block", "creativity", "daily", "Ten minutes counts. Keep the artist alive.", "Creativity makes the system feel like a life."),
  ritual("life-3", "Room reset", "body", "monthly", "Deep clean and remove visual noise.", "Your environment trains your standards."),
  ritual("life-4", "Sleep wind-down", "sleep", "daily", "Screen down, tomorrow prepared, Zai preserved.", "Sleep improves nearly every other ritual."),
  ritual("meal-plan", "Meal planning", "food", "weekly", "Plan protein, produce, and practical meals.", "A plan protects you from chaotic hunger."),
  ritual("outfit-plan", "Laundry and outfit planning", "beauty", "weekly", "Prepare the week before it asks.", "Polish is easier when the basics are handled."),
  ritual("admin-reset", "Budget and admin reset", "money", "weekly", "Check spending, inboxes, forms, and appointments.", "A princess keeps receipts."),
  ritual("measure-check", "Waist, glute, and weight check", "waist", "biweekly", "Collect neutral data without spiralling.", "Measurements are information, not a verdict."),
  ritual("progress-photos", "Progress photos", "body", "biweekly", "Take consistent, private reference photos.", "Progress is easier to see across time."),
  ritual("hair-length", "Hair length check", "hair", "biweekly", "Check retention gently and consistently.", "Long-term change deserves calm evidence."),
  ritual("wardrobe-audit", "Wardrobe audit", "beauty", "biweekly", "Edit, mend, plan, and notice what is missing.", "Your wardrobe should support your actual life."),
  ritual("social-check", "Relationship and social check-in", "social", "biweekly", "Review the calendar and tend to the people you love.", "A full life includes meaningful connection."),
  ritual("glow-review", "Full glow-up review", "body", "monthly", "Review the whole ritual archive.", "Reflection turns activity into direction."),
  ritual("goal-update", "Update goals", "soul", "monthly", "Keep what matters and release what does not.", "Your system should evolve with you."),
  ritual("portfolio-month", "Website and portfolio audit", "career", "monthly", "Review the public story your work tells.", "Visibility is part of career growth."),
  ritual("finance-audit", "Financial audit", "money", "monthly", "Review spending, saving, subscriptions, and plans.", "Money clarity creates softness elsewhere."),
  ritual("beauty-maintenance", "Beauty maintenance", "beauty", "monthly", "Plan appointments, products, and replenishment.", "Maintenance is quieter than emergencies."),
  ritual("training-focus", "Plan next month’s training focus", "glutes", "monthly", "Choose the next focused training priority.", "Focused plans beat vague ambition."),
  ritual("prayer-reflection", "Prayer, reflection, or journal", "soul", "daily", "A quiet moment before the noise takes over.", "Inner steadiness makes the outer glow sustainable."),
  ritual("buy-band", "Buy a resistance band", "glutes", "one-time", "Acquire the tiny tool that removes an excuse.", "Simple equipment can unlock consistent training."),
  ritual("baseline-photos", "Take baseline photos", "body", "one-time", "Create a private starting reference.", "The ritual archive deserves a beginning."),
  ritual("starting-measures", "Record starting measurements", "waist", "one-time", "Log a calm and neutral baseline.", "You cannot compare what you never recorded."),
  ritual("gym-split", "Set the gym split", "glutes", "one-time", "Choose a realistic repeatable training structure.", "Clarity reduces negotiation."),
  ritual("haircare-shelf", "Create the haircare shelf", "hair", "one-time", "Put the routine where it is easy to use.", "Environment design makes rituals easier."),
  ritual("fieldwork-tracker", "Create dissertation fieldwork tracker", "career", "one-time", "Give the project one reliable command centre.", "Complex work needs a visible system."),
  ritual("dress-countdown", "Dress fitting countdown", "beauty", "custom", "Review the fitting plan every ten days.", "A custom cycle keeps the event calm and considered.", 10)
];

const levels = [
  level(1, "The Initiate", 0, 7, "more rose accents"),
  level(2, "The Ritualist", 7, 21, "completion sparkle"),
  level(3, "The Polished Girl", 21, 46, "champagne glass cards"),
  level(4, "The Upper East Side Threat", 46, 81, "pearl border shimmer"),
  level(5, "The Elle Woods Effect", 81, 131, "stronger glow aura"),
  level(6, "The Blair Waldorf Standard", 131, 201, "velvet oxblood accents"),
  level(7, "The Serena Glow", 201, 301, "golden-hour gradients"),
  level(8, "The Miranda Priestly Discipline", 301, 451, "sharper editorial polish"),
  level(9, "The Siren Era", 451, 651, "cinematic pearl glow"),
  level(10, "The Archival Woman", 651, Infinity, "the complete ritual archive")
];

const motivation = [
  "Your streak is too pretty to break.",
  "Protein first. Drama later.",
  "Posture check, Upper East Side edition.",
  "A princess does not skip water.",
  "Today’s glow score is rising.",
  "You’re not behind. You’re becoming.",
  "Do not make me send Miranda.",
  "Blair would call this maintenance.",
  "Elle passed Harvard. You can drink the water.",
  "The ritual archive remembers."
];
const completionMessages = ["That’s discipline, darling.", "Elle would approve.", "One ritual closer.", "Princess behaviour.", "Miranda noticed.", "Discipline looks expensive on you."];
const levelMessages = ["Your standards just got prettier.", "The ritual archive is growing.", "Discipline looks expensive on you.", "This is what consistency does.", "You are no longer trying. You are becoming."];

function ritual(id, title, category, frequency, description, why, cycleDays) {
  return { id, title, category, frequency, description, why, cycleDays };
}
function level(number, name, min, next, unlock) { return { number, name, min, next, unlock }; }
function defaultState() {
  return { days: {}, streak: 0, bestStreak: 0, totalTicks: 0, measurements: [], shownLevels: [1], lastActiveDate: TODAY_KEY };
}
function loadState() {
  try {
    const loaded = { ...defaultState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    loaded.days ||= {};
    loaded.measurements ||= [];
    loaded.shownLevels ||= [1];
    loaded.totalTicks = Math.max(loaded.totalTicks || 0, historyCount(loaded));
    return loaded;
  } catch { return defaultState(); }
}
function historyCount(source) {
  return Object.values(source.days || {}).reduce((sum, day) => sum + Object.values(day.checked || {}).filter(Boolean).length, 0);
}
let state = loadState();
ensureDay(TODAY_KEY);
let trackerView = "week";
let trackerDate = new Date();
let habitFilter = "today";
let chartMode = "today";

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}
function startOfWeek(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}
function periodRange(habit, date = new Date()) {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (habit.frequency === "daily") return [today, today];
  if (habit.frequency === "weekly") {
    const start = startOfWeek(today);
    return [start, addDays(start, 6)];
  }
  if (habit.frequency === "biweekly") {
    const anchor = new Date(2026, 0, 5);
    const windowIndex = Math.floor((startOfWeek(today) - anchor) / 86400000 / 14);
    const start = addDays(anchor, windowIndex * 14);
    return [start, addDays(start, 13)];
  }
  if (habit.frequency === "monthly") return [new Date(today.getFullYear(), today.getMonth(), 1), new Date(today.getFullYear(), today.getMonth() + 1, 0)];
  if (habit.frequency === "custom") {
    const anchor = new Date(2026, 0, 1);
    const cycle = habit.cycleDays || 10;
    const index = Math.floor((today - anchor) / 86400000 / cycle);
    const start = addDays(anchor, index * cycle);
    return [start, addDays(start, cycle - 1)];
  }
  return [new Date(2000, 0, 1), new Date(2100, 0, 1)];
}
function ensureDay(key) {
  if (!state.days[key]) state.days[key] = { checked: {}, saved: false };
  state.days[key].checked ||= {};
  return state.days[key];
}
function completionKeys(habit, date = new Date()) {
  const [start, end] = periodRange(habit, date);
  return Object.keys(state.days).filter(key => {
    const value = state.days[key]?.checked?.[habit.id];
    const parsed = parseDate(key);
    return value && parsed >= start && parsed <= end;
  }).sort();
}
function isComplete(habit, date = new Date()) { return completionKeys(habit, date).length > 0; }
function frequencyLabel(frequency) {
  return { daily: "Daily Ritual", weekly: "Weekly Standard", biweekly: "Biweekly Reset", monthly: "Monthly Audit", "one-time": "One-Time Quest", custom: "Custom Cycle" }[frequency];
}
function dueStatus(habit, date = new Date()) {
  if (isComplete(habit, date)) {
    return { key: "done", label: habit.frequency === "daily" ? "Done today" : habit.frequency === "weekly" ? "Done this week" : habit.frequency === "monthly" ? "Done this month" : "Already handled." };
  }
  const overdue = habit.frequency === "daily" && date.getHours() >= 20;
  if (overdue) return { key: "overdue", label: "Overdue, but recoverable." };
  if (habit.frequency === "daily") return { key: "due", label: "Due today, darling." };
  if (habit.frequency === "weekly" || habit.frequency === "biweekly" || habit.frequency === "custom") return { key: "due", label: "This week’s ritual." };
  if (habit.frequency === "monthly") return { key: "due", label: "Monthly audit waiting." };
  return { key: "due", label: "One-time quest waiting." };
}
function saveState() {
  state.lastActiveDate = TODAY_KEY;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const saved = document.getElementById("lastSaved");
  if (saved) saved.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function loadRecords(key) {
  try { return JSON.parse(localStorage.getItem(key) || "{}"); }
  catch { return {}; }
}
function saveRecord(key, record) {
  const records = loadRecords(key);
  records[TODAY_KEY] = record;
  localStorage.setItem(key, JSON.stringify(records));
}
function localTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}
function currentLevel() {
  return [...levels].reverse().find(item => state.totalTicks >= item.min) || levels[0];
}
function applyLevel() {
  const current = currentLevel();
  document.body.className = document.body.className.replace(/\blevel-\d+\b/g, "").trim();
  document.body.classList.add(`level-${current.number}`);
  return current;
}
function checkLevelUp(previousLevel) {
  const current = applyLevel();
  if (current.number > previousLevel.number && !state.shownLevels.includes(current.number)) {
    state.shownLevels.push(current.number);
    saveState();
    showLevelModal(current);
  }
}

function toggleHabit(id, key = TODAY_KEY) {
  const habit = habits.find(item => item.id === id);
  if (!habit) return;
  const previousLevel = currentLevel();
  const existing = completionKeys(habit, parseDate(key));
  if (existing.length) {
    const removeKey = existing.includes(key) ? key : existing[existing.length - 1];
    ensureDay(removeKey).checked[id] = false;
    state.totalTicks = Math.max(0, state.totalTicks - 1);
    showToast("Missed, not ruined. Recover the ritual.");
  } else {
    ensureDay(key).checked[id] = true;
    state.totalTicks += 1;
    showToast(completionMessages[Math.floor(Math.random() * completionMessages.length)]);
  }
  ensureDay(key).saved = false;
  saveState();
  checkLevelUp(previousLevel);
  renderAll();
}

function todayScope() { return habits; }
function todayCompletedCount() { return todayScope().filter(habit => isComplete(habit)).length; }
function todayPercentage() { return Math.round(todayCompletedCount() / todayScope().length * 100); }
function periodStats(start, end) {
  const entries = [];
  const days = Math.max(1, Math.floor((end - start) / 86400000) + 1);
  Object.entries(state.days).forEach(([key, day]) => {
    const parsed = parseDate(key);
    if (parsed >= start && parsed <= end) {
      Object.entries(day.checked || {}).forEach(([id, done]) => {
        const habit = habits.find(item => item.id === id);
        if (done && habit) entries.push(habit);
      });
    }
  });
  const possible = habits.filter(habit => habit.frequency !== "one-time").reduce((sum, habit) => {
    if (habit.frequency === "daily") return sum + days;
    if (habit.frequency === "weekly") return sum + Math.ceil(days / 7);
    if (habit.frequency === "biweekly") return sum + Math.ceil(days / 14);
    if (habit.frequency === "custom") return sum + Math.ceil(days / (habit.cycleDays || 10));
    return sum + 1;
  }, 0);
  return { entries, percentage: Math.min(100, Math.round(entries.length / Math.max(1, possible) * 100)) };
}
function weekStats() {
  const start = startOfWeek(new Date());
  return periodStats(start, addDays(start, 6));
}
function monthStats() {
  const now = new Date();
  return periodStats(new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0));
}

function renderHabitBoard() {
  const board = document.getElementById("habitBoard");
  if (!board) return;
  const visible = habits.filter(habit => {
    const done = isComplete(habit);
    const status = dueStatus(habit);
    if (habitFilter === "today") return habit.frequency === "daily" || !done;
    if (habitFilter === "completed") return done;
    if (habitFilter === "missed") return status.key === "overdue";
    if (habitFilter === "all") return true;
    return habit.frequency === habitFilter;
  });
  document.querySelectorAll(".habit-filter").forEach(button => button.classList.toggle("active", button.dataset.filter === habitFilter));
  const note = document.getElementById("ritualBoardNote");
  if (note) note.textContent = visible.length ? `${visible.length} rituals in view · ${visible.filter(habit => isComplete(habit)).length} already handled.` : "Nothing waiting here. Elegant.";
  const groups = Object.keys(categoryMeta).map(category => ({ category, habits: visible.filter(habit => habit.category === category) })).filter(group => group.habits.length);
  board.innerHTML = groups.length ? groups.map(group => {
    const meta = categoryMeta[group.category];
    return `<section class="life-category"><div class="life-category-head"><span class="category-symbol">${meta.icon}</span><div><p class="section-label">${meta.group}</p><h3>${meta.label}</h3></div><span class="mono">${group.habits.length} rituals</span></div><div class="command-card-grid">${group.habits.map(renderHabitCard).join("")}</div></section>`;
  }).join("") : `<div class="empty-rituals"><span>✦</span><h3>No rituals here.</h3><p>Missed, not ruined. The archive is simply calm.</p></div>`;
  board.querySelectorAll("[data-habit-id]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation();
    toggleHabit(button.dataset.habitId);
  }));
  bindCursorLabels();
}
function renderHabitCard(habit) {
  const done = isComplete(habit);
  const status = dueStatus(habit);
  const meta = categoryMeta[habit.category];
  return `<article class="command-habit ${done ? "done" : ""} status-${status.key}">
    <div class="command-habit-top"><span class="frequency-badge frequency-${habit.frequency}">${frequencyLabel(habit.frequency)}</span><span class="due-status">${status.label}</span></div>
    <div class="command-habit-title"><span>${meta.icon}</span><div><p>${meta.label}</p><h4>${habit.title}</h4></div></div>
    <p class="command-habit-copy">${habit.description}</p>
    <details><summary>Why it matters</summary><p>${habit.why}</p></details>
    <button class="ritual-check" data-habit-id="${habit.id}" data-cursor="ritual">${done ? "✓ Already handled" : "Complete ritual"}</button>
  </article>`;
}

function renderSummary() {
  const summary = document.getElementById("commandSummary");
  if (!summary) return;
  const incomplete = habits.filter(habit => !isComplete(habit));
  const next = incomplete[0]?.title || "The archive is complete";
  const week = weekStats();
  const month = monthStats();
  const levelInfo = currentLevel();
  const items = [
    ["Rituals due", incomplete.length],
    ["Completed today", Object.values(state.days[TODAY_KEY]?.checked || {}).filter(Boolean).length],
    ["Current streak", `${state.streak || 0} days`],
    ["Current level", `L${levelInfo.number} · ${levelInfo.name}`],
    ["Next ritual due", next],
    ["Weekly completion", `${week.percentage}%`],
    ["Monthly completion", `${month.percentage}%`]
  ];
  summary.innerHTML = items.map(([label, value]) => `<article class="summary-tile"><span>${label}</span><strong>${value}</strong></article>`).join("");
}

function renderProgress() {
  const current = applyLevel();
  const p = chartPercentage();
  const pie = document.getElementById("progressPie");
  if (pie) {
    pie.style.removeProperty("background");
    pie.style.setProperty("--p", p);
  }
  document.getElementById("progressPercent").textContent = `${p}%`;
  document.getElementById("heroDoneCount").textContent = chartMode === "today" ? `${todayCompletedCount()} / ${habits.length} rituals` : `${state.totalTicks} archived rituals`;
  document.getElementById("motivationLine").textContent = p === 100 ? "The archive is immaculate." : motivation[Math.floor((p / 100) * (motivation.length - 1))];
  document.getElementById("streakCount").textContent = `${state.streak || 0} days`;
  document.getElementById("bestStreak").textContent = `${state.bestStreak || 0} days`;
  document.getElementById("totalTicks").textContent = String(state.totalTicks || 0);
  document.getElementById("streakHeader").textContent = `Level ${current.number} · Streak ${state.streak || 0}`;
  document.getElementById("levelNumber").textContent = current.number;
  document.getElementById("levelName").textContent = `${current.name}`;
  document.getElementById("nextUnlock").textContent = current.number === 10 ? "Archive complete: full evolved aesthetic" : `Next unlock: ${current.unlock}`;
  document.getElementById("levelText").textContent = `Level ${current.number} · ${current.name}`;
  const range = current.next === Infinity ? 1 : current.next - current.min;
  const progress = current.next === Infinity ? 100 : Math.round((state.totalTicks - current.min) / range * 100);
  document.getElementById("levelBarFill").style.width = `${progress}%`;
  document.getElementById("glowLevelFill").style.width = `${progress}%`;
  document.getElementById("glowLevelProgress").textContent = current.next === Infinity ? `${state.totalTicks} rituals completed · final level` : `${state.totalTicks} / ${current.next} rituals completed`;
  renderChartLegend();
}
function chartPercentage() {
  if (chartMode === "weekly") return weekStats().percentage;
  if (chartMode === "category" || chartMode === "life") return monthStats().percentage;
  return todayPercentage();
}
function renderChartLegend() {
  const legend = document.getElementById("chartLegend");
  const title = document.getElementById("chartTitle");
  if (!legend || !title) return;
  document.querySelectorAll(".chart-mode").forEach(button => button.classList.toggle("active", button.dataset.chartMode === chartMode));
  if (chartMode === "today") {
    title.textContent = "Today's completion";
    legend.innerHTML = `<span><i></i>${todayCompletedCount()} complete</span><span><i></i>${habits.length - todayCompletedCount()} remaining</span>`;
    return;
  }
  const stats = chartMode === "weekly" ? weekStats() : monthStats();
  title.textContent = chartMode === "weekly" ? "Weekly rituals" : chartMode === "category" ? "Category balance" : "Life balance";
  const counts = {};
  stats.entries.forEach(habit => {
    const key = chartMode === "life" ? categoryMeta[habit.category].group : categoryMeta[habit.category].label;
    counts[key] = (counts[key] || 0) + 1;
  });
  if (chartMode === "category" || chartMode === "life") {
    const colors = ["#e86f9d", "#c49a5a", "#b9859b", "#f3c5d6", "#7c3651"];
    const values = Object.values(counts);
    const total = values.reduce((sum, value) => sum + value, 0);
    if (total) {
      let cursor = 0;
      const stops = values.slice(0, 5).map((value, index) => {
        const start = cursor;
        cursor += value / total * 100;
        return `${colors[index]} ${start}% ${cursor}%`;
      });
      document.getElementById("progressPie").style.background = `conic-gradient(${stops.join(",")})`;
    }
  }
  legend.innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, count]) => `<span><i></i>${label}: ${count}</span>`).join("") || `<span><i></i>No archived rituals yet</span>`;
}

function trackerDates() {
  if (trackerView === "month") {
    const total = new Date(trackerDate.getFullYear(), trackerDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: total }, (_, i) => new Date(trackerDate.getFullYear(), trackerDate.getMonth(), i + 1));
  }
  const start = startOfWeek(trackerDate);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
function renderTracker() {
  const tables = document.getElementById("trackerTables");
  const archive = document.getElementById("archiveWindow");
  const period = document.getElementById("trackerPeriod");
  if (!tables || !archive || !period) return;
  const isArchive = trackerView === "archive";
  tables.hidden = isArchive;
  archive.hidden = !isArchive;
  document.querySelectorAll(".tracker-tab").forEach(tab => {
    const active = tab.dataset.view === trackerView;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  if (isArchive) {
    period.textContent = "Saved months";
    renderArchive();
    return;
  }
  const dates = trackerDates();
  period.textContent = trackerView === "month" ? trackerDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : `${dates[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${dates[6].toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
  const groups = Object.keys(categoryMeta).map(category => ({ category, habits: habits.filter(habit => habit.category === category) })).filter(group => group.habits.length);
  tables.innerHTML = groups.map(group => {
    const meta = categoryMeta[group.category];
    const headers = dates.map(date => `<th>${trackerView === "month" ? date.getDate() : `${date.toLocaleDateString("en-GB", { weekday: "short" })}<br>${date.getDate()}`}</th>`).join("");
    const rows = group.habits.map(habit => `<tr><th class="habit-name">${habit.title}<small>${frequencyLabel(habit.frequency)}</small></th>${dates.map(date => {
      const key = dateKey(date);
      const checked = !!state.days[key]?.checked?.[habit.id];
      return `<td><button class="tracker-cell ${checked ? "done" : ""} ${key === TODAY_KEY ? "today" : ""}" data-track-id="${habit.id}" data-date="${key}" aria-label="${habit.title}, ${key}">${checked ? "✓" : ""}</button></td>`;
    }).join("")}</tr>`).join("");
    return `<article class="tracker-block"><div class="tracker-block-head"><h3>${meta.icon} ${meta.label}</h3><span class="mono">${group.habits.length} rituals</span></div><div class="tracker-scroll"><table class="habit-table" style="min-width:${240 + dates.length * 42}px"><thead><tr><th class="habit-name">Habit</th>${headers}</tr></thead><tbody>${rows}</tbody></table></div></article>`;
  }).join("");
  document.querySelectorAll("[data-track-id]").forEach(cell => cell.addEventListener("click", () => toggleHabit(cell.dataset.trackId, cell.dataset.date)));
}
function renderArchive() {
  const container = document.getElementById("archiveMonths");
  if (!container) return;
  const months = new Set(Object.keys(state.days).map(key => key.slice(0, 7)));
  months.add(TODAY_KEY.slice(0, 7));
  container.innerHTML = [...months].sort().reverse().map(monthKey => {
    const [year, month] = monthKey.split("-").map(Number);
    const label = new Date(year, month - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    const ticks = Object.entries(state.days).filter(([key]) => key.startsWith(monthKey)).reduce((sum, [, day]) => sum + Object.values(day.checked || {}).filter(Boolean).length, 0);
    return `<button class="archive-month" data-month="${monthKey}"><strong>${label}</strong><span>${ticks} completed rituals · open month →</span></button>`;
  }).join("");
  container.querySelectorAll("[data-month]").forEach(button => button.addEventListener("click", () => {
    const [year, month] = button.dataset.month.split("-").map(Number);
    trackerDate = new Date(year, month - 1, 1);
    trackerView = "month";
    renderTracker();
  }));
}
function moveTracker(direction) {
  if (trackerView === "archive") return;
  trackerDate = trackerView === "month" ? new Date(trackerDate.getFullYear(), trackerDate.getMonth() + direction, 1) : addDays(trackerDate, direction * 7);
  renderTracker();
}

function renderReview() {
  const grid = document.getElementById("reviewGrid");
  if (!grid) return;
  const week = weekStats();
  const categoryCounts = {};
  week.entries.forEach(habit => categoryCounts[habit.category] = (categoryCounts[habit.category] || 0) + 1);
  const ranked = Object.keys(categoryMeta).sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0));
  const best = categoryMeta[ranked[0]].label;
  const neglected = categoryMeta[ranked[ranked.length - 1]].label;
  const focus = habits.find(habit => habit.category === ranked[ranked.length - 1] && !isComplete(habit))?.title || "Protect the streak";
  const cards = [
    ["This week", `${week.percentage}%`, "The archive is taking shape."],
    ["Best category", best, "Blair would call this maintenance."],
    ["Neglected category", neglected, "Missed, not ruined."],
    ["Current streak", `${state.streak || 0} days`, "Your streak is too pretty to break."],
    ["Tomorrow’s focus", focus, "Back on the staircase."],
    ["Command note", motivation[(state.totalTicks || 0) % motivation.length], "The ritual archive remembers."]
  ];
  grid.innerHTML = cards.map(([label, value, copy]) => `<article class="review-card"><p class="section-label">${label}</p><h3>${value}</h3><p>${copy}</p></article>`).join("");
}

function renderDailyArchive() {
  const grid = document.getElementById("dailyArchiveGrid");
  const status = document.getElementById("dailyArchiveStatus");
  if (!grid || !status) return;
  const morning = loadRecords(CHECKIN_KEY)[TODAY_KEY];
  const evening = loadRecords(EVENING_KEY)[TODAY_KEY];
  const eveningStatus = evening ? "Today has been witnessed." : "Evening archive opens at 22:00.";
  status.textContent = morning ? (evening ? "Today has been witnessed." : "Morning archive complete.") : "The morning archive is waiting.";
  const cards = [
    ["Weight logged", morning?.weight || "Waiting"],
    ["Waist logged", morning?.waist || "Waiting"],
    ["Today’s affirmation", morning?.affirmation || "Waiting for today’s words"],
    ["Gratitude", morning?.gratitude || "Waiting for one true thing"],
    ["Morning notes", morning?.morningNotes || "Waiting for your notes"],
    ["Evening reflection", eveningStatus]
  ];
  grid.innerHTML = cards.map(([label, value]) => `<article class="daily-archive-card"><p class="section-label">${label}</p><p>${value}</p></article>`).join("");
}

let activeMandatoryModal = null;
function focusableElements(modal) {
  return [...modal.querySelectorAll('input, textarea, button, select, [tabindex]:not([tabindex="-1"])')].filter(element => !element.disabled);
}
function openMandatoryModal(modal) {
  activeMandatoryModal = modal;
  modal.hidden = false;
  document.body.classList.add("modal-locked");
  requestAnimationFrame(() => focusableElements(modal)[0]?.focus());
}
function closeMandatoryModal(modal) {
  modal.hidden = true;
  activeMandatoryModal = null;
  document.body.classList.remove("modal-locked");
}
function openOptionalHabitUpdate() {
  const modal = document.getElementById("habitUpdateModal");
  const list = document.getElementById("habitUpdateList");
  const due = habits.filter(habit => !isComplete(habit));
  list.innerHTML = due.map(habit => {
    const meta = categoryMeta[habit.category];
    return `<label class="habit-update-option"><input type="checkbox" name="habitUpdate" value="${habit.id}" /><span>${meta.icon}</span><span><strong>${habit.title}</strong><small>${frequencyLabel(habit.frequency)} · ${dueStatus(habit).label}</small></span></label>`;
  }).join("") || `<p class="optional-empty">Everything due is already handled. Miranda has no notes.</p>`;
  modal.hidden = false;
  requestAnimationFrame(() => document.getElementById("habitUpdateClose")?.focus());
}
function closeOptionalHabitUpdate() {
  document.getElementById("habitUpdateModal").hidden = true;
}
function validateRequiredForm(form, button, helper, readyMessage) {
  const valid = [...form.querySelectorAll("[required]")].every(field => field.value.trim());
  button.disabled = !valid;
  helper.textContent = valid ? readyMessage : helper.dataset.default;
}
function initialiseCheckinForms() {
  const morningForm = document.getElementById("morningCheckinForm");
  const morningButton = document.getElementById("morningCheckinSubmit");
  const morningHelper = document.getElementById("morningCheckinHelper");
  morningHelper.dataset.default = morningHelper.textContent;
  morningForm.addEventListener("input", () => validateRequiredForm(morningForm, morningButton, morningHelper, "The archive is ready. Begin when you are."));
  morningForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(morningForm);
    saveRecord(CHECKIN_KEY, {
      date: TODAY_KEY,
      time: localTime(),
      weight: data.get("weight"),
      waist: data.get("waist"),
      affirmation: data.get("affirmation").trim(),
      gratitude: data.get("gratitude").trim(),
      morningNotes: data.get("morningNotes").trim()
    });
    state.measurements.unshift({ date: TODAY_KEY, waist: data.get("waist"), weight: data.get("weight"), glute: "Morning archive" });
    state.measurements = state.measurements.slice(0, 24);
    saveState();
    closeMandatoryModal(document.getElementById("morningCheckinModal"));
    renderMeasurements();
    renderDailyArchive();
    renderSummary();
    showToast("Morning archive complete. The day may begin.");
  });

  const eveningForm = document.getElementById("eveningReflectionForm");
  const eveningButton = document.getElementById("eveningReflectionSubmit");
  const eveningHelper = document.getElementById("eveningReflectionHelper");
  eveningHelper.dataset.default = eveningHelper.textContent;
  eveningForm.addEventListener("input", () => validateRequiredForm(eveningForm, eveningButton, eveningHelper, "The day is ready to be witnessed."));
  eveningForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(eveningForm);
    saveRecord(EVENING_KEY, {
      date: TODAY_KEY,
      time: localTime(),
      mood: data.get("mood") ? Number(data.get("mood")) : null,
      daySummary: data.get("daySummary").trim(),
      completed: data.get("completed").trim(),
      struggledWith: data.get("struggledWith").trim(),
      proudOf: data.get("proudOf").trim(),
      tomorrowFocus: data.get("tomorrowFocus").trim()
    });
    closeMandatoryModal(document.getElementById("eveningReflectionModal"));
    renderDailyArchive();
    showToast("Archived. Rest now, darling.");
  });

  document.getElementById("habitUpdateForm").addEventListener("submit", event => {
    event.preventDefault();
    const previousLevel = currentLevel();
    const selected = [...event.currentTarget.querySelectorAll('input[name="habitUpdate"]:checked')].map(input => input.value);
    selected.forEach(id => {
      const habit = habits.find(item => item.id === id);
      if (habit && !isComplete(habit)) {
        ensureDay(TODAY_KEY).checked[id] = true;
        state.totalTicks += 1;
      }
    });
    saveRecord(HABIT_UPDATE_KEY, { date: TODAY_KEY, time: localTime(), habits: selected });
    saveState();
    checkLevelUp(previousLevel);
    closeOptionalHabitUpdate();
    renderAll();
    showToast(selected.length ? "Habit update saved. The archive noticed." : "Archive checked. Carry on, darling.");
  });
  document.getElementById("habitUpdateClose").addEventListener("click", closeOptionalHabitUpdate);
  document.getElementById("habitUpdateSkip").addEventListener("click", closeOptionalHabitUpdate);
  document.getElementById("habitUpdateModal").addEventListener("click", event => {
    if (event.target.id === "habitUpdateModal") closeOptionalHabitUpdate();
  });
}
function runDailyCheckinPriority() {
  const now = new Date();
  const morning = loadRecords(CHECKIN_KEY)[TODAY_KEY];
  const evening = loadRecords(EVENING_KEY)[TODAY_KEY];
  if (now.getHours() >= 22 && !evening) {
    openMandatoryModal(document.getElementById("eveningReflectionModal"));
    return;
  }
  if (!morning) {
    openMandatoryModal(document.getElementById("morningCheckinModal"));
    return;
  }
  openOptionalHabitUpdate();
}

function completeDay() {
  const p = todayPercentage();
  const day = ensureDay(TODAY_KEY);
  if (!day.saved && p >= 70) {
    state.streak = (state.streak || 0) + 1;
    state.bestStreak = Math.max(state.bestStreak || 0, state.streak);
  }
  day.saved = true;
  saveState();
  renderAll();
  showToast(p >= 70 ? "Day saved. Your streak is protected." : "Saved. Missed, not ruined.");
}
function saveMeasurements() {
  const waist = document.getElementById("waistInput").value;
  const weight = document.getElementById("weightInput").value;
  const glute = document.getElementById("gluteInput").value;
  if (!waist && !weight && !glute) return showToast("Give me one measurement or note first.");
  state.measurements.unshift({ date: TODAY_KEY, waist, weight, glute });
  state.measurements = state.measurements.slice(0, 24);
  saveState();
  renderMeasurements();
  showToast("Logged. A princess keeps receipts.");
}
function renderMeasurements() {
  const log = document.getElementById("measurementLog");
  if (!log) return;
  log.innerHTML = state.measurements.map(row => `<div class="log-row"><strong>${row.date}</strong><span>Waist: ${row.waist || "—"}</span><span>Weight: ${row.weight || "—"}</span><span>${row.glute || "—"}</span></div>`).join("");
}

let resetTimer = null;
function startResetHold() {
  const phrase = document.getElementById("resetPhrase").value.trim();
  const checked = document.getElementById("resetCheckbox").checked;
  const status = document.getElementById("resetStatus");
  if (!checked || phrase !== "ERASE MY RITUAL ARCHIVE") {
    status.textContent = "Tick the acknowledgement and type the exact archive phrase.";
    return;
  }
  const button = document.getElementById("resetBtn");
  button.classList.add("holding");
  status.textContent = "Keep holding for 4 seconds. The archive is still protected.";
  resetTimer = setTimeout(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CHECKIN_KEY);
    localStorage.removeItem(HABIT_UPDATE_KEY);
    localStorage.removeItem(EVENING_KEY);
    state = defaultState();
    ensureDay(TODAY_KEY);
    saveState();
    renderAll();
    renderMeasurements();
    status.textContent = "Ritual archive erased. New era.";
    button.classList.remove("holding");
    runDailyCheckinPriority();
  }, 4000);
}
function cancelResetHold() {
  clearTimeout(resetTimer);
  document.getElementById("resetBtn")?.classList.remove("holding");
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function showLevelModal(info) {
  const modal = document.getElementById("levelModal");
  document.getElementById("levelModalNumber").textContent = info.number;
  document.getElementById("levelModalTitle").textContent = `Level ${info.number} unlocked: ${info.name}`;
  document.getElementById("levelModalCopy").textContent = levelMessages[(info.number - 2) % levelMessages.length];
  modal.hidden = false;
}
function renderAll() {
  renderHabitBoard();
  renderSummary();
  renderProgress();
  renderTracker();
  renderReview();
  renderDailyArchive();
}

const cursor = document.querySelector(".cursor");
const cursorLabel = document.querySelector(".cursor-label");
const cursorDot = document.querySelector(".cursor-dot");
let mouseX = innerWidth / 2, mouseY = innerHeight / 2, curX = mouseX, curY = mouseY;
addEventListener("mousemove", event => { mouseX = event.clientX; mouseY = event.clientY; });
function animateCursor() {
  curX += (mouseX - curX) * .14;
  curY += (mouseY - curY) * .14;
  if (cursor) cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
  if (cursorDot) cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateCursor);
}
function bindCursorLabels() {
  document.querySelectorAll("[data-cursor]").forEach(element => {
    element.onmouseenter = () => { cursor?.classList.add("active"); if (cursorLabel) cursorLabel.textContent = element.dataset.cursor; };
    element.onmouseleave = () => { cursor?.classList.remove("active"); if (cursorLabel) cursorLabel.textContent = ""; };
  });
}
animateCursor();

const loaderLines = document.querySelectorAll(".loader-line");
const loaderMark = document.querySelector(".loader-mark");
const loader = document.getElementById("loader");
setTimeout(() => { loaderLines[0]?.classList.remove("active"); loaderLines[1]?.classList.add("active"); }, 900);
setTimeout(() => { loaderLines[1]?.classList.remove("active"); loaderMark?.classList.add("active"); }, 1850);
setTimeout(() => loader?.classList.add("hide"), 2850);
document.getElementById("todayDate").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

document.getElementById("completeDayBtn")?.addEventListener("click", completeDay);
document.getElementById("saveMeasurementsBtn")?.addEventListener("click", saveMeasurements);
document.getElementById("quickWinBtn")?.addEventListener("click", () => showToast(motivation[Math.floor(Math.random() * motivation.length)]));
document.querySelectorAll(".habit-filter").forEach(button => button.addEventListener("click", () => { habitFilter = button.dataset.filter; renderHabitBoard(); }));
document.querySelectorAll(".chart-mode").forEach(button => button.addEventListener("click", () => { chartMode = button.dataset.chartMode; renderProgress(); }));
document.querySelectorAll(".tracker-tab").forEach(tab => tab.addEventListener("click", () => { trackerView = tab.dataset.view; renderTracker(); }));
document.getElementById("trackerPrev")?.addEventListener("click", () => moveTracker(-1));
document.getElementById("trackerNext")?.addEventListener("click", () => moveTracker(1));
document.getElementById("trackerToday")?.addEventListener("click", () => { trackerDate = new Date(); if (trackerView === "archive") trackerView = "week"; renderTracker(); });
document.getElementById("levelModalClose")?.addEventListener("click", () => document.getElementById("levelModal").hidden = true);
document.getElementById("levelModal")?.addEventListener("click", event => { if (event.target.id === "levelModal") event.currentTarget.hidden = true; });
document.addEventListener("keydown", event => {
  if (activeMandatoryModal) {
    if (event.key === "Escape") event.preventDefault();
    if (event.key === "Tab") {
      const focusable = focusableElements(activeMandatoryModal);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    return;
  }
  if (event.key === "Escape" && !document.getElementById("habitUpdateModal").hidden) closeOptionalHabitUpdate();
});
const resetBtn = document.getElementById("resetBtn");
resetBtn?.addEventListener("mousedown", startResetHold);
resetBtn?.addEventListener("touchstart", startResetHold, { passive: true });
["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(event => resetBtn?.addEventListener(event, cancelResetHold));

const currentSection = document.querySelector(".swiss-current");
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.target === currentSection) entry.target.classList.toggle("current-visible", entry.isIntersecting);
}), { threshold: .12 });
if (currentSection) observer.observe(currentSection);

renderAll();
renderMeasurements();
initialiseCheckinForms();
bindCursorLabels();
saveState();
forcePageTop();
setTimeout(forcePageTop, 0);
setTimeout(forcePageTop, 100);
setTimeout(forcePageTop, 500);
runDailyCheckinPriority();
