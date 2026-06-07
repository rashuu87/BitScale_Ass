"use client";

export default function Header({ title }: { title?: string }) {
  return (
    <header className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 bg-white border-b border-gray-100 shrink-0">
      {title && <span className="text-sm font-semibold text-gray-700 truncate">{title}</span>}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Credits — hide label text on xs */}
        <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M5 8.5C5 9.88 6.34 11 8 11s3-1.12 3-2.5S9.66 6 8 6 5 7.12 5 8.5z" fill="#f59e0b" />
            <path d="M8 5v1M8 10v1" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="font-medium text-gray-700">450000</span>
          <span className="text-gray-400">/5500000</span>
        </div>
        {/* Plan badge — short on xs */}
        <span className="bg-emerald-600 text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
          <span className="hidden sm:inline">Booster Plan</span>
          <span className="sm:hidden">Booster</span>
        </span>
        {/* Dual avatar */}
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-xs font-bold border-2 border-white cursor-pointer z-10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white -ml-2 cursor-pointer">B</div>
        </div>
      </div>
    </header>
  );
}
