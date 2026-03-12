/* eslint-env jest */

import { getHeroBackgroundContainerStyle } from "../app/includes/HeroVideoBackground";

jest.mock("expo-video", () => ({
  useVideoPlayer: () => null,
  VideoView: () => null,
}));

describe("HeroVideoBackground", () => {
  it("stretches behind the scrollbar gutter on web", () => {
    expect(getHeroBackgroundContainerStyle("web")).toMatchObject({
      left: "50%",
      width: "100vw",
      transform: "translateX(-50%)",
    });
  });

  it("keeps the native layout unchanged outside web", () => {
    expect(getHeroBackgroundContainerStyle("ios")).toMatchObject({
      left: 0,
      width: "100%",
    });
  });
});
