#!/usr/bin/env bun

export function greet(name?: string, shout = false): string {
  const trimmed = name?.trim();
  const greeting = `Hello, ${trimmed ? trimmed : "world"}!`;
  return shout ? greeting.toUpperCase() : greeting;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const shout = args.includes("--shout");
  const name = args.find((arg) => arg !== "--shout");
  console.log(greet(name, shout));
}
