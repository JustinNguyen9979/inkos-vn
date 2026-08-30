import { appendFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const VERSION_PATTERN = /^(\d{4})\.(\d{1,2})\.(\d{1,2})(?:-(\d+))?$/;

export function dateParts(date = new Date(), timeZone = "Asia/Ho_Chi_Minh") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value]));
}

export function parseDateVersion(version) {
  const match = VERSION_PATTERN.exec(version);
  if (!match) throw new Error(`Invalid date-based npm version: ${version}`);

  const [, year, month, day, revision] = match;
  const monthNumber = Number(month);
  const dayNumber = Number(day);
  if (monthNumber < 1 || monthNumber > 12 || dayNumber < 1 || dayNumber > 31) {
    throw new Error(`Invalid calendar date in npm version: ${version}`);
  }
  return {
    version: `${Number(year)}.${monthNumber}.${dayNumber}${revision === undefined ? "" : `-${Number(revision)}`}`,
    label: `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}${revision === undefined ? "" : `-${Number(revision)}`}`,
  };
}

export function deriveVersion(tags, { date = new Date(), timeZone = "Asia/Ho_Chi_Minh", override } = {}) {
  if (override) return parseDateVersion(override);

  const { year, month, day } = dateParts(date, timeZone);
  const base = `${Number(year)}.${Number(month)}.${Number(day)}`;
  const revisions = tags.flatMap((tag) => {
    const match = new RegExp(`^inkos-vn-v${base.replaceAll(".", "\\.")}(?:-(\\d+))?$`).exec(tag.trim());
    return match ? [match[1] === undefined ? 0 : Number(match[1])] : [];
  });
  const revision = revisions.length === 0 ? undefined : Math.max(...revisions) + 1;
  return parseDateVersion(`${base}${revision === undefined ? "" : `-${revision}`}`);
}

function parseArgs(argv) {
  const valueAfter = (flag) => {
    const index = argv.indexOf(flag);
    return index === -1 ? undefined : argv[index + 1];
  };
  return {
    override: valueAfter("--override"),
    output: valueAfter("--github-output"),
    timeZone: valueAfter("--time-zone") ?? "Asia/Ho_Chi_Minh",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const tagResult = spawnSync("git", ["tag", "-l", "inkos-vn-v*"], { encoding: "utf8" });
  if (tagResult.status !== 0) throw new Error(tagResult.stderr || "Unable to list Git tags");

  const result = deriveVersion(tagResult.stdout.split(/\r?\n/).filter(Boolean), args);
  if (args.output) {
    await appendFile(args.output, `release_version=${result.version}\nrelease_label=${result.label}\n`, "utf8");
  }
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
