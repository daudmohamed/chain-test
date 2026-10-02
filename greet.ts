#!/usr/bin/env bun

export function greet(name?: string, options: { shout?: boolean } = {}): string {
  const trimmed = name?.trim();
  const message = `Hello, ${trimmed ? trimmed : "world"}!`;
  return options.shout ? message.toUpperCase() : message;
}

export function parseArgs(argv: string[]): { name?: string; shout: boolean; times?: string | null } {
  const positionals: string[] = [];
  let shout = false;
  let sawTimes = false;
  let times: string | null | undefined = undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--shout") {
      shout = true;
    } else if (arg === "--times") {
      sawTimes = true;
      const next = argv[i + 1];
      if (next === undefined) {
        times = null;
      } else {
        times = next;
        i++;
      }
    } else {
      positionals.push(arg);
    }
  }

  const result: { name?: string; shout: boolean; times?: string | null } = {
    name: positionals[0],
    shout,
  };
  if (sawTimes) result.times = times;
  return result;
}

const TIMES_ERROR = "--times must be a whole number from 1 to 10";

export function parseTimes(times: string | null | undefined): number {
  if (times === undefined) return 1;
  if (typeof times !== "string" || !/^\d+$/.test(times)) throw new Error(TIMES_ERROR);
  const count = parseInt(times, 10);
  if (count < 1 || count > 10) throw new Error(TIMES_ERROR);
  return count;
}

if (import.meta.main) {
  const { name, shout, times } = parseArgs(process.argv.slice(2));
  let count = 0;
  let failed = false;
  try {
    count = parseTimes(times);
  } catch (err) {
    failed = true;
    console.error(`error: ${(err as Error).message}`);
    process.exitCode = 1;
  }
  if (!failed) {
    const line = greet(name, { shout });
    for (let i = 0; i < count; i++) {
      console.log(line);
    }
  }
}
