import { END, render, START } from "./family-readme.mjs";

/** Static frames are built centrally; native consumers never execute this code. */
export function nativeFrame(registry, current) {
  const body = render(registry, { current }).slice(START.length, -END.length).trim();
  return {
    header: `Part of [Ferramenta](${registry.FAMILY_SITE}), a family of Rust tools.\n`,
    footer: `${body}\n`,
  };
}
