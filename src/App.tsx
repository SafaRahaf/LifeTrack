import { useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  Package,
  CreditCard,
  Sparkles,
} from "lucide-react";
import Tasks from "./pages/Tasks";
import Storage from "./pages/Storage";
import Payments from "./pages/Payment";
import Dashboard from "./pages/Dashboard";

type Page = "dashboard" | "tasks" | "storage" | "payments";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Things to do", icon: ListTodo },
  { id: "storage", label: "Storage", icon: Package },
  { id: "payments", label: "Payments", icon: CreditCard },
] as const;

function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const pageTitle =
    navigation.find((item) => item.id === activePage)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-[#faf7fc] text-[#171020]">
      {/* Desktop sidebar */}
      <aside className="fixed hidden h-screen w-64 flex-col border-r border-purple-100 bg-white p-5 lg:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-black to-purple-600 p-2 text-white">
            <Sparkles size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold">LifeTrack</h1>
            <p className="text-xs text-gray-500">Your personal space</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-br from-black to-purple-600 text-white"
                    : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-gradient-to-br from-black to-purple-600 p-4 text-white">
          <Sparkles size={22} />
          <p className="mt-3 text-sm font-semibold">Stay organized.</p>
          <p className="mt-1 text-xs text-pink-100">
            Small steps, big progress.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="pb-20 lg:ml-64 lg:pb-0">
        <header className="flex items-center justify-between border-b border-purple-100 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs text-gray-500">Workspace</p>
            <h2 className="text-xl font-bold">{pageTitle}</h2>
          </div>
        </header>

        <div className="p-5 sm:p-8">
          {activePage === "tasks" ? (
            <Tasks />
          ) : activePage === "storage" ? (
            <Storage />
          ) : activePage === "payments" ? (
            <Payments />
          ) : activePage === "dashboard" ? (
            //@ts-ignore
            <Dashboard onNavigate={setActivePage} />
          ) : (
            <div className="rounded-2xl border border-purple-100 bg-white p-10 text-center">
              <h2 className="text-xl font-bold">{pageTitle}</h2>
              <p className="mt-2 text-sm text-gray-500">
                This module is coming soon.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-purple-100 bg-white p-2 lg:hidden">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs ${
                active ? "text-pink-600" : "text-gray-500"
              }`}
            >
              <Icon size={19} />
              <span>{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default App;
