# chain-test

## greet

A tiny CLI that prints a greeting. Requires [Bun](https://bun.sh).

```sh
bun greet.ts Alice          # Hello, Alice!
bun greet.ts                # Hello, world!
bun greet.ts Daud --shout   # HELLO, DAUD!
bun greet.ts --shout Daud   # HELLO, DAUD!
bun greet.ts --shout        # HELLO, WORLD!
```

`--shout` prints the greeting in upper case and may come before or after the name.

A name that is empty or only whitespace is treated as no name, and surrounding whitespace is trimmed.

Run the tests:

```sh
bun test
```
