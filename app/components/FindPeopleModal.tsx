"use client";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { X, Search, ChevronDown, ChevronUp, Lock, Bookmark, Eye, User, Globe, MapPin, Building2, Users, Save, CheckCircle2, Download, SlidersHorizontal } from "lucide-react";
import { mockPeopleResults } from "../data/mockData";

type Filters = {
  keyword: string;
  jobTitle: string[];
  companyWebsite: string[];
  personLocation: string[];
  companyLocation: string[];
  companyHeadcount: string[];
  managementLevel: string[];
};

const INITIAL_FILTERS: Filters = {
  keyword: "", jobTitle: [], companyWebsite: [],
  personLocation: [], companyLocation: [], companyHeadcount: [], managementLevel: [],
};

const BriefcaseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><path d="M2 12h20" />
  </svg>
);
const LevelsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const filterConfig = [
  { key: "jobTitle",         label: "Job Title",         icon: <BriefcaseIcon />, placeholder: "E.g: Manager",          suggestions: ["Software Engineer", "Manager", "Director", "VP", "CTO", "Founder"] },
  { key: "companyWebsite",   label: "Company Website",   icon: <Globe size={13} />, placeholder: "E.g: google.com",     suggestions: ["google.com", "linkedin.com", "salesforce.com", "hubspot.com"] },
  { key: "personLocation",   label: "Person Location",   icon: <MapPin size={13} />, placeholder: "E.g: London",        suggestions: ["United States", "United Kingdom", "India", "UAE", "Canada", "Australia"] },
  { key: "companyLocation",  label: "Company Location",  icon: <Building2 size={13} />, placeholder: "E.g: UAE",        suggestions: ["United States", "United Kingdom", "UAE", "Singapore", "Germany"] },
  { key: "companyHeadcount", label: "Company Headcount", icon: <Users size={13} />, placeholder: "E.g: 11-50",          suggestions: ["1-10", "11-50", "51-200", "201-500", "501-1000", "10000+"] },
  { key: "managementLevel",  label: "Management Level",  icon: <LevelsIcon />,      placeholder: "E.g: Founder",        suggestions: ["Owner", "Founder", "C-Suite", "VP", "Director", "Manager"] },
];

const ALL_COLS = ["NAME", "TITLE", "HEADLINE", "LINKEDIN URL", "COMPANY", "COMPANY URL", "COMPANY SIZE"];

function ChipInput({
  values, onChange, placeholder, suggestions,
}: {
  values: string[]; onChange: (v: string[]) => void; placeholder: string; suggestions: string[];
}) {
  const [input, setInput] = useState("");
  const [showSugg, setShowSugg] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filteredSugg = suggestions.filter(s =>
    s.toLowerCase().includes(input.toLowerCase()) && !values.includes(s)
  );

  const add = (val: string) => {
    const v = val.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
    setShowSugg(false);
  };

  const remove = (val: string) => onChange(values.filter(v => v !== val));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) { e.preventDefault(); add(input); }
    if (e.key === "Backspace" && !input && values.length) remove(values[values.length - 1]);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShowSugg(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="min-h-[38px] w-full px-2 py-1.5 text-sm border border-blue-300 rounded-lg bg-blue-50/30 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 flex flex-wrap gap-1 cursor-text"
        onClick={() => { setShowSugg(true); }}>
        {values.map(v => (
          <span key={v} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
            {v}
            <button onClick={(e) => { e.stopPropagation(); remove(v); }} className="hover:text-blue-900 leading-none">×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setShowSugg(true); }}
          onKeyDown={onKey}
          onFocus={() => setShowSugg(true)}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] outline-none bg-transparent text-sm placeholder-gray-400"
        />
      </div>
      {showSugg && filteredSugg.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {filteredSugg.map(s => (
            <button key={s} onMouseDown={() => add(s)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 animate-pulse">
      {[120, 90, 140, 110, 90, 100, 60].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-gray-200 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

export default function FindPeopleModal({ onClose }: { onClose: () => void }) {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["jobTitle"]));
  const [results, setResults] = useState<typeof mockPeopleResults>([]);
  const [previewed, setPreviewed] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Set<string>>(new Set(ALL_COLS));
  const [showColToggle, setShowColToggle] = useState(false);
  const [mobileTab, setMobileTab] = useState<"filters" | "results">("filters");

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const toggleSection = (key: string) => {
    const s = new Set(openSections);
    s.has(key) ? s.delete(key) : s.add(key);
    setOpenSections(s);
  };

  const setChips = (key: keyof Omit<Filters, "keyword">, val: string[]) =>
    setFilters(f => ({ ...f, [key]: val }));

  const activeFilterCount = Object.entries(filters).filter(([k, v]) =>
    k === "keyword" ? !!v : (v as string[]).length > 0
  ).length;

  const handlePreview = () => {
    setLoading(true);
    setMobileTab("results");
    setTimeout(() => {
      const jt = filters.jobTitle.map(v => v.toLowerCase());
      const kw = filters.keyword.toLowerCase();
      const filtered = mockPeopleResults.filter(p =>
        (!kw || p.name.toLowerCase().includes(kw) || p.company.toLowerCase().includes(kw)) &&
        (jt.length === 0 || jt.some(t => p.title.toLowerCase().includes(t)))
      );
      setResults(filtered);
      setPreviewed(true);
      setLoading(false);
    }, 900);
  };

  const handleSave = () => {
    setToast("Search saved successfully!");
    setTimeout(() => setToast(""), 3000);
  };

  const handleExport = () => {
    if (!results.length) return;
    const cols = ALL_COLS.filter(c => visibleCols.has(c));
    const keys: (keyof typeof results[0])[] = ["name", "title", "headline", "linkedinUrl", "company", "companyUrl"];
    const csv = [cols.join(","), ...results.map(r =>
      keys.filter((_, i) => visibleCols.has(ALL_COLS[i])).map(k => `"${r[k]}"`).join(",")
    )].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "people_results.csv";
    a.click();
    setToast("Exported CSV!");
    setTimeout(() => setToast(""), 3000);
  };

  const cols = ALL_COLS.filter(c => visibleCols.has(c));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {toast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fadeIn">
          <CheckCircle2 size={15} className="text-emerald-400" />{toast}
        </div>
      )}

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
        style={{ animation: "modalIn 0.18s ease-out" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Find People</h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              <Bookmark size={13} /> Saved Search <ChevronDown size={12} />
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Mobile tab toggle */}
        <div className="flex sm:hidden border-b border-gray-100 shrink-0">
          {(["filters", "results"] as const).map(t => (
            <button key={t} onClick={() => setMobileTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                mobileTab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}>
              {t === "filters" ? "Filters" : `Results${previewed ? ` (${results.length})` : ""}`}
            </button>
          ))}
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Filter Panel */}
          <div className={`w-full sm:w-72 shrink-0 sm:border-r border-gray-100 flex flex-col ${
            mobileTab === "results" ? "hidden sm:flex" : "flex"
          }`}>
            <div className="flex-1 overflow-y-auto px-4 pt-4"
              style={{ maskImage: "linear-gradient(to bottom, black calc(100% - 32px), transparent 100%)" }}>
              <div className="flex items-center gap-2 mb-2">
                <User size={14} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">People Keyword</span>
              </div>
              <div className="relative mb-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={filters.keyword}
                  onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
                  placeholder="Enter single keyword here..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>

              <div className="border-t border-gray-100 my-3" />

              {filterConfig.map(({ key, label, icon, placeholder, suggestions }) => {
                const isOpen = openSections.has(key);
                const chips = filters[key as keyof Omit<Filters, "keyword">] as string[];
                return (
                  <div key={key}>
                    <button onClick={() => toggleSection(key)}
                      className="w-full flex items-start justify-between py-2.5 text-left group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">{icon}</span>
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
                          {chips.length > 0 && (
                            <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{chips.length}</span>
                          )}
                        </div>
                        {!isOpen && chips.length === 0 && (
                          <p className="text-xs text-gray-400 mt-0.5 pl-5">{placeholder}</p>
                        )}
                        {!isOpen && chips.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 pl-5">
                            {chips.slice(0, 2).map(c => (
                              <span key={c} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{c}</span>
                            ))}
                            {chips.length > 2 && <span className="text-xs text-gray-400">+{chips.length - 2}</span>}
                          </div>
                        )}
                      </div>
                      {isOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0 mt-0.5" /> : <ChevronDown size={14} className="text-gray-400 shrink-0 mt-0.5" />}
                    </button>
                    {isOpen && (
                      <div className="pb-3">
                        <ChipInput
                          values={chips}
                          onChange={v => setChips(key as keyof Omit<Filters, "keyword">, v)}
                          placeholder={placeholder}
                          suggestions={suggestions}
                        />
                        <p className="text-[10px] text-gray-400 mt-1 px-1">Press Enter or comma to add. Click suggestion to select.</p>
                      </div>
                    )}
                    <div className="border-t border-gray-100" />
                  </div>
                );
              })}

              {activeFilterCount > 0 && (
                <button onClick={() => { setFilters(INITIAL_FILTERS); setResults([]); setPreviewed(false); }}
                  className="text-xs text-red-500 hover:text-red-700 py-2 block">
                  Clear all filters ({activeFilterCount})
                </button>
              )}
              <div className="mt-3 border-t border-gray-100" />
            </div>

            <div className="flex gap-2 p-4 shrink-0">
              <button onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                <Save size={13} /> Save Search
              </button>
              <button onClick={handlePreview} disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-70">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : <><Eye size={13} /> Preview Result</>}
              </button>
            </div>
          </div>

          {/* Right Results Panel */}
          <div className={`flex-1 flex flex-col min-w-0 ${
            mobileTab === "filters" ? "hidden sm:flex" : "flex"
          }`}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 shrink-0 gap-2 flex-wrap">
              <span className="text-sm text-gray-500">
                {previewed ? `Found ${results.length} ${results.length === 1 ? "person" : "people"}` : "Found 0 people. Click preview to view results"}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  <Search size={10} /> 8000/50000
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Lock size={11} className="text-amber-500" />
                  Unlock <strong className="text-orange-500 font-bold">100,000</strong> leads with Enterprise Plan*
                </span>
                {previewed && results.length > 0 && (
                  <>
                    <div className="relative">
                      <button onClick={() => setShowColToggle(v => !v)}
                        className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 transition-colors">
                        <SlidersHorizontal size={11} /> Columns
                      </button>
                      {showColToggle && (
                        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-2 min-w-[140px]">
                          {ALL_COLS.map(col => (
                            <label key={col} className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                              <input type="checkbox" checked={visibleCols.has(col)}
                                onChange={() => {
                                  const s = new Set(visibleCols);
                                  s.has(col) ? (s.size > 1 && s.delete(col)) : s.add(col);
                                  setVisibleCols(s);
                                }}
                                className="rounded" />
                              {col}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={handleExport}
                      className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1 hover:bg-gray-50 transition-colors">
                      <Download size={11} /> Export
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col m-3 rounded-lg border-2 border-dashed border-orange-400 overflow-hidden">
              {loading ? (
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="text-gray-500 font-semibold tracking-wider uppercase text-[10px] border-b border-gray-100">
                        {ALL_COLS.map(col => <th key={col} className="text-left px-4 py-3 whitespace-nowrap">{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
                  </table>
                </div>
              ) : previewed && results.length > 0 ? (
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="text-gray-500 font-semibold tracking-wider uppercase text-[10px] border-b border-gray-100">
                        {cols.map(col => <th key={col} className="text-left px-4 py-3 whitespace-nowrap">{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((p, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                          {visibleCols.has("NAME") && <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>}
                          {visibleCols.has("TITLE") && <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.title}</td>}
                          {visibleCols.has("HEADLINE") && <td className="px-4 py-3 text-gray-500 max-w-[130px] truncate">{p.headline}</td>}
                          {visibleCols.has("LINKEDIN URL") && <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer whitespace-nowrap">{p.linkedinUrl}</td>}
                          {visibleCols.has("COMPANY") && <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{p.company}</td>}
                          {visibleCols.has("COMPANY URL") && <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer whitespace-nowrap">{p.companyUrl}</td>}
                          {visibleCols.has("COMPANY SIZE") && <td className="px-4 py-3 text-gray-500 whitespace-nowrap">11-50</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
      <svg width="130" height="150" viewBox="0 0 130 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5">
        <ellipse cx="65" cy="118" rx="45" ry="16" fill="#e0f2fe" opacity="0.6" />
        <rect x="30" y="20" width="65" height="88" rx="5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <rect x="50" y="14" width="25" height="13" rx="4" fill="#93c5fd" />
        <rect x="55" y="16" width="15" height="9" rx="2" fill="white" />
        <rect x="42" y="38" width="8" height="8" rx="1.5" fill="white" stroke="#60a5fa" strokeWidth="1.2" />
        <path d="M44 42 L46 44 L49 40" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="55" y="40" width="28" height="4" rx="2" fill="#93c5fd" />
        <rect x="42" y="53" width="8" height="8" rx="1.5" fill="white" stroke="#93c5fd" strokeWidth="1.2" />
        <rect x="55" y="55" width="22" height="4" rx="2" fill="#bfdbfe" />
        <rect x="42" y="68" width="8" height="8" rx="1.5" fill="white" stroke="#93c5fd" strokeWidth="1.2" />
        <rect x="55" y="70" width="26" height="4" rx="2" fill="#bfdbfe" />
        <rect x="42" y="83" width="8" height="8" rx="1.5" fill="white" stroke="#93c5fd" strokeWidth="1.2" />
        <rect x="55" y="85" width="18" height="4" rx="2" fill="#dbeafe" />
        <circle cx="22" cy="82" r="5" fill="#f97316" />
        <path d="M17 102 Q22 92 27 102" fill="#f97316" />
        <line x1="22" y1="87" x2="22" y2="97" stroke="#f97316" strokeWidth="2" />
        <line x1="22" y1="90" x2="17" y2="94" stroke="#f97316" strokeWidth="1.5" />
        <line x1="22" y1="90" x2="27" y2="94" stroke="#f97316" strokeWidth="1.5" />
        <rect x="100" y="50" width="6" height="30" rx="1" fill="#fbbf24" transform="rotate(10 100 50)" />
        <polygon points="100,80 106,80 103,88" fill="#f59e0b" transform="rotate(10 103 80)" />
        <rect x="111" y="58" width="5" height="36" rx="1" fill="#a78bfa" transform="rotate(5 111 58)" />
        <line x1="112" y1="64" x2="115" y2="64" stroke="white" strokeWidth="0.8" />
        <line x1="112" y1="70" x2="115" y2="70" stroke="white" strokeWidth="0.8" />
        <line x1="112" y1="76" x2="115" y2="76" stroke="white" strokeWidth="0.8" />
        <line x1="112" y1="82" x2="115" y2="82" stroke="white" strokeWidth="0.8" />
        <path d="M10 112 Q7 101 15 103 Q9 109 18 109" fill="#86efac" />
        <path d="M116 112 Q121 101 119 107 Q116 105 113 112" fill="#86efac" />
      </svg>
      <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
        Start your search, preview, and import people<br />for enrichment by applying any filter in the left panel.
      </p>
      <p className="text-xs text-gray-400 mt-2 font-medium">OR</p>
      <p className="text-sm text-gray-500 mt-1">Import from saved Search.</p>
    </div>
  );
}
