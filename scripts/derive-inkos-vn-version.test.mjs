import test from "node:test";
import assert from "node:assert/strict";
import { deriveVersion, parseDateVersion } from "./derive-inkos-vn-version.mjs";

const releaseDate = new Date("2026-08-30T01:00:00.000Z");

test("uses the release date for the first publication of a day", () => {
  assert.deepEqual(deriveVersion([], { date: releaseDate }), {
    version: "2026.8.30",
    label: "2026-08-30",
  });
});

test("increments the numeric suffix for every later publication that day", () => {
  assert.deepEqual(
    deriveVersion(["inkos-vn-v2026.8.30", "inkos-vn-v2026.8.30-1", "inkos-vn-v1.8.0-vn.6"], {
      date: releaseDate,
    }),
    { version: "2026.8.30-2", label: "2026-08-30-2" },
  );
});

test("normalizes a manual retry and rejects non-SemVer date formats", () => {
  assert.deepEqual(parseDateVersion("2026.08.30-03"), {
    version: "2026.8.30-3",
    label: "2026-08-30-3",
  });
  assert.throws(() => parseDateVersion("2026-08-30"), /Invalid date-based npm version/);
  assert.throws(() => parseDateVersion("2026.13.30"), /Invalid calendar date/);
});
