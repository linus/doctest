import { doctest } from "./mod.js";

Deno.test("Doctest", async (t) => {
  await t.step({
    name: "mod",
    ignore: true,
    fn: (t) => doctest(t, "mod.js"),
  });
  await doctest(t, "lib.js");
});

Deno.test("Specification", async (t) => {
  await t.step(
    "Functions returning a Promise can be tested like a regular function",
    (t) => doctest(t, "spec/returns-promise.js"),
  );
  await t.step(
    "Functions throwing an Error can be tested by expecting a thrown Error",
    (t) => doctest(t, "spec/expect-error.js"),
  );
  await t.step(
    "Generator functions can be tested in different ways ",
    (t) => doctest(t, "spec/generator-function.js"),
  );
  await t.step(
    "Examples without a result are not tested",
    (t) => doctest(t, "spec/example-without-result.js"),
  );
  await t.step(
    "Sample passing module (@supabase/doctest-js)",
    (t) => doctest(t, "spec/sample-passing-module.js"),
  );
  await t.step(
    "Sample passing class (@supabase/doctest-js)",
    (t) => doctest(t, "spec/sample-passing-class.js"),
  );
});
