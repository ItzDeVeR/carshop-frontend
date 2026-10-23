import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../services/ToastService";
import Loader from "../../components/Loader";

export default function FavoriteCars() {
  const backendApiUrl = import.meta.env.VITE_BACKEND_URL;
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchFavorites() {
      try {
        setLoading(true);
        const result = await api.get("/favorite");
        setFavorites(result.data);
      } catch (error) {
        addToast(error, "error");
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  const handleRemove = async (id) => {
    try {
      setLoading(true);
      const result = await api.post("/favorite", { car_id: id });

      setFavorites((prev) => prev.filter((car) => car.id !== id));

      addToast(result.data?.message || "Изменено успешно");
    } catch (error) {
      addToast(error, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (
      window.confirm("Вы уверены, что хотите очистить весь список избранного?")
    ) {
      try {
        setLoading(true);
        const result = await api.delete("/favorite/all");

        setFavorites([]);

        addToast(result.data?.message || "Удалено успешно");
      } catch (error) {
        addToast(error, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendToManager = () => {
    setIsSending(true);
    setTimeout(() => {
      alert(
        "Заявка с избранными авто успешно отправлена менеджеру! Мы свяжемся с вами в течение 15 минут.",
      );
      setIsSending(false);
    }, 1000);
  };

  if (isLoading && favorites.length === 0) {
    return <Loader text="Подгружаем ваши избранные авто..." />;
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          Список избранного пуст
        </h3>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          Сохраняйте понравившиеся автомобили из каталога, чтобы сравнить их или
          отправить менеджеру на точный расчет доставки.
        </p>
        <Link
          to="/catalog"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Избранные автомобили
          </h2>
          <p className="text-sm text-gray-500">
            Сохранено:{" "}
            <span className="font-semibold text-gray-700">
              {favorites.length}
            </span>{" "}
            шт.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">

          <button
            onClick={handleClearAll}
            className="order-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 md:order-1"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Очистить все
          </button>

          <button
            onClick={handleSendToManager}
            disabled={isSending}
            className="order-1 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 md:order-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            {isSending ? "Отправка..." : "Запросить просчет всех авто"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((car) => (
          <div
            key={car.id}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >

            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              <img
                src={backendApiUrl + car.main_image}
                alt={car.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <button
                onClick={() => handleRemove(car.id)}
                title="Удалить из избранного"
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-transform hover:scale-110 hover:bg-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {car.country_code} {car.country}
                </span>
                <span className="rounded-md bg-blue-600/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {car.status.replaceAll("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2">
                <h3 className="line-clamp-1 text-base font-bold text-gray-900">
                  {car.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {car.year} г. • {car.mileage_km} км • {car.engine_info}
                </p>
              </div>

              <div className="my-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                <span>Срок привоза:</span>
                <span className="font-semibold text-gray-800">
                  {car.delivery_time_text}
                </span>
              </div>

              <div className="mt-auto border-t border-gray-100 pt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-400">
                    Цена «Под ключ» в РФ:
                  </span>
                  <span className="text-xs text-gray-400">
                    {car.price_original_currency}
                  </span>
                </div>
                <p className="text-xl font-black text-blue-600">
                  {car.price_rub.toLocaleString("ru-RU")} ₽
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/cars/${car.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  <svg
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Подробнее
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
