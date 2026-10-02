import { test, expect } from "bun:test";
import { greet, parseArgs, parseTimes } from "./greet.ts";

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

test("parseArgs extracts --times value before the name", () => {
  expect(parseArgs(["--times", "3", "Daud"])).toEqual({ name: "Daud", shout: false, times: "3" });
});

test("parseArgs extracts --times value after the name", () => {
  expect(parseArgs(["Daud", "--times", "3"])).toEqual({ name: "Daud", shout: false, times: "3" });
});

test("parseArgs combines --times with --shout in any order", () => {
  expect(parseArgs(["Daud", "--shout", "--times", "4"])).toEqual({ name: "Daud", shout: true, times: "4" });
  expect(parseArgs(["Daud", "--times", "4", "--shout"])).toEqual({ name: "Daud", shout: true, times: "4" });
});

test("parseArgs yields null for a value-less --times", () => {
  expect(parseArgs(["Daud", "--times"])).toEqual({ name: "Daud", shout: false, times: null });
});

test("parseArgs keeps the --times value out of the name", () => {
  expect(parseArgs(["--times", "3"]).name).toBe(undefined);
});

test("parseArgs uses the last --times value when given twice", () => {
  expect(parseArgs(["--times", "2", "--times", "5"]).times).toBe("5");
});

test("parseArgs treats the token after --times as its value even if it looks like a flag", () => {
  expect(parseArgs(["--times", "--shout"]).times).toBe("--shout");
});

test("parseTimes returns each valid count", () => {
  expect(parseTimes("1")).toBe(1);
  expect(parseTimes("2")).toBe(2);
  expect(parseTimes("5")).toBe(5);
  expect(parseTimes("10")).toBe(10);
});

test("parseTimes defaults to 1 when times is undefined", () => {
  expect(parseTimes(undefined)).toBe(1);
});

test("parseTimes accepts digit-prefixed forms within range", () => {
  expect(parseTimes("07")).toBe(7);
});

test("parseTimes throws for a missing value (null)", () => {
  expect(() => parseTimes(null)).toThrow("--times must be a whole number from 1 to 10");
});

test("parseTimes throws for 0", () => {
  expect(() => parseTimes("0")).toThrow("--times must be a whole number from 1 to 10");
});

test("parseTimes throws for a negative", () => {
  expect(() => parseTimes("-1")).toThrow("--times must be a whole number from 1 to 10");
});

test("parseTimes throws for 11", () => {
  expect(() => parseTimes("11")).toThrow("--times must be a whole number from 1 to 10");
});

test("parseTimes throws for non-numeric strings", () => {
  expect(() => parseTimes("abc")).toThrow("--times must be a whole number from 1 to 10");
  expect(() => parseTimes("2.5")).toThrow("--times must be a whole number from 1 to 10");
});

async function run(args: string[]) {
  const proc = Bun.spawn([process.execPath, "greet.ts", ...args], {
    stdout: "pipe",
    stderr: "pipe",
    cwd: import.meta.dir,
  });
  const out = await new Response(proc.stdout).text();
  const err = await new Response(proc.stderr).text();
  const code = await proc.exited;
  return { out, err, code };
}

test("CLI: name then --shout", async () => {
  expect(await run(["Daud", "--shout"])).toEqual({ out: "HELLO, DAUD!\n", err: "", code: 0 });
});

test("CLI: --shout then name", async () => {
  expect(await run(["--shout", "Daud"])).toEqual({ out: "HELLO, DAUD!\n", err: "", code: 0 });
});

test("CLI: --shout alone", async () => {
  expect(await run(["--shout"])).toEqual({ out: "HELLO, WORLD!\n", err: "", code: 0 });
});

test("CLI: no flag", async () => {
  expect(await run(["Alice"])).toEqual({ out: "Hello, Alice!\n", err: "", code: 0 });
});

test("CLI: --times prints the greeting N times, one per line", async () => {
  expect(await run(["--times", "3", "Daud"])).toEqual({
    out: "Hello, Daud!\nHello, Daud!\nHello, Daud!\n",
    err: "",
    code: 0,
  });
});

test("CLI: --times 1 reproduces the single-line output", async () => {
  expect(await run(["--times", "1", "Alice"])).toEqual({
    out: "Hello, Alice!\n",
    err: "",
    code: 0,
  });
});

test("CLI: --times with --shout (flag first)", async () => {
  expect(await run(["--shout", "--times", "2", "Daud"])).toEqual({
    out: "HELLO, DAUD!\nHELLO, DAUD!\n",
    err: "",
    code: 0,
  });
});

test("CLI: --times with --shout (shout first)", async () => {
  expect(await run(["Daud", "--times", "2", "--shout"])).toEqual({
    out: "HELLO, DAUD!\nHELLO, DAUD!\n",
    err: "",
    code: 0,
  });
});

test("CLI: --times with no value prints error and exits 1", async () => {
  expect(await run(["Daud", "--times"])).toEqual({
    out: "",
    err: "error: --times must be a whole number from 1 to 10\n",
    code: 1,
  });
});

test("CLI: --times 0 prints error and exits 1", async () => {
  expect(await run(["--times", "0"])).toEqual({
    out: "",
    err: "error: --times must be a whole number from 1 to 10\n",
    code: 1,
  });
});

test("CLI: --times -1 prints error and exits 1", async () => {
  expect(await run(["--times", "-1"])).toEqual({
    out: "",
    err: "error: --times must be a whole number from 1 to 10\n",
    code: 1,
  });
});

test("CLI: --times 11 prints error and exits 1", async () => {
  expect(await run(["--times", "11"])).toEqual({
    out: "",
    err: "error: --times must be a whole number from 1 to 10\n",
    code: 1,
  });
});

test("CLI: --times abc prints error and exits 1", async () => {
  expect(await run(["--times", "abc"])).toEqual({
    out: "",
    err: "error: --times must be a whole number from 1 to 10\n",
    code: 1,
  });
});

test("CLI: --times 2.5 prints error and exits 1", async () => {
  expect(await run(["--times", "2.5"])).toEqual({
    out: "",
    err: "error: --times must be a whole number from 1 to 10\n",
    code: 1,
  });
});
