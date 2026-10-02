# chain-test

## greet

A tiny CLI that prints a greeting. Requires [Bun](https://bun.sh).

```sh
bun greet.ts Alice   # Hello, Alice!
bun greet.ts         # Hello, world!
bun greet.ts Daud --shout   # HELLO, DAUD!
```

`--shout` upper-cases the greeting and may come before or after the name; on its own it prints `HELLO, WORLD!`.

A name that is empty or only whitespace is treated as no name, and surrounding whitespace is trimmed.

Run the tests:

```sh
bun test
```
