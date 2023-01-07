import { doc } from "https://deno.land/x/deno_doc@0.51.0/mod.ts";
import { getTests, runExample } from "./lib.js";

/**
 * The main entry point. Call it with the path to the file to test, and run it
 * using Mocha.
 *
 * @param {string} file
 * @param {Deno.TestContext} t
 * @example doctest(null, "index.js")
 */
export async function doctest(t, file) {
  const url = new URL(file, import.meta.url);
  const nodes = await doc(url.href);
  const module = await import(url.href);

  for (const symbol in module) {
    // @ts-ignore TS doesn't like us assigning arbitrary properties to
    // globalThis, but we don't have a better way yet 🤷
    globalThis[symbol] = module[symbol];
  }

  await t.step(file, (t) =>
    // @ts-ignore that getTests promises resolve with a boolean
    Promise.all(
      getTests(nodes).map(({ functionName, examples }) =>
        t.step({
          name: functionName,
          fn: (t) =>
            // @ts-ignore that the runExample promises resolve with a boolean
            Promise.all(examples.map((example) => runExample(t, example))),
          sanitizeOps: false,
          sanitizeResources: false,
          sanitizeExit: false,
        })
      ),
    ));
}
