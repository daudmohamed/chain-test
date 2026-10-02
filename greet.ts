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

if (import.meta.main) {
  const { name, shout } = parseArgs(process.argv.slice(2));
  console.log(greet(name, { shout }));
}
