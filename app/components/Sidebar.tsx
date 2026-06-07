"use client";
import { LayoutDashboard, BookOpen, Zap, FileText, Settings, ChevronDown, ChevronRight, HelpCircle, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-3 left-3 z-50 lg:hidden p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
        onClick={() => setMobileOpen(o => !o)}
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        flex flex-col bg-white border-r border-gray-100 shrink-0 h-full transition-all duration-300
        ${collapsed ? "w-16" : "w-52"}
        fixed lg:relative z-40 lg:z-auto
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
          <span className="font-black text-xl text-gray-900 tracking-tight">
            {collapsed ? "B" : "Bitscale"}
          </span>
        </div>

        {/* Workspace */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-3 mx-2 mt-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            {/* Small avatar */}
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 truncate">GTM Spaces</span>
            <ChevronDown size={14} className="text-gray-400 ml-auto shrink-0" />
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2">
          {/* Home section */}
          {!collapsed && <p className="text-xs text-gray-400 font-medium px-4 py-2">Home</p>}
          <NavItem icon={<LayoutDashboard size={16} />} label="My Dashboard" active collapsed={collapsed} />
          <NavItem icon={<BookOpen size={16} />} label="Playbooks" collapsed={collapsed} badge="🚀" />
          <NavItem icon={<Zap size={16} />} label="Integrations" collapsed={collapsed} />

          {/* Other section */}
          {!collapsed && <p className="text-xs text-gray-400 font-medium px-4 py-2 mt-3">Other</p>}
          <NavItem icon={<FileText size={16} />} label="Documnetation" collapsed={collapsed} />
          <NavItem icon={<Settings size={16} />} label="Settings" collapsed={collapsed} />
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 p-3">
          {!collapsed && (
            <div className="mb-2">
              <p className="text-xs font-black text-gray-900">Bitscale</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 cursor-pointer hover:text-blue-600">
                <HelpCircle size={11} /> Get Support at Bitscale
              </p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 w-full"
          >
            <ChevronRight size={14} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label, active, collapsed, badge }: {
  icon: React.ReactNode; label: string; active?: boolean; collapsed?: boolean; badge?: string;
}) {
  return (
    <div title={collapsed ? label : undefined}
      className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-lg cursor-pointer transition-colors
        ${active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
      <span className={`shrink-0 ${active ? "text-blue-600" : "text-gray-400"}`}>{icon}</span>
      {!collapsed && (
        <>
          <span className="text-sm font-medium flex-1">{label}</span>
          {badge && <span className="text-sm">{badge}</span>}
          {active && <ChevronRight size={14} className="text-blue-500" />}
        </>
      )}
    </div>
  );
}
