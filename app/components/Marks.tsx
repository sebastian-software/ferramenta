import { MARK_DEFS } from "./mark-defs"

/**
 * Mounts the shared SVG sprite once per page: duotone project marks,
 * the pegboard hook, and the line-style chrome icons.
 */
export function MarkDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs dangerouslySetInnerHTML={{ __html: MARK_DEFS }} />
    </svg>
  )
}

interface MarkProps {
  /** Symbol name without the "i-" prefix, e.g. "ferroni" or "arrow" */
  name: string
  className?: string
  size?: number
}

/** A single symbol from the sprite. Project marks use class "mark", chrome icons "icon". */
export function Mark({ name, className = "mark", size }: MarkProps) {
  return (
    <svg className={className} width={size} height={size} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  )
}
