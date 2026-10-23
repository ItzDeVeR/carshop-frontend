import { useState } from "react";
import Container from "../components/Container";
import { useToast } from "../services/ToastService";

const STEPS = [
  {
    number: "01",
    title: "Консультация и подбор",
    subtitle: "1–2 дня",
    description:
      "Определяем ваши пожелания (марка, модель, год, бюджет). Наш менеджер подбирает лучшие варианты на дилерских площадках и закрытых аукционах Кореи, Китая или Европы.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
  },
  {
    number: "02",
    title: "Заключение договора",
    subtitle: "В день подбора",
    description:
      "Подписываем официальный договор поставки, где фиксируются параметры автомобиля, максимальный бюджет, ответственность сторон и этапы оплаты.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    ),
  },
  {
    number: "03",
    title: "Выездная инспекция и фотоотчет",
    subtitle: "1 день",
    description:
      "Наш специалист выезжает к авто за рубежом: замеряет ЛКП толщиномером, делает компьютерную диагностику и отправляет вам более 50 фото и подробное видео.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    ),
  },
  {
    number: "04",
    title: "Выкуп и оплата инвойса",
    subtitle: "2–3 дня",
    description:
      "После вашего утверждения мы выкупаем авто. Вы оплачиваете инвойс (стоимость машины) напрямую в банк страны-продавца через SWIFT/банковский перевод.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    ),
  },
  {
    number: "05",
    title: "Доставка и Таможня в РФ",
    subtitle: "15–25 дней",
    description:
      "Автомобиль доставляется фрахтом/автовозом на таможню РФ. Проходим таможенную очистку, оформляем СБКТС и действующий ЭПТС на ваше имя.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    number: "06",
    title: "Выдача ключей и доставка по РФ",
    subtitle: "3–7 дней",
    description:
      "Забираете автомобиль в нашем офисе выдачи или мы отправляем его крытым автовозом прямо к вашему дому. Машина готова к постановке на учет в ГИБДД!",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    ),
  },
];

const FAQS = [
  {
    question: "Безопасно ли переводить деньги за границу?",
    answer:
      "Да, абсолютно. Оплата авто происходит по официальному инвойсу (счет-фактуре) от дилера через российский банк с прохождением валютного контроля. Деньги поступают напрямую юридическому лицу за рубежом.",
  },
  {
    question: "Как зафиксирована цена? Вдруг она вырастет в процессе?",
    answer:
      "Итоговая стоимость «под ключ» фиксируется в нашем договоре перед выкупом. Любые колебания курсов или форс-мажоры закрываются в рамках прописанных условий, цена для вас не меняется.",
  },
  {
    question: "Что делать, если на осмотре выяснится, что машина битая?",
    answer:
      "Мы не выкупаем кота в мешке. Наш инспектор проверяет толщину ЛКП, несущие элементы, срабатывание подушек и работу ДВС. Если машина не соответствует заявленному состоянию, мы бракуем ее и подбираем следующий вариант.",
  },
  {
    question: "Сколько времени занимает весь процесс от договора до ключей?",
    answer:
      "В среднем из Южной Кореи — 20–30 дней, из Китая — 25–35 дней, из Европы — 25–40 дней. Вы сможете отслеживать каждый шаг и трекинг в вашем личном кабинете на нашем сайте.",
  },
];

export default function HowToBuy() {
  const { addToast } = useToast();
  const [openFaq, setOpenFaq] = useState(null);
  const [phone, setPhone] = useState("");

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleConsultation = (e) => {
    e.preventDefault();
    if (!phone) return;
    addToast("Заявка принята! Менеджер свяжется с вами для консультации.");
    setPhone("");
  };

  return (
    <div className="min-h-screen py-8">
      <Container className="flex flex-col gap-10">

        <div className="flex flex-col items-center text-center">
          <span className="rounded-lg bg-[#F50E30]/10 px-3 py-1 text-xs font-bold tracking-wider text-[#F50E30] uppercase">
            Простой и понятный процесс
          </span>
          <h1 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
            Как купить автомобиль под заказ
          </h1>
          <p className="mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
            Шаг за шагом показываем, как происходит покупка машины из-за
            границы: от выбора модели до вручения ключей.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F50E30]/10 text-[#F50E30]">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      {step.icon}
                    </svg>
                  </div>
                  <span className="text-2xl font-black text-gray-200">
                    {step.number}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                    {step.subtitle}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gray-900 p-6 text-white shadow-lg sm:p-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-wider text-[#F50E30] uppercase">
              Финансовая безопасность
            </span>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Поэтапная система оплаты
            </h2>
            <p className="mt-2 text-xs text-gray-300 sm:text-sm">
              Вам не нужно отдавать всю сумму сразу. Оплата разбивается на 3
              понятных прозрачных платежа:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <span className="text-xs font-bold text-[#F50E30]">
                Платеж 1 (Аванс)
              </span>
              <h4 className="mt-1 text-base font-bold text-white">
                Гарантийный депозит
              </h4>
              <p className="mt-2 text-xs text-gray-300">
                Фиксирует наше сотрудничество и идет в зачет при выкупе машины.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <span className="text-xs font-bold text-[#F50E30]">
                Платеж 2 (Выкуп)
              </span>
              <h4 className="mt-1 text-base font-bold text-white">
                Оплата инвойса
              </h4>
              <p className="mt-2 text-xs text-gray-300">
                Прямой перевод дилеру за границей за выкупленный автомобиль.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <span className="text-xs font-bold text-[#F50E30]">
                Платеж 3 (Финал)
              </span>
              <h4 className="mt-1 text-base font-bold text-white">
                Таможня и выдача
              </h4>
              <p className="mt-2 text-xs text-gray-300">
                Оплата таможенной пошлины в РФ и услуг доставки при получении.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-center text-2xl font-black text-gray-900 sm:text-3xl">
            Часто задаваемые вопросы
          </h2>
          <p className="mt-1 text-center text-xs text-gray-500 sm:text-sm">
            Отвечаем на главные сомнения покупателей при заказе авто
          </p>

          <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-4 text-left text-sm font-bold text-gray-800 hover:text-[#F50E30]"
                >
                  <span>{faq.question}</span>
                  <span className="ml-2 text-lg text-gray-400">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="border-t border-gray-200/50 px-4 pt-3 pb-4 text-xs leading-relaxed text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:flex-row">
          <div className="max-w-lg">
            <h3 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
              Готовы найти автомобиль мечты?
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Оставьте заявку, и мы бесплатно подберем 3 подходящих варианта с
              просчетом доставки в ваш город.
            </p>
          </div>

          <form
            onSubmit={handleConsultation}
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
              Получить подбор
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
