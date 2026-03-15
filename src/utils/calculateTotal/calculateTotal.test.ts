import { describe, it, expect } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
  it("should sum a single number", () => {
    expect(calculateTotal("100")).toBe(100);
  });

  it("should sum multiple numbers separated by newlines", () => {
    expect(calculateTotal("10\n20\n30")).toBe(60);
  });

  it("should handle decimal numbers", () => {
    expect(calculateTotal("10.5\n20.3\n9.2")).toBe(40);
  });

  it("should handle empty input", () => {
    expect(calculateTotal("")).toBe(0);
  });

  it("should handle whitespace around numbers", () => {
    expect(calculateTotal("  10  \n  20  \n  30  ")).toBe(60);
  });

  it("should handle multiple consecutive newlines", () => {
    expect(calculateTotal("10\n\n20\n\n\n30")).toBe(60);
  });

  it("should handle negative numbers", () => {
    expect(calculateTotal("-10\n20\n-5")).toBe(5);
  });

  it("should ignore invalid/non-numeric values", () => {
    expect(calculateTotal("10\nabc\n20\n")).toBe(30);
  });

  it("should ignore NaN values", () => {
    expect(calculateTotal("10\nNaN\n20")).toBe(30);
  });

  it("should handle mixed valid and invalid values", () => {
    expect(calculateTotal("100\n50\ninvalid\n25\nNaN\n25")).toBe(200);
  });

  it("should handle zero", () => {
    expect(calculateTotal("0\n10\n0")).toBe(10);
  });

  it("should handle only whitespace", () => {
    expect(calculateTotal("\n  \n\n")).toBe(0);
  });

  it("should handle only invalid values", () => {
    expect(calculateTotal("abc\nxyz\n123invalid")).toBe(123);
  });

  it("should handle large numbers", () => {
    expect(calculateTotal("1000000\n2000000\n3000000")).toBe(6000000);
  });

  it("should handle very small decimals", () => {
    expect(calculateTotal("0.1\n0.2\n0.3")).toBeCloseTo(0.6, 10);
  });

  it("should sum numbers separated by commas", () => {
    expect(calculateTotal("10,20,30")).toBe(60);
  });

  it("should sum numbers separated by spaces", () => {
    expect(calculateTotal("10 20 30")).toBe(60);
  });

  it("should handle comma-separated decimals", () => {
    expect(calculateTotal("10.5,20.3,9.2")).toBe(40);
  });

  it("should handle space-separated decimals", () => {
    expect(calculateTotal("10.5 20.3 9.2")).toBe(40);
  });

  it("should handle mixed separators (commas and newlines)", () => {
    expect(calculateTotal("10,20\n30,40")).toBe(100);
  });

  it("should handle mixed separators (spaces and newlines)", () => {
    expect(calculateTotal("10 20\n30 40")).toBe(100);
  });

  it("should handle comma-separated with whitespace", () => {
    expect(calculateTotal("  10  , 20 , 30  ")).toBe(60);
  });

  it("should handle space-separated with mixed whitespace", () => {
    expect(calculateTotal("  10   20   30  ")).toBe(60);
  });

  it("should ignore invalid comma-separated values", () => {
    expect(calculateTotal("10,abc,20,xyz,30")).toBe(60);
  });

  it("should ignore invalid space-separated values", () => {
    expect(calculateTotal("10 abc 20 xyz 30")).toBe(60);
  });

  it("should handle negative numbers with commas", () => {
    expect(calculateTotal("-10,20,-5")).toBe(5);
  });

  it("should handle negative numbers with spaces", () => {
    expect(calculateTotal("-10 20 -5")).toBe(5);
  });
});
