import { doctest } from "./mod.js";

Deno.test("Doctest", async (t) => {
  await t.step({
    name: "mod",
    ignore: true,
    fn: doctest("mod.js"),
  });
  await doctest("lib.js")(t);
});

Deno.test("Specification", async (t) => {
  await t.step(
    "Functions returning a Promise can be tested like a regular function",
    doctest("spec/returns-promise.js"),
  );
  await t.step(
    "Functions throwing an Error can be tested by expecting a thrown Error",
    doctest("spec/expect-error.js"),
  );
  await t.step(
    "Generator functions can be tested in different ways ",
    doctest("spec/generator-function.js"),
  );
  await t.step(
    "Examples without a result are not tested",
    doctest("spec/example-without-result.js"),
  );
  await t.step(
    "Sample passing module (@supabase/doctest-js)",
    doctest("spec/sample-passing-module.js"),
  );
  await t.step(
    "Sample passing class (@supabase/doctest-js)",
    doctest("spec/sample-passing-class.js"),
  );
});
