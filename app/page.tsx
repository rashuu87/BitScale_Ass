"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardContent from "./components/DashboardContent";
import FindPeopleModal from "./components/FindPeopleModal";
import FindCompaniesModal from "./components/FindCompaniesModal";

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modal, setModal] = useState<"people" | "companies" | null>(null);

  const headerTitle = modal === "people" ? "Find People" : modal === "companies" ? "Find Companies" : "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
      <div className="flex flex-col flex-1 min-w-0 lg:ml-0 pl-14 lg:pl-0">
        <Header title={headerTitle} />
        <DashboardContent
          onFindPeople={() => setModal("people")}
          onFindCompanies={() => setModal("companies")}
        />
      </div>
      {modal === "people" && <FindPeopleModal onClose={() => setModal(null)} />}
      {modal === "companies" && <FindCompaniesModal onClose={() => setModal(null)} />}
    </div>
  );
}
