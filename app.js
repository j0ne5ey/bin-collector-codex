import { fullDate, nextTwoCollectionDays, relativeDate } from "./lib/schedule.mjs";

const DATA_URL = "./data/collections.json";
const PULL_THRESHOLD = 76;
const collectionRoot = document.querySelector("#collections");
const setupPanel = document.querySelector("#setup");
const status = document.querySelector("#status");
const statusText = document.querySelector("#status-text");
const updatedAt = document.querySelector("#updated-at");
const refreshButton = document.querySelector("#refresh-button");
const pullIndicator = document.querySelector("#pull-indicator");
const pullIcon = document.querySelector("#pull-icon");
const pullLabel = document.querySelector("#pull-label");
const template = document.querySelector("#collection-template");

const binStyles = {
  recycling: { colour: "#6eb6d8", ink: "#123845" },
  general: { colour: "#79837f", ink: "#ffffff" },
  food: { colour: "#7eae6d", ink: "#163823" },
  garden: { colour: "#79a65f", ink: "#163823" },
  glass: { colour: "#7bb7a4", ink: "#153c34" },
  default: { colour: "#e6b648", ink: "#153c34" }
};

let refreshing = false;
let touchStart = null;
let pullDistance = 0;

function binIcon() {
  return `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 10h14l-1.5 16h-11zM7 7h18M12 4h8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 14v8M18 14v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
}

function setStatus(message, mode = "ready") {
  statusText.textContent = message;
  status.classList.toggle("is-loading", mode === "loading");
  status.classList.toggle("is-error", mode === "error");
}

function renderBin(bin) {
  const style = binStyles[bin.type] || binStyles.default;
  const row = document.createElement("div");
  row.className = "bin-item";
  row.innerHTML = `<span class="bin-tile" style="--tile:${style.colour};--tile-ink:${style.ink}">${binIcon()}</span><span class="bin-name"></span>`;
  row.querySelector(".bin-name").textContent = bin.name;
  return row;
}

function renderDay(day, position) {
  const card = template.content.firstElementChild.cloneNode(true);
  card.classList.add(position);
  card.querySelector(".card-kicker").textContent = position === "imminent" ? "Next collection" : "Then";
  card.querySelector(".relative-date").textContent = relativeDate(day.date);
  card.querySelector(".calendar-date").textContent = fullDate(day.date);
  const list = card.querySelector(".bin-list");
  day.bins.forEach((bin) => list.append(renderBin(bin)));
  return card;
}

function render(data) {
  const days = nextTwoCollectionDays(data.collections || []);
  collectionRoot.replaceChildren();
  setupPanel.hidden = true;

  if (!data.configured) {
    setupPanel.hidden = false;
    setStatus("Address setup required", "error");
  } else if (!days.length) {
    setupPanel.hidden = false;
    setupPanel.querySelector("h2").textContent = "No upcoming collections";
    setupPanel.querySelector("p").textContent = "The updater did not find a future collection. Try refreshing or check the council calendar.";
    setStatus("No future collections found", "error");
  } else {
    collectionRoot.append(renderDay(days[0], "imminent"));
    if (days[1]) collectionRoot.append(renderDay(days[1], "then"));
    setStatus("Schedule is up to date");
  }

  collectionRoot.setAttribute("aria-busy", "false");
  updatedAt.textContent = data.updatedAt
    ? `Updated ${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(data.updatedAt))}`
    : "";
}

async function loadCollections({ userInitiated = false } = {}) {
  if (refreshing) return;
  refreshing = true;
  refreshButton.disabled = true;
  refreshButton.classList.add("is-refreshing");
  setStatus("Refreshing schedule…", "loading");
  if (userInitiated) setPullState("refreshing");

  try {
    const response = await fetch(`${DATA_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Schedule request failed (${response.status})`);
    render(await response.json());
  } catch (error) {
    console.error(error);
    setStatus("Could not refresh — showing saved data", "error");
  } finally {
    refreshing = false;
    refreshButton.disabled = false;
    refreshButton.classList.remove("is-refreshing");
    window.setTimeout(() => setPullState("hidden"), 450);
  }
}

function setPullState(state) {
  pullIndicator.classList.toggle("is-visible", state !== "hidden");
  pullIndicator.classList.toggle("is-refreshing", state === "refreshing");
  if (state === "pull") { pullIcon.textContent = "↓"; pullLabel.textContent = "Pull to refresh"; }
  if (state === "release") { pullIcon.textContent = "↑"; pullLabel.textContent = "Release to refresh"; }
  if (state === "refreshing") { pullIcon.textContent = "↻"; pullLabel.textContent = "Refreshing"; }
}

window.addEventListener("touchstart", (event) => {
  if (window.scrollY === 0 && !refreshing) touchStart = event.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchmove", (event) => {
  if (touchStart === null || refreshing) return;
  pullDistance = Math.max(0, event.touches[0].clientY - touchStart);
  if (pullDistance > 8) setPullState(pullDistance >= PULL_THRESHOLD ? "release" : "pull");
}, { passive: true });

window.addEventListener("touchend", () => {
  if (touchStart === null) return;
  const shouldRefresh = pullDistance >= PULL_THRESHOLD;
  touchStart = null;
  pullDistance = 0;
  if (shouldRefresh) loadCollections({ userInitiated: true });
  else setPullState("hidden");
}, { passive: true });

refreshButton.addEventListener("click", () => loadCollections({ userInitiated: true }));

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
loadCollections();
