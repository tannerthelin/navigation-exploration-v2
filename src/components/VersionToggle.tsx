import { useState, useRef, useEffect } from "react";
import { useVersion, type PrototypeVersion } from "../contexts/VersionContext";

const versions: { label: string; value: PrototypeVersion; description: string }[] = [
  { label: "Version A", value: "A", description: "Current prototype" },
  { label: "Version B", value: "B", description: "Alternate prototype" },
];

export default function VersionToggle() {
  const { version, setVersion } = useVersion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-[9999]">
      {/* Popover menu */}
      {open ? (
        <div className="absolute bottom-12 right-0 w-[200px] rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Prototype</p>
          </div>
          {versions.map((v) => (
            <button
              key={v.value}
              onClick={() => { setVersion(v.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-gray-50 ${
                version === v.value ? "bg-gray-50" : ""
              }`}
            >
              <div>
                <p className={`text-[14px] font-medium ${version === v.value ? "text-gray-900" : "text-gray-700"}`}>
                  {v.label}
                </p>
                <p className="text-[12px] text-gray-400">{v.description}</p>
              </div>
              {version === v.value ? (
                <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {/* Three-dot trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Switch prototype version"
        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg border transition-all ${
          open
            ? "bg-gray-900 border-gray-900 text-white"
            : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-800"
        }`}
      >
        {/* Three vertical dots */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="3" r="1.4" />
          <circle cx="8" cy="8" r="1.4" />
          <circle cx="8" cy="13" r="1.4" />
        </svg>
      </button>

      {/* Active version badge */}
      <span className="pointer-events-none absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[9px] font-bold text-white">
        {version}
      </span>
    </div>
  );
}
