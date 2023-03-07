import { doc } from "https://deno.land/x/deno_doc@0.52.0/mod.ts";
import { resolve, toFileUrl } from "https://deno.land/std@0.149.0/path/mod.ts";
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
  const url = toFileUrl(resolve(Deno.cwd(), file));
  const nodes = await doc(url.href);

  await t.step(file, (t) =>
    // @ts-ignore that getTests promises resolve with a boolean
    Promise.all(
      getTests(nodes).map(({ functionName, examples }) =>
        // @ts-ignore that t.step resolve with a boolean
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
