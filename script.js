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
const EVENTS_KEY = "glowEvents";
const CUSTOM_RITUALS_KEY = "glowCustomRituals";
const RITUAL_OVERRIDES_KEY = "glowRitualOverrides";
const WORK_STATE_KEY = "glowWorkState.v1";
const WORK_TASKS_KEY = "workTasks";
const WORK_EVENTS_KEY = "workEvents";
const MODE_MIGRATION_KEY = "glowTwoModeMigration.v1";
const CALENDAR_ITEMS_KEY = "calendarItems";
const CALENDAR_SCHEDULE_OVERRIDES_KEY = "calendarScheduleOverrides";
const CALENDAR_COMPLETIONS_KEY = "calendarItemCompletions";
const CALENDAR_DAY_NOTES_KEY = "calendarDayNotes";
const TODAY_KEY = dateKey(new Date());
const TIME_CLASSES = ["time-dawn", "time-morning", "time-midday", "time-afternoon", "time-sunset", "time-evening", "time-night"];

function applyTimeTheme() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  let theme = "night";
  if (hour >= 5 && hour < 7) theme = "dawn";
  else if (hour >= 7 && hour < 11) theme = "morning";
  else if (hour >= 11 && hour < 14) theme = "midday";
  else if (hour >= 14 && hour < 17) theme = "afternoon";
  else if (hour >= 17 && hour < 20) theme = "sunset";
  else if (hour >= 20 && hour < 22) theme = "evening";
  document.body.classList.remove(...TIME_CLASSES);
  document.body.classList.add(`time-${theme}`);
  const atmosphere = {
    dawn: ["Dawn archive", "The archive is waking in blush light."],
    morning: ["Morning ritual", "The archive is in morning light."],
    midday: ["Midday discipline", "Midday discipline mode."],
    afternoon: ["Afternoon polish", "The palette follows the steady sky."],
    sunset: ["Sunset glow", "Sunset glow unlocked."],
    evening: ["Evening reflection", "Rose-mauve light for graceful discipline."],
    night: ["Night archive", "Night archive: softer, quieter, sharper."]
  }[theme];
  const label = document.getElementById("timeAtmosphereLabel");
  const copy = document.getElementById("timeAtmosphereCopy");
  if (label) label.textContent = atmosphere[0];
  if (copy) copy.textContent = `${atmosphere[1]} Palette synced to your day.`;
  configureDynamicLoader(theme);
}
function configureDynamicLoader(theme) {
  const copy = {
    dawn: ["The archive wakes before the world.", "Soft light. Serious standards.", "Dawn Ritual"],
    morning: ["Morning light, polished intentions.", "The day is ready to be directed.", "Morning Command"],
    midday: ["Midday discipline is becoming visible.", "Refiling the future in brighter light.", "Midday Archive"],
    afternoon: ["The afternoon edit is in progress.", "Quiet consistency, beautifully filed.", "Afternoon Polish"],
    sunset: ["The archive is catching rose-gold light.", "Closing the distance to becoming.", "Sunset Glow"],
    evening: ["The day softens. The standards remain.", "Preparing the archive for reflection.", "Evening Edition"],
    night: ["The private archive is still awake.", "Moonlit discipline, quietly filed.", "Night Archive"]
  }[theme] || ["The archive is waking.", "Zai builds systems.", "Glow-Up Station"];
  document.querySelectorAll(".loader-line").forEach((line, index) => { if (copy[index]) line.textContent = copy[index]; });
  const mark = document.querySelector(".loader-mark");
  if (mark) mark.textContent = copy[2];
}

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
  soul: { label: "Soul / God / Mind", icon: "✦", group: "Soul" },
  custom: { label: "Custom", icon: "✧", group: "Life" }
};
const WORK_CATEGORY_KEYS = new Set(["career", "creativity", "money"]);
function isWorkHabit(habit) { return habit?.mode === "work" || WORK_CATEGORY_KEYS.has(habit?.category); }
function pinkHabits() { return habits.filter(habit => !isWorkHabit(habit)); }

let habits = [
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

const baseHabits = habits.map(habit => ({ ...habit }));
let ritualOverrides = loadRecords(RITUAL_OVERRIDES_KEY);
let customRituals = loadCollection(CUSTOM_RITUALS_KEY);
let events = loadCollection(EVENTS_KEY);
syncCustomRituals();

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
let eventView = "active";
let selectedEventId = null;
const workCategoryMeta = {
  study: { label: "Study / Dissertation", icon: "§" },
  jobs: { label: "Jobs / Applications", icon: "↗" },
  portfolio: { label: "Portfolio", icon: "□" },
  creativeWork: { label: "Creative Tasks", icon: "✎" },
  client: { label: "Client Work", icon: "◇" },
  brand: { label: "Brand Projects", icon: "✦" },
  adminWork: { label: "Money / Admin", icon: "₊" },
  skills: { label: "Skill Building", icon: "↑" },
  networking: { label: "Networking", icon: "○" }
};
const workLevels = ["The Apprentice", "The Focused Girl", "The Oxford Engine", "The Portfolio Builder", "The Strategist", "The Interview Threat", "The Creative Operator", "The Blue-Chip Girl", "The Empire Builder", "The Archival CEO"];
const workLevelThresholds = [0, 7, 21, 46, 81, 131, 201, 301, 451, 651];
const workMotivation = ["Your future invoices are watching.", "One application closer.", "The portfolio will not build itself, darling.", "Oxford discipline. Vogue execution.", "Tiny task. Large consequence.", "Build proof, not panic.", "The blue archive remembers."];
const builtInWorkTasks = [
  workTask("life-0", "Dissertation or career block", "study", "daily", "Moves the largest academic obligation forward through manageable progress.", "60 minutes"),
  workTask("life-1", "Portfolio and career review", "portfolio", "weekly", "Turns your ability into proof that other people can hire.", "45 minutes"),
  workTask("life-2", "Creative skill block", "creativeWork", "daily", "Keeps creative capability visible and growing.", "30 minutes"),
  workTask("admin-reset", "Budget and admin reset", "adminWork", "weekly", "Protects the creative life from chaos.", "30 minutes"),
  workTask("portfolio-month", "Website and portfolio audit", "portfolio", "monthly", "Keeps your public proof polished and current.", "90 minutes"),
  workTask("finance-audit", "Financial audit", "adminWork", "monthly", "Creates money clarity and calmer decisions.", "45 minutes"),
  workTask("fieldwork-tracker", "Create dissertation fieldwork tracker", "study", "one-time", "Gives complex academic work one reliable command centre.", "60 minutes"),
  workTask("work-job-search", "Search and shortlist jobs", "jobs", "weekly", "Converts ambition into visible opportunities.", "45 minutes"),
  workTask("work-application", "Submit a strong application", "jobs", "weekly", "Puts your evidence in front of the right people.", "90 minutes"),
  workTask("work-cv", "Improve CV or LinkedIn", "jobs", "weekly", "Keeps your professional story ready when opportunity appears.", "30 minutes"),
  workTask("work-reading", "Academic reading and notes", "study", "weekly", "Builds the evidence base behind stronger academic work.", "60 minutes"),
  workTask("work-case-study", "Build a portfolio case study", "portfolio", "weekly", "Turns finished work into persuasive proof.", "90 minutes"),
  workTask("work-seo", "Portfolio SEO and project copy", "portfolio", "monthly", "Helps the right people discover and understand your work.", "60 minutes"),
  workTask("work-design-sprint", "Creative design sprint", "creativeWork", "weekly", "Keeps ideas moving from taste into visible output.", "60 minutes"),
  workTask("work-client-followup", "Client work and follow-up", "client", "weekly", "Builds trust through clear delivery and communication.", "45 minutes"),
  workTask("work-brand-concept", "Develop a brand concept", "brand", "weekly", "Builds evidence of strategic and commercial taste.", "60 minutes"),
  workTask("work-email", "Email and calendar clean-up", "adminWork", "weekly", "Protects focused work from avoidable chaos.", "30 minutes"),
  workTask("work-skill", "High-income skill practice", "skills", "weekly", "Builds capability that compounds over time.", "60 minutes"),
  workTask("work-network", "Networking touchpoint", "networking", "weekly", "Makes relationships part of opportunity-building.", "20 minutes")
];
let customWorkTasks = loadCollection(WORK_TASKS_KEY);
customWorkTasks = customWorkTasks.map(task => ({ ...task, category: mapLegacyWorkCategory(task.category) }));
let workTasks = [...builtInWorkTasks, ...customWorkTasks.filter(task => !task.deleted)];
let workEvents = loadCollection(WORK_EVENTS_KEY);
let workState = loadWorkState();
let workFilter = "today";
let workTrackerView = "week";
let workTrackerDate = new Date();
let currentMode = "glow";

function workTask(id, title, category, frequency, why, duration = "") {
  return { id, title, category, frequency, why, duration, importance: "High", mode: "work", description: why };
}
function defaultWorkState() { return { days: {}, totalTicks: 0, streak: 0, bestStreak: 0, lastActiveDate: TODAY_KEY }; }
function loadWorkState() {
  try {
    const loaded = { ...defaultWorkState(), ...JSON.parse(localStorage.getItem(WORK_STATE_KEY) || "{}") };
    loaded.days = loaded.days && typeof loaded.days === "object" ? loaded.days : {};
    loaded.totalTicks = Number.isFinite(Number(loaded.totalTicks)) ? Number(loaded.totalTicks) : 0;
    return loaded;
  }
  catch { return defaultWorkState(); }
}
function saveWorkState() { localStorage.setItem(WORK_STATE_KEY, JSON.stringify(workState)); }
function recomputeWorkStreak() {
  const completedDates = new Set(Object.entries(workState.days).filter(([, day]) => Object.values(day.checked || {}).some(Boolean)).map(([key]) => key));
  let cursor = parseDate(TODAY_KEY);
  if (!completedDates.has(TODAY_KEY)) cursor = addDays(cursor, -1);
  let streak = 0;
  while (completedDates.has(dateKey(cursor))) { streak += 1; cursor = addDays(cursor, -1); }
  workState.streak = streak;
  workState.bestStreak = Math.max(workState.bestStreak || 0, streak);
}
function ensureWorkDay(key) {
  if (!workState.days[key]) workState.days[key] = { checked: {} };
  workState.days[key].checked ||= {};
  return workState.days[key];
}

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
function loadCollection(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}
function saveCollection(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function activeHabits() {
  const today = parseDate(TODAY_KEY);
  return pinkHabits().filter(habit => !habit.paused && (!habit.startDate || parseDate(habit.startDate) <= today) && (!habit.endDate || parseDate(habit.endDate) >= today));
}
function eventById(id) { return events.find(event => event.id === id); }
function linkedEventsForRitual(id) { return events.filter(event => event.status !== "archived" && event.ritualLinks?.some(link => link.ritualId === id)); }
function daysUntil(date) { return Math.ceil((parseDate(date) - parseDate(TODAY_KEY)) / 86400000); }
function eventTiming(event) {
  const days = daysUntil(event.date);
  if (days < 0) return { days, state: "past", copy: "This event has passed. Archive it or keep reflecting." };
  if (days === 0) return { days, state: "today", copy: "D-day has arrived." };
  if (days <= 2) return { days, state: "imminent", copy: days === 1 ? "Tomorrow is the reveal." : `${days} days until the reveal.` };
  if (days <= 6) return { days, state: "near", copy: `${days} days until the reveal. Final polish window.` };
  if (days <= 13) return { days, state: "rose", copy: `${days} days until the reveal.` };
  return { days, state: days <= 30 ? "blush" : "calm", copy: `${days} days until the reveal.` };
}
function importanceWeight(value) { return { Low: 1, Medium: 2, High: 3, Critical: 5 }[value] || 2; }
function eventReadiness(event) {
  const links = event.ritualLinks || [];
  const total = links.reduce((sum, link) => sum + importanceWeight(link.importance), 0);
  const completed = links.reduce((sum, link) => {
    const habit = habits.find(item => item.id === link.ritualId);
    return sum + (habit && isComplete(habit) ? importanceWeight(link.importance) : 0);
  }, 0);
  return total ? Math.round(completed / total * 100) : 0;
}
function eventBestStreak(event) {
  const start = dateKey(new Date(event.createdAt || `${TODAY_KEY}T00:00:00`));
  const end = event.date;
  const keys = Object.keys(state.days).filter(key => key >= start && key <= end && Object.values(state.days[key]?.checked || {}).some(Boolean)).sort();
  let best = 0, current = 0, previous = null;
  keys.forEach(key => {
    const date = parseDate(key);
    current = previous && (date - previous) / 86400000 === 1 ? current + 1 : 1;
    best = Math.max(best, current);
    previous = date;
  });
  return best;
}
function readinessLabel(score) {
  if (score <= 30) return "The ritual has begun.";
  if (score <= 55) return "Momentum building.";
  if (score <= 75) return "Visible progress era.";
  if (score <= 90) return "D-day discipline.";
  return "Ready, glowing, archived.";
}
function eventMotivation(category) {
  return {
    "Dress fitting": "Every ritual is tailoring the silhouette.",
    "Date / reunion": "Become calm enough to enjoy being seen.",
    Holiday: "Build the body that carries you through the sun.",
    "Career moment": "Polish is preparation made visible.",
    "Personal reset": "The event is not outside you. You are the event."
  }[category] || "Preparation is becoming visible.";
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

function todayScope() { return activeHabits(); }
function todayCompletedCount() { return todayScope().filter(habit => isComplete(habit)).length; }
function todayPercentage() { return Math.round(todayCompletedCount() / todayScope().length * 100); }
function periodStats(start, end) {
  const entries = [];
  const days = Math.max(1, Math.floor((end - start) / 86400000) + 1);
  Object.entries(state.days).forEach(([key, day]) => {
    const parsed = parseDate(key);
    if (parsed >= start && parsed <= end) {
      Object.entries(day.checked || {}).forEach(([id, done]) => {
        const habit = pinkHabits().find(item => item.id === id);
        if (done && habit) entries.push(habit);
      });
    }
  });
  const possible = pinkHabits().filter(habit => habit.frequency !== "one-time").reduce((sum, habit) => {
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
  const visible = (habitFilter === "all" ? pinkHabits() : activeHabits()).filter(habit => {
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
  board.querySelectorAll("[data-open-event]").forEach(button => button.addEventListener("click", () => openEventDetail(button.dataset.openEvent)));
  board.querySelectorAll("[data-edit-ritual]").forEach(button => button.addEventListener("click", () => openRitualEditor(button.dataset.editRitual)));
  board.querySelectorAll("[data-pause-ritual]").forEach(button => button.addEventListener("click", () => toggleCustomRitualPause(button.dataset.pauseRitual)));
  board.querySelectorAll("[data-delete-ritual]").forEach(button => button.addEventListener("click", () => deleteCustomRitual(button.dataset.deleteRitual)));
  bindCursorLabels();
}
function renderHabitCard(habit) {
  const done = isComplete(habit);
  const status = dueStatus(habit);
  const meta = categoryMeta[habit.category];
  const linked = linkedEventsForRitual(habit.id);
  return `<article class="command-habit ${done ? "done" : ""} status-${status.key}">
    <div class="command-habit-top"><span class="frequency-badge frequency-${habit.frequency}">${frequencyLabel(habit.frequency)}</span><span class="due-status">${status.label}</span></div>
    <div class="command-habit-title"><span>${meta.icon}</span><div><p>${meta.label}</p><h4>${habit.title}</h4></div></div>
    <p class="command-habit-copy">${habit.description}</p>
    ${linked.length ? `<div class="event-tags">${linked.map(event => `<button data-open-event="${event.id}" type="button">Linked to: ${event.name}</button>`).join("")}</div>` : ""}
    <details><summary>Why it matters</summary><p>${habit.why}</p></details>
    <div class="custom-ritual-actions"><button data-edit-ritual="${habit.id}" type="button">Edit</button>${habit.custom ? `<button data-pause-ritual="${habit.id}" type="button">${habit.paused ? "Resume" : "Pause"}</button>` : ""}<button data-delete-ritual="${habit.id}" type="button">Delete</button></div>
    <button class="ritual-check" data-habit-id="${habit.id}" data-cursor="ritual">${done ? "✓ Already handled" : "Complete ritual"}</button>
  </article>`;
}

function renderSummary() {
  const summary = document.getElementById("commandSummary");
  if (!summary) return;
  const incomplete = activeHabits().filter(habit => !isComplete(habit));
  const next = incomplete[0]?.title || "The archive is complete";
  const week = weekStats();
  const month = monthStats();
  const levelInfo = currentLevel();
  const nextEvent = events.filter(event => event.status !== "archived" && daysUntil(event.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
  const items = [
    ["Rituals due", incomplete.length],
    ["Completed today", Object.values(state.days[TODAY_KEY]?.checked || {}).filter(Boolean).length],
    ["Current streak", `${state.streak || 0} days`],
    ["Current level", `L${levelInfo.number} · ${levelInfo.name}`],
    ["Next ritual due", next],
    ["Weekly completion", `${week.percentage}%`],
    ["Monthly completion", `${month.percentage}%`]
  ];
  summary.innerHTML = items.map(([label, value]) => `<article class="summary-tile"><span>${label}</span><strong>${value}</strong></article>`).join("") +
    `<article class="summary-tile summary-dday"><span>Next D-Day</span><strong>${nextEvent ? escapeHTML(nextEvent.name) : "Create your first D-day"}</strong><button type="button" ${nextEvent ? `data-summary-event="${nextEvent.id}"` : "data-summary-create-event"}>${nextEvent ? `${eventReadiness(nextEvent)}% ready · Open Event` : "Create a D-Day"}</button></article>`;
  summary.querySelector("[data-summary-event]")?.addEventListener("click", button => openEventDetail(button.currentTarget.dataset.summaryEvent));
  summary.querySelector("[data-summary-create-event]")?.addEventListener("click", () => openEventEditor());
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
  const groups = Object.keys(categoryMeta).map(category => ({ category, habits: pinkHabits().filter(habit => habit.category === category) })).filter(group => group.habits.length);
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

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}
function renderEvents() {
  const grid = document.getElementById("eventGrid");
  if (!grid) return;
  document.querySelectorAll(".event-tab").forEach(button => button.classList.toggle("active", button.dataset.eventView === eventView));
  const shown = events.filter(event => eventView === "archived" ? event.status === "archived" : event.status !== "archived").sort((a, b) => a.date.localeCompare(b.date));
  grid.innerHTML = shown.length ? shown.map(renderEventCard).join("") : `<div class="event-empty"><span>✦</span><h3>${eventView === "archived" ? "No archived reveals yet." : "No D-days yet."}</h3><p>${eventView === "archived" ? "Your completed transformation folders will live here." : "Choose the moment you want to meet as your best self."}</p></div>`;
  grid.querySelectorAll("[data-event-id]").forEach(button => button.addEventListener("click", () => openEventDetail(button.dataset.eventId)));
  renderNextDday();
}
function renderEventCard(event) {
  const timing = eventTiming(event);
  const readiness = event.finalReadiness ?? eventReadiness(event);
  const critical = (event.ritualLinks || []).filter(link => link.importance === "Critical").filter(link => {
    const habit = habits.find(item => item.id === link.ritualId);
    return habit && !isComplete(habit);
  }).length;
  return `<button class="event-card urgency-${timing.state}" data-event-id="${event.id}" type="button">
    <div class="event-card-top"><span>${escapeHTML(event.category || "Custom")}</span><span>${event.status === "archived" ? "Archived" : timing.state === "past" ? "Past" : "Upcoming"}</span></div>
    <h3>${escapeHTML(event.name)}</h3>
    <p class="event-countdown">${timing.copy}</p>
    <div class="event-readiness-bar"><div style="width:${readiness}%"></div></div>
    <div class="event-card-bottom"><strong>Readiness: ${readiness}%</strong><span>${critical} critical remaining</span></div>
  </button>`;
}
function renderNextDday() {
  const container = document.getElementById("nextDdayCard");
  if (!container) return;
  const next = events.filter(event => event.status !== "archived" && daysUntil(event.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
  if (!next) {
    container.innerHTML = `<div><p class="section-label">Next D-Day</p><h3>Create your first D-day.</h3><p>No deadline, no pressure. Choose a moment worth preparing for.</p></div><button class="secondary-btn" data-create-event type="button">Create a D-Day</button>`;
  } else {
    const readiness = eventReadiness(next);
    const critical = (next.ritualLinks || []).filter(link => link.importance === "Critical").map(link => habits.find(habit => habit.id === link.ritualId)).filter(habit => habit && !isComplete(habit)).slice(0, 3);
    container.innerHTML = `<div><p class="section-label">Next D-Day</p><h3>${escapeHTML(next.name)}</h3><p>${eventTiming(next).copy} · Readiness ${readiness}%</p><span>${critical.length ? `Critical focus: ${critical.map(item => item.title).join(", ")}` : "Critical rituals handled."}</span></div><button class="secondary-btn" data-next-event="${next.id}" type="button">Open Event</button>`;
  }
  container.querySelector("[data-create-event]")?.addEventListener("click", () => openEventEditor());
  container.querySelector("[data-next-event]")?.addEventListener("click", button => openEventDetail(button.currentTarget.dataset.nextEvent));
}
function openEventDetail(id) {
  selectedEventId = id;
  const event = eventById(id);
  const detail = document.getElementById("eventDetail");
  if (!event || !detail) return;
  const timing = eventTiming(event);
  const readiness = event.finalReadiness ?? eventReadiness(event);
  const links = event.ritualLinks || [];
  const created = new Date(event.createdAt || `${TODAY_KEY}T00:00:00`);
  const target = parseDate(event.date);
  const totalWindow = Math.max(1, Math.ceil((target - created) / 86400000));
  const elapsed = Math.max(0, Math.min(totalWindow, Math.ceil((new Date() - created) / 86400000)));
  const prep = Math.round(elapsed / totalWindow * 100);
  const categoryCounts = {};
  links.forEach(link => {
    const habit = habits.find(item => item.id === link.ritualId);
    if (habit && isComplete(habit)) categoryCounts[categoryMeta[habit.category].label] = (categoryCounts[categoryMeta[habit.category].label] || 0) + 1;
  });
  detail.hidden = false;
  detail.innerHTML = `<div class="event-detail-hero urgency-${timing.state}">
    <button class="event-detail-close" type="button">← All D-Days</button><p class="section-label">${escapeHTML(event.category)}</p><h2>${escapeHTML(event.name)}</h2>
    <p class="event-detail-countdown">${timing.copy}</p><blockquote>${escapeHTML(event.motivation)}</blockquote>
    <div class="event-detail-actions"><button class="secondary-btn" data-edit-event="${event.id}" type="button">Edit Event</button>${event.status !== "archived" ? `<button class="secondary-btn" data-archive-event="${event.id}" type="button">Archive Event</button>` : ""}</div>
  </div>
  <div class="event-metrics">
    <article><span>Readiness</span><strong>${readiness}%</strong><p>${readinessLabel(readiness)}</p></article>
    <article><span>Days remaining</span><strong>${Math.max(0, timing.days)}</strong><p>${timing.days <= 2 ? "The reveal is close." : "This glow-up has a deadline."}</p></article>
    <article><span>Preparation elapsed</span><strong>${prep}%</strong><p>Preparation is becoming visible.</p></article>
    <article><span>Critical complete</span><strong>${links.filter(link => { const habit = habits.find(item => item.id === link.ritualId); return link.importance === "Critical" && habit && isComplete(habit); }).length}/${links.filter(link => link.importance === "Critical").length}</strong><p>Deadline near. Discipline prettier.</p></article>
    <article><span>Best event streak</span><strong>${eventBestStreak(event)}</strong><p>Consistency made visible.</p></article>
  </div>
  <div class="event-story"><article><p class="section-label">Main goal</p><h3>${escapeHTML(event.goal)}</h3></article><article><p class="section-label">Atelier note</p><h3>${eventMotivation(event.category)}</h3></article></div>
  <div class="event-notes"><p class="section-label">Preparation notes</p><div>
    <article><strong>Desired feeling</strong><p>${escapeHTML(event.desiredFeeling || "To feel calm, polished, and ready.")}</p></article>
    <article><strong>Outfit</strong><p>${escapeHTML(event.outfitNotes || "No outfit notes yet.")}</p></article>
    <article><strong>Body</strong><p>${escapeHTML(event.bodyNotes || "No body notes yet.")}</p></article>
    <article><strong>Beauty</strong><p>${escapeHTML(event.beautyNotes || "No beauty notes yet.")}</p></article>
    <article><strong>Confidence</strong><p>${escapeHTML(event.confidenceNotes || "No confidence notes yet.")}</p></article>
    <article><strong>Private</strong><p>${escapeHTML(event.privateNotes || "No private notes yet.")}</p></article>
  </div></div>
  <div class="event-linked-list"><h3>Selected rituals</h3>${links.length ? links.map(link => {
    const habit = habits.find(item => item.id === link.ritualId);
    return habit ? `<article class="${isComplete(habit) ? "done" : ""}"><span>${categoryMeta[habit.category].icon}</span><div><strong>${escapeHTML(habit.title)}</strong><p>${escapeHTML(link.note || habit.why)}</p></div><em>${link.importance}</em></article>` : "";
  }).join("") : `<p>No rituals selected yet. Edit the event to build the preparation plan.</p>`}</div>
  ${event.postEventReflection ? `<div class="event-reflection"><p class="section-label">Post-event reflection</p><h3>${escapeHTML(event.postEventReflection.felt)}</h3><p>${escapeHTML(event.postEventReflection.learned)}</p></div>` : ""}
  <div class="event-category-balance"><p class="section-label">Completed ritual categories</p><p>${Object.entries(categoryCounts).map(([name, count]) => `${name}: ${count}`).join(" · ") || "The first completion will begin this chart."}</p></div>`;
  detail.querySelector(".event-detail-close").addEventListener("click", () => { detail.hidden = true; selectedEventId = null; });
  detail.querySelector("[data-edit-event]")?.addEventListener("click", () => openEventEditor(id));
  detail.querySelector("[data-archive-event]")?.addEventListener("click", () => openEventArchive(id));
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}
function openAtelierModal(id) { document.getElementById(id).hidden = false; document.body.classList.add("modal-locked"); }
function closeAtelierModal(id) { document.getElementById(id).hidden = true; document.body.classList.remove("modal-locked"); }
function renderEventRitualPicker(event) {
  const links = new Map((event?.ritualLinks || []).map(link => [link.ritualId, link]));
  document.getElementById("eventRitualPicker").innerHTML = activeHabits().map(habit => {
    const link = links.get(habit.id);
    return `<div class="event-picker-row"><label><input type="checkbox" data-event-ritual="${habit.id}" ${link ? "checked" : ""}/><span>${categoryMeta[habit.category].icon}</span><strong>${escapeHTML(habit.title)}</strong></label><select data-link-importance="${habit.id}"><option ${link?.importance === "Low" ? "selected" : ""}>Low</option><option ${!link || link.importance === "Medium" ? "selected" : ""}>Medium</option><option ${link?.importance === "High" ? "selected" : ""}>High</option><option ${link?.importance === "Critical" ? "selected" : ""}>Critical</option></select><select data-link-frequency="${habit.id}"><option value="">Use main frequency</option>${["daily","weekly","biweekly","monthly","one-time","custom"].map(value => `<option value="${value}" ${link?.frequencyOverride === value ? "selected" : ""}>${frequencyLabel(value)}</option>`).join("")}</select><input data-link-note="${habit.id}" placeholder="Event-specific note" value="${escapeHTML(link?.note || "")}" /></div>`;
  }).join("");
}
function openEventEditor(id = "") {
  const form = document.getElementById("eventEditorForm");
  const event = eventById(id);
  form.reset();
  form.elements.eventId.value = event?.id || "";
  ["name", "date", "category", "desiredFeeling", "goal", "motivation", "outfitNotes", "bodyNotes", "beautyNotes", "confidenceNotes", "privateNotes"].forEach(name => {
    if (event && form.elements[name]) form.elements[name].value = event[name] || "";
  });
  document.getElementById("eventEditorTitle").textContent = event ? "Edit the D-Day." : "Create a D-Day.";
  renderEventRitualPicker(event);
  openAtelierModal("eventEditorModal");
}
function openEventArchive(id) {
  const form = document.getElementById("eventArchiveForm");
  form.reset();
  form.elements.eventId.value = id;
  openAtelierModal("eventArchiveModal");
}
function recommendRitual(title) {
  const text = title.toLowerCase();
  const extreme = /(starve|no food|punish|burn everything|lose 5kg|no carbs forever|laxative|skip meals)/.test(text);
  const rules = [
    [/(posture|shoulder)/, "posture", "daily", "Critical", "Opens the chest, improves silhouette, and helps clothes sit more elegantly."],
    [/(protein)/, "food", "daily", "High", "Protects muscle, supports curves, and helps body recomposition without crash dieting."],
    [/(water|hydrate)/, "water", "daily", "High", "Supports digestion, skin, energy, and helps reduce water retention."],
    [/(glute|hip thrust|rdl|kickback)/, "glutes", "weekly", "High", "Builds lower-body shape and supports strong, focused training."],
    [/(hair|scalp|oil|mask)/, "hair", "weekly", "Medium", "Protects length, reduces breakage, and supports stronger-looking hair over time."],
    [/(sleep)/, "sleep", "daily", "Critical", "Supports recovery, appetite regulation, skin, mood, and training results."],
    [/(walk|steps)/, "body", "daily", "High", "Supports health and body composition gently without sacrificing curves."],
    [/(dissertation|portfolio|brand|career)/, "career", "daily", "High", "Turns the glow-up into a life upgrade, not just a body project."],
    [/(pray|god|journal|gratitude)/, "soul", "daily", "Medium", "Keeps the transformation grounded, calm, and emotionally honest."]
  ];
  const match = rules.find(([pattern]) => pattern.test(text));
  return {
    category: match?.[1] || "custom", frequency: match?.[2] || "weekly", importance: match?.[3] || "Medium",
    why: match?.[4] || "Makes this intention visible, repeatable, and easier to archive.",
    warning: extreme ? "This ritual sounds extreme. Let’s make it effective without making it destructive. Try a protein-first meal, steady movement, or a realistic recovery ritual instead." : ""
  };
}
function openRitualEditor(id = "") {
  const form = document.getElementById("ritualEditorForm");
  const item = habits.find(ritual => ritual.id === id);
  form.reset();
  form.elements.ritualId.value = item?.id || "";
  ["title", "category", "frequency", "importance", "why", "notes", "startDate", "endDate", "targetCount"].forEach(name => {
    if (item && form.elements[name]) form.elements[name].value = item[name] || "";
  });
  if (item && !item.notes) form.elements.notes.value = item.description || "";
  form.elements.linkedEvent.value = item?.linkedEventIds?.[0] || "";
  document.getElementById("ritualEditorTitle").textContent = item ? "Edit the Ritual." : "Add a Ritual.";
  updateRitualRecommendation();
  openAtelierModal("ritualEditorModal");
}
function updateRitualRecommendation() {
  const form = document.getElementById("ritualEditorForm");
  const suggestion = recommendRitual(form.elements.title.value);
  const box = document.getElementById("ritualRecommendation");
  box.classList.toggle("warning", !!suggestion.warning);
  box.innerHTML = suggestion.warning || `I recommend making this a <strong>${frequencyLabel(suggestion.frequency)}</strong>. Suggested category: <strong>${categoryMeta[suggestion.category].label}</strong>. Why it matters: ${suggestion.why} <button type="button" id="applyRitualSuggestion">Apply suggestion</button>`;
  document.getElementById("applyRitualSuggestion")?.addEventListener("click", () => {
    form.elements.category.value = suggestion.category;
    form.elements.frequency.value = suggestion.frequency;
    form.elements.importance.value = suggestion.importance;
    form.elements.why.value = suggestion.why;
  });
}
function syncCustomRituals() {
  habits = baseHabits
    .map(habit => ({ ...habit, ...(ritualOverrides[habit.id] || {}), builtIn: true }))
    .filter(habit => !habit.deleted);
  habits.push(...customRituals.filter(item => !item.deleted).map(item => ({ ...item, custom: true, description: item.notes || item.description || item.why || "A ritual designed for your life." })));
  localStorage.setItem(RITUAL_OVERRIDES_KEY, JSON.stringify(ritualOverrides));
  saveCollection(CUSTOM_RITUALS_KEY, customRituals);
}
function toggleCustomRitualPause(id) {
  const item = customRituals.find(ritual => ritual.id === id);
  if (!item) return;
  item.paused = !item.paused;
  syncCustomRituals();
  renderAll();
}
function deleteCustomRitual(id) {
  const item = customRituals.find(ritual => ritual.id === id);
  if (item) item.deleted = true;
  else if (baseHabits.some(ritual => ritual.id === id)) ritualOverrides[id] = { ...(ritualOverrides[id] || {}), deleted: true };
  else return;
  events.forEach(event => event.ritualLinks = (event.ritualLinks || []).filter(link => link.ritualId !== id));
  saveCollection(EVENTS_KEY, events);
  syncCustomRituals();
  renderAll();
}
function initialiseAtelier() {
  const categorySelect = document.getElementById("customRitualCategory");
  categorySelect.innerHTML = Object.entries(categoryMeta).filter(([key]) => !WORK_CATEGORY_KEYS.has(key)).map(([key, meta]) => `<option value="${key}">${meta.label}</option>`).join("");
  const linkedEventSelect = document.getElementById("ritualEditorForm").elements.linkedEvent;
  linkedEventSelect.innerHTML = `<option value="">None</option>${events.filter(event => event.status !== "archived").map(event => `<option value="${event.id}">${escapeHTML(event.name)}</option>`).join("")}`;
  document.getElementById("openEventCreator").addEventListener("click", () => openEventEditor());
  document.getElementById("openRitualCreator").addEventListener("click", () => openRitualEditor());
  document.querySelectorAll("[data-close-atelier]").forEach(button => button.addEventListener("click", () => closeAtelierModal(button.dataset.closeAtelier)));
  document.querySelectorAll(".atelier-modal").forEach(modal => modal.addEventListener("click", event => {
    if (event.target === modal) closeAtelierModal(modal.id);
  }));
  document.querySelectorAll(".event-tab").forEach(button => button.addEventListener("click", () => {
    eventView = button.dataset.eventView;
    document.getElementById("eventDetail").hidden = true;
    renderEvents();
  }));
  document.getElementById("eventEditorForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const existing = eventById(data.get("eventId"));
    const ritualLinks = [...form.querySelectorAll("[data-event-ritual]:checked")].map(input => ({
      ritualId: input.dataset.eventRitual,
      importance: form.querySelector(`[data-link-importance="${input.dataset.eventRitual}"]`).value,
      note: form.querySelector(`[data-link-note="${input.dataset.eventRitual}"]`).value.trim(),
      frequencyOverride: form.querySelector(`[data-link-frequency="${input.dataset.eventRitual}"]`).value || null
    }));
    const record = {
      ...(existing || {}),
      id: existing?.id || `event_${Date.now()}`,
      name: data.get("name").trim(), date: data.get("date"), category: data.get("category"),
      goal: data.get("goal").trim(), motivation: data.get("motivation").trim(), desiredFeeling: data.get("desiredFeeling").trim(),
      outfitNotes: data.get("outfitNotes").trim(), bodyNotes: data.get("bodyNotes").trim(), beautyNotes: data.get("beautyNotes").trim(),
      confidenceNotes: data.get("confidenceNotes").trim(), privateNotes: data.get("privateNotes").trim(),
      createdAt: existing?.createdAt || new Date().toISOString(), status: existing?.status || "active", archivedAt: existing?.archivedAt || null,
      postEventReflection: existing?.postEventReflection || null, ritualLinks
    };
    if (existing) events[events.findIndex(item => item.id === existing.id)] = record;
    else events.push(record);
    saveCollection(EVENTS_KEY, events);
    closeAtelierModal("eventEditorModal");
    initialiseEventSelect();
    renderAll();
    openEventDetail(record.id);
    showToast("D-Day saved. Preparation is becoming visible.");
  });
  const ritualForm = document.getElementById("ritualEditorForm");
  ritualForm.elements.title.addEventListener("input", updateRitualRecommendation);
  ritualForm.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const existing = customRituals.find(item => item.id === data.get("ritualId"));
    const existingBuiltIn = baseHabits.find(item => item.id === data.get("ritualId"));
    const suggestion = recommendRitual(data.get("title"));
    if (suggestion.warning && !data.get("why").trim()) {
      showToast("Let’s make this ritual effective without making it destructive.");
      return;
    }
    const linkedEventIds = data.get("linkedEvent") ? [data.get("linkedEvent")] : [];
    const record = {
      ...(existing || existingBuiltIn || {}), id: existing?.id || existingBuiltIn?.id || `custom_${Date.now()}`, title: data.get("title").trim(),
      category: data.get("category"), frequency: data.get("frequency"), importance: data.get("importance"),
      why: data.get("why").trim() || suggestion.why, notes: data.get("notes").trim(),
      description: data.get("notes").trim() || existingBuiltIn?.description || data.get("why").trim() || suggestion.why,
      startDate: data.get("startDate"), endDate: data.get("endDate"), targetCount: Number(data.get("targetCount") || 1),
      linkedEventIds, paused: existing?.paused || false, createdAt: existing?.createdAt || new Date().toISOString()
    };
    if (existing) customRituals[customRituals.findIndex(item => item.id === existing.id)] = record;
    else if (existingBuiltIn) ritualOverrides[existingBuiltIn.id] = { ...record, builtIn: true, deleted: false };
    else customRituals.push(record);
    events.forEach(item => item.ritualLinks = (item.ritualLinks || []).filter(link => link.ritualId !== record.id));
    linkedEventIds.forEach(id => {
      const linkedEvent = eventById(id);
      if (linkedEvent) {
        linkedEvent.ritualLinks ||= [];
        linkedEvent.ritualLinks.push({ ritualId: record.id, importance: record.importance, note: record.notes, frequencyOverride: null });
      }
    });
    saveCollection(EVENTS_KEY, events);
    syncCustomRituals();
    closeAtelierModal("ritualEditorModal");
    renderAll();
    showToast(existingBuiltIn ? "Ritual updated. Its history remains intact." : "Custom ritual saved. The life-command system noticed.");
  });
  document.getElementById("eventArchiveForm").addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const item = eventById(data.get("eventId"));
    if (!item) return;
    item.finalReadiness = eventReadiness(item);
    item.status = "archived";
    item.archivedAt = new Date().toISOString();
    item.postEventReflection = { felt: data.get("felt").trim(), worked: data.get("worked").trim(), repeat: data.get("repeat").trim(), learned: data.get("learned").trim() };
    saveCollection(EVENTS_KEY, events);
    closeAtelierModal("eventArchiveModal");
    initialiseEventSelect();
    eventView = "archived";
    renderAll();
    openEventDetail(item.id);
    showToast("The reveal has been archived.");
  });
}
function initialiseEventSelect() {
  const select = document.getElementById("ritualEditorForm")?.elements.linkedEvent;
  if (select) select.innerHTML = `<option value="">None</option>${events.filter(event => event.status !== "archived").map(event => `<option value="${event.id}">${escapeHTML(event.name)}</option>`).join("")}`;
}

function renderReview() {
  const grid = document.getElementById("reviewGrid");
  if (!grid) return;
  const week = weekStats();
  const categoryCounts = {};
  week.entries.forEach(habit => categoryCounts[habit.category] = (categoryCounts[habit.category] || 0) + 1);
  const ranked = Object.keys(categoryMeta).filter(key => !WORK_CATEGORY_KEYS.has(key)).sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0));
  const best = categoryMeta[ranked[0]].label;
  const neglected = categoryMeta[ranked[ranked.length - 1]].label;
  const focus = pinkHabits().find(habit => habit.category === ranked[ranked.length - 1] && !isComplete(habit))?.title || "Protect the streak";
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
  if (!modal) return;
  activeMandatoryModal = modal;
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-locked");
  requestAnimationFrame(() => focusableElements(modal)[0]?.focus());
}
function closeMandatoryModal(modal) {
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  activeMandatoryModal = null;
  document.body.classList.remove("modal-locked");
  releaseLoader();
}
function openOptionalHabitUpdate() {
  const modal = document.getElementById("habitUpdateModal");
  const list = document.getElementById("habitUpdateList");
  const today = parseDate(TODAY_KEY);
  const due = activeHabits().filter(habit => {
    if (isComplete(habit, today)) return false;
    if (habit.frequency === "daily") return true;
    return !!calendarOccurrence(habit, today, "glow-ritual");
  });
  list.innerHTML = due.map(habit => {
    const meta = categoryMeta[habit.category];
    return `<label class="habit-update-option"><input type="checkbox" name="habitUpdate" value="${habit.id}" /><span>${meta.icon}</span><span><strong>${habit.title}</strong><small>${frequencyLabel(habit.frequency)} · ${dueStatus(habit).label}</small></span></label>`;
  }).join("") || `<p class="optional-empty">Everything due is already handled. Miranda has no notes.</p>`;
  modal.hidden = false;
  requestAnimationFrame(() => document.getElementById("habitUpdateClose")?.focus());
}
function closeOptionalHabitUpdate() {
  document.getElementById("habitUpdateModal").hidden = true;
  releaseLoader();
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
    localStorage.removeItem(EVENTS_KEY);
    localStorage.removeItem(CUSTOM_RITUALS_KEY);
    localStorage.removeItem(RITUAL_OVERRIDES_KEY);
    localStorage.removeItem(WORK_STATE_KEY);
    localStorage.removeItem(WORK_TASKS_KEY);
    localStorage.removeItem(WORK_EVENTS_KEY);
    localStorage.removeItem(MODE_MIGRATION_KEY);
    localStorage.removeItem(CALENDAR_ITEMS_KEY);
    localStorage.removeItem(CALENDAR_SCHEDULE_OVERRIDES_KEY);
    localStorage.removeItem(CALENDAR_COMPLETIONS_KEY);
    localStorage.removeItem(CALENDAR_DAY_NOTES_KEY);
    events = [];
    customRituals = [];
    ritualOverrides = {};
    syncCustomRituals();
    initialiseEventSelect();
    state = defaultState();
    workState = defaultWorkState();
    customWorkTasks = [];
    workTasks = [...builtInWorkTasks];
    workEvents = [];
    calendarItems = [];
    calendarScheduleOverrides = {};
    calendarItemCompletions = {};
    calendarDayNotes = {};
    saveWorkState();
    saveCollection(WORK_TASKS_KEY, customWorkTasks);
    saveCollection(WORK_EVENTS_KEY, workEvents);
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

function migrateToTwoModes() {
  if (localStorage.getItem(MODE_MIGRATION_KEY)) return;
  const workIds = new Set([...builtInWorkTasks.map(task => task.id), ...customRituals.filter(isWorkHabit).map(task => task.id)]);
  Object.entries(state.days).forEach(([key, day]) => {
    Object.entries(day.checked || {}).forEach(([id, done]) => {
      if (workIds.has(id) && done) {
        ensureWorkDay(key).checked[id] = true;
        day.checked[id] = false;
      }
    });
  });
  const movedCustom = customRituals.filter(isWorkHabit).map(item => ({ ...item, mode: "work", category: mapLegacyWorkCategory(item.category), description: item.notes || item.why }));
  if (movedCustom.length) {
    customWorkTasks.push(...movedCustom.filter(item => !customWorkTasks.some(existing => existing.id === item.id)));
    customRituals = customRituals.filter(item => !isWorkHabit(item));
    syncCustomRituals();
  }
  const movedEvents = events.filter(event => event.category === "Career moment");
  if (movedEvents.length) {
    workEvents.push(...movedEvents.filter(item => !workEvents.some(existing => existing.id === item.id)));
    events = events.filter(event => event.category !== "Career moment");
    saveCollection(EVENTS_KEY, events);
    saveCollection(WORK_EVENTS_KEY, workEvents);
  }
  workState.totalTicks = Object.values(workState.days).reduce((sum, day) => sum + Object.values(day.checked || {}).filter(Boolean).length, 0);
  recomputeWorkStreak();
  state.totalTicks = historyCount(state);
  workTasks = [...builtInWorkTasks, ...customWorkTasks.filter(task => !task.deleted)];
  saveCollection(WORK_TASKS_KEY, customWorkTasks);
  saveWorkState();
  saveState();
  localStorage.setItem(MODE_MIGRATION_KEY, "complete");
}
function mapLegacyWorkCategory(category) {
  if (category === "career") return "study";
  if (category === "money") return "adminWork";
  if (category === "creativity") return "creativeWork";
  return workCategoryMeta[category] ? category : "creativeWork";
}
function workCompletionKeys(task, date = new Date()) {
  const [start, end] = periodRange(task, date);
  return Object.keys(workState.days).filter(key => workState.days[key]?.checked?.[task.id] && parseDate(key) >= start && parseDate(key) <= end);
}
function isWorkComplete(task, date = new Date()) { return workCompletionKeys(task, date).length > 0; }
function activeWorkTasks() { return workTasks.filter(task => !task.paused); }
function workLevelInfo() {
  let number = 1;
  workLevelThresholds.forEach((min, index) => { if (workState.totalTicks >= min) number = index + 1; });
  return { number, name: workLevels[number - 1], min: workLevelThresholds[number - 1], next: workLevelThresholds[number] ?? Infinity };
}
function toggleWorkTask(id) {
  const task = workTasks.find(item => item.id === id);
  if (!task) return;
  const existing = workCompletionKeys(task);
  if (existing.length) {
    ensureWorkDay(existing[existing.length - 1]).checked[id] = false;
    workState.totalTicks = Math.max(0, workState.totalTicks - 1);
    showToast("Missed, not ruined. Build proof, not panic.");
  } else {
    ensureWorkDay(TODAY_KEY).checked[id] = true;
    workState.totalTicks += 1;
    showToast(workMotivation[workState.totalTicks % workMotivation.length]);
  }
  recomputeWorkStreak();
  saveWorkState();
  renderWorkAll();
}
function workRecommendation(title) {
  const value = title.toLowerCase();
  if (/dissertation|essay|reading|fieldwork|study/.test(value)) return ["study", "daily", "High", "Moves the largest academic obligation forward through consistent, manageable progress."];
  if (/job|application|cv|cover letter|linkedin|interview/.test(value)) return ["jobs", "weekly", "High", "Converts ambition into visible opportunities."];
  if (/portfolio|website|case study|seo/.test(value)) return ["portfolio", "weekly", "High", "Turns your ability into proof that other people can hire."];
  if (/client|brand|logo|strategy|deck/.test(value)) return ["client", "weekly", "High", "Builds evidence of creative problem-solving and commercial taste."];
  if (/ai|coding|web design|marketing|sales/.test(value)) return ["skills", "weekly", "High", "Builds high-income capability that compounds over time."];
  if (/email|calendar|budget|invoice|admin/.test(value)) return ["adminWork", "weekly", "Medium", "Protects the creative life from chaos."];
  return ["creativeWork", "weekly", "Medium", "Turns a useful intention into visible proof."];
}
function renderWorkAll() {
  const renderers = [renderWorkBoard, renderWorkSummary, renderWorkTracker, renderWorkEvents, renderWorkReview];
  renderers.forEach(renderer => {
    try { renderer(); }
    catch (error) { console.error(`Work renderer failed: ${renderer.name}`, error); }
  });
}
function workTrackerDates() {
  if (workTrackerView === "month") {
    const start = new Date(workTrackerDate.getFullYear(), workTrackerDate.getMonth(), 1);
    return Array.from({ length: new Date(workTrackerDate.getFullYear(), workTrackerDate.getMonth() + 1, 0).getDate() }, (_, index) => addDays(start, index));
  }
  const start = startOfWeek(workTrackerDate);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}
function renderWorkTracker() {
  const tables = document.getElementById("workTrackerTables");
  const archive = document.getElementById("workArchiveWindow");
  if (!tables || !archive) return;
  document.querySelectorAll(".work-tracker-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.workView === workTrackerView));
  archive.hidden = workTrackerView !== "archive";
  tables.hidden = workTrackerView === "archive";
  if (workTrackerView === "archive") {
    const months = [...new Set(Object.keys(workState.days).map(key => key.slice(0, 7)))].sort().reverse();
    document.getElementById("workArchiveMonths").innerHTML = months.length ? months.map(month => {
      const count = Object.entries(workState.days).filter(([key]) => key.startsWith(month)).reduce((sum, [, day]) => sum + Object.values(day.checked || {}).filter(Boolean).length, 0);
      return `<button class="archive-month" data-work-month="${month}"><strong>${new Date(`${month}-01T00:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</strong><span>${count} tasks filed</span></button>`;
    }).join("") : `<p class="optional-empty">Complete a work task and the blue archive will begin.</p>`;
    document.querySelectorAll("[data-work-month]").forEach(button => button.addEventListener("click", () => {
      workTrackerDate = parseDate(`${button.dataset.workMonth}-01`);
      workTrackerView = "month";
      renderWorkTracker();
    }));
    document.getElementById("workTrackerPeriod").textContent = "Blue archive";
    return;
  }
  const dates = workTrackerDates();
  document.getElementById("workTrackerPeriod").textContent = workTrackerView === "week"
    ? `${dates[0].toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${dates[6].toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
    : workTrackerDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  tables.innerHTML = Object.entries(workCategoryMeta).map(([category, meta]) => {
    const tasks = workTasks.filter(task => task.category === category && !task.deleted);
    if (!tasks.length) return "";
    return `<section class="tracker-block"><div class="tracker-block-head"><h3>${meta.icon} ${meta.label}</h3><span class="mono">${tasks.length} tasks</span></div><div class="tracker-scroll"><table class="habit-table"><thead><tr><th class="habit-name">Work task</th>${dates.map(date => `<th>${date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })}</th>`).join("")}</tr></thead><tbody>${tasks.map(task => `<tr><th class="habit-name">${escapeHTML(task.title)}<small>${frequencyLabel(task.frequency)}</small></th>${dates.map(date => `<td><button class="tracker-cell ${workState.days[dateKey(date)]?.checked?.[task.id] ? "done" : ""} ${dateKey(date) === TODAY_KEY ? "today" : ""}" data-work-cell="${task.id}" data-work-date="${dateKey(date)}">✓</button></td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
  }).join("");
  tables.querySelectorAll("[data-work-cell]").forEach(button => button.addEventListener("click", () => toggleWorkTaskOnDate(button.dataset.workCell, button.dataset.workDate)));
}
function toggleWorkTaskOnDate(id, key) {
  const day = ensureWorkDay(key);
  day.checked[id] = !day.checked[id];
  workState.totalTicks = Object.values(workState.days).reduce((sum, item) => sum + Object.values(item.checked || {}).filter(Boolean).length, 0);
  recomputeWorkStreak();
  saveWorkState();
  renderWorkAll();
}
function moveWorkTracker(amount) {
  workTrackerDate = workTrackerView === "month" ? new Date(workTrackerDate.getFullYear(), workTrackerDate.getMonth() + amount, 1) : addDays(workTrackerDate, amount * 7);
  renderWorkTracker();
}
function renderWorkBoard() {
  const board = document.getElementById("workTaskBoard");
  if (!board) return;
  const visible = (workFilter === "all" ? workTasks : activeWorkTasks()).filter(task => workFilter === "all" || (workFilter === "today" && (task.frequency === "daily" || !isWorkComplete(task))) || (workFilter === "completed" && isWorkComplete(task)) || task.frequency === workFilter);
  document.querySelectorAll(".work-task-filter").forEach(button => button.classList.toggle("active", button.dataset.workFilter === workFilter));
  board.innerHTML = Object.entries(workCategoryMeta).map(([key, meta]) => {
    const tasks = visible.filter(task => task.category === key);
    if (!tasks.length) return "";
    return `<section class="life-category"><div class="life-category-head"><span class="category-symbol">${meta.icon}</span><div><p class="section-label">Blue archive</p><h3>${meta.label}</h3></div><span class="mono">${tasks.length} tasks</span></div><div class="command-card-grid">${tasks.map(task => `<article class="command-habit work-command ${isWorkComplete(task) ? "done" : ""} ${task.paused ? "is-paused" : ""}"><div class="command-habit-top"><span class="frequency-badge frequency-${task.frequency}">${frequencyLabel(task.frequency)}</span><span class="due-status">${task.paused ? "Paused." : isWorkComplete(task) ? "Already filed." : task.deadline ? `Due ${task.deadline}` : "Ready when you are."}</span></div><div class="command-habit-title"><span>${meta.icon}</span><div><p>${meta.label}</p><h4>${escapeHTML(task.title)}</h4></div></div><p class="command-habit-copy">${escapeHTML(task.why || task.description || "")}</p>${task.duration ? `<p class="mono">Estimate · ${escapeHTML(task.duration)}</p>` : ""}${task.custom ? `<div class="custom-ritual-actions"><button data-edit-work-task="${task.id}">Edit</button><button data-pause-work-task="${task.id}">${task.paused ? "Resume" : "Pause"}</button><button data-delete-work-task="${task.id}">Delete</button></div>` : ""}<button class="ritual-check" data-work-task-id="${task.id}" ${task.paused ? "disabled" : ""}>${isWorkComplete(task) ? "✓ Proof filed" : "Complete task"}</button></article>`).join("")}</div></section>`;
  }).join("") || `<div class="empty-rituals"><h3>The desk is clear.</h3><p>Tiny task. Large consequence.</p></div>`;
  board.querySelectorAll("[data-work-task-id]").forEach(button => button.addEventListener("click", () => toggleWorkTask(button.dataset.workTaskId)));
  board.querySelectorAll("[data-edit-work-task]").forEach(button => button.addEventListener("click", () => openWorkTaskEditor(button.dataset.editWorkTask)));
  board.querySelectorAll("[data-pause-work-task]").forEach(button => button.addEventListener("click", () => updateCustomWorkTask(button.dataset.pauseWorkTask, "pause")));
  board.querySelectorAll("[data-delete-work-task]").forEach(button => button.addEventListener("click", () => updateCustomWorkTask(button.dataset.deleteWorkTask, "delete")));
}
function renderWorkSummary() {
  const active = activeWorkTasks();
  const completed = active.filter(isWorkComplete).length;
  const percentage = Math.round(completed / Math.max(1, active.length) * 100);
  const info = workLevelInfo();
  const next = workEvents.filter(event => event.status !== "archived" && daysUntil(event.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
  document.getElementById("workDoneCount").textContent = `${completed} / ${active.length} tasks`;
  document.getElementById("workProgressPercent").textContent = `${percentage}%`;
  document.getElementById("workProgressPie").style.setProperty("--p", percentage);
  document.getElementById("workLevelText").textContent = `Level ${info.number} · ${info.name}`;
  document.getElementById("workLevelBarFill").style.width = `${info.next === Infinity ? 100 : Math.round((workState.totalTicks - info.min) / (info.next - info.min) * 100)}%`;
  document.getElementById("workCommandSummary").innerHTML = [["Tasks due", active.length - completed], ["Completed", completed], ["Work streak", `${workState.streak || 0} days`], ["Work level", `L${info.number} · ${info.name}`], ["Next deadline", next?.name || "No deadline filed"], ["Total proof", workState.totalTicks]].map(([label, value]) => `<article class="summary-tile"><span>${label}</span><strong>${escapeHTML(String(value))}</strong></article>`).join("");
  document.getElementById("workLevelCard").innerHTML = `<p class="section-label">Current work rank</p><h3>Level ${info.number} · ${info.name}</h3><p>${workState.totalTicks} completed tasks archived. Next rank: ${workLevels[info.number] || "Complete blue archive"}.</p>`;
}
function workEventReadiness(event) {
  const links = [...(event.ritualLinks || [])];
  workTasks.filter(task => task.linkedEvent === event.id && !links.some(link => link.ritualId === task.id)).forEach(task => links.push({ ritualId: task.id, importance: task.importance }));
  const total = links.reduce((sum, link) => sum + importanceWeight(link.importance), 0);
  const complete = links.reduce((sum, link) => {
    const task = workTasks.find(item => item.id === link.ritualId);
    return sum + (task && isWorkComplete(task) ? importanceWeight(link.importance) : 0);
  }, 0);
  return total ? Math.round(complete / total * 100) : 0;
}
function renderWorkEvents() {
  const grid = document.getElementById("workEventGrid");
  const nextCard = document.getElementById("nextWorkDeadline");
  if (!grid || !nextCard) return;
  const active = workEvents.filter(event => event.status !== "archived").sort((a, b) => a.date.localeCompare(b.date));
  const archived = workEvents.filter(event => event.status === "archived").sort((a, b) => b.date.localeCompare(a.date));
  const next = active.find(event => daysUntil(event.date) >= 0);
  nextCard.innerHTML = next ? `<div><p class="section-label">Next deadline</p><h3>${escapeHTML(next.name)}</h3><p>${daysUntil(next.date) === 0 ? "Deadline day has arrived." : `${daysUntil(next.date)} days remaining.`}</p></div><strong>${workEventReadiness(next)}% ready</strong>` : `<div><p class="section-label">Next deadline</p><h3>File the future.</h3><p>No work deadline exists yet.</p></div>`;
  grid.innerHTML = active.length || archived.length ? active.map(event => `<article class="event-card ${daysUntil(event.date) <= 6 ? "urgency-near" : ""}"><div class="event-card-top"><span>${escapeHTML(event.category)}</span><span>${event.date}</span></div><h3>${escapeHTML(event.name)}</h3><p class="event-countdown">${daysUntil(event.date) < 0 ? "This deadline has passed." : `${daysUntil(event.date)} days remaining.`}</p><div class="event-readiness-bar"><div style="width:${workEventReadiness(event)}%"></div></div><div class="event-card-bottom"><span>Readiness ${workEventReadiness(event)}%</span><button data-open-work-event="${event.id}">Open</button></div></article>`).join("") + archived.map(event => `<article class="event-card work-event-archived"><div class="event-card-top"><span>Blue archive</span><span>${event.date}</span></div><h3>${escapeHTML(event.name)}</h3><p class="event-countdown">Deadline witnessed and filed.</p><div class="event-card-bottom"><span>Archived</span><button data-open-work-event="${event.id}">Reflect</button></div></article>`).join("") : `<div class="event-empty"><span>□</span><h3>No deadlines yet.</h3><p>Every future needs a filing system.</p></div>`;
  grid.querySelectorAll("[data-open-work-event]").forEach(button => button.addEventListener("click", () => openWorkEventDetail(button.dataset.openWorkEvent)));
  grid.querySelectorAll("[data-archive-work-event]").forEach(button => button.addEventListener("click", () => {
    const item = workEvents.find(event => event.id === button.dataset.archiveWorkEvent);
    if (item) { item.status = "archived"; item.archivedAt = new Date().toISOString(); saveCollection(WORK_EVENTS_KEY, workEvents); renderWorkEvents(); }
  }));
}
function openWorkEventDetail(id) {
  const event = workEvents.find(item => item.id === id);
  const detail = document.getElementById("workEventDetail");
  if (!event || !detail) return;
  const linked = (event.ritualLinks || []).map(link => workTasks.find(task => task.id === link.ritualId)).filter(Boolean);
  detail.hidden = false;
  detail.innerHTML = `<div class="event-detail-hero"><button class="event-detail-close" data-close-work-detail>← Back to deadlines</button><p class="section-label">${escapeHTML(event.category)}</p><h2>${escapeHTML(event.name)}</h2><p class="event-detail-countdown">${event.status === "archived" ? "Deadline witnessed and filed." : daysUntil(event.date) === 0 ? "Deadline day has arrived." : `${daysUntil(event.date)} days remaining.`}</p><blockquote>${escapeHTML(event.motivation)}</blockquote><div class="event-detail-actions"><button class="secondary-btn" data-edit-work-event="${event.id}">Edit deadline</button>${event.status !== "archived" ? `<button class="primary-btn" data-archive-work-event="${event.id}">Archive deadline</button>` : ""}</div></div><div class="event-metrics"><article><span>Readiness</span><strong>${workEventReadiness(event)}%</strong><p>Preparation becomes opportunity.</p></article><article><span>Required tasks</span><strong>${linked.length}</strong><p>${linked.filter(isWorkComplete).length} already filed.</p></article><article><span>Event date</span><strong>${event.date}</strong><p>Your ambition has a due date.</p></article></div><div class="event-story"><article><p class="section-label">Goal</p><h3>${escapeHTML(event.goal)}</h3></article><article><p class="section-label">Private notes</p><h3>${escapeHTML(event.notes || "No notes filed yet.")}</h3></article></div><div class="event-linked-list"><h3>Required proof</h3>${linked.map(task => `<article class="${isWorkComplete(task) ? "done" : ""}"><span>${workCategoryMeta[task.category]?.icon || "□"}</span><div><strong>${escapeHTML(task.title)}</strong><p>${escapeHTML(task.why || "")}</p></div><em>${isWorkComplete(task) ? "Filed" : "Waiting"}</em></article>`).join("") || "<p>No required tasks selected yet.</p>"}</div>`;
  detail.querySelector("[data-close-work-detail]").addEventListener("click", () => detail.hidden = true);
  detail.querySelector("[data-edit-work-event]")?.addEventListener("click", () => openWorkEventEditor(id));
  detail.querySelector("[data-archive-work-event]")?.addEventListener("click", () => { event.status = "archived"; event.archivedAt = new Date().toISOString(); saveCollection(WORK_EVENTS_KEY, workEvents); renderWorkEvents(); openWorkEventDetail(id); });
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}
function renderWorkReview() {
  const active = activeWorkTasks();
  const completed = active.filter(isWorkComplete);
  const counts = {};
  completed.forEach(task => counts[task.category] = (counts[task.category] || 0) + 1);
  const best = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  document.getElementById("workReviewGrid").innerHTML = [["Today’s completion", `${Math.round(completed.length / Math.max(1, active.length) * 100)}%`, "Build proof, not panic."], ["Strongest file", best ? workCategoryMeta[best].label : "Awaiting first task", "The blue archive remembers."], ["Total completed", workState.totalTicks, "Tiny task. Large consequence."], ["Command note", workMotivation[workState.totalTicks % workMotivation.length], "Preparation becomes opportunity."]].map(([label, value, copy]) => `<article class="review-card"><p class="section-label">${label}</p><h3>${value}</h3><p>${copy}</p></article>`).join("");
}
function prepareModePieces(page, phase) {
  const selectors = [
    ".hero-copy > *", ".hero-pie-card", ".hero-bottom-note",
    ".section-head > *", ".summary-tile", ".work-level-card", ".score-card",
    ".habit-filters", ".life-category-head", ".command-habit",
    ".tracker-toolbar", ".tracker-block", ".next-dday", ".event-card", ".review-card",
    ".calendar-hero > *", ".calendar-summary > *", ".calendar-filter-rail", ".calendar-sidebar", ".calendar-main-content"
  ].join(",");
  const pieces = [...page.querySelectorAll(selectors)].filter(element => {
    const rect = element.getBoundingClientRect();
    return rect.bottom > -120 && rect.top < innerHeight + 180;
  }).slice(0, 42);
  pieces.forEach((piece, index) => {
    const direction = index % 2 ? 1 : -1;
    const lane = (index % 7) - 3;
    piece.classList.add("mode-piece", phase);
    piece.style.setProperty("--piece-index", index);
    piece.style.setProperty("--scatter-x", `${direction * (24 + (index % 4) * 16)}px`);
    piece.style.setProperty("--scatter-y", `${lane * 15 + 34 + (index % 3) * 14}px`);
    piece.style.setProperty("--scatter-r", `${direction * (.25 + (index % 4) * .18)}deg`);
    piece.style.setProperty("--float-scale", `${.96 + (index % 3) * .01}`);
  });
  return pieces;
}
function clearModePieces(pieces) {
  pieces.forEach(piece => {
    piece.classList.remove("mode-piece", "mode-piece--leaving", "mode-piece--entering");
    piece.style.removeProperty("--piece-index");
    piece.style.removeProperty("--scatter-x");
    piece.style.removeProperty("--scatter-y");
    piece.style.removeProperty("--scatter-r");
    piece.style.removeProperty("--float-scale");
  });
}
function switchMode(mode) {
  if (mode === currentMode || document.body.classList.contains("mode-transitioning")) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pages = { glow: "glowMode", work: "workMode", calendar: "calendarMode" };
  const outgoing = document.getElementById(pages[currentMode]);
  const incoming = document.getElementById(pages[mode]);
  const leavingPieces = reduced ? [] : prepareModePieces(outgoing, "mode-piece--leaving");
  document.body.classList.add("mode-transitioning", "mode-deconstructing", `transition-to-${mode}`);
  setTimeout(() => {
    try {
      currentMode = mode;
      document.body.classList.toggle("mode-glow", mode === "glow");
      document.body.classList.toggle("mode-work", mode === "work");
      document.body.classList.toggle("mode-calendar", mode === "calendar");
      Object.entries(pages).forEach(([key, id]) => document.getElementById(id).hidden = key !== mode);
      document.querySelector(".glow-nav").hidden = mode !== "glow";
      document.querySelector(".work-nav").hidden = mode !== "work";
      document.querySelectorAll(".mode-switch").forEach(button => button.classList.toggle("active", button.dataset.mode === mode));
      document.querySelector(".brand em").textContent = mode === "glow" ? "Glow-Up" : mode === "work" ? "Work Atelier" : "Archive Calendar";
      document.getElementById("streakHeader").textContent = mode === "glow" ? `Streak ${state.streak || 0}` : mode === "work" ? `Work ${workState.totalTicks} filed` : "Whole life view";
      if (mode === "work") renderWorkAll();
      else if (mode === "calendar") renderCalendarView();
      else renderAll();
      forcePageTop();
      clearModePieces(leavingPieces);
      document.body.classList.remove("mode-deconstructing");
      document.body.classList.add("mode-reconstructing");
      const enteringPieces = reduced ? [] : prepareModePieces(incoming, "mode-piece--entering");
      requestAnimationFrame(() => requestAnimationFrame(() => incoming.classList.add("mode-page--assembled")));
      setTimeout(() => {
        clearModePieces(enteringPieces);
        incoming.classList.remove("mode-page--assembled");
      }, reduced ? 10 : 1150);
    } finally {
      setTimeout(() => document.body.classList.remove("mode-transitioning", "mode-reconstructing", "transition-to-work", "transition-to-glow"), reduced ? 30 : 1250);
    }
  }, reduced ? 20 : 720);
}
function initialiseWorkMode() {
  document.body.classList.add("mode-glow");
  document.querySelectorAll(".mode-switch").forEach(button => button.addEventListener("click", () => switchMode(button.dataset.mode)));
  document.querySelectorAll(".work-task-filter").forEach(button => button.addEventListener("click", () => { workFilter = button.dataset.workFilter; renderWorkBoard(); }));
  document.querySelectorAll(".work-tracker-tab").forEach(button => button.addEventListener("click", () => { workTrackerView = button.dataset.workView; renderWorkTracker(); }));
  document.getElementById("workTrackerPrev")?.addEventListener("click", () => moveWorkTracker(-1));
  document.getElementById("workTrackerNext")?.addEventListener("click", () => moveWorkTracker(1));
  document.getElementById("workTrackerToday")?.addEventListener("click", () => { workTrackerDate = new Date(); workTrackerView = "week"; renderWorkTracker(); });
  document.getElementById("workBoostBtn")?.addEventListener("click", () => showToast(workMotivation[Math.floor(Math.random() * workMotivation.length)]));
  const taskForm = document.getElementById("workTaskEditorForm");
  const eventForm = document.getElementById("workEventEditorForm");
  document.getElementById("workTaskCategory").innerHTML = Object.entries(workCategoryMeta).map(([key, meta]) => `<option value="${key}">${meta.label}</option>`).join("");
  refreshWorkEventSelect();
  document.getElementById("openWorkTaskCreator").addEventListener("click", () => openWorkTaskEditor());
  document.getElementById("openWorkEventCreator").addEventListener("click", () => openWorkEventEditor());
  document.querySelectorAll("[data-close-work-modal]").forEach(button => button.addEventListener("click", () => document.getElementById(button.dataset.closeWorkModal).hidden = true));
  taskForm.elements.title.addEventListener("input", () => {
    const [category, frequency, importance, why] = workRecommendation(taskForm.elements.title.value);
    document.getElementById("workTaskRecommendation").innerHTML = `Suggested category: <strong>${workCategoryMeta[category].label}</strong>. I recommend a <strong>${frequencyLabel(frequency)}</strong>. ${why}`;
    taskForm.dataset.suggestion = JSON.stringify({ category, frequency, importance, why });
  });
  taskForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(taskForm);
    const suggestion = JSON.parse(taskForm.dataset.suggestion || '{"category":"creativeWork","frequency":"weekly","importance":"Medium","why":"Turns intention into proof."}');
    const existing = customWorkTasks.find(task => task.id === data.get("taskId"));
    const record = { ...(existing || {}), id: existing?.id || `work_${Date.now()}`, title: data.get("title").trim(), category: data.get("category") || suggestion.category, frequency: data.get("frequency") || suggestion.frequency, importance: data.get("importance") || suggestion.importance, deadline: data.get("deadline"), duration: data.get("duration").trim(), linkedEvent: data.get("linkedEvent"), why: data.get("why").trim() || suggestion.why, notes: data.get("notes").trim(), mode: "work", custom: true };
    if (existing) customWorkTasks[customWorkTasks.findIndex(task => task.id === existing.id)] = record; else customWorkTasks.push(record);
    workTasks = [...builtInWorkTasks, ...customWorkTasks.filter(task => !task.deleted)]; saveCollection(WORK_TASKS_KEY, customWorkTasks); document.getElementById("workTaskEditorModal").hidden = true; renderWorkAll(); showToast("Work task filed. The future has receipts.");
  });
  eventForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(eventForm);
    const existing = workEvents.find(item => item.id === data.get("eventId"));
    const ritualLinks = [...eventForm.querySelectorAll("[name='workEventTask']:checked")].map(input => ({ ritualId: input.value, importance: workTasks.find(task => task.id === input.value)?.importance || "High" }));
    const record = { ...(existing || {}), id: existing?.id || `work_event_${Date.now()}`, name: data.get("name").trim(), date: data.get("date"), category: data.get("category"), goal: data.get("goal").trim(), motivation: data.get("motivation").trim(), notes: data.get("notes").trim(), ritualLinks, status: existing?.status || "active", createdAt: existing?.createdAt || new Date().toISOString() };
    if (existing) workEvents[workEvents.findIndex(item => item.id === existing.id)] = record; else workEvents.push(record);
    saveCollection(WORK_EVENTS_KEY, workEvents); refreshWorkEventSelect(); document.getElementById("workEventEditorModal").hidden = true; renderWorkEvents(); showToast("Deadline filed. Preparation becomes opportunity.");
  });
}
function openWorkTaskEditor(id = "") {
  const form = document.getElementById("workTaskEditorForm");
  form.reset();
  const task = customWorkTasks.find(item => item.id === id);
  if (task) Object.entries(task).forEach(([key, value]) => { if (form.elements[key] && value != null) form.elements[key].value = value; });
  form.elements.taskId.value = task?.id || "";
  document.getElementById("workTaskEditorTitle").textContent = task ? "Edit Work Task." : "Add a Work Task.";
  document.getElementById("workTaskEditorModal").hidden = false;
}
function updateCustomWorkTask(id, action) {
  const task = customWorkTasks.find(item => item.id === id);
  if (!task) return;
  if (action === "delete") task.deleted = true;
  else task.paused = !task.paused;
  workTasks = [...builtInWorkTasks, ...customWorkTasks.filter(item => !item.deleted)];
  saveCollection(WORK_TASKS_KEY, customWorkTasks);
  renderWorkAll();
}
function refreshWorkEventSelect() {
  const select = document.getElementById("workTaskEditorForm")?.elements.linkedEvent;
  if (select) select.innerHTML = `<option value="">None</option>${workEvents.filter(event => event.status !== "archived").map(event => `<option value="${event.id}">${escapeHTML(event.name)}</option>`).join("")}`;
}
function openWorkEventEditor(id = "") {
  const form = document.getElementById("workEventEditorForm");
  const event = workEvents.find(item => item.id === id);
  form.reset();
  if (event) Object.entries(event).forEach(([key, value]) => { if (form.elements[key] && value != null) form.elements[key].value = value; });
  form.elements.eventId.value = event?.id || "";
  document.getElementById("workEventEditorTitle").textContent = event ? "Edit Deadline." : "Create a Deadline.";
  renderWorkEventTaskPicker(new Set((event?.ritualLinks || []).map(link => link.ritualId)));
  document.getElementById("workEventEditorModal").hidden = false;
}
function renderWorkEventTaskPicker(selected = new Set()) {
  const picker = document.getElementById("workEventTaskPicker");
  picker.innerHTML = activeWorkTasks().map(task => `<label class="habit-update-option"><input type="checkbox" name="workEventTask" value="${task.id}" ${selected.has(task.id) ? "checked" : ""}/><span>${workCategoryMeta[task.category]?.icon || "□"}</span><span><strong>${escapeHTML(task.title)}</strong><small>${frequencyLabel(task.frequency)} · ${task.importance || "High"} importance</small></span></label>`).join("");
}
function renderAll() {
  renderHabitBoard();
  renderSummary();
  renderProgress();
  renderTracker();
  renderReview();
  renderDailyArchive();
  renderEvents();
  if (currentMode === "work") renderWorkAll();
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
let loaderReleased = false;
function releaseLoader() {
  if (loaderReleased) return;
  loaderReleased = true;
  loaderLines.forEach(line => line.classList.remove("active"));
  loaderMark?.classList.remove("active");
  loaderLines[0]?.classList.add("active");
  setTimeout(() => { loaderLines[0]?.classList.remove("active"); loaderLines[1]?.classList.add("active"); }, 900);
  setTimeout(() => { loaderLines[1]?.classList.remove("active"); loaderMark?.classList.add("active"); }, 1850);
  setTimeout(() => loader?.classList.add("hide"), 2850);
}

// Safety net: if a non-critical startup feature fails before the check-in system
// can show, do not let the decorative loader permanently block the website.
setTimeout(() => {
  const visibleMandatoryModal = document.querySelector(".checkin-modal:not([hidden])");
  if (!visibleMandatoryModal && loader && !loader.classList.contains("hide")) {
    loader.classList.add("hide");
  }
}, 6500);
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

// Calendar system initialization
let calendarItems = loadCollection(CALENDAR_ITEMS_KEY);
let calendarScheduleOverrides = loadRecords(CALENDAR_SCHEDULE_OVERRIDES_KEY);
let calendarItemCompletions = loadRecords(CALENDAR_COMPLETIONS_KEY);
let calendarDayNotes = loadRecords(CALENDAR_DAY_NOTES_KEY);
let calendarCurrentView = "week";
let calendarCurrentDate = new Date();
let calendarFilter = "all";
let visibleCategories = {
  glow: new Set(["body", "waist", "glutes", "posture", "hair", "beauty", "food", "water", "sleep", "soul", "social"]),
  work: new Set(["study", "jobs", "portfolio", "creativeWork", "client", "brand", "adminWork", "skills", "networking"])
};

function calendarOccurrence(task, date, sourceType) {
  if (!task || task.frequency === "daily" || task.calendarVisible === false) return null;
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const recurringSchedule = calendarScheduleOverrides[`${sourceType}:${task.id}:schedule`] || {};
  const preferredDay = recurringSchedule.preferredDay ?? task.preferredDay ?? 0;
  const preferredDayOfMonth = recurringSchedule.preferredDayOfMonth ?? task.preferredDayOfMonth ?? 1;
  const movedOverride = Object.entries(calendarScheduleOverrides).find(([key, override]) => key.startsWith(`${sourceType}:${task.id}:`) && override?.date === dateKey(target) && override.calendarVisible !== false);
  if (movedOverride) {
    return { occurrenceKey: movedOverride[0].split(":").pop(), overrideKey: movedOverride[0], time: movedOverride[1].time || task.scheduledTime || null };
  }
  let occurrenceKey = "";
  let scheduledDate = null;
  if (task.frequency === "weekly") {
    const start = startOfWeek(target);
    occurrenceKey = dateKey(start);
    scheduledDate = addDays(start, Number(preferredDay));
  } else if (task.frequency === "biweekly" || task.frequency === "custom") {
    const [start] = periodRange(task, target);
    occurrenceKey = dateKey(start);
    scheduledDate = addDays(start, Number(preferredDay));
  } else if (task.frequency === "monthly") {
    const start = new Date(target.getFullYear(), target.getMonth(), 1);
    occurrenceKey = dateKey(start);
    const day = Math.min(Number(preferredDayOfMonth), new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate());
    scheduledDate = new Date(target.getFullYear(), target.getMonth(), day);
  } else if (task.frequency === "one-time") {
    const raw = task.deadline || task.startDate || (task.createdAt ? dateKey(new Date(task.createdAt)) : "");
    if (!raw) return null;
    occurrenceKey = raw;
    scheduledDate = parseDate(raw);
  } else return null;
  const overrideKey = `${sourceType}:${task.id}:${occurrenceKey}`;
  const override = calendarScheduleOverrides[overrideKey];
  if (override?.calendarVisible === false) return null;
  const finalDate = override?.date ? parseDate(override.date) : scheduledDate;
  if (dateKey(finalDate) !== dateKey(target)) return null;
  return { occurrenceKey, overrideKey, time: override?.time || task.scheduledTime || null };
}
function passesCalendarFilter(item) {
  if (calendarFilter === "all") return true;
  if (calendarFilter === "glow") return item.mode === "glow";
  if (calendarFilter === "work") return item.mode === "work";
  if (calendarFilter === "events") return item.sourceType === "glow-event";
  if (calendarFilter === "deadlines") return item.sourceType === "work-event";
  return calendarFilter === "rituals" && ["glow-ritual", "work-task"].includes(item.sourceType);
}
function getAllCalendarItems(date = new Date()) {
  const items = [];
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  activeHabits().forEach(habit => {
    if (!visibleCategories.glow.has(habit.category)) return;
    const occurrence = calendarOccurrence(habit, today, "glow-ritual");
    if (occurrence) {
      items.push({
        id: `glow-ritual-${habit.id}-${occurrence.occurrenceKey}`,
        sourceId: habit.id,
        sourceType: "glow-ritual",
        occurrenceKey: occurrence.occurrenceKey,
        title: habit.title,
        category: habit.category,
        date: dateKey(today),
        time: occurrence.time,
        type: "ritual",
        mode: "glow",
        icon: categoryMeta[habit.category]?.icon || "♡",
        isCompleted: isComplete(habit, today),
        frequency: habit.frequency,
        description: habit.description
      });
    }
  });

  (workTasks || []).forEach(task => {
    if (!visibleCategories.work.has(task.category)) return;
    const occurrence = calendarOccurrence(task, today, "work-task");
    if (occurrence) {
      items.push({
        id: `work-task-${task.id}-${occurrence.occurrenceKey}`,
        sourceId: task.id,
        sourceType: "work-task",
        occurrenceKey: occurrence.occurrenceKey,
        title: task.title,
        category: task.category,
        date: dateKey(today),
        time: occurrence.time,
        type: "task",
        mode: "work",
        icon: workCategoryMeta[task.category]?.icon || "§",
        isCompleted: workState.days[dateKey(today)]?.checked?.[task.id] || false,
        frequency: task.frequency,
        description: task.why
      });
    }
  });

  (events || []).forEach(event => {
    if (event.status !== "archived" && event.date === dateKey(today)) {
      items.push({
        id: `glow-event-${event.id}`,
        sourceId: event.id,
        sourceType: "glow-event",
        title: event.name,
        category: event.category,
        date: dateKey(today),
        time: null,
        type: "dday",
        mode: "glow",
        icon: "✦",
        countdown: daysUntil(event.date),
        isCompleted: false,
        readiness: eventReadiness(event)
      });
    }
  });

  (workEvents || []).forEach(event => {
    if (event.status !== "archived" && event.date === dateKey(today)) {
      items.push({
        id: `work-event-${event.id}`,
        sourceId: event.id,
        sourceType: "work-event",
        title: event.name,
        category: event.category,
        date: dateKey(today),
        time: null,
        type: "deadline",
        mode: "work",
        icon: "◆",
        countdown: daysUntil(event.date),
        isCompleted: false
      });
    }
  });

  (calendarItems || []).forEach(item => {
    const start = item.date ? parseDate(item.date) : null;
    if (!start || item.recurrence === "daily") return;
    const elapsed = Math.floor((today - start) / 86400000);
    const occurs = item.recurrence === "weekly" ? elapsed >= 0 && elapsed % 7 === 0
      : item.recurrence === "biweekly" ? elapsed >= 0 && elapsed % 14 === 0
      : item.recurrence === "monthly" ? today >= start && today.getDate() === start.getDate()
      : item.date === dateKey(today);
    if (occurs) {
      items.push({
        id: `calendar-${item.id}`,
        sourceId: item.id,
        sourceType: "calendar-item",
        title: item.title,
        category: item.mode,
        date: item.date,
        time: item.time || null,
        type: item.type,
        mode: item.mode,
        icon: "☾",
        importance: item.importance,
        isCompleted: calendarItemCompletions[dateKey(today)]?.[item.id] || false,
        notes: item.notes
      });
    }
  });

  return items.filter(passesCalendarFilter).sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
}

function renderCalendarView() {
  const container = document.getElementById("calendarViewContainer");
  if (!container) return;
  
  if (calendarCurrentView === "month") {
    renderCalendarMonth(container);
  } else if (calendarCurrentView === "week") {
    renderCalendarWeek(container);
  } else if (calendarCurrentView === "day") {
    renderCalendarDay(container);
  }
  updateCalendarPeriodLabel();
  renderCalendarSummary();
}
function calendarItemMarkup(item, compact = false) {
  const eventBadge = item.countdown === 0 ? "today" : item.countdown > 0 ? `${item.countdown} days` : "passed";
  const badge = item.sourceType === "glow-event" ? `D-Day · ${eventBadge}` : item.sourceType === "work-event" ? `Deadline · ${eventBadge}` : item.frequency ? frequencyLabel(item.frequency) : item.type;
  const compactMeta = ["glow-event", "work-event"].includes(item.sourceType) ? `<small>${escapeHTML(String(badge))}</small>` : "";
  return `<button class="calendar-item calendar-item--${item.sourceType} ${item.mode} ${item.isCompleted ? "completed" : ""}" data-calendar-item-id="${item.id}" data-calendar-date="${item.date}" draggable="true" type="button"><span class="item-icon">${item.icon}</span><span class="item-content"><strong>${escapeHTML(item.title)}</strong>${compact ? compactMeta : `<small>${item.time || "Anytime"} · ${escapeHTML(String(badge || ""))}</small>`}</span></button>`;
}
function renderCalendarSummary() {
  const summary = document.getElementById("calendarSummary");
  if (!summary) return;
  const todayItems = getAllCalendarItems(new Date());
  const weekStart = startOfWeek(new Date());
  const weekItems = Array.from({ length: 7 }, (_, index) => getAllCalendarItems(addDays(weekStart, index))).flat();
  const nextGlow = events.filter(event => event.status !== "archived" && daysUntil(event.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
  const nextWork = workEvents.filter(event => event.status !== "archived" && daysUntil(event.date) >= 0).sort((a, b) => a.date.localeCompare(b.date))[0];
  const cards = [
    ["Scheduled today", todayItems.length],
    ["This week’s deadlines", weekItems.filter(item => item.sourceType === "work-event").length],
    ["Next D-Day", nextGlow?.name || "Nothing filed"],
    ["Next work deadline", nextWork?.name || "Nothing filed"],
    ["Completed today", todayItems.filter(item => item.isCompleted).length],
    ["Open rituals & tasks", todayItems.filter(item => !item.isCompleted && ["glow-ritual", "work-task"].includes(item.sourceType)).length]
  ];
  summary.innerHTML = cards.map(([label, value]) => `<article class="summary-tile"><span>${label}</span><strong>${escapeHTML(String(value))}</strong></article>`).join("");
}

function renderCalendarDay(container) {
  const date = new Date(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth(), calendarCurrentDate.getDate());
  const items = getAllCalendarItems(date);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  
  const timeSlots = {
    "Morning": [],
    "Midday": [],
    "Afternoon": [],
    "Evening": [],
    "Night": [],
    "Anytime": []
  };

  items.forEach(item => {
    if (!item.time) {
      timeSlots["Anytime"].push(item);
    } else {
      const hour = parseInt(item.time.split(":")[0]);
      if (hour < 12) timeSlots["Morning"].push(item);
      else if (hour < 14) timeSlots["Midday"].push(item);
      else if (hour < 17) timeSlots["Afternoon"].push(item);
      else if (hour < 20) timeSlots["Evening"].push(item);
      else timeSlots["Night"].push(item);
    }
  });

  let html = `
    <div class="calendar-day-view">
      <div class="calendar-date-header">${dayName}</div>
  `;
  
  Object.entries(timeSlots).forEach(([slot, slotItems]) => {
    if (slotItems.length === 0) return;
    html += `
      <div class="calendar-time-slot" data-calendar-drop-date="${dateKey(date)}">
        <div class="slot-title">${slot}</div>
        <div class="slot-items">
          ${slotItems.map(item => `
            ${calendarItemMarkup(item)}
          `).join('')}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  attachCalendarEventListeners();
}
  

function renderCalendarWeek(container) {
  const start = startOfWeek(calendarCurrentDate);
  const weekDays = Array.from({length: 7}, (_, i) => addDays(start, i));
  
  let html = '<div class="week-grid">';
  
  weekDays.forEach(day => {
    const items = getAllCalendarItems(day);
    const dayName = day.toLocaleDateString("en-US", { weekday: "short" });
    
    html += `
      <div class="calendar-day-column" data-calendar-drop-date="${dateKey(day)}">
        <div class="day-header">
          <div class="day-label">${dayName}</div>
          <div class="day-date">${day.getDate()}</div>
        </div>
        <div class="day-items">
          ${items.map(item => `
            ${calendarItemMarkup(item)}
          `).join('')}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  attachCalendarEventListeners();
}

function renderCalendarMonth(container) {
  const year = calendarCurrentDate.getFullYear();
  const month = calendarCurrentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = startOfWeek(firstDay);
  
  let html = '<table class="month-grid" style="width: 100%; border-collapse: collapse;">';
  
  // Header row with day names
  html += '<tr>';
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach(day => {
    html += `<td class="day-header-name">${day.slice(0, 3)}</td>`;
  });
  html += '</tr>';
  
  // Calendar grid
  let currentDate = new Date(startDate);
  while (currentDate < lastDay || currentDate.getDay() !== 1) {
    html += '<tr>';
    for (let i = 0; i < 7; i++) {
      const isCurrentMonth = currentDate.getMonth() === month;
      const items = isCurrentMonth ? getAllCalendarItems(currentDate) : [];
      const dayKey = dateKey(currentDate);
      
      html += `
        <td class="calendar-month-day ${!isCurrentMonth ? 'other-month' : ''}" data-date="${dayKey}" data-calendar-drop-date="${dayKey}">
          <div class="day-number">${currentDate.getDate()}</div>
          <div class="day-items-preview">
            ${items.slice(0, 3).map(item => `
              ${calendarItemMarkup(item, true)}
            `).join('')}
            ${items.length > 3 ? `<div class="item-more">+${items.length - 3}</div>` : ''}
          </div>
        </td>
      `;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    html += '</tr>';
  }
  
  html += '</table>';
  container.innerHTML = html;
  attachCalendarEventListeners();
}

function updateCalendarPeriodLabel() {
  const label = document.getElementById("calendarPeriodLabel");
  if (!label) return;
  
  if (calendarCurrentView === "month") {
    label.textContent = calendarCurrentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } else if (calendarCurrentView === "week") {
    const start = startOfWeek(calendarCurrentDate);
    const end = addDays(start, 6);
    label.textContent = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  } else if (calendarCurrentView === "day") {
    label.textContent = calendarCurrentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }
}

let draggedCalendarItem = null;
function moveCalendarItemToDate(item, targetDate) {
  if (!item || !targetDate || item.date === targetDate) return;
  let recurringRuleChanged = false;
  if (["glow-ritual", "work-task"].includes(item.sourceType)) {
    const collection = item.sourceType === "glow-ritual" ? habits : workTasks;
    const source = collection.find(entry => entry.id === item.sourceId);
    if (source && ["weekly", "biweekly", "custom"].includes(source.frequency)) {
      source.preferredDay = (parseDate(targetDate).getDay() + 6) % 7;
      clearCalendarOccurrenceOverrides(item.sourceType, item.sourceId);
      persistScheduledSource(item.sourceType, source);
      recurringRuleChanged = true;
    } else if (source?.frequency === "monthly") {
      source.preferredDayOfMonth = parseDate(targetDate).getDate();
      clearCalendarOccurrenceOverrides(item.sourceType, item.sourceId);
      persistScheduledSource(item.sourceType, source);
      recurringRuleChanged = true;
    } else {
      const key = `${item.sourceType}:${item.sourceId}:${item.occurrenceKey}`;
      calendarScheduleOverrides[key] = {
        ...(calendarScheduleOverrides[key] || {}),
        itemId: item.sourceId,
        sourceType: item.sourceType,
        date: targetDate,
        time: item.time || "",
        calendarVisible: true,
        updatedAt: new Date().toISOString()
      };
    }
    localStorage.setItem(CALENDAR_SCHEDULE_OVERRIDES_KEY, JSON.stringify(calendarScheduleOverrides));
  } else if (item.sourceType === "glow-event") {
    const event = events.find(entry => entry.id === item.sourceId);
    if (event) {
      event.date = targetDate;
      saveCollection(EVENTS_KEY, events);
    }
  } else if (item.sourceType === "work-event") {
    const event = workEvents.find(entry => entry.id === item.sourceId);
    if (event) {
      event.date = targetDate;
      saveCollection(WORK_EVENTS_KEY, workEvents);
    }
  } else if (item.sourceType === "calendar-item") {
    const calendarItem = calendarItems.find(entry => entry.id === item.sourceId);
    if (calendarItem) {
      calendarItem.date = targetDate;
      saveCollection(CALENDAR_ITEMS_KEY, calendarItems);
    }
  }
  document.body.classList.remove("calendar-is-dragging");
  document.querySelectorAll(".calendar-drop-active").forEach(target => target.classList.remove("calendar-drop-active"));
  draggedCalendarItem = null;
  renderCalendarView();
  renderEvents();
  renderWorkEvents();
  const destination = parseDate(targetDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  showToast(recurringRuleChanged ? `${item.title} will now follow ${destination}.` : `${item.title} moved to ${destination}.`);
}
function clearCalendarOccurrenceOverrides(sourceType, sourceId) {
  Object.keys(calendarScheduleOverrides).forEach(key => {
    if (key.startsWith(`${sourceType}:${sourceId}:`)) delete calendarScheduleOverrides[key];
  });
}
function persistScheduledSource(sourceType, source) {
  if (sourceType === "glow-ritual" && source.custom) {
    const custom = customRituals.find(item => item.id === source.id);
    if (custom) Object.assign(custom, { preferredDay: source.preferredDay, preferredDayOfMonth: source.preferredDayOfMonth });
    saveCollection(CUSTOM_RITUALS_KEY, customRituals);
  } else if (sourceType === "work-task") {
    const custom = customWorkTasks.find(item => item.id === source.id);
    if (custom) Object.assign(custom, { preferredDay: source.preferredDay, preferredDayOfMonth: source.preferredDayOfMonth });
    else {
      const scheduleKey = `work-task:${source.id}:schedule`;
      calendarScheduleOverrides[scheduleKey] = { itemId: source.id, sourceType, preferredDay: source.preferredDay, preferredDayOfMonth: source.preferredDayOfMonth, calendarVisible: true, updatedAt: new Date().toISOString() };
    }
    saveCollection(WORK_TASKS_KEY, customWorkTasks);
  } else {
    const scheduleKey = `glow-ritual:${source.id}:schedule`;
    calendarScheduleOverrides[scheduleKey] = { itemId: source.id, sourceType, preferredDay: source.preferredDay, preferredDayOfMonth: source.preferredDayOfMonth, calendarVisible: true, updatedAt: new Date().toISOString() };
  }
}
function attachCalendarEventListeners() {
  document.querySelectorAll("[data-calendar-item-id]").forEach(element => {
    element.addEventListener("click", event => {
      event.stopPropagation();
      if (element.dataset.justDragged === "true") {
        element.dataset.justDragged = "false";
        return;
      }
      const item = getAllCalendarItems(parseDate(element.dataset.calendarDate)).find(entry => entry.id === element.dataset.calendarItemId);
      if (item) openCalendarItemDetail(item);
    });
    element.addEventListener("dragstart", event => {
      draggedCalendarItem = getAllCalendarItems(parseDate(element.dataset.calendarDate)).find(entry => entry.id === element.dataset.calendarItemId);
      element.classList.add("is-dragging");
      document.body.classList.add("calendar-is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", element.dataset.calendarItemId);
    });
    element.addEventListener("dragend", () => {
      element.classList.remove("is-dragging");
      element.dataset.justDragged = "true";
      document.body.classList.remove("calendar-is-dragging");
      document.querySelectorAll(".calendar-drop-active").forEach(target => target.classList.remove("calendar-drop-active"));
      draggedCalendarItem = null;
      setTimeout(() => { element.dataset.justDragged = "false"; }, 200);
    });
  });
  document.querySelectorAll("[data-calendar-drop-date]").forEach(target => {
    target.addEventListener("dragover", event => {
      if (!draggedCalendarItem) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      target.classList.add("calendar-drop-active");
    });
    target.addEventListener("dragleave", event => {
      if (!target.contains(event.relatedTarget)) target.classList.remove("calendar-drop-active");
    });
    target.addEventListener("drop", event => {
      event.preventDefault();
      event.stopPropagation();
      target.classList.remove("calendar-drop-active");
      moveCalendarItemToDate(draggedCalendarItem, target.dataset.calendarDropDate);
    });
  });
  
  document.querySelectorAll(".calendar-month-day").forEach(day => {
    day.addEventListener("click", () => {
      const date = parseDate(day.dataset.date);
      calendarCurrentDate = date;
      calendarCurrentView = "day";
      renderCalendarView();
      updateCalendarViewButtons();
    });
  });
}
function openCalendarItemDetail(item) {
  const modal = document.getElementById("calendarItemDetailModal");
  const body = document.getElementById("calendarItemDetailBody");
  const actions = document.getElementById("calendarItemDetailActions");
  const source = item.sourceType === "glow-ritual" ? habits.find(entry => entry.id === item.sourceId)
    : item.sourceType === "work-task" ? workTasks.find(entry => entry.id === item.sourceId)
    : item.sourceType === "glow-event" ? events.find(entry => entry.id === item.sourceId)
    : item.sourceType === "work-event" ? workEvents.find(entry => entry.id === item.sourceId)
    : calendarItems.find(entry => entry.id === item.sourceId);
  body.innerHTML = `<p class="section-label">${item.sourceType.replaceAll("-", " ")}</p><h2 id="calendarItemDetailTitle">${escapeHTML(item.title)}</h2><div class="calendar-detail-meta"><span>${item.icon} ${escapeHTML(String(item.category || item.mode))}</span><span>${item.date}${item.time ? ` · ${item.time}` : ""}</span></div><p>${escapeHTML(source?.why || source?.description || source?.goal || source?.motivation || source?.notes || "Placed in the shared archive.")}</p>`;
  const completable = ["glow-ritual", "work-task", "calendar-item"].includes(item.sourceType);
  actions.innerHTML = `${completable ? `<button class="primary-btn" data-calendar-complete>${item.isCompleted ? "Undo completion" : "Complete"}</button>` : ""}${["glow-ritual", "work-task"].includes(item.sourceType) ? `<button class="secondary-btn" data-calendar-schedule>Schedule this occurrence</button>` : ""}${item.sourceType === "calendar-item" ? `<button class="secondary-btn" data-calendar-edit>Edit item</button>` : `<button class="secondary-btn" data-calendar-open-source>Open original</button>`}${item.sourceType === "calendar-item" ? `<button class="danger-btn" data-calendar-delete>Delete</button>` : ""}`;
  actions.querySelector("[data-calendar-complete]")?.addEventListener("click", () => {
    if (item.sourceType === "glow-ritual") toggleHabit(item.sourceId, item.date);
    else if (item.sourceType === "work-task") toggleWorkTaskOnDate(item.sourceId, item.date);
    else {
      calendarItemCompletions[item.date] ||= {};
      calendarItemCompletions[item.date][item.sourceId] = !item.isCompleted;
      localStorage.setItem(CALENDAR_COMPLETIONS_KEY, JSON.stringify(calendarItemCompletions));
    }
    modal.hidden = true;
    renderCalendarView();
  });
  actions.querySelector("[data-calendar-schedule]")?.addEventListener("click", () => openCalendarSchedule(item));
  actions.querySelector("[data-calendar-open-source]")?.addEventListener("click", () => {
    modal.hidden = true;
    if (item.sourceType === "glow-event") { switchMode("glow"); setTimeout(() => openEventDetail(item.sourceId), 1500); }
    else if (item.sourceType === "work-event") { switchMode("work"); setTimeout(() => openWorkEventDetail(item.sourceId), 1500); }
    else switchMode(item.mode === "work" ? "work" : "glow");
  });
  actions.querySelector("[data-calendar-edit]")?.addEventListener("click", () => {
    const form = document.getElementById("calendarItemEditorForm");
    form.reset();
    Object.entries(source || {}).forEach(([key, value]) => { if (form.elements[key] && value != null) form.elements[key].value = value; });
    form.elements.itemId.value = source.id;
    modal.hidden = true;
    document.getElementById("calendarItemEditorModal").hidden = false;
  });
  actions.querySelector("[data-calendar-delete]")?.addEventListener("click", () => {
    calendarItems = calendarItems.filter(entry => entry.id !== item.sourceId);
    saveCollection(CALENDAR_ITEMS_KEY, calendarItems);
    modal.hidden = true;
    renderCalendarView();
  });
  modal.hidden = false;
}
function openCalendarSchedule(item) {
  const form = document.getElementById("calendarScheduleForm");
  form.reset();
  form.elements.sourceId.value = item.sourceId;
  form.elements.sourceType.value = item.sourceType;
  form.elements.occurrenceKey.value = item.occurrenceKey;
  form.elements.title.value = item.title;
  form.elements.date.value = item.date;
  form.elements.time.value = item.time || "";
  form.elements.calendarVisible.checked = true;
  document.getElementById("calendarItemDetailModal").hidden = true;
  document.getElementById("calendarScheduleModal").hidden = false;
}

function updateCalendarViewButtons() {
  document.querySelectorAll(".calendar-view-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.calendarView === calendarCurrentView);
  });
}

function initializeCalendarMode() {
  // Calendar navigation
  document.querySelectorAll('a[href="#calendar"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      switchMode("calendar");
    });
  });

  // Category dropdown toggles
  document.querySelectorAll(".category-dropdown-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const dropdownId = btn.dataset.dropdown;
      const content = document.getElementById(dropdownId);
      const isOpen = !content.hidden;
      content.hidden = !content.hidden;
      btn.dataset.open = !isOpen;
    });
  });

  // Category checkboxes
  document.querySelectorAll('input[data-calendar-category]').forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const category = checkbox.dataset.calendarCategory;
      const mode = checkbox.dataset.mode;
      
      if (checkbox.checked) {
        visibleCategories[mode].add(category);
      } else {
        visibleCategories[mode].delete(category);
      }
      
      renderCalendarView();
    });
  });

  // View switcher
  document.querySelectorAll(".calendar-view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      calendarCurrentView = btn.dataset.calendarView;
      renderCalendarView();
      updateCalendarViewButtons();
    });
  });
  document.querySelectorAll(".calendar-filter").forEach(button => button.addEventListener("click", () => {
    calendarFilter = button.dataset.calendarFilter;
    document.querySelectorAll(".calendar-filter").forEach(item => item.classList.toggle("active", item === button));
    renderCalendarView();
  }));

  // Navigation
  document.getElementById("calendarPrev")?.addEventListener("click", () => {
    if (calendarCurrentView === "month") {
      calendarCurrentDate = new Date(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth() - 1, 1);
    } else if (calendarCurrentView === "week") {
      calendarCurrentDate = addDays(calendarCurrentDate, -7);
    } else if (calendarCurrentView === "day") {
      calendarCurrentDate = addDays(calendarCurrentDate, -1);
    }
    renderCalendarView();
  });

  document.getElementById("calendarNext")?.addEventListener("click", () => {
    if (calendarCurrentView === "month") {
      calendarCurrentDate = new Date(calendarCurrentDate.getFullYear(), calendarCurrentDate.getMonth() + 1, 1);
    } else if (calendarCurrentView === "week") {
      calendarCurrentDate = addDays(calendarCurrentDate, 7);
    } else if (calendarCurrentView === "day") {
      calendarCurrentDate = addDays(calendarCurrentDate, 1);
    }
    renderCalendarView();
  });

  document.getElementById("calendarToday")?.addEventListener("click", () => {
    calendarCurrentDate = new Date();
    if (calendarCurrentView !== "week") {
      calendarCurrentView = "week";
      updateCalendarViewButtons();
    }
    renderCalendarView();
  });

  // Add button
  document.getElementById("calendarAddBtn")?.addEventListener("click", () => {
    document.getElementById("calendarItemEditorModal").hidden = false;
    document.getElementById("calendarItemEditorForm").reset();
    document.getElementById("calendarItemEditorId").value = "";
  });

  // Form submission
  document.getElementById("calendarItemEditorForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = {
      id: formData.get("itemId") || `calendar-${Date.now()}`,
      title: formData.get("title"),
      type: formData.get("type"),
      mode: formData.get("mode"),
      category: formData.get("mode"),
      date: formData.get("date"),
      time: formData.get("time"),
      endTime: formData.get("endTime"),
      recurrence: formData.get("recurrence"),
      importance: formData.get("importance"),
      notes: formData.get("notes")
    };

    const existing = calendarItems.findIndex(i => i.id === item.id);
    if (existing >= 0) {
      calendarItems[existing] = item;
    } else {
      calendarItems.push(item);
    }

    saveCollection(CALENDAR_ITEMS_KEY, calendarItems);
    document.getElementById("calendarItemEditorModal").hidden = true;
    renderCalendarView();
  });
  document.getElementById("calendarItemEditorClose")?.addEventListener("click", () => document.getElementById("calendarItemEditorModal").hidden = true);
  document.getElementById("calendarItemDetailClose")?.addEventListener("click", () => document.getElementById("calendarItemDetailModal").hidden = true);
  document.getElementById("calendarScheduleClose")?.addEventListener("click", () => document.getElementById("calendarScheduleModal").hidden = true);
  document.getElementById("calendarScheduleForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const key = `${data.get("sourceType")}:${data.get("sourceId")}:${data.get("occurrenceKey")}`;
    calendarScheduleOverrides[key] = { itemId: data.get("sourceId"), sourceType: data.get("sourceType"), date: data.get("date"), time: data.get("time"), calendarVisible: data.get("calendarVisible") === "on", updatedAt: new Date().toISOString() };
    localStorage.setItem(CALENDAR_SCHEDULE_OVERRIDES_KEY, JSON.stringify(calendarScheduleOverrides));
    document.getElementById("calendarScheduleModal").hidden = true;
    renderCalendarView();
    showToast("Occurrence scheduled. The shared archive noticed.");
  });

  renderCalendarView();
  updateCalendarViewButtons();
}

function showCalendarMode() {
  switchMode("calendar");
}

const currentSection = document.querySelector(".swiss-current");
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.target === currentSection) entry.target.classList.toggle("current-visible", entry.isIntersecting);
}), { threshold: .12 });
if (currentSection) observer.observe(currentSection);

initialiseCheckinForms();
applyTimeTheme();
runDailyCheckinPriority();
try {
  initialiseWorkMode();
  renderWorkAll();
} catch (error) {
  console.error("Work Mode startup error:", error);
}
try {
  initializeCalendarMode();
} catch (error) {
  console.error("Calendar startup error:", error);
}
try {
  migrateToTwoModes();
  renderAll();
  renderMeasurements();
  initialiseAtelier();
  renderWorkAll();
  applyTimeTheme();
  setInterval(applyTimeTheme, 5 * 60 * 1000);
  bindCursorLabels();
  saveState();
  forcePageTop();
  setTimeout(forcePageTop, 0);
  setTimeout(forcePageTop, 100);
  setTimeout(forcePageTop, 500);
} catch (error) {
  console.error("Dashboard startup error:", error);
  runDailyCheckinPriority();
}
