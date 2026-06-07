"use client";
import { useState, useRef, useEffect } from "react";
import { Star, Search, MoreHorizontal, ChevronDown, ArrowUp, Trash2, Pencil, Copy, ExternalLink } from "lucide-react";
import { grids } from "../data/mockData";

const iconColors: Record<string, string> = {
  workbook: "#f97316", linkedin: "#0077b5", salesnav: "#7c3aed",
  company: "#16a34a", csv: "#dc2626", people: "#9333ea",
  maps: "#ea4335", google: "#4285f4", factors: "#f59e0b", hubspot: "#ff7a59",
};

const iconLabels: Record<string, string> = {
  workbook: "W", linkedin: "in", salesnav: "S", company: "C",
  csv: "↓", people: "P", maps: "📍", google: "G", factors: "F", hubspot: "H",
};

const avatarColors: Record<string, string> = {
  "Sam Taylor": "from-blue-400 to-blue-600",
  "Chris Parker": "from-green-400 to-green-600",
  "Jone Doe": "from-pink-400 to-rose-500",
  "Alex Morgan": "from-amber-400 to-orange-500",
  "Drew Wilson": "from-purple-400 to-purple-600",
};

export default function GridTable({ onFindPeople }: { onFindPeople: () => void }) {
  const [activeTab, setActiveTab] = useState<"grids" | "starred">("grids");
  const [search, setSearch] = useState("");
  const [starred, setStarred] = useState<Set<number>>(new Set());
  const [sortAsc, setSortAsc] = useState(true);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1]));
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleStar = (id: number) => {
    const s = new Set(starred);
    s.has(id) ? s.delete(id) : s.add(id);
    setStarred(s);
  };

  const toggleExpand = (id: number) => {
    const s = new Set(expanded);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpanded(s);
  };

  const filtered = grids
    .filter(g => (activeTab === "starred" ? starred.has(g.id) : true))
    .filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-4 pb-0 gap-3">
        <div className="flex">
          {(["grids", "starred"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {tab === "grids" ? "My Grids" : "Starred"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pb-2 sm:pb-0">
          <div className="relative flex-1 sm:flex-none">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search grids..."
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-full sm:w-52 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <button className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="3" cy="6" r="1" fill="currentColor" /><circle cx="3" cy="12" r="1" fill="currentColor" /><circle cx="3" cy="18" r="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
      <table className="w-full text-sm mt-1 min-w-[400px]">
        <thead>
          <tr className="text-gray-500 text-xs border-y border-gray-100 bg-gray-50/50">
            <th className="w-20 sm:w-24 px-3 py-3" />
            <th className="text-left px-2 py-3 font-medium">
              <button onClick={() => setSortAsc(!sortAsc)} className="flex items-center gap-1 hover:text-gray-800 font-medium">
                Name <ArrowUp size={12} className={`transition-transform ${sortAsc ? "" : "rotate-180"}`} />
              </button>
            </th>
            <th className="hidden sm:table-cell text-left px-3 py-3 font-medium whitespace-nowrap">Edited by</th>
            <th className="hidden md:table-cell text-left px-3 py-3 font-medium whitespace-nowrap">Last edited</th>
            <th className="text-right px-4 py-3 font-medium whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(grid => (
            <tr key={grid.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors group">
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleExpand(grid.id)}
                    className={`text-gray-300 hover:text-gray-500 transition-opacity ${grid.id === 1 ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <ChevronDown size={12} className={`transition-transform ${expanded.has(grid.id) ? "" : "-rotate-90"}`} />
                  </button>
                  <button onClick={() => toggleStar(grid.id)}>
                    <Star size={12} className={starred.has(grid.id) ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-300"} />
                  </button>
                  {grid.id === 1 ? (
                    <div className="flex items-center gap-0.5">
                      <span className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white" style={{ backgroundColor: "#f97316" }}>P</span>
                      <span className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white" style={{ backgroundColor: "#16a34a" }}>🔗</span>
                    </div>
                  ) : (
                    <span className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: iconColors[grid.icon] || "#6b7280" }}>
                      {iconLabels[grid.icon]}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-2 py-2.5">
                <span className="text-gray-800 font-medium text-sm">{grid.name}</span>
              </td>
              <td className="hidden sm:table-cell px-3 py-2.5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarColors[grid.editedBy] || "from-blue-400 to-purple-500"} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {grid.avatar[0]}
                  </div>
                  <span className="text-gray-600 text-sm">{grid.editedBy}</span>
                </div>
              </td>
              <td className="hidden md:table-cell px-3 py-2.5 text-gray-500 text-sm whitespace-nowrap">{grid.lastEdited}</td>
              <td className="px-4 py-2.5 text-right relative">
                <div className="relative inline-block" ref={openMenu === grid.id ? menuRef : undefined}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === grid.id ? null : grid.id); }}
                    className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors">
                    <MoreHorizontal size={15} />
                  </button>
                  {openMenu === grid.id && (
                    <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-xl py-1 min-w-[140px]">
                      {[
                        { icon: <ExternalLink size={13} />, label: "Open" },
                        { icon: <Pencil size={13} />, label: "Rename" },
                        { icon: <Copy size={13} />, label: "Duplicate" },
                        { icon: <Trash2 size={13} />, label: "Delete", danger: true },
                      ].map(({ icon, label, danger }) => (
                        <button key={label} onClick={() => setOpenMenu(null)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                            danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"
                          }`}>
                          {icon}{label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          {activeTab === "starred" ? "No starred grids yet. Star a grid to see it here." : "No grids found."}
        </div>
      )}
    </div>
  );
}
