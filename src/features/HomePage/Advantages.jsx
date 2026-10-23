import Container from "../../components/Container";

const ADVANTAGES_DATA = [
  {
    id: 1,
    title: "Выгода до 30%",
    description:
      "Покупка напрямую на аукционах и у дилеров за рубежом без наценок российских автосалонов и перекупщиков.",
    badge: "Экономия",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    id: 2,
    title: "Фиксация цены в договоре",
    description:
      "Итоговая стоимость под ключ прописывается перед выкупом. Никаких скрытых комиссий и сюрпризов в процессе.",
    badge: "Гарантия",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    id: 3,
    title: "Детальная инспекция",
    description:
      "Выездной осмотр толщиномером, компьютерная диагностика ДВС и КПП, фото/видеоотчет более чем из 50 кадров.",
    badge: "Проверка",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    ),
  },
  {
    id: 4,
    title: "Страхование на 100%",
    description:
      "Автомобиль полностью застрахован от любых повреждений на всех этапах: фрахт, таможня и автовоз по РФ.",
    badge: "Безопасность",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    id: 5,
    title: "Официальный ЭПТС и Таможня",
    description:
      "Полное таможенное оформление, получение СБКТС и действующего ЭПТС на ваше имя. Машина готова к ГИБДД.",
    badge: "Документы",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
  {
    id: 6,
    title: "Быстрая логистика",
    description:
      "Прямые контракты с судоходными линиями и автовозами. Доставка от 15 дней с трекингом в личном кабинете.",
    badge: "Скорость",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
];

export default function Advantages() {
  return (
    <section className="py-12">
      <Container className="flex flex-col gap-10">

        <div className="flex flex-col items-center text-center">
          <span className="rounded-lg bg-[#F50E30]/10 px-3 py-1 text-xs font-bold tracking-wider text-[#F50E30] uppercase">
            Почему именно мы
          </span>
          <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
            Наши ключевые преимущества
          </h2>
          <p className="mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
            Мы делаем процесс покупки автомобиля из-за границы прозрачным,
            безопасным и простым для каждого клиента.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES_DATA.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F50E30]/10 text-[#F50E30] transition-colors group-hover:bg-[#F50E30] group-hover:text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600">
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
