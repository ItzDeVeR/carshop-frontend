import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminSidebar,
  AdminOrders,
  AdminCars,
  AdminLeads,
  AdminUsers,
} from "../features/AdminPage/index";
import Loader from "../components/Loader";
import api from "../services/api";

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [userRole, setUserRole] = useState("MANAGER");
  const currentManagerName = "Аноним";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);

      try {
        const result = await api.get("/profile/me");

        setUser(result.data);
        setUserRole(result.data.role);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader text="Получение данных о пользователе" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F8]">

      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-xl bg-gray-900 p-2.5 text-xs font-bold text-white shadow-lg"
        >
          {isSidebarOpen ? "✕" : "☰ Меню Админа"}
        </button>
      </div>

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        userRole={userRole}
        currentManagerName={user?.full_name || currentManagerName}
        handleLogout={handleLogout}
      />

      <main className="w-full flex-1 overflow-y-auto p-4 sm:p-8">

        <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <span className="text-xs font-semibold text-gray-500">
            Тест прав доступа:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setUserRole("MANAGER");
                if (activeTab === "cars" || activeTab === "users")
                  setActiveTab("orders");
              }}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                userRole === "MANAGER"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Режим Менеджера
            </button>
            <button
              onClick={() => setUserRole("ADMIN")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                userRole === "ADMIN"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Режим Админа
            </button>
          </div>
        </div>

        {activeTab === "orders" && (
          <AdminOrders
            userRole={userRole}
            currentManagerName={user?.full_name || currentManagerName}
          />
        )}
        {activeTab === "leads" && <AdminLeads />}
        {activeTab === "cars" && userRole === "ADMIN" && <AdminCars />}
        {activeTab === "users" && userRole === "ADMIN" && <AdminUsers />}
      </main>
    </div>
  );
}
