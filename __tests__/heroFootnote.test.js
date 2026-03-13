/* eslint-env jest */

import fs from "node:fs";
import path from "node:path";

const readRepoFile = (...segments) =>
  fs.readFileSync(path.join(process.cwd(), ...segments), "utf8");

describe("hero footnote", () => {
  it("keeps the WSL 2 label together across translations", () => {
    const localizationSource = readRepoFile("config", "localization.js");
    const windowsExperimentalLines =
      localizationSource.match(/windowsExperimental: ".*"/g) || [];

    expect(windowsExperimentalLines.length).toBeGreaterThan(0);
    windowsExperimentalLines.forEach((line) => {
      expect(line).toContain("WSL\\u00A02");
    });
  });

  it("uses a dedicated responsive style for the hero footnote", () => {
    const mainSource = readRepoFile("app", "Main.js");

    expect(mainSource).toMatch(/style=\{\[\s*styles\.heroFootnote,\s*IS_SMALL_SCREEN && styles\.heroFootnoteSmall/);
    expect(mainSource).toMatch(/heroFootnote:\s*\{[\s\S]*textAlign:\s*'center'/);
    expect(mainSource).toMatch(/heroFootnoteSmall:\s*\{[\s\S]*maxWidth:\s*280/);
  });
});
