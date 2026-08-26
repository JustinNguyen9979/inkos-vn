import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { INKOS_VN_PACKAGE_NAMES, inkosVnAlias, inkosVnPackageName } from "./inkos-vn-package-map.mjs";

const scriptDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const workspaceRoot = resolve(scriptDir, "..");

function parseArgs(argv) {
  const index = argv.indexOf("--out");
  if (index === -1 || !argv[index + 1]) {
    throw new Error("Usage: node scripts/stage-inkos-vn-packages.mjs --out <directory>");
  }
  const versionIndex = argv.indexOf("--version");
  return {
    outputRoot: resolve(argv[index + 1]),
    version: versionIndex === -1 ? undefined : argv[versionIndex + 1],
  };
}

function rewriteDependencies(pkg) {
  for (const field of ["dependencies", "optionalDependencies", "peerDependencies"]) {
    const dependencies = pkg[field];
    if (!dependencies) continue;

    for (const sourceName of INKOS_VN_PACKAGE_NAMES.keys()) {
      if (!(sourceName in dependencies)) continue;
      dependencies[sourceName] = inkosVnAlias(sourceName, pkg.version);
    }
  }
}

async function copyIfPresent(source, target) {
  try {
    await cp(source, target, { recursive: true });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

async function stagePackage(packageDir, outputRoot, version) {
  const sourcePackageJson = JSON.parse(await readFile(join(packageDir, "package.json"), "utf-8"));
  const outputDir = join(outputRoot, basename(packageDir));
  await mkdir(outputDir, { recursive: true });

  for (const entry of ["dist", "genres", "skills"]) {
    await copyIfPresent(join(packageDir, entry), join(outputDir, entry));
  }
  await copyIfPresent(join(workspaceRoot, "LICENSE"), join(outputDir, "LICENSE"));
  await copyIfPresent(join(workspaceRoot, "README.vi.md"), join(outputDir, "README.md"));

  sourcePackageJson.name = inkosVnPackageName(sourcePackageJson.name);
  if (version) sourcePackageJson.version = version;
  sourcePackageJson.repository = {
    type: "git",
    url: "https://github.com/JustinNguyen9979/inkos-vn.git",
    ...(sourcePackageJson.repository?.directory ? { directory: sourcePackageJson.repository.directory } : {}),
  };
  rewriteDependencies(sourcePackageJson);

  // Staging contains built artifacts and must never run source-tree hooks.
  delete sourcePackageJson.devDependencies;
  delete sourcePackageJson.scripts;

  await writeFile(join(outputDir, "package.json"), `${JSON.stringify(sourcePackageJson, null, 2)}\n`, "utf-8");
  return { name: sourcePackageJson.name, version: sourcePackageJson.version, directory: outputDir };
}

async function main() {
  const { outputRoot, version } = parseArgs(process.argv.slice(2));
  if (outputRoot === workspaceRoot || outputRoot === resolve(workspaceRoot, "packages")) {
    throw new Error("Refusing to replace the workspace root or source packages directory");
  }

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const staged = [];
  for (const packageName of ["core", "studio", "cli"]) {
    staged.push(await stagePackage(join(workspaceRoot, "packages", packageName), outputRoot, version));
  }

  await writeFile(join(outputRoot, "manifest.json"), `${JSON.stringify(staged, null, 2)}\n`, "utf-8");
  process.stdout.write(`${JSON.stringify({ outputRoot, packages: staged })}\n`);
}

await main();
