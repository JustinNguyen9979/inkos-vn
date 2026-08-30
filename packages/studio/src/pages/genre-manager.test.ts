import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GENRE_LANGUAGE_OPTIONS, GenreRulesMarkdown } from "./GenreManager";

describe("genre language options", () => {
  it("offers Vietnamese when creating or editing a genre", () => {
    expect(GENRE_LANGUAGE_OPTIONS).toContainEqual({
      value: "vi",
      label: "Tiếng Việt (vi)",
    });
  });
});

describe("genre rules Markdown", () => {
  it("renders saved rules as formatted Markdown", () => {
    const html = renderToStaticMarkup(createElement(GenreRulesMarkdown, {
      markdown: "## Nhịp truyện\n\n- Có tiến triển\n- Có hệ quả\n\n**Không kéo dài.**",
    }));

    expect(html).toContain("<h2");
    expect(html).toContain("<li");
    expect(html).toContain('data-streamdown="strong"');
    expect(html).toContain("Nhịp truyện");
  });
});
