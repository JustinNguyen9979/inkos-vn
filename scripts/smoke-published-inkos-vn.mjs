import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const versionIndex = process.argv.indexOf("--version");
const version = versionIndex === -1 ? undefined : process.argv[versionIndex + 1];
if (!version) throw new Error("Usage: node scripts/smoke-published-inkos-vn.mjs --version <version>");

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { encoding: "utf8", stdio: "pipe", ...options });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `${command} failed`);
  return result.stdout.trim();
};
const pause = (milliseconds) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);

for (const name of ["inkos-vn-core", "inkos-vn-studio", "inkos-vn"]) {
  let available = false;
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    const result = spawnSync(npm, ["view", `${name}@${version}`, "version", "--json"], { encoding: "utf8" });
    if (result.status === 0 && JSON.parse(result.stdout) === version) {
      available = true;
      break;
    }
    process.stdout.write(`Waiting for npm registry propagation (${name}, attempt ${attempt}/60)\n`);
    pause(10_000);
  }
  assert.ok(available, `${name}@${version} did not become available within 10 minutes`);
}

const testRoot = await mkdtemp(join(tmpdir(), "inkos-vn-smoke-"));
try {
  run(npm, ["init", "-y"], { cwd: testRoot });
  run(npm, ["install", `inkos-vn@${version}`], { cwd: testRoot });

  const cliPackage = JSON.parse(await readFile(join(testRoot, "node_modules", "inkos-vn", "package.json"), "utf8"));
  assert.equal(cliPackage.version, version);
  assert.equal(cliPackage.dependencies["@actalk/inkos-core"], `npm:inkos-vn-core@${version}`);
  assert.equal(cliPackage.dependencies["@actalk/inkos-studio"], `npm:inkos-vn-studio@${version}`);

  const coreRoot = join(testRoot, "node_modules", "@actalk", "inkos-core");
  const studioRoot = join(testRoot, "node_modules", "@actalk", "inkos-studio");
  const corePackage = JSON.parse(await readFile(join(coreRoot, "package.json"), "utf8"));
  const studioPackage = JSON.parse(await readFile(join(studioRoot, "package.json"), "utf8"));
  assert.equal(corePackage.version, version);
  assert.equal(studioPackage.version, version);

  const cliResult = run(process.execPath, [join(testRoot, "node_modules", "inkos-vn", "dist", "index.js"), "--version"]);
  assert.match(cliResult, new RegExp(version.replaceAll(".", "\\.")));
  const importedCore = await import(pathToFileURL(join(coreRoot, "dist", "index.js")));
  assert.ok(Object.keys(importedCore).length > 0);
  process.stdout.write(`Installed and verified InkOS VN ${version} on ${process.platform}.\n`);
} finally {
  await rm(testRoot, { recursive: true, force: true });
}
