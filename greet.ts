#!/usr/bin/env bun

export function greet(name?: string, options: { shout?: boolean } = {}): string {
  const trimmed = name?.trim();
  const message = `Hello, ${trimmed ? trimmed : "world"}!`;
  return options.shout ? message.toUpperCase() : message;
}

export function parseArgs(argv: string[]): { name?: string; shout: boolean } {
  const shout = argv.includes("--shout");
  const rest = argv.filter((arg) => arg !== "--shout");
  return { name: rest[0], shout };
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
  const { name, shout } = parseArgs(process.argv.slice(2));
  console.log(greet(name, { shout }));
}
