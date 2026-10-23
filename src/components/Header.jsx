import { useState } from "react";
import Container from "./Container";
import { NavLink, Link } from "react-router-dom";

const navLinkStyle = ({ isActive }) =>
  `transition-colors duration-200 hover:text-[#F50E30] font-medium ${
    isActive ? "text-[#F50E30] font-bold" : "text-gray-800"
  }`;

function HeaderLinks({ closeMenu }) {
  return (
    <div className="flex flex-col gap-y-3 lg:flex-row lg:gap-x-8 lg:gap-y-0">
      <NavLink to="/catalog" onClick={closeMenu} className={navLinkStyle}>
        Каталог
      </NavLink>
      <NavLink to="/about" onClick={closeMenu} className={navLinkStyle}>
        О нас
      </NavLink>
      <NavLink to="/services" onClick={closeMenu} className={navLinkStyle}>
        Услуги
      </NavLink>
      <NavLink to="/how-to-buy" onClick={closeMenu} className={navLinkStyle}>
        Как купить
      </NavLink>
      <NavLink to="/reviews" onClick={closeMenu} className={navLinkStyle}>
        Отзывы
      </NavLink>

      <NavLink to="/contacts" onClick={closeMenu} className={navLinkStyle}>
        Контакты
      </NavLink>
    </div>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="relative z-50 my-5">
      <Container className="flex items-center justify-between gap-x-4">

        <NavLink to="/" onClick={closeMenu} className="shrink-0">
          <img className="h-10 w-auto" src="/micon.png" alt="logo" />
        </NavLink>

        <div className="hidden lg:flex">
          <HeaderLinks closeMenu={closeMenu} />
        </div>

        <div className="flex items-center gap-x-5">

          <div className="hidden items-center gap-x-2 sm:flex">
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              title="Telegram"
            >
              <img
                src="/telegram_logo.svg"
                alt="tglogo"
                className="h-6 w-6 transition-transform hover:scale-110"
              />
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
            >
              <img
                src="/whatsapp_logo.svg"
                alt="whatslogo"
                className="h-6 w-6 transition-transform hover:scale-110"
              />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              title="YouTube"
            >
              <img
                src="/youtube_logo.svg"
                alt="youtubelogo"
                className="h-6 w-6 transition-transform hover:scale-110"
              />
            </a>
          </div>

          <div className="hidden flex-col text-xs font-semibold text-gray-700 xl:flex">
            <a href="tel:+78352675252" className="hover:text-[#F50E30]">
              +7 (8352) 67-52-52
            </a>
            <a href="tel:+79279971242" className="hover:text-[#F50E30]">
              +7 (927) 997-12-42
            </a>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-200"
              >
                <svg
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Профиль
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Link
                  to="/auth/login"
                  className="rounded-xl border border-gray-200 px-3.5 py-1.5 text-gray-700 transition-colors hover:border-[#F50E30] hover:text-[#F50E30]"
                >
                  Войти
                </Link>
                <Link
                  to="/auth/register"
                  className="rounded-xl bg-[#F50E30] px-3.5 py-1.5 text-white shadow-sm transition-opacity hover:opacity-90"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer p-1 text-black focus:outline-none lg:hidden"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </Container>

      <div
        className={`absolute top-full left-0 w-full border-b border-gray-100 bg-white px-6 py-5 shadow-xl transition-all duration-300 ease-in-out lg:hidden ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-y-4">
          <HeaderLinks closeMenu={closeMenu} />

          <hr className="border-gray-100" />

          <div className="flex flex-col gap-2 pt-1">
            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={closeMenu}
                className="w-full rounded-xl bg-gray-100 py-2.5 text-center text-sm font-bold text-gray-800"
              >
                Мой профиль
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/auth/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-gray-200 py-2 text-center text-xs font-bold text-gray-700"
                >
                  Войти
                </Link>
                <Link
                  to="/auth/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-[#F50E30] py-2 text-center text-xs font-bold text-white shadow-sm"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-col pt-2 text-xs font-medium text-gray-500">
            <a href="tel:+78352675252" className="py-0.5 hover:text-[#F50E30]">
              +7 (8352) 67-52-52
            </a>
            <a href="tel:+79279971242" className="py-0.5 hover:text-[#F50E30]">
              +7 (927) 997-12-42
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
