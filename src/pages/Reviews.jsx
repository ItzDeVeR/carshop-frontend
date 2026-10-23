import { useState } from "react";
import Container from "../components/Container";
import { useToast } from "../services/ToastService";

const MOCK_REVIEWS = [
  {
    id: 1,
    author: "Михаил и Елены",
    city: "г. Москва",
    carName: "Hyundai Santa Fe 2.2d (2022)",
    country: "🇰🇷 Южная Корея",
    countryCode: "KR",
    deliveryDays: "22 дня",
    rating: 5,
    date: "14 июня 2026",
    comment:
      "Изначально переживали отправлять деньги за границу, но менеджер Алексей все детально объяснил и фиксировал цену в договоре. Прислали видео с толщиномером перед выкупом. Машина приехала в идеале, растаможка прошла без задержек. Огромное спасибо!",
    carImage:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    author: "Артем Димов",
    city: "г. Екатеринбург",
    carName: "Geely Monjaro 2.0T 4WD",
    country: "🇨🇳 Китай",
    countryCode: "CN",
    deliveryDays: "19 дней",
    rating: 5,
    date: "02 июля 2026",
    comment:
      "Заказывал новую Monjaro из Китая. Вышла почти на 800 тыс. рублей дешевле, чем у нашего официального дилера. ЭПТС активировали за 3 дня, машину доставили крытым автовозом прямо к дому. Рекомендую CarShop!",
    carImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    author: "Игорь В.",
    city: "г. Казань",
    carName: "BMW X5 xDrive30d",
    country: "🇩🇪 Германия",
    countryCode: "DE",
    deliveryDays: "28 дней",
    rating: 5,
    date: "20 мая 2026",
    comment:
      "Искал немецкую сборку с честным пробегом. Парни нашли отличный X5 на дилерской площадке в Мюнхене. Состояние идеальное, родной окрас. Документы для постановки на учет в ГИБДД под ключ.",
    carImage:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 4,
    author: "Ольга К.",
    city: "г. Санкт-Петербург",
    carName: "Kia Carnival 2.2d",
    country: "🇰🇷 Южная Корея",
    countryCode: "KR",
    deliveryDays: "24 дня",
    rating: 5,
    date: "10 апреля 2026",
    comment:
      "Большой семейный минивэн заказывали для поездок на юг. Очень довольны комплектацией Calligraphy! Всё отслеживали по трекингу прямо в личном кабинете на сайте. Очень удобный сервис.",
    carImage:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
];

export default function Reviews() {
  const { addToast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    car: "",
    comment: "",
    rating: 5,
  });

  const filteredReviews =
    selectedCountry === "all"
      ? MOCK_REVIEWS
      : MOCK_REVIEWS.filter((r) => r.countryCode === selectedCountry);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    addToast("Спасибо за отзыв! Он появится на сайте после модерации.");
    setNewReview({ name: "", car: "", comment: "", rating: 5 });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen py-8">
      <Container className="flex flex-col gap-8">

        <div className="flex flex-col items-center text-center">
          <span className="rounded-lg bg-[#F50E30]/10 px-3 py-1 text-xs font-bold tracking-wider text-[#F50E30] uppercase">
            Истории счастливых владельцев
          </span>
          <h1 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
            Отзывы наших клиентов
          </h1>
          <p className="mt-2 max-w-xl text-xs text-gray-500 sm:text-sm">
            Реальные впечатления людей, которые уже доверили нам привоз своих
            автомобилей из-за рубежа.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-4 sm:border-r sm:border-b-0 sm:pb-0">
            <div className="flex items-center gap-1 text-3xl font-black text-gray-900">
              4.9 <span className="text-xl text-amber-400">★</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Средняя оценка клиентов
            </p>
          </div>

          <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-4 sm:border-r sm:border-b-0 sm:pb-0">
            <div className="text-3xl font-black text-[#F50E30]">1200+</div>
            <p className="mt-1 text-xs text-gray-500">
              Привезенных автомобилей
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-[#F50E30] px-6 py-3 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
            >
              + Оставить свой отзыв
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs font-medium text-gray-400">
              Рынок привоза:
            </span>
            <button
              onClick={() => setSelectedCountry("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCountry === "all"
                  ? "bg-[#F50E30] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Все отзывы
            </button>
            <button
              onClick={() => setSelectedCountry("KR")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCountry === "KR"
                  ? "bg-[#F50E30] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🇰🇷 Южная Корея
            </button>
            <button
              onClick={() => setSelectedCountry("CN")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCountry === "CN"
                  ? "bg-[#F50E30] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🇨🇳 Китай
            </button>
            <button
              onClick={() => setSelectedCountry("DE")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCountry === "DE"
                  ? "bg-[#F50E30] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🇩🇪 Германия
            </button>
          </div>

          <span className="text-xs text-gray-400">
            Найдено отзывов:{" "}
            <strong className="text-gray-800">{filteredReviews.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div>

                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="h-12 w-12 rounded-full border border-gray-100 object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {review.author}
                      </h3>
                      <p className="text-xs text-gray-400">{review.city}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end text-xs text-amber-400">
                      {"★".repeat(review.rating)}
                    </div>
                    <span className="mt-1 block text-[10px] text-gray-400">
                      {review.date}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-xs">
                  <span className="font-semibold text-gray-800">
                    {review.carName}
                  </span>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>{review.country}</span>
                    <span>•</span>
                    <span className="font-medium text-gray-700">
                      {review.deliveryDays}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-gray-600 italic">
                  «{review.comment}»
                </p>
              </div>

              <div className="mt-5 h-44 w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={review.carImage}
                  alt={review.carName}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Оставить отзыв
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-lg text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleSubmitReview}
                className="mt-4 flex flex-col gap-4"
              >
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) =>
                      setNewReview({ ...newReview, name: e.target.value })
                    }
                    placeholder="Например: Иван П."
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#F50E30]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Привезенное авто
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.car}
                    onChange={(e) =>
                      setNewReview({ ...newReview, car: e.target.value })
                    }
                    placeholder="Например: Kia K5 2023"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#F50E30]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Ваш отзыв
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Расскажите о качестве подбора, сроках и впечатлениях..."
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#F50E30]"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full cursor-pointer rounded-xl bg-[#F50E30] py-3 text-xs font-bold text-white hover:opacity-90"
                >
                  Отправить отзыв
                </button>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
