import { NATIVE_TARGETS } from "./targets.mjs";

export function nativeMatrix() {
  return {
    include: NATIVE_TARGETS.map((target) => ({
      id: target.id,
      target: target.triple,
      runner:
        target.os === "darwin"
          ? "macos-latest"
          : target.os === "win32"
            ? target.cpu === "arm64"
              ? "windows-11-arm"
              : "windows-latest"
            : target.cpu === "arm64"
              ? "ubuntu-24.04-arm"
              : "ubuntu-latest",
      libc: target.libc === "glibc" ? "gnu" : (target.libc ?? ""),
      native: target.libc !== "musl",
    })),
  };
}
