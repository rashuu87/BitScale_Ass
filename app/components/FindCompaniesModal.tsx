"use client";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { X, Search, ChevronDown, ChevronUp, Lock, Bookmark, Eye, MapPin, Building2, Users, Save, CheckCircle2, Download, SlidersHorizontal, Globe } from "lucide-react";

type CompanyFilters = {
  keyword: string;
  industry: string[];
  companyLocation: string[];
  headcount: string[];
  revenue: string[];
  techStack: string[];
};

const INITIAL: CompanyFilters = {
  keyword: "", industry: [], companyLocation: [], headcount: [], revenue: [], techStack: [],
};

const IndustryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const RevenueIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const filterConfig = [
  { key: "industry",        label: "Industry",          icon: <IndustryIcon />,    placeholder: "E.g: SaaS",        suggestions: ["SaaS", "FinTech", "Healthcare", "E-commerce", "AI/ML", "EdTech", "HR Tech"] },
  { key: "companyLocation", label: "Company Location",  icon: <MapPin size={13} />, placeholder: "E.g: USA",         suggestions: ["United States", "United Kingdom", "India", "UAE", "Singapore", "Germany"] },
  { key: "headcount",       label: "Company Headcount", icon: <Users size={13} />, placeholder: "E.g: 11-50",        suggestions: ["1-10", "11-50", "51-200", "201-500", "501-1000", "10000+"] },
  { key: "revenue",         label: "Annual Revenue",    icon: <RevenueIcon />,     placeholder: "E.g: $1M-$10M",    suggestions: ["<$1M", "$1M-$10M", "$10M-$50M", "$50M-$100M", "$100M+"] },
  { key: "techStack",       label: "Tech Stack",        icon: <Globe size={13} />, placeholder: "E.g: React",       suggestions: ["React", "Node.js", "Salesforce", "HubSpot", "AWS", "Python", "Java"] },
];

const MOCK_COMPANIES = [
  { name: "TechCorp Inc", industry: "SaaS", location: "San Francisco, US", headcount: "201-500", website: "techcorp.com", revenue: "$50M+", techStack: "React, AWS" },
  { name: "GrowthCo", industry: "FinTech", location: "New York, US", headcount: "51-200", website: "growthco.com", revenue: "$10M-$50M", techStack: "Node.js, Python" },
  { name: "InnovateLabs", industry: "AI/ML", location: "Austin, US", headcount: "11-50", website: "innovatelabs.dev", revenue: "$1M-$10M", techStack: "Python, TensorFlow" },
];

const ALL_COLS = ["NAME", "INDUSTRY", "LOCATION", "HEADCOUNT", "WEBSITE", "REVENUE", "TECH STACK"];

function ChipInput({ values, onChange, placeholder, suggestions }: {
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
    setInput(""); setShowSugg(false);
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
        onClick={() => setShowSugg(true)}>
        {values.map(v => (
          <span key={v} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
            {v}<button onClick={(e) => { e.stopPropagation(); remove(v); }} className="hover:text-blue-900 leading-none">×</button>
          </span>
        ))}
        <input value={input} onChange={e => { setInput(e.target.value); setShowSugg(true); }}
          onKeyDown={onKey} onFocus={() => setShowSugg(true)}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] outline-none bg-transparent text-sm placeholder-gray-400" />
      </div>
      {showSugg && filteredSugg.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {filteredSugg.map(s => (
            <button key={s} onMouseDown={() => add(s)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 animate-pulse">
      {[100, 80, 130, 70, 110, 80, 100].map((w, i) => (
        <td key={i} className="px-4 py-3"><div className="h-3 bg-gray-200 rounded" style={{ width: w }} /></td>
      ))}
    </tr>
  );
}

export default function FindCompaniesModal({ onClose }: { onClose: () => void }) {
  const [filters, setFilters] = useState<CompanyFilters>(INITIAL);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["industry"]));
  const [results, setResults] = useState<typeof MOCK_COMPANIES>([]);
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

  const setChips = (key: keyof Omit<CompanyFilters, "keyword">, val: string[]) =>
    setFilters(f => ({ ...f, [key]: val }));

  const activeFilterCount = Object.entries(filters).filter(([k, v]) =>
    k === "keyword" ? !!v : (v as string[]).length > 0
  ).length;

  const handlePreview = () => {
    setLoading(true);
    setMobileTab("results");
    setTimeout(() => {
      const kw = filters.keyword.toLowerCase();
      const ind = filters.industry.map(v => v.toLowerCase());
      const filtered = MOCK_COMPANIES.filter(c =>
        (!kw || c.name.toLowerCase().includes(kw) || c.industry.toLowerCase().includes(kw)) &&
        (ind.length === 0 || ind.some(i => c.industry.toLowerCase().includes(i)))
      );
      setResults(filtered);
      setPreviewed(true);
      setLoading(false);
    }, 900);
  };

  const handleExport = () => {
    if (!results.length) return;
    const keys: (keyof typeof results[0])[] = ["name", "industry", "location", "headcount", "website", "revenue", "techStack"];
    const csv = [ALL_COLS.filter(c => visibleCols.has(c)).join(","),
      ...results.map(r => keys.filter((_, i) => visibleCols.has(ALL_COLS[i])).map(k => `"${r[k]}"`).join(","))
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "company_results.csv";
    a.click();
    setToast("Exported CSV!"); setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {toast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
          <CheckCircle2 size={15} className="text-emerald-400" />{toast}
        </div>
      )}

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
        style={{ animation: "modalIn 0.18s ease-out" }}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Find Companies</h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              <Bookmark size={13} /> Saved Search <ChevronDown size={12} />
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
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
          <div className={`w-full sm:w-72 shrink-0 sm:border-r border-gray-100 flex flex-col ${
            mobileTab === "results" ? "hidden sm:flex" : "flex"
          }`}>
            <div className="flex-1 overflow-y-auto px-4 pt-4"
              style={{ maskImage: "linear-gradient(to bottom, black calc(100% - 32px), transparent 100%)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={14} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">Company Keyword</span>
              </div>
              <div className="relative mb-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={filters.keyword} onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
                  placeholder="Enter company name or keyword..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
              </div>

              <div className="border-t border-gray-100 my-3" />

              {filterConfig.map(({ key, label, icon, placeholder, suggestions }) => {
                const isOpen = openSections.has(key);
                const chips = filters[key as keyof Omit<CompanyFilters, "keyword">] as string[];
                return (
                  <div key={key}>
                    <button onClick={() => toggleSection(key)} className="w-full flex items-start justify-between py-2.5 text-left group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">{icon}</span>
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
                          {chips.length > 0 && (
                            <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{chips.length}</span>
                          )}
                        </div>
                        {!isOpen && chips.length === 0 && <p className="text-xs text-gray-400 mt-0.5 pl-5">{placeholder}</p>}
                        {!isOpen && chips.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 pl-5">
                            {chips.slice(0, 2).map(c => <span key={c} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{c}</span>)}
                            {chips.length > 2 && <span className="text-xs text-gray-400">+{chips.length - 2}</span>}
                          </div>
                        )}
                      </div>
                      {isOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0 mt-0.5" /> : <ChevronDown size={14} className="text-gray-400 shrink-0 mt-0.5" />}
                    </button>
                    {isOpen && (
                      <div className="pb-3">
                        <ChipInput values={chips} onChange={v => setChips(key as keyof Omit<CompanyFilters, "keyword">, v)}
                          placeholder={placeholder} suggestions={suggestions} />
                        <p className="text-[10px] text-gray-400 mt-1 px-1">Press Enter or comma to add. Click suggestion to select.</p>
                      </div>
                    )}
                    <div className="border-t border-gray-100" />
                  </div>
                );
              })}

              {activeFilterCount > 0 && (
                <button onClick={() => { setFilters(INITIAL); setResults([]); setPreviewed(false); }}
                  className="text-xs text-red-500 hover:text-red-700 py-2 block">
                  Clear all filters ({activeFilterCount})
                </button>
              )}
              <div className="mt-3 border-t border-gray-100" />
            </div>

            <div className="flex gap-2 p-4 shrink-0">
              <button onClick={() => { setToast("Search saved!"); setTimeout(() => setToast(""), 3000); }}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                <Save size={13} /> Save Search
              </button>
              <button onClick={handlePreview} disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-70">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Loading...
                  </span>
                ) : <><Eye size={13} /> Preview Result</>}
              </button>
            </div>
          </div>

          <div className={`flex-1 flex flex-col min-w-0 ${
            mobileTab === "filters" ? "hidden sm:flex" : "flex"
          }`}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 shrink-0 gap-2 flex-wrap">
              <span className="text-sm text-gray-500">
                {previewed ? `Found ${results.length} ${results.length === 1 ? "company" : "companies"}` : "Found 0 companies. Click preview to view results"}
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
                                }} className="rounded" />{col}
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
                        {ALL_COLS.filter(c => visibleCols.has(c)).map(col => <th key={col} className="text-left px-4 py-3 whitespace-nowrap">{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((c, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                          {visibleCols.has("NAME") && <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{c.name}</td>}
                          {visibleCols.has("INDUSTRY") && <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.industry}</td>}
                          {visibleCols.has("LOCATION") && <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.location}</td>}
                          {visibleCols.has("HEADCOUNT") && <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.headcount}</td>}
                          {visibleCols.has("WEBSITE") && <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer whitespace-nowrap">{c.website}</td>}
                          {visibleCols.has("REVENUE") && <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.revenue}</td>}
                          {visibleCols.has("TECH STACK") && <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.techStack}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                    <Building2 size={36} className="text-blue-300" />
                  </div>
                  <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                    Start your Company search, preview, and import companies<br />for enrichment by applying any filter in the left panel.
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">OR</p>
                  <p className="text-sm text-gray-500 mt-1">Import companies from saved Search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
