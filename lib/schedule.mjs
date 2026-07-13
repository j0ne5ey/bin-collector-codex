export const COUNCIL_TIME_ZONE = "Europe/London";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: COUNCIL_TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long"
});

export function councilClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: COUNCIL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

export function visibleCollections(collections, now = new Date()) {
  const clock = councilClock(now);
  return collections
    .filter((item) => item?.date && (item.date > clock.date || (item.date === clock.date && clock.hour < 12)))
    .sort((a, b) => a.date.localeCompare(b.date) || String(a.name).localeCompare(String(b.name)));
}

export function nextTwoCollectionDays(collections, now = new Date()) {
  const grouped = new Map();
  for (const collection of visibleCollections(collections, now)) {
    if (!grouped.has(collection.date)) grouped.set(collection.date, []);
    grouped.get(collection.date).push(collection);
  }
  return [...grouped.entries()].slice(0, 2).map(([date, bins]) => ({ date, bins }));
}

export function parseDate(dateKey) {
  return new Date(`${dateKey}T12:00:00Z`);
}

export function fullDate(dateKey) {
  return dateFormatter.format(parseDate(dateKey));
}

export function relativeDate(dateKey, now = new Date()) {
  const today = councilClock(now).date;
  const difference = Math.round((parseDate(dateKey) - parseDate(today)) / 86_400_000);
  if (difference === 0) return "Today";
  if (difference === 1) return "Tomorrow";
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long" }).format(parseDate(dateKey));
}
