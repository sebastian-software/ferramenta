import type { ComponentPropsWithoutRef } from "react";

type SelectProps = {
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
} & Omit<ComponentPropsWithoutRef<"select">, "children">;

/** A labeled native select; callers own its value and the content it controls. */
export function FerraSelect({ label, options, ...props }: SelectProps) {
  return (
    <label className="ferra-select">
      <span>{label}</span>
      <select {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
