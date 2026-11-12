"use client";

import { TRAINING_TYPES, TRAINING_LABELS } from "@/lib/targets";
import type { TrainingType } from "@/lib/types";

export default function TrainingSelector({
  value,
  onChange,
  disabled,
  options,
}: {
  value: TrainingType;
  onChange: (t: TrainingType) => void;
  disabled?: boolean;
  options?: { value: TrainingType; label: string }[];
}) {
  const opts =
    options && options.length
      ? options
      : TRAINING_TYPES.map((t) => ({ value: t, label: TRAINING_LABELS[t] }));
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as TrainingType)}
      className="rounded-lg border border-[#55555f] bg-[#42424a] px-3 py-2 text-[15px] font-semibold text-white outline-none disabled:opacity-50"
    >
      {opts.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
