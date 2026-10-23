import { useState } from "react";
import Container from "../components/Container";
import { useToast } from "../services/ToastService";

const SERVICES_LIST = [
  {
    id: "podbor",
    title: "Подбор и выкуп авто под ключ",
    price: "от 50 000 ₽",
    badge: "Популярное",
    description:
      "Полный комплекс услуг по поиску, проверке, выкупу и доставке автомобиля из Южной Кореи, Китая, ОАЭ или Европы.",
    features: [
      "Поиск вариантов на закрытых аукционах и дилерских площадках",
      "Выезд инспектора с толщиномером и компьютерной диагностикой",
      "Детальный фото- и видеоотчет (более 50 снимков)",
      "Юридическая проверка истории и документов авто",
      "Заключение официального договора с фиксированной ценой",
    ],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    ),
  },
  {
    id: "customs",
    title: "Таможенная очистка и ЭПТС",
    price: "от 30 000 ₽",
    badge: "Быстро",
    description:
      "Полное таможенное оформление ввезенного авто «под ключ» без вашего личного присутствия на таможне.",
    features: [
      "Расчет таможенных пошлин и утилизационного сбора",
      "Получение СБКТС (Свидетельство безопасности конструкции)",
      "Оформление действующего ЭПТС со статусом «Действующий»",
      "Помощь с таможенной декларацией и ТПО",
      "Установка и активация кнопки ГЛОНАСС (при необходимости)",
    ],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    id: "delivery",
    title: "Логистика и автовоз по РФ",
    price: "от 25 000 ₽",
    badge: "Страховка 100%",
    description:
      "Бережная доставка автомобиля из порта Владивостока или КПП на границе в любой регион и город России.",
    features: [
      "Доставка крытым автовозом или контейнерным ж/д вагоном",
      "Полная страховка груза на время транспортировки",
      "Отслеживание перемещения авто по GPS-трекеру",
      "Фотофиксация погрузки и разгрузки автомобиля",
      "Передача ключей прямо у вашего дома",
    ],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    ),
  },
  {
    id: "inspection",
    title: "Разовая инспекция (Осмотр в КНР/Корее)",
    price: "от 15 000 ₽",
    badge: "Экспресс",
    description:
      "Если вы сами нашли машину за рубежом, наш специалист выедет и проверит её перед вашей покупкой.",
    features: [
      "Проверка кузова профессиональным толщиномером на предмет ДТП",
      "Замер износа резины и тормозной системы",
      "Диагностика сканером на скрытые ошибки и скрученный пробег",
      "Проверка работоспособности электроники и климатической системы",
      "Онлайн-звонок с площадки во время осмотра",
    ],
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    ),
  },
];

export default function Services() {
  const { addToast } = useToast();
  const [selectedService, setSelectedService] = useState(null);
  const [phone, setPhone] = useState("");

  const handleServiceOrder = (serviceTitle) => {
    setSelectedService(serviceTitle);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) return;

    addToast(
      `Заявка на услугу "${selectedService || "Консультация"}" успешно принята!`,
    );
    setPhone("");
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen py-8">
      <Container className="flex flex-col gap-8">

        <div className="flex flex-col items-center text-center">
          <span className="rounded-lg bg-[#F50E30]/10 px-3 py-1 text-xs font-bold tracking-wider text-[#F50E30] uppercase">
            Наши услуги
          </span>
          <h1 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
            Услуги по импорту и оформлению авто
          </h1>
          <p className="mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
            Оказываем как полный комплекс услуг «под ключ», так и отдельные
            этапы: от выездной инспекции до получения ЭПТС.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICES_LIST.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div>

                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F50E30]/10 text-[#F50E30]">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        {service.icon}
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {service.title}
                      </h3>
                      <p className="text-sm font-extrabold text-[#F50E30]">
                        {service.price}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                    {service.badge}
                  </span>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-gray-500">
                  {service.description}
                </p>

                <ul className="mt-4 flex flex-col gap-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-gray-700"
                    >
                      <span className="font-bold text-[#F50E30]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleServiceOrder(service.title)}
                className="mt-6 w-full cursor-pointer rounded-xl bg-gray-900 py-3 text-center text-xs font-bold text-white transition-all hover:bg-[#F50E30]"
              >
                Заказать услугу
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:flex-row">
          <div className="max-w-lg">
            <span className="text-xs font-bold text-[#F50E30]">
              Индивидуальный расчет
            </span>
            <h3 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">
              {selectedService
                ? `Заявка: ${selectedService}`
                : "Нужна консультация по услугам?"}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Оставьте контактный номер — мы перезвоним, ответим на все вопросы
              и сделаем калькуляцию затрат.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
          >
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#F50E30] sm:w-64"
            />
            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-[#F50E30] px-6 py-3 text-xs font-bold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              {selectedService ? "Заказать услугу" : "Перезвоните мне"}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
