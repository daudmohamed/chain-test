# chain-test

## greet

A tiny CLI that prints a greeting. Requires [Bun](https://bun.sh).

```sh
bun greet.ts Alice   # Hello, Alice!
bun greet.ts         # Hello, world!
bun greet.ts Daud --shout   # HELLO, DAUD!
bun greet.ts Daud --times 3   # prints the greeting 3 times, one per line
```

`--shout` upper-cases the greeting and may come before or after the name; on its own it prints `HELLO, WORLD!`.

`--times N` prints the greeting N times, one per line. N must be a whole number from 1 to 10; any other value (a missing value, 0, a negative, 11, or a non-numeric string) prints `error: --times must be a whole number from 1 to 10` to stderr and exits with code 1. It may come before or after the name and combines with `--shout`.

A name that is empty or only whitespace is treated as no name, and surrounding whitespace is trimmed.

Run the tests:

```sh
bun test
```
