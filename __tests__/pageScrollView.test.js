/* eslint-env jest */

import fs from "node:fs";
import path from "node:path";

const readRepoFile = (...segments) =>
  fs.readFileSync(path.join(process.cwd(), ...segments), "utf8");

describe("page-level web scrolling", () => {
  it("marks the main page scroll container for page scrollbar styling", () => {
    const mainSource = readRepoFile("app", "Main.js");

    expect(mainSource).toMatch(/<ScrollView[^>]*testID=["']page-scroll-view["']/);
  });

  it("hides the page scrollbar gutter on web", () => {
    const html = readRepoFile("public", "index.html");

    expect(html).toContain('[data-testid="page-scroll-view"]');
    expect(html).toMatch(/\[data-testid="page-scroll-view"\]\s*\{[\s\S]*scrollbar-width:\s*none;/);
    expect(html).toMatch(/\[data-testid="page-scroll-view"\]::-webkit-scrollbar\s*\{[\s\S]*width:\s*0;/);
  });
});
