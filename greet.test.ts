import { test, expect } from "bun:test";
import { greet, parseArgs } from "./greet.ts";

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

test("shouts the greeting when shout is true", () => {
  expect(greet("Daud", { shout: true })).toBe("HELLO, DAUD!");
  expect(greet(undefined, { shout: true })).toBe("HELLO, WORLD!");
});

test("does not shout by default or when shout is false", () => {
  expect(greet("Alice")).toBe("Hello, Alice!");
  expect(greet("Alice", { shout: false })).toBe("Hello, Alice!");
});

test("parseArgs finds the flag after the name", () => {
  expect(parseArgs(["Daud", "--shout"])).toEqual({ name: "Daud", shout: true });
});

test("parseArgs finds the flag before the name", () => {
  expect(parseArgs(["--shout", "Daud"])).toEqual({ name: "Daud", shout: true });
});

test("parseArgs handles the flag alone and no arguments", () => {
  expect(parseArgs(["--shout"])).toEqual({ shout: true });
  expect(parseArgs([])).toEqual({ shout: false });
});

test("parseArgs ignores extra positionals and keeps other flags positional", () => {
  expect(parseArgs(["A", "B"]).name).toBe("A");
  expect(parseArgs(["--foo"])).toEqual({ name: "--foo", shout: false });
});

async function run(args: string[]) {
  const proc = Bun.spawn([process.execPath, "greet.ts", ...args], {
    stdout: "pipe",
    cwd: import.meta.dir,
  });
  const out = await new Response(proc.stdout).text();
  const code = await proc.exited;
  return { out, code };
}

test("CLI: name then --shout", async () => {
  expect(await run(["Daud", "--shout"])).toEqual({ out: "HELLO, DAUD!\n", code: 0 });
});

test("CLI: --shout then name", async () => {
  expect(await run(["--shout", "Daud"])).toEqual({ out: "HELLO, DAUD!\n", code: 0 });
});

test("CLI: --shout alone", async () => {
  expect(await run(["--shout"])).toEqual({ out: "HELLO, WORLD!\n", code: 0 });
});

test("CLI: no flag", async () => {
  expect(await run(["Alice"])).toEqual({ out: "Hello, Alice!\n", code: 0 });
});
