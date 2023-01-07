import { assertEquals } from "https://deno.land/std@0.141.0/testing/asserts.ts";

/**
 * @typedef {import("https://deno.land/x/deno_doc@0.51.0/lib/types.d.ts").DocNode} DocNode
 * @typedef {import("https://deno.land/x/deno_doc@0.51.0/lib/types.d.ts").Location} Location
 * @typedef {{
 *   test: string,
 *   example: string,
 *   expected: string
 * }} Example
 * @typedef {{
 *   functionName: string,
 *   location: Location,
 *   examples: Example[]
 * }} DocTest
 */

/**
 * @param {DocNode[]} nodes
 * @returns {DocTest[]}
 * @example getTests([{
 *   name: "Math.max",
 *   location: {
 *     filename: "file:///tmp/index.js",
 *     line: 10,
 *     col: 0
 *   },
 *   jsDoc: {
 *     tags: [{
 *       kind: "example",
 *       doc: "Math.max(1, 3)\n//=> 3"
 *     }]
 *   }
 * }])
 * //=> [
 *   {
 *     functionName: "Math.max",
 *     location: {
 *       filename: "file:///tmp/index.js",
 *       line: 10,
 *       col: 0
 *     },
 *     examples: [{
 *       test: "Math.max(1, 3)",
 *       example: "Math.max(1, 3)\n//=> 3",
 *       expected: "3"
 *     }]
 *   }
 * ]
 * @example getTests([{
 *   kind: "class",
 *   classDef: {
 *     methods: [{
 *       jsDoc: {
 *         tags: [{
 *           kind: "example",
 *           doc: "add(1, 2)\n//=> 3"
 *         }]
 *       },
 *       name: "add",
 *       location: {
 *         filename: "file:///tmp/index.js",
 *         line: 17,
 *         col: 4711
 *       }
 *     }]
 *   }
 * }])
 * //=> [
 *   {
 *     functionName: "add",
 *     location: {
 *       filename: "file:///tmp/index.js",
 *       line: 17,
 *       col: 4711
 *     },
 *     examples: [{
 *       test: "add(1, 2)",
 *       example: "add(1, 2)\n//=> 3",
 *       expected: "3"
 *     }]
 *   }
 * ]
 */
export function getTests(nodes) {
  return nodes
    .flatMap((node) =>
      node.kind === "class"
        ? node.classDef.methods.map(({ jsDoc, name, location }) => ({
          jsDoc,
          name,
          location,
        }))
        : {
          jsDoc: node.jsDoc,
          name: node.name,
          location: node.location,
        }
    )
    .filter(({ jsDoc }) => jsDoc?.tags?.some(({ kind }) => kind === "example"))
    .map((node) => {
      // @ts-ignore TS not understanding that jsDoc.tags must be present
      const examples = node.jsDoc.tags
        .filter(({ kind }) => kind === "example")
        // @ts-ignore TS not understanding that this is a kind "example" which
        // has a doc property
        .map(({ doc }) => {
          const [test, expected] = doc.split(/^\s*\/\/\s*=>\s*/m, 2);
          return {
            test: test.trim(),
            example: doc,
            expected,
          };
        })
        .filter(({ test, expected }) =>
          typeof test === "string" && typeof expected === "string"
        );

      return {
        ...node,
        examples,
      };
    })
    .filter(({ examples }) => examples.length > 0)
    .map(({
      name: functionName,
      location,
      examples,
    }) => ({
      functionName,
      location,
      examples,
    }));
}

/**
 * @param {Deno.TestContext} t
 * @param {Example} param1
 * @returns {Promise<boolean>}
 */
export function runExample(t, {
  test,
  example,
  expected: result,
}) {
  return t.step(example, async () => {
    const [actual, expected] = await Promise.allSettled([
      new Promise((resolve, reject) => {
        try {
          resolve(eval?.call(null, test));
        } catch (e) {
          reject(e);
        }
      }),
      new Promise((resolve, reject) => {
        try {
          const code = result.trim().startsWith("throw ")
            ? result
            : `(${result})`;
          resolve(eval?.call(null, code));
        } catch (e) {
          reject(e);
        }
      }),
    ]);

    if (actual.status === "rejected") {
      // If the example was rejected, and that's unexpected, then we should
      // notify someone!
      if (expected.status !== "rejected") throw actual.reason;
      // Else - Aha! We expected this! Make sure the error caught is the
      // expected one:
      assertEquals(actual.reason, expected.reason);
    } else if (expected.status === "fulfilled") {
      assertEquals(actual.value, expected.value);
    } else {
      // If we expected an error, but received a result, let's throw the
      // expected error to raise a flag that something is wrong:
      throw expected.reason;
    }
  });
}
