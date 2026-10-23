import { useState } from "react";
import Container from "../components/Container";
import { useToast } from "../services/ToastService";

export default function About() {
  const { addToast } = useToast();
  const [phone, setPhone] = useState("");

  const handleConsultation = (e) => {
    e.preventDefault();
    if (!phone) return;
    addToast(
      "Заявка на консультацию принята! Мы перезвоним вам в течение 10 минут.",
    );
    setPhone("");
  };

  return (
    <div className="min-h-screen py-8">
      <Container className="flex flex-col gap-10">

        <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-12 text-white shadow-lg sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-lg bg-[#F50E30] px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
              О компании CarShop
            </span>
            <h1 className="mt-4 text-3xl font-black sm:text-5xl">
              Привозим автомобили из-за рубежа под ключ
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
              Мы помогаем выгодно купить, под ключ растаможить и бережно
              доставить автомобили из Южной Кореи, Китая и Европы в любую точку
              России с гарантией сохранности и честной ценой.
            </p>
          </div>

          <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-[#F50E30]/20 blur-3xl" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-black text-[#F50E30] sm:text-4xl">
              7+ лет
            </p>
            <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
              Работаем на рынке авто
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-black text-[#F50E30] sm:text-4xl">
              1 200+
            </p>
            <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
              Привезенных машин в РФ
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-black text-[#F50E30] sm:text-4xl">
              до 30%
            </p>
            <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
              Экономии от цены в РФ
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl font-black text-[#F50E30] sm:text-4xl">
              100%
            </p>
            <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
              Юридическая чистота
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-center text-2xl font-black text-gray-900 sm:text-3xl">
            Почему нам доверяют
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-xs text-gray-500 sm:text-sm">
            Мы берем на себя все риски и бюрократию, чтобы вы получили готовый
            автомобиль с ЭПТС без лишней головной боли.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F50E30] font-bold text-white">
                ✓
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">
                Фиксированная цена
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Стоимость авто, доставки и растаможки прописывается в договоре и
                не меняется в процессе транспортировки.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F50E30] font-bold text-white">
                🔍
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">
                Детальный осмотр
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Наш специалист выезжает на площадку за рубежом, замеряет ЛКП
                толщиномером и присылает вам более 50 фото и видео.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F50E30] font-bold text-white">
                🛡️
              </div>
              <h3 className="mt-4 text-base font-bold text-gray-900">
                Страхование на всех этапах
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Каждая машина застрахована от момента выкупа до передачи ключей
                в вашем городе.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-center text-2xl font-black text-gray-900 sm:text-3xl">
            Как происходит процесс привоза
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="relative flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F50E30]/10 text-lg font-black text-[#F50E30]">
                01
              </span>
              <h4 className="mt-3 text-sm font-bold text-gray-800">
                Подбор и Заявка
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Подбираем варианты под ваш бюджет и пожелания
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F50E30]/10 text-lg font-black text-[#F50E30]">
                02
              </span>
              <h4 className="mt-3 text-sm font-bold text-gray-800">
                Проверка и Выкуп
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Инспектируем авто в стране покупки и заключаем договор
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F50E30]/10 text-lg font-black text-[#F50E30]">
                03
              </span>
              <h4 className="mt-3 text-sm font-bold text-gray-800">
                Таможня и Доставка
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Оформляем таможенную очистку, СБКТС и ЭПТС
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F50E30]/10 text-lg font-black text-[#F50E30]">
                04
              </span>
              <h4 className="mt-3 text-sm font-bold text-gray-800">
                Выдача ключей
              </h4>
              <p className="mt-1 text-xs text-gray-500">
                Передаем готовое авто в вашем городе
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10 md:flex-row">
          <div className="max-w-xl">
            <h3 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
              Остались вопросы или хотите рассчитать стоимость?
            </h3>
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              Оставьте ваш номер телефона, и наш менеджер сделает подробный
              расчет доставки любого авто за 15 минут.
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
              className="w-full cursor-pointer rounded-xl bg-[#F50E30] px-6 py-3 text-sm font-bold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              Получить расчет
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
