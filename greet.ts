#!/usr/bin/env bun

export function greet(name?: string, shout = false): string {
  const trimmed = name?.trim();
  const greeting = `Hello, ${trimmed ? trimmed : "world"}!`;
  return shout ? greeting.toUpperCase() : greeting;
}

if (import.meta.main) {
  console.log(greet(process.argv[2]));
}
