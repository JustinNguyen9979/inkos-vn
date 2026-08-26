import { describe, expect, it } from "vitest";
import { BUILTIN_PROMPTS, BUILTIN_PROMPT_PACKS, loadBuiltinAgentSkills } from "@actalk/inkos-core";
import {
  localizePromptPacksForVietnamese,
  localizeSkillForVietnamese,
} from "./vi-agent-content";

describe("Vietnamese agent content", () => {
  it("localizes built-in skills but leaves imported skills untouched", () => {
    expect(localizeSkillForVietnamese({
      id: "inkos-long-writing",
      name: "inkos-long-writing",
      description: "中文。English.",
      source: "builtin",
    })).toMatchObject({ name: "Viết truyện dài", description: expect.stringContaining("xây dựng cảnh") });

    const imported = { id: "inkos-long-writing", name: "My skill", description: "Keep me", source: "project" };
    expect(localizeSkillForVietnamese(imported)).toBe(imported);
  });

  it("localizes built-in prompt display copy without replacing project overrides", () => {
    const localized = localizePromptPacksForVietnamese({
      packs: [{ id: "longform", title: "Longform Writing", description: "English", prompts: ["longform.writer"] }],
      prompts: [{
        id: "longform.writer",
        packId: "longform",
        title: "Longform Writer",
        defaultContent: "Default English",
        content: "My custom prompt",
        source: "project",
        overridden: true,
      }],
    });

    expect(localized.packs[0]).toMatchObject({ title: "Viết truyện dài" });
    expect(localized.prompts[0]?.title).toBe("Người viết truyện dài");
    expect(localized.prompts[0]?.defaultContent).toContain("Bạn là người viết chương truyện dài");
    expect(localized.prompts[0]?.content).toBe("My custom prompt");
  });

  it("shows the Vietnamese content for a non-overridden built-in prompt", () => {
    const localized = localizePromptPacksForVietnamese({
      packs: [],
      prompts: [{
        id: "play.start",
        packId: "play",
        title: "Play Start",
        defaultContent: "Default English",
        content: "Default English",
        source: "builtin",
        overridden: false,
      }],
    });

    expect(localized.prompts[0]?.content).toContain("hướng dẫn khởi tạo thế giới");
  });

  it("covers every built-in prompt pack and prompt", () => {
    const localized = localizePromptPacksForVietnamese({
      packs: BUILTIN_PROMPT_PACKS,
      prompts: BUILTIN_PROMPTS.map((prompt) => ({
        ...prompt,
        defaultContent: prompt.content,
        source: "builtin",
        overridden: false,
      })),
    });

    for (const [index, pack] of BUILTIN_PROMPT_PACKS.entries()) {
      expect(localized.packs[index]?.title, `missing Vietnamese pack: ${pack.id}`).not.toBe(pack.title);
      expect(localized.packs[index]?.description, `missing Vietnamese pack description: ${pack.id}`).not.toBe(pack.description);
    }
    for (const [index, prompt] of BUILTIN_PROMPTS.entries()) {
      expect(localized.prompts[index]?.title, `missing Vietnamese prompt: ${prompt.id}`).not.toBe(prompt.title);
      expect(localized.prompts[index]?.content, `missing Vietnamese prompt content: ${prompt.id}`).not.toBe(prompt.content);
    }
  });

  it("covers every built-in Agent Skill", async () => {
    const { skills } = await loadBuiltinAgentSkills();
    expect(skills.length).toBeGreaterThan(0);
    for (const skill of skills) {
      const localized = localizeSkillForVietnamese(skill);
      expect(localized.name, `missing Vietnamese skill name: ${skill.id}`).not.toBe(skill.name);
      expect(localized.description, `missing Vietnamese skill description: ${skill.id}`).not.toBe(skill.description);
    }
  });
});
