import { useState } from "react";
import Container from "../components/Container";
import { useToast } from "../services/ToastService";

export default function Contacts() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast(
      "Заявка принята! Наш менеджер свяжется с вами в течение 10 минут.",
    );
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-8">
      <Container className="flex flex-col gap-8">

        <div className="flex flex-col items-center text-center">
          <span className="rounded-lg bg-[#F50E30]/10 px-3 py-1 text-xs font-bold tracking-wider text-[#F50E30] uppercase">
            Свяжитесь с нами
          </span>
          <h1 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
            Контакты компании CarShop
          </h1>
          <p className="mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
            Мы всегда на связи и готовы проконсультировать вас по любым вопросам
            привоза автомобилей под заказ.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F50E30]/10 text-[#F50E30]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">
                Отдел продаж
              </h3>
              <div className="mt-2 flex flex-col gap-1 text-xs font-medium text-gray-600">
                <a
                  href="tel:+78352675252"
                  className="transition-colors hover:text-[#F50E30]"
                >
                  +7 (8352) 67-52-52
                </a>
                <a
                  href="tel:+79279971242"
                  className="transition-colors hover:text-[#F50E30]"
                >
                  +7 (927) 997-12-42
                </a>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-gray-400">
              Звонок по РФ бесплатный
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F50E30]/10 text-[#F50E30]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">
                Адрес офиса
              </h3>
              <p className="mt-2 text-xs leading-relaxed font-medium text-gray-600">
                г. Чебоксары, пр-т Ивана Яковлева, д. 4B, офис 302
              </p>
            </div>
            <p className="mt-4 text-[10px] text-gray-400">
              Прием по предварительной записи
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F50E30]/10 text-[#F50E30]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">
                Режим работы
              </h3>
              <div className="mt-2 text-xs leading-relaxed font-medium text-gray-600">
                <p>Пн — Пт: 09:00 — 19:00</p>
                <p>Сб — Вс: 10:00 — 16:00</p>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-gray-400">Мессенджеры 24/7</p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F50E30]/10 text-[#F50E30]">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">
                Мессенджеры
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  title="Telegram"
                  className="transition-transform hover:scale-110"
                >
                  <img src="/telegram_logo.svg" alt="tg" className="h-7 w-7" />
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                  className="transition-transform hover:scale-110"
                >
                  <img src="/whatsapp_logo.svg" alt="wa" className="h-7 w-7" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube"
                  className="transition-transform hover:scale-110"
                >
                  <img src="/youtube_logo.svg" alt="yt" className="h-7 w-7" />
                </a>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-gray-400">
              Быстрый ответ в течение 5 минут
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-7">
            <div className="border-b border-gray-100 p-4">
              <h3 className="text-base font-bold text-gray-900">
                Наш офис на карте
              </h3>
              <p className="text-xs text-gray-400">
                г. Чебоксары, пр-т Ивана Яковлева, д. 4B
              </p>
            </div>

            <div className="relative h-80 w-full bg-gray-100 sm:h-96">
              <iframe
                title="map"
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A08f86f78a2e5e1b12b55b9e1124ef130f1d07c08a9db0c4df536db1a039d5e3c&amp;source=constructor"
                width="100%"
                height="100%"
                frameBorder="0"
                className="h-full w-full border-0"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Остались вопросы?
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Заполните форму, и наш эксперт свяжется с вами, чтобы рассчитать
                полную стоимость привоза авто.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-4"
              >
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Александр"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-800 transition-colors outline-none focus:border-[#F50E30]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+7 (___) ___-__-__"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-800 transition-colors outline-none focus:border-[#F50E30]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Сообщение / Какая машина интересует?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Хочу привезти Hyundai Santa Fe 2022 из Кореи..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-800 transition-colors outline-none focus:border-[#F50E30]"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full cursor-pointer rounded-xl bg-[#F50E30] py-3 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-95"
                >
                  Отправить заявку
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-3 border-b border-gray-100 pb-2 text-sm font-bold text-gray-900">
            Юридические реквизиты
          </h3>
          <div className="grid grid-cols-1 gap-4 text-xs text-gray-500 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <span className="block text-gray-400">Наименование:</span>
              <strong className="text-gray-800">ООО «КарШоп Импорт»</strong>
            </div>
            <div>
              <span className="block text-gray-400">ИНН / КПП:</span>
              <strong className="text-gray-800">2130123456 / 213001001</strong>
            </div>
            <div>
              <span className="block text-gray-400">ОГРН:</span>
              <strong className="text-gray-800">1212100005678</strong>
            </div>
            <div>
              <span className="block text-gray-400">Банк:</span>
              <strong className="text-gray-800">
                АО «ТБанк» / ПАО «Сбербанк»
              </strong>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
