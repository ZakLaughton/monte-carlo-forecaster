import { parseShareParams, buildShareParams } from "../share-params";

describe("buildShareParams", () => {
  it("produces a correctly formatted query string", () => {
    expect(
      buildShareParams({ weeks: [5, 3, 8, 6], size: 50, start: "2026-04-07" }),
    ).toBe("?weeks=5,3,8,6&size=50&start=2026-04-07");
  });

  it("handles a single week value", () => {
    expect(
      buildShareParams({ weeks: [4], size: 10, start: "2026-01-01" }),
    ).toBe("?weeks=4&size=10&start=2026-01-01");
  });
});

describe("parseShareParams", () => {
  describe("valid params", () => {
    it("parses all fields correctly", () => {
      expect(
        parseShareParams("?weeks=5,3,8,6&size=50&start=2026-04-07")
      ).toEqual({
        weeks: [5, 3, 8, 6],
        size: 50,
        start: "2026-04-07",
      });
    });

    it("handles a single week value", () => {
      expect(parseShareParams("?weeks=4&size=10&start=2026-01-01")).toEqual({
        weeks: [4],
        size: 10,
        start: "2026-01-01",
      });
    });
  });

  describe("missing or empty params", () => {
    it("returns null for empty string", () => {
      expect(parseShareParams("")).toBeNull();
    });

    it("returns null when weeks is missing", () => {
      expect(parseShareParams("?size=50&start=2026-04-07")).toBeNull();
    });

    it("returns null when size is missing", () => {
      expect(parseShareParams("?weeks=5,3&start=2026-04-07")).toBeNull();
    });

    it("returns null when start is missing", () => {
      expect(parseShareParams("?weeks=5,3&size=50")).toBeNull();
    });
  });

  describe("round-trip with buildShareParams", () => {
    it("parses what buildShareParams produces", () => {
      const input = { weeks: [5, 3, 8, 6], size: 50, start: "2026-04-07" };
      expect(parseShareParams(buildShareParams(input))).toEqual(input);
    });
  });

  describe("invalid param values", () => {
    it("returns null when weeks contains non-numeric values", () => {
      expect(parseShareParams("?weeks=5,abc,3&size=50&start=2026-04-07")).toBeNull();
    });

    it("returns null when size is non-numeric", () => {
      expect(parseShareParams("?weeks=5,3&size=abc&start=2026-04-07")).toBeNull();
    });

    it("returns null when weeks is empty", () => {
      expect(parseShareParams("?weeks=&size=50&start=2026-04-07")).toBeNull();
    });
  });
});
