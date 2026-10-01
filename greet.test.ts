import { test, expect } from "bun:test";
import { greet } from "./greet.ts";

test("greets the given name", () => {
  expect(greet("Alice")).toBe("Hello, Alice!");
});

test("falls back to world when no name is given", () => {
  expect(greet()).toBe("Hello, world!");
});

test("trims whitespace around the name", () => {
  expect(greet("  Alice  ")).toBe("Hello, Alice!");
});

test("treats an empty or whitespace-only name as no name", () => {
  expect(greet("")).toBe("Hello, world!");
  expect(greet("   ")).toBe("Hello, world!");
});
