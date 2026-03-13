/* eslint-env jest */

import fs from "node:fs";
import path from "node:path";

const metroConfigSource = fs.readFileSync(
  path.join(process.cwd(), "metro.config.js"),
  "utf8"
);

describe("metro config", () => {
  it("uses the Expo SVG transformer entrypoint", () => {
    expect(metroConfigSource).toContain(
      'require.resolve("react-native-svg-transformer/expo")'
    );
  });

  it("treats svg files as source modules", () => {
    expect(metroConfigSource).toContain('filter((ext) => ext !== "svg")');
    expect(metroConfigSource).toContain('[...resolver.sourceExts, "svg"]');
  });

  it("aliases use-latest-callback to the local compatibility shim", () => {
    expect(metroConfigSource).toContain('moduleName === "use-latest-callback"');
    expect(metroConfigSource).toContain('shims/useLatestCallback.js');
  });
});
