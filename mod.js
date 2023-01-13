import { doc } from "https://deno.land/x/deno_doc@0.52.0/mod.ts";
import { getTests, runExample } from "./lib.js";

/**
 * The main entry point. Call it with the path to the file to test, and run it
 * using Deno.test().
 *
 * @param {Deno.TestContext} t
 * @param {string} file
 * @example Deno.test("doctest", (t) => doctest(t, "lib.js"));
 * //=> undefined
 */
export async function doctest(t, file) {
  const url = new URL(file, import.meta.url);
  const nodes = await doc(url.href);

  await t.step(file, (t) =>
    // @ts-ignore that getTests promises resolve with a boolean
    Promise.all(
      getTests(nodes).map(({ functionName, examples }) =>
        t.step({
          name: functionName,
          fn: (t) =>
            // @ts-ignore that the runExample promises resolve with a boolean
            Promise.all(
              examples.map((example) => runExample(t, example, url.href)),
            ),
          sanitizeOps: false,
          sanitizeResources: false,
          sanitizeExit: false,
        })
      ),
    ));
}
