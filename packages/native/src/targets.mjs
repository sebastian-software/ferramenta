import { NATIVE_TARGETS } from "../runtime/native.mjs";

export { NATIVE_TARGETS };

export function nativePackages(config) {
  return NATIVE_TARGETS.map((target) => ({
    ...target,
    packageName: config.packagePattern.replace("{target}", target.id),
    binaryName: config.binaryPattern.replace("{target}", target.id),
  }));
}

export function targetForTriple(triple) {
  const target = NATIVE_TARGETS.find((entry) => entry.triple === triple);
  if (!target) throw new Error(`Unsupported Rust target: ${triple}`);
  return target;
}
