/* eslint-env jest */

import fs from "node:fs";
import path from "node:path";

const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
);

describe("package manifest", () => {
  it("does not pin react-navigation packages that expo-router already owns", () => {
    expect(packageJson.dependencies?.["@react-navigation/native"]).toBeUndefined();
    expect(packageJson.dependencies?.["@react-navigation/bottom-tabs"]).toBeUndefined();
  });

  it("pins use-latest-callback to the web-safe version", () => {
    expect(packageJson.pnpm?.overrides?.["use-latest-callback"]).toBe("0.2.3");
    expect(packageJson.pnpm?.overrides?.["@react-navigation/core>use-latest-callback"]).toBe("0.2.3");
    expect(packageJson.pnpm?.overrides?.["@react-navigation/elements>use-latest-callback"]).toBe("0.2.3");
    expect(packageJson.pnpm?.overrides?.["@react-navigation/native-stack>use-latest-callback"]).toBe("0.2.3");
  });
});
