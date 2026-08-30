import { ChevronDown, Search, X } from "lucide-react";

export function Badge({ children, tone = "gold" }) {
  const tones = {
    gold: "bg-[#f8eedc] text-[#8d6728] border-[#ead7b2]",
    green: "bg-[#e9f6ef] text-[#2d8a5d] border-[#cce9d9]",
    red: "bg-[#fbeaea] text-[#bd5252] border-[#f0cccc]",
    blue: "bg-[#eeeafe] text-[#6952b3] border-[#ded4fa]",
    gray: "bg-[#f2f1ef] text-[#77716a] border-[#e3e0db]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "انتخاب کنید",
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-lg border border-[#e6e1d9] bg-white px-3 pl-9 text-xs text-[#57514a] outline-none transition focus:border-[#b98a39] focus:ring-2 focus:ring-[#b98a39]/10"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8e887f]" />
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "جستجو در مخاطبین...",
}) {
  return (
    <div className="relative w-full max-w-127.5">
      <Search className="absolute right-3 top-1/2 size-4.25 -translate-y-1/2 text-[#9b958c]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[#e5e1db] bg-white pr-10 pl-9 text-xs text-[#3e3933] outline-none placeholder:text-[#aaa49c] focus:border-[#b98a39] focus:ring-2 focus:ring-[#b98a39]/10"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#99928a] hover:bg-[#f3f0eb]"
          aria-label="پاک کردن"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

export function IconButton({ children, title, onClick, className = "" }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`inline-flex size-8 items-center justify-center rounded-lg text-[#787168] transition hover:bg-[#f4f0e9] hover:text-[#6f5120] ${className}`}
    >
      {children}
    </button>
  );
}
