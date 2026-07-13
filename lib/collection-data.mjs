const COUNCIL_TIME_ZONE = "Europe/London";

export function normaliseType(name = "") {
  const value = name.toLowerCase();
  if (/recycl|blue/.test(value)) return "recycling";
  if (/general|residual|refuse|grey|gray/.test(value)) return "general";
  if (/food/.test(value)) return "food";
  if (/garden|green waste/.test(value)) return "garden";
  if (/glass/.test(value)) return "glass";
  return "default";
}

export function councilDateKey(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return null;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: COUNCIL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function normaliseEvent(event) {
  const name = event.Subject || event.subject || event.FriendlyName || event.FeatureTypeName || event.ServiceName || event.title;
  const date = councilDateKey(event.StartTime || event.startTime || event.Start || event.start || event.CollectionDate || event.date);
  if (!name || !date) return null;
  return { date, name: String(name).trim(), type: normaliseType(name) };
}
