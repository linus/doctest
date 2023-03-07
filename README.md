# 🧪 doctest

`doctest` is no fuss [doctests][doctest] for Deno. Document your code with
[JSDoc][jsdoc], provide your [@example][example], and run your tests with
`deno test`.

![CI status](https://github.com/linus/doctest/workflows/CI/badge.svg)
![CodeQL status](https://github.com/linus/doctest/workflows/CodeQL/badge.svg)

## Usage

1. In your code, document your functions with JSDoc tags, providing `@example`
   tags for your examples:

```js
/**
 * A cool function
 *
 * @param {string} name
 * @returns {string} A greeting
 * @example hello("Mr von Neumann")
 * //=> "Hello, Mr von Neumann!"
 */
export function hello(name) {
  return `Hello, ${name}!`;
}
```

**Notes**: The function under test **must** be exported, and it **cannot** be a
default export. Only named exports work. The expected result **must** be
prefixed with the string `//=>` on the beginning of a new line, after the
example code.

2. To execute the test, add a file which is discovered by `deno test` (e.g. in a
   `tests/` directory), and call `doctest` with the path to the file, relative
   to the project root, to be tested:

```js
import { doctest } from "https://deno.land/x/doctest@{VERSION}/mod.js";

/**
 * A test
 */
Deno.test("Tests", (t) => doctest(t, "hello.js"));
```

Where {VERSION} should be substituted with the specific version you want to use.

3. Run `deno test` and relax. Your code _and_ your examples are tested!

```bash
$ deno test

  Tests
    hello.js
      hello
        ✔ hello("Mr von Neumann")
//=> "Hello, Mr von Neumann!"


  1 passing (6ms)
```

## Advanced

`doctest` can handle Promises (in both examples and expected results), expected
Errors (both thrown Errors and rejected Promises), generator functions, and
more. Examples are in [spec](spec). This also acts as the specification and test
suite for `doctest`.

## Development

`doctest` is under active development. Pull requests are welcome:

1. Fork the repository
2. Clone the project to your own machine
3. Commit changes to a new branch of your fork
4. Push your work (making sure the code is tested!)
5. Submit a pull request

## Authors

Linus Thiel <linus@yesbabyyes.se>.

## See also

A similar module for Node.js is [@linus/testy](https://github.com/linus/testy).

## Thank you

- [kiwicopple](https://github.com/kiwicopple) for providing
  `@supabase/doctest-js`, giving rise to adequate frustration to think of a new
  solution.
- [ry](https://github.com/ry) as always, for Node.js, Deno and more.

## License

ISC License

Copyright 2023 Linus Thiel.

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

[doctest]: https://docs.python.org/3/library/doctest.html
[jsdoc]: https://jsdoc.app/
[example]: https://jsdoc.app/tags-example.html
