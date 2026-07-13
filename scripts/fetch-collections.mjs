import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normaliseEvent } from "../lib/collection-data.mjs";

const CALENDAR_URL = "https://scotborders-live-portal.bartecmunicipal.com/Embeddable/CollectionCalendar";
const outputPath = path.resolve(process.env.OUTPUT_PATH || "data/collections.json");
const postcode = process.env.SBC_POSTCODE?.trim();
const uprn = process.env.SBC_UPRN?.trim();

if (!postcode || !uprn) {
  throw new Error("SBC_POSTCODE and SBC_UPRN are required.");
}
if (!/^\d+$/.test(uprn)) throw new Error("SBC_UPRN must contain digits only.");

async function existingCollections() {
  try { return JSON.parse(await readFile(outputPath, "utf8")); }
  catch { return null; }
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ locale: "en-GB", timezoneId: "Europe/London" });
  await page.goto(CALENDAR_URL, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.locator("#SelectedPostcode").fill(postcode);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.locator("#btnSearchPostcode").click()
  ]);

  await page.waitForFunction(() => document.querySelector("#Premises")?.ej2_instances?.[0]);
  const selected = await page.evaluate((selectedUprn) => {
    const list = document.querySelector("#Premises")?.ej2_instances?.[0];
    if (!list) return false;
    const match = list.dataSource?.find((address) => String(Math.trunc(Number(address.UPRN))) === selectedUprn);
    if (!match) return false;
    list.value = Number(selectedUprn);
    list.dataBind();
    return true;
  }, uprn);
  if (!selected) throw new Error("The configured UPRN was not returned for the configured postcode.");

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.locator("#btnSelectPrem").click()
  ]);
  await page.waitForFunction(() => document.querySelector("#schedule")?.ej2_instances?.[0]);
  await page.waitForTimeout(1_500);

  const events = [];
  for (let month = 0; month < 3; month += 1) {
    const monthEvents = await page.evaluate(() => {
      const schedule = document.querySelector("#schedule")?.ej2_instances?.[0];
      const renderedEvents = Array.isArray(schedule?.eventsData) ? schedule.eventsData : [];
      const configuredEvents = Array.isArray(schedule?.eventSettings?.dataSource) ? schedule.eventSettings.dataSource : [];
      const source = renderedEvents.length ? renderedEvents : configuredEvents;
      return JSON.parse(JSON.stringify(source));
    });
    events.push(...monthEvents);

    if (month < 2) {
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.waitForTimeout(600);
    }
  }

  const collections = events
    .map(normaliseEvent)
    .filter(Boolean)
    .filter((item, index, all) => all.findIndex((other) => other.date === item.date && other.name === item.name) === index)
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

  if (!collections.length) {
    const existing = await existingCollections();
    if (existing?.collections?.length) throw new Error("SBC returned no collections; existing data has been preserved.");
    throw new Error("SBC returned no collection events for this property.");
  }

  const payload = {
    configured: true,
    updatedAt: new Date().toISOString(),
    source: "Scottish Borders Council via Bartec Municipal",
    collections
  };
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Saved ${collections.length} collections to ${outputPath}`);
} finally {
  await browser.close();
}
