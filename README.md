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
Deno.test("Tests", doctest("hello.js"));
```

Where {VERSION} should be substituted with the specific version you want to use.

3. Run `deno test` and relax. Your code _and_ your examples are tested!

```
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

### Running `doctest` tests

```bash
$ deno test -A
running 2 tests from ./test.js
Doctest ...
  mod ... ignored (0ms)
  lib.js ...
    getTests ...
      getTests([{
  name: "Math.max",
  location: {
    filename: "file:///tmp/index.js",
    line: 10,
    col: 0
  },
  jsDoc: {
    tags: [{
      kind: "example",
      doc: "Math.max(1, 3)\n//=> 3"
    }]
  }
}])
//=> [
  {
    functionName: "Math.max",
    location: {
      filename: "file:///tmp/index.js",
      line: 10,
      col: 0
    },
    examples: [{
      test: "Math.max(1, 3)",
      example: "Math.max(1, 3)\n//=> 3",
      expected: "3"
    }]
  }
] ... ok (20ms)
      getTests([{
  kind: "class",
  classDef: {
    methods: [{
      jsDoc: {
        tags: [{
          kind: "example",
          doc: "add(1, 2)\n//=> 3"
        }]
      },
      name: "add",
      location: {
        filename: "file:///tmp/index.js",
        line: 17,
        col: 4711
      }
    }]
  }
}])
//=> [
  {
    functionName: "add",
    location: {
      filename: "file:///tmp/index.js",
      line: 17,
      col: 4711
    },
    examples: [{
      test: "add(1, 2)",
      example: "add(1, 2)\n//=> 3",
      expected: "3"
    }]
  }
] ... ok (12ms)
    getTests ... ok (22ms)
  lib.js ... ok (30ms)
Doctest ... ok (514ms)
Specification ...
  Functions returning a Promise can be tested like a regular function ...
    spec/returns-promise.js ...
      returnsPromise ...
        returnsPromise(17)
//=> 17 ... ok (30ms)
        returnsPromise(17)
//=> Promise.resolve(17) ... ok (22ms)
      returnsPromise ... ok (30ms)
      rejectsPromise ...
        rejectsPromise(17)
//=> throw new Error(17) ... ok (15ms)
        rejectsPromise(17)
//=> Promise.reject(Error(17)) ... ok (9ms)
      rejectsPromise ... ok (18ms)
    spec/returns-promise.js ... ok (37ms)
  Functions returning a Promise can be tested like a regular function ... ok (42ms)
  Functions throwing an Error can be tested by expecting a thrown Error ...
    spec/expect-error.js ...
      throws ...
        throws(4711)
//=> throw new Error(4711) ... ok (26ms)
      throws ... ok (26ms)
    spec/expect-error.js ... ok (31ms)
  Functions throwing an Error can be tested by expecting a thrown Error ... ok (36ms)
  Generator functions can be tested in different ways  ...
    spec/generator-function.js ...
      generateValues ...
        generateValues(["foo", "bar", "baz"]).next()
// Call .next() immediately to check the first value
//=> {
  value: "foo",
  done: false
} ... ok (62ms)
        Array.from(generateValues([42, 17]))
// Consume the iterator into an array, and test that
//=> [42, 17] ... ok (54ms)
        // Assign the iterator to a variable and iterate as many steps as needed
const it = generateValues(["baz", "qux"]);
it.next();
it.next();
it.next();
//=> {
  value: undefined,
  done: true
} ... ok (47ms)
      generateValues ... ok (63ms)
      fibonacci ...
        fibonacci().next().value
//=> 0 ... ok (39ms)
        const f = fibonacci();
f.next();
f.next().value
//=> 1 ... ok (32ms)
        const f = fibonacci();
f.next();
f.next();
f.next().value
//=> 1 ... ok (25ms)
        const f = fibonacci();
[...Array(13)].map(() => f.next().value)
//=> [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144] ... ok (18ms)
        const f = fibonacci([8, 13]);
[...Array(13)].map(() => f.next().value)
//=> [8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584] ... ok (10ms)
      fibonacci ... ok (39ms)
    spec/generator-function.js ... ok (70ms)
  Generator functions can be tested in different ways  ... ok (76ms)
  Examples without a result are not tested ...
    spec/example-without-result.js ... ok (4ms)
  Examples without a result are not tested ... ok (8ms)
  Sample passing module (@supabase/doctest-js) ...
    spec/sample-passing-module.js ...
      titleize ...
        titleize('wOaH')
//=> 'Woah' ... ok (80ms)
        titleize('w')
//=> 'W' ... ok (70ms)
      titleize ... ok (81ms)
      stringData ...
        stringData(
  'woah'
)
//=> {
  length: 4,
  vowels: 2,
  consonants: 2
} ... ok (62ms)
      stringData ... ok (62ms)
      split ...
        split('why am i doing this?', ' ')
//=> [ 'why', 'am', 'i', 'doing', 'this?' ] ... ok (54ms)
      split ... ok (54ms)
      add ...
        add(1, 2)
//=> 3 ... ok (45ms)
        add(3, 4)
//=> 7 ... ok (38ms)
        add(3, 4)
//=> 7 ... ok (30ms)
      add ... ok (45ms)
      objectToQueryString ...
        objectToQueryString({
 param1: 'hello',
 param2: 'world'
})
//=> 'param1=hello&param2=world' ... ok (23ms)
      objectToQueryString ... ok (23ms)
      convertColumn ...
        convertColumn(
 'age',
 [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}],
 ['Paul', '33'],
 []
)
//=> 33 ... ok (15ms)
        convertColumn(
 'age',
 [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}],
 ['Paul', '33'],
 ['int4']
)
//=> '33' ... ok (10ms)
      convertColumn ... ok (17ms)
    spec/sample-passing-module.js ... ok (90ms)
  Sample passing module (@supabase/doctest-js) ... ok (97ms)
  Sample passing class (@supabase/doctest-js) ...
    spec/sample-passing-class.js ...
      add ...
        new Arithmetic().add(1, 2)
//=> 3 ... ok (39ms)
        const arithmetic = new Arithmetic();
arithmetic.add(1, 9)
//=> 10 ... ok (31ms)
      add ... ok (39ms)
      subtract ...
        new Arithmetic().subtract(10, 2)
//=> 8 ... ok (23ms)
      subtract ... ok (23ms)
      addToThis ...
        new Arithmetic(7).addToThis(3)
//=> 10 ... ok (15ms)
      addToThis ... ok (15ms)
      increaseThis ...
        const arithmetic = new Arithmetic(17);
arithmetic.increaseThis(42);
arithmetic.foo
//=> 59 ... ok (9ms)
      increaseThis ... ok (9ms)
    spec/sample-passing-class.js ... ok (45ms)
  Sample passing class (@supabase/doctest-js) ... ok (52ms)
Specification ... ok (316ms)

ok | 2 passed (59 steps) | 0 failed | 0 ignored (1 step) (850ms)
```

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
