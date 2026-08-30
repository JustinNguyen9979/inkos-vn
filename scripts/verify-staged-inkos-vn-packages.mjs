import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

function parseArgs(argv) {
  const valueAfter = (flag) => {
    const index = argv.indexOf(flag);
    if (index === -1 || !argv[index + 1]) throw new Error(`Missing ${flag}`);
    return argv[index + 1];
  };
  return { root: resolve(valueAfter("--root")), version: valueAfter("--version") };
}

async function readPackage(root, directory) {
  return JSON.parse(await readFile(join(root, directory, "package.json"), "utf8"));
}

async function main() {
  const { root, version } = parseArgs(process.argv.slice(2));
  const expectedNames = { core: "inkos-vn-core", studio: "inkos-vn-studio", cli: "inkos-vn" };
  const packages = {};

  for (const [directory, expectedName] of Object.entries(expectedNames)) {
    const pkg = await readPackage(root, directory);
    packages[directory] = pkg;
    assert.equal(pkg.name, expectedName, `${directory} has the wrong package name`);
    assert.equal(pkg.version, version, `${directory} has the wrong version`);
    assert.doesNotMatch(JSON.stringify(pkg), /workspace:/, `${directory} still contains workspace: dependencies`);
    await access(join(root, directory, pkg.main ?? pkg.bin?.inkos));
  }

  assert.equal(packages.studio.dependencies["@actalk/inkos-core"], `npm:inkos-vn-core@${version}`);
  assert.equal(packages.cli.dependencies["@actalk/inkos-core"], `npm:inkos-vn-core@${version}`);
  assert.equal(packages.cli.dependencies["@actalk/inkos-studio"], `npm:inkos-vn-studio@${version}`);

  process.stdout.write(`Verified all staged InkOS VN packages at ${version}.\n`);
}

await main();
