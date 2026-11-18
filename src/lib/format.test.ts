import { describe, expect, it } from "vitest";
import { formatCompact, formatPrice, formatPercent, formatTimestamp, fearLabel } from "./format";

describe("market display helpers", () => {
  it("formats compact USD thresholds and prices", () => {
    expect(formatCompact(1_000_000)).toContain("$1M");
    expect(formatPrice(1_000)).toContain("1,000");
    expect(formatPrice(0.000012345)).toContain("0.00001235");
  });
  it("formats percentage direction and known fear labels", () => {
    expect(formatPercent(-2.25)).toContain("-2.25%");
    expect(formatPercent(0)).toContain("0.00%");
    expect(fearLabel(13)).toBe("Extreme fear");
    expect(fearLabel(53)).toBe("Neutral");
  });
  it("formats valid timestamps and safely handles invalid ones", () => {
    expect(formatTimestamp("2026-11-18T12:00:00.000Z")).toContain("18 Nov");
    expect(formatTimestamp("bad-value")).toBe("Unknown time");
  });
});
