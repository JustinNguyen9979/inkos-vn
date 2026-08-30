import { describe, expect, it } from "vitest";
import { GENRE_LANGUAGE_OPTIONS } from "./GenreManager";

describe("genre language options", () => {
  it("offers Vietnamese when creating or editing a genre", () => {
    expect(GENRE_LANGUAGE_OPTIONS).toContainEqual({
      value: "vi",
      label: "Tiếng Việt (vi)",
    });
  });
});
