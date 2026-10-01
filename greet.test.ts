import { test, expect } from "bun:test";
import { greet } from "./greet.ts";
import { join } from "node:path";

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

test("shouts the greeting for a given name", () => {
  expect(greet("Daud", true)).toBe("HELLO, DAUD!");
});

test("shouts the world fallback when no name is given", () => {
  expect(greet(undefined, true)).toBe("HELLO, WORLD!");
});

const script = join(import.meta.dir, "greet.ts");

function runCli(...args: string[]) {
  const result = Bun.spawnSync([process.execPath, script, ...args]);
  return { stdout: result.stdout.toString(), exitCode: result.exitCode };
}

test("cli: --shout after the name", () => {
  expect(runCli("Daud", "--shout")).toEqual({ stdout: "HELLO, DAUD!\n", exitCode: 0 });
});

test("cli: --shout before the name", () => {
  expect(runCli("--shout", "Daud")).toEqual({ stdout: "HELLO, DAUD!\n", exitCode: 0 });
});

test("cli: --shout alone falls back to world", () => {
  expect(runCli("--shout")).toEqual({ stdout: "HELLO, WORLD!\n", exitCode: 0 });
});
