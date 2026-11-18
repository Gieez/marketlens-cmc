import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const mark = () => readFileSync(resolve(process.cwd(), "public/marketlens-mark.svg"), "utf8");
const logo = () => readFileSync(resolve(process.cwd(), "public/marketlens-logo.svg"), "utf8");

describe("MarketLens brand assets", () => {
  it("provides a self-contained square mark for the app icon", () => {
    const svg = mark();
    expect(svg).toContain('viewBox="0 0 64 64"');
    expect(svg).toContain(">MarketLens mark</title>");
    expect(svg).toContain("<circle");
    expect(svg).toContain("<path");
    expect(svg).not.toContain("<script");
    expect(svg).not.toContain("<a");
    expect(svg).not.toContain("href=");
  });

  it("provides a horizontal wordmark for video and pitch assets", () => {
    const svg = logo();
    expect(svg).toContain(">MarketLens</title>");
    expect(svg).toContain('viewBox="0 0 300 72"');
    expect(svg).toContain("market");
    expect(svg).toContain("lens");
    expect(svg).toContain("<path");
    expect(svg).not.toContain("<script");
    expect(svg).not.toContain("<a");
    expect(svg).not.toContain("href=");
  });
});
