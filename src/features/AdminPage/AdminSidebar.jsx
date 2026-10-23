import { Link } from "react-router-dom";

export const AdminSidebar = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  userRole,
  currentManagerName = "Алексей В.",
  handleLogout,
}) => {

  const allTabs = [
    { id: "orders", label: "📦 Заказы клиентов", roles: ["MANAGER", "ADMIN"] },
    { id: "leads", label: "🔥 Заявки с сайта", roles: ["MANAGER", "ADMIN"] },
    { id: "cars", label: "🚗 Каталог авто", roles: ["ADMIN"] },
    { id: "users", label: "👥 Пользователи", roles: ["ADMIN"] },
  ];

  const visibleTabs = allTabs.filter((tab) => tab.roles.includes(userRole));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } flex shrink-0 flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between border-b border-gray-800 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">CarShop</span>
            <span className="rounded-md bg-[#F50E30] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
              CRM
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-gray-800/60 p-3 text-xs">
          <p className="font-semibold text-white">
            {userRole === "ADMIN" ? "Администратор" : "Менеджер по продажам"}
          </p>
          <span
            className={`mt-1 inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
              userRole === "ADMIN"
                ? "bg-purple-500/20 text-purple-300"
                : "bg-blue-500/20 text-blue-300"
            }`}
          >
            Права: {userRole}
          </span>
        </div>

        <nav className="mt-6 flex flex-col gap-1.5">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-medium transition-all sm:text-sm ${
                activeTab === tab.id
                  ? "bg-[#F50E30] font-bold text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-800 pt-4">

        <div className="flex items-center justify-between rounded-xl bg-gray-800/60 p-2.5 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white">
              👤
            </div>
            <span className="truncate font-semibold text-gray-200">
              {currentManagerName}
            </span>
          </div>
          {handleLogout && (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[11px] font-bold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
              title="Выйти из системы"
            >
              Выход
            </button>
          )}
        </div>

        <Link
          to="/"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 py-2.5 text-xs font-semibold text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        >
          ← Вернуться в магазин
        </Link>
      </div>
    </aside>
  );
};
