import { NavLink, Outlet } from "react-router-dom";
import Container from "../components/Container";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) =>
    `whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-lg ${
      isActive
        ? "bg-white text-blue-600 font-semibold"
        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white p-3">
      <Container className="h-full min-h-[calc(100vh-24px)] rounded-xl bg-[#F4F6F8] pb-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 md:hidden">
            <div className="rounded-b-lg bg-white px-3 py-1.5 text-lg font-bold text-gray-900 shadow-sm">
              <NavLink to="/">CarShop</NavLink>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 active:bg-red-100"
            >
              Выход
            </button>
          </div>

          <div className="no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto pb-1 md:gap-2 md:pb-0">
            <NavLink to="/profile/orders" className={linkStyle}>
              Мои заказы
            </NavLink>
            <NavLink to="/profile/favorites" className={linkStyle}>
              Избранное
            </NavLink>

            <div className="md:hidden">
              <NavLink to="/profile/settings" className={linkStyle}>
                Личные данные
              </NavLink>
            </div>
          </div>

          <div className="hidden items-center rounded-b-xl bg-white px-4 py-2 text-xl font-bold shadow-sm md:flex">
            <NavLink to="/">CarShop</NavLink>
          </div>

          <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
            <NavLink to="/profile/settings" className={linkStyle}>
              Личные данные
            </NavLink>

            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              Выход
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </Container>
    </div>
  );
}
