"use client";

import { useRef } from "react";

type TextareaWithBulletProps = {
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  className?: string;
};

export default function TextareaWithBullet({
  name,
  defaultValue = "",
  rows = 3,
  required,
  className,
}: TextareaWithBulletProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function addBullet() {
    const textarea = ref.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const prefix = start > 0 && value[start - 1] !== "\n" ? "\n" : "";
    const insertion = `${prefix}• `;
    textarea.value = `${value.slice(0, start)}${insertion}${value.slice(end)}`;
    const cursor = start + insertion.length;
    textarea.focus();
    textarea.setSelectionRange(cursor, cursor);
  }

  return (
    <div className="grid gap-2">
      <textarea
        ref={ref}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
        className={
          className ??
          "resize-none rounded-md border border-slate-300 px-3 py-2 text-sm"
        }
      />
      <button
        type="button"
        onClick={addBullet}
        className="w-fit rounded-md border border-[#A05DD0]/40 bg-white px-3 py-1.5 text-xs font-medium text-[#770FC2] transition hover:bg-[#F3E8FF]"
      >
        Add Bullet
      </button>
    </div>
  );
}
