"use client";
import { useState, useEffect } from "react";
import { Plus, Play, CheckCircle, Circle } from "lucide-react";
import GridTable from "./GridTable";

const articles = [
  {
    title: "How to Integrate 2 Way HubSpot",
    desc: "Prerequisites for this Integration is that you should have a HubSpot account and Copy the API key. We simple add our API key through the integrations pa...",
    date: "Posted today",
  },
  {
    title: "Getting Started with BitAgent",
    desc: "BitAgent helps you automate your outreach workflows. Learn how to set up your first agent in under 10 minutes with our step-by-step walkthrough.",
    date: "Posted yesterday",
  },
  {
    title: "5 Ways to Enrich Your Lead Data",
    desc: "Data enrichment is key to personalizing your outreach. Discover the top 5 enrichment strategies used by our highest-performing customers.",
    date: "2 days ago",
  },
];

const checklistItems = [
  { label: "Create your data list", done: true },
  { label: "Learn about BitAgent", done: true },
  { label: "Connect an integration", done: true },
  { label: "Customise waterfall providers", done: false },
];

export default function DashboardContent({
  onFindPeople,
  onFindCompanies,
}: {
  onFindPeople: () => void;
  onFindCompanies: () => void;
}) {
  const [articleIdx, setArticleIdx] = useState(0);
  const [toast, setToast] = useState(false);

  // Auto-advance carousel every 5 s
  useEffect(() => {
    const t = setInterval(() => setArticleIdx(i => (i + 1) % articles.length), 5000);
    return () => clearInterval(t);
  }, []);

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 relative">
      {/* New Grid toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fadeIn">
          <CheckCircle size={15} className="text-emerald-400" /> New Grid created!
        </div>
      )}
      {/* Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back, Tim!</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's your daily scoop on Bitscale!</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onFindCompanies}
            className="flex items-center gap-2 text-sm font-medium px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="hidden xs:inline sm:inline">Find Companies</span>
            <span className="xs:hidden sm:hidden">Companies</span>
          </button>
          <button
            onClick={onFindPeople}
            className="flex items-center gap-2 text-sm font-medium px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 shrink-0">
              <circle cx="12" cy="7" r="4" /><path d="M5 21c0-4 3.1-7 7-7s7 3 7 7" />
            </svg>
            <span className="hidden xs:inline sm:inline">Find People</span>
            <span className="xs:hidden sm:hidden">People</span>
          </button>
          <button onClick={showToast} className="flex items-center gap-2 text-sm font-semibold px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            <Plus size={15} /> <span className="hidden sm:inline">New Grid</span><span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latest from Bitscale */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">Latest from Bitscale</h3>
            {/* Pill-dot carousel — active = wide pill, others = small dots */}
            <div className="flex items-center gap-1">
              {articles.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setArticleIdx(i)}
                  className={`transition-all duration-300 rounded-full h-2 ${
                    i === articleIdx
                      ? "w-6 bg-blue-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            {/* Video thumbnail — blueish gradient with screenshot feel */}
            <div className="w-24 h-16 rounded-lg shrink-0 cursor-pointer group relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 50%, #1a4a7a 100%)" }}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.05) 3px, rgba(255,255,255,0.05) 4px)" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center group-hover:bg-white/35 transition-colors">
                  <Play size={13} fill="white" className="text-white ml-0.5" />
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-snug">{articles[articleIdx].title}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-3">{articles[articleIdx].desc}</p>
              <p className="text-xs text-gray-400 mt-2">{articles[articleIdx].date}</p>
            </div>
          </div>
        </div>

        {/* Complete product demo */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-start gap-3 mb-3">
            {/* Dark navy icon box with clipboard icon inside */}
            <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="8" y="2" width="8" height="4" rx="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Complete product demo</h3>
                <span className="text-sm font-bold text-emerald-600">75%</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">92% of users nailed BitScale after this walkthrough</p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pl-12">
            {checklistItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.done
                  ? <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  : <Circle size={14} className="text-gray-300 shrink-0" />}
                <span className={`text-xs ${item.done ? "text-gray-700" : "text-gray-400"}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <GridTable onFindPeople={onFindPeople} />
    </div>
  );
}
