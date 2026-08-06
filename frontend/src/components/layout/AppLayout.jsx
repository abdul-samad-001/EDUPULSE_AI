import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <TopNavbar />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AppLayout;