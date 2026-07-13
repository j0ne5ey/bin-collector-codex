import test from "node:test";
import assert from "node:assert/strict";
import { nextTwoCollectionDays, relativeDate, visibleCollections } from "../lib/schedule.mjs";

const bins = [
  { date: "2026-07-13", name: "General waste", type: "general" },
  { date: "2026-07-14", name: "Food waste", type: "food" },
  { date: "2026-07-14", name: "Recycling", type: "recycling" },
  { date: "2026-07-28", name: "General waste", type: "general" }
];

test("keeps today's collection before noon in council time", () => {
  assert.equal(visibleCollections(bins, new Date("2026-07-13T09:30:00Z"))[0].date, "2026-07-13");
});

test("removes today's collection from midday in council time", () => {
  assert.equal(visibleCollections(bins, new Date("2026-07-13T11:00:00Z"))[0].date, "2026-07-14");
});

test("returns two distinct days and keeps bins on the same day together", () => {
  const days = nextTwoCollectionDays(bins, new Date("2026-07-13T11:00:00Z"));
  assert.deepEqual(days.map((day) => day.date), ["2026-07-14", "2026-07-28"]);
  assert.equal(days[0].bins.length, 2);
});

test("formats tomorrow relative to council date", () => {
  assert.equal(relativeDate("2026-07-14", new Date("2026-07-13T09:30:00Z")), "Tomorrow");
});
