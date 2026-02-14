import { useEffect, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
  value?: string;
  options: Option[];
  onChange: (value: string) => void;

  className?: string; // wrapper / button
  menuClassName?: string; // dropdown panel
  scrollClassName?: string; // ONLY scrollbar / scroll area
  placeholder?: string;
};

export function Dropdown({
  value,
  options,
  onChange,
  className = "",
  menuClassName = "",
  scrollClassName = "",
  placeholder = "Select an option",
}: Readonly<DropdownProps>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="
          w-full flex justify-between items-center
          px-4 py-2 rounded-lg border
          bg-[#101011] text-white
          border-zinc-700
          focus:outline-none focus:ring-2 focus:ring-pink-500
        "
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.5 7.5 10 12l4.5-4.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`
            absolute z-50 mt-2 w-full rounded-lg
            shadow-lg
            ${menuClassName}
          `}
        >
          <ul
            className={`
              max-h-48 overflow-y-auto
              ${scrollClassName}
            `}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="
                  px-4 py-2 cursor-pointer
                  text-sm text-white
                  hover:bg-pink-600/20
                "
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// <Dropdown
//   value={form.category}
//   onChange={(v) => setForm((p) => ({ ...p, category: v }))}
//   options={categories.map((c) => ({
//     value: c._id,
//     label: c.name,
//   }))}
//   className="w-72"
//   menuClassName="bg-[#101011] border border-zinc-700"
//   scrollClassName="scrollbar-thin scrollbar-thumb-pink-500"
// />
