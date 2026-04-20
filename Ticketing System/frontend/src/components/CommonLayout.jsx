import { lazy, Suspense, useState } from "react";
import Header from "../components/Header";
const Sidebar = lazy(()=> import("../components/Sidebar"));
const Footer = lazy(()=> import("./Footer"));

export default function CommonLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-sm">
      <Header toogleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex min-h-[calc(100vh-56px)]">
        <Suspense fallback={null}>
          <Sidebar isOpen={isSidebarOpen} />
        </Suspense>

        <main className="flex-1 p-6 overflow-auto">{children}</main>

      </div>
      <Footer />

    </div>
  );
}