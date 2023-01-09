/** @type Worker */
// @ts-ignore make believe ctx is a Worker
const ctx = self;

/**
 * @param {{
 *   data: {
 *     moduleUrl: string,
 *     test: string,
 *     result: string
 *   }
 * }} param0
 */
ctx.onmessage = async ({ data }) => {
  const module = await import(data.moduleUrl);
  for (const symbol in module) {
    // @ts-ignore TS doesn't like us assigning arbitrary properties to
    // self/globalThis, but we don't have a better way yet 🤷
    ctx[symbol] = module[symbol];
  }
  const { test, result } = data;
  const [actual, expected] = await Promise.allSettled([
    new Promise((resolve, reject) => {
      try {
        resolve(eval?.(test));
      } catch (e) {
        reject(e);
      }
    }),
    new Promise((resolve, reject) => {
      try {
        const code = result.trim().startsWith("throw ")
          ? result
          : `(${result})`;
        resolve(eval?.(code));
      } catch (e) {
        reject(e);
      }
    }),
  ]);

  ctx.postMessage({ actual, expected });
};
