#!/usr/bin/env bun

export function greet(name?: string): string {
  const trimmed = name?.trim();
  return `Hello, ${trimmed ? trimmed : "world"}!`;
}

if (import.meta.main) {
  console.log(greet(process.argv[2]));
}
