import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { STUDIO_SOURCE_STRINGS } from "../packages/studio/src/hooks/use-i18n";
import { VI_STRINGS } from "../packages/studio/src/i18n/vi";

const scriptDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const root = resolve(scriptDir, "..");
const viPath = resolve(root, "packages/studio/src/i18n/vi.ts");
const statePath = resolve(root, "localization/studio-translation-state.json");
const checkOnly = process.argv.includes("--check");

type SourceEntry = { readonly zh: string; readonly en: string };
type TranslationState = {
  readonly schemaVersion: 1;
  readonly sourceHashes: Record<string, string>;
};

function hashSource(entry: SourceEntry): string {
  return createHash("sha256").update(JSON.stringify(entry)).digest("hex");
}

function placeholders(value: string): string[] {
  return value.match(/\{[^}]+\}|%[a-z]/gi)?.sort() ?? [];
}

async function loadState(): Promise<TranslationState | null> {
  try {
    return JSON.parse(await readFile(statePath, "utf-8")) as TranslationState;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function translate(entries: Record<string, SourceEntry>): Promise<Record<string, string>> {
  const apiKey = process.env.INKOS_VN_TRANSLATION_API_KEY;
  const model = process.env.INKOS_VN_TRANSLATION_MODEL;
  const baseUrl = (process.env.INKOS_VN_TRANSLATION_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  if (!apiKey || !model) {
    throw new Error("Vietnamese catalog changed but INKOS_VN_TRANSLATION_API_KEY or INKOS_VN_TRANSLATION_MODEL is not configured");
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Translate InkOS user-interface copy into natural Vietnamese. Return one JSON object with exactly the supplied keys. Preserve placeholders, product names, commands, flags, environment variables, paths, Markdown and code tokens. Do not add commentary.",
        },
        { role: "user", content: JSON.stringify(entries) },
      ],
    }),
  });
  if (!response.ok) throw new Error(`Translation API failed (${response.status}): ${await response.text()}`);

  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Translation API returned no JSON content");
  return JSON.parse(content) as Record<string, string>;
}

async function main(): Promise<void> {
  const source = STUDIO_SOURCE_STRINGS as Record<string, SourceEntry>;
  const currentVietnamese = VI_STRINGS as Record<string, string>;
  const sourceKeys = Object.keys(source);
  const extraKeys = Object.keys(currentVietnamese).filter((key) => !(key in source));
  if (extraKeys.length > 0) throw new Error(`Vietnamese catalog has removed upstream keys: ${extraKeys.join(", ")}`);

  const state = await loadState();
  const needsTranslation: Record<string, SourceEntry> = {};
  for (const key of sourceKeys) {
    const existing = currentVietnamese[key];
    const sourceChanged = state !== null && state.sourceHashes[key] !== hashSource(source[key]);
    if (!existing || sourceChanged) needsTranslation[key] = source[key];
  }

  if (checkOnly) {
    const missing = sourceKeys.filter((key) => !currentVietnamese[key]);
    if (missing.length > 0) throw new Error(`Missing Vietnamese keys: ${missing.join(", ")}`);
    for (const key of sourceKeys) {
      if (placeholders(currentVietnamese[key]).join("|") !== placeholders(source[key].en).join("|")) {
        throw new Error(`Placeholder mismatch for ${key}`);
      }
    }
    return;
  }

  const generated = Object.keys(needsTranslation).length > 0 ? await translate(needsTranslation) : {};
  const nextVietnamese: Record<string, string> = {};
  for (const key of sourceKeys) {
    const value = generated[key] ?? currentVietnamese[key];
    if (!value?.trim()) throw new Error(`Translation is empty for ${key}`);
    if (placeholders(value).join("|") !== placeholders(source[key].en).join("|")) {
      throw new Error(`Placeholder mismatch for ${key}`);
    }
    nextVietnamese[key] = value;
  }

  const generatedFile = `/**\n * Vietnamese-only Studio catalog.\n * Generated/updated by scripts/sync-vietnamese-catalog.ts.\n */\nexport const VI_STRINGS = ${JSON.stringify(nextVietnamese, null, 2)} as const;\n`;
  await writeFile(viPath, generatedFile, "utf-8");

  await mkdir(dirname(statePath), { recursive: true });
  const nextState: TranslationState = {
    schemaVersion: 1,
    sourceHashes: Object.fromEntries(sourceKeys.map((key) => [key, hashSource(source[key])])),
  };
  await writeFile(statePath, `${JSON.stringify(nextState, null, 2)}\n`, "utf-8");
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
