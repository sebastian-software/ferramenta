/** Module hook that points `ardo/ui` at the stub next to this file. */
export function resolve(specifier, context, next) {
  if (specifier === "ardo/ui") {
    return { shortCircuit: true, url: new URL("ardo-ui-stub.mjs", import.meta.url).href };
  }
  return next(specifier, context);
}
