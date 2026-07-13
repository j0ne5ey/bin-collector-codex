import test from "node:test";
import assert from "node:assert/strict";
import { councilDateKey, normaliseEvent } from "../lib/collection-data.mjs";

test("converts a BST midnight serialized as UTC back to the council date", () => {
  assert.equal(councilDateKey("2026-07-19T23:00:00.000Z"), "2026-07-20");
});

test("keeps a GMT midnight on the same council date", () => {
  assert.equal(councilDateKey("2026-12-07T00:00:00.000Z"), "2026-12-07");
});

test("normalises a serialized SBC event", () => {
  assert.deepEqual(
    normaliseEvent({ Subject: "General Waste", StartTime: "2026-07-23T23:00:00.000Z" }),
    { date: "2026-07-24", name: "General Waste", type: "general" }
  );
});
