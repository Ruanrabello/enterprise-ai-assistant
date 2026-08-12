import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((currentValue) => !currentValue)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
