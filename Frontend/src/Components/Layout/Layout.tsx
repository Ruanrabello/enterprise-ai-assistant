import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

import { Outlet } from "react-router-dom";

function Layout() {
  const [cheia, minimizada] = useState<boolean>(false);
  return (

    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <Sidebar
       collapsed={cheia}
       onToggle={() => minimizada(!cheia)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 flex flex-col min-h-0 p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default Layout;
