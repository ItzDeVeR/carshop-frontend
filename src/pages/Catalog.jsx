import { useState, useMemo, useEffect } from "react";
import Container from "../components/Container";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../services/ToastService";
import Loader from "../components/Loader";

export default function Catalog() {
  const backendApiUrl = import.meta.env.VITE_BACKEND_URL;
  const { addToast } = useToast();
  const [cars, setCars] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [totalCars, setTotalCars] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 20;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCars() {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (searchQuery.trim()) params.append("name", searchQuery.trim());
      if (selectedCondition !== "all")
        params.append("condition", selectedCondition);
      if (selectedCountry !== "all")
        params.append("country_code", selectedCountry);
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (priceMax) params.append("price_rub", priceMax);
      if (sortBy !== "default") params.append("sort_by", sortBy);

      try {
        const result = await api.get(`/cars?${params}`, {
          signal: controller.signal,
        });

        let fetchedCars = result.data.cars || [];

        const isAuthenticated = Boolean(localStorage.getItem("token"));
        if (isAuthenticated) {
          try {
            const favResult = await api.get("/favorite", {
              signal: controller.signal,
            });
            const favoritesData = favResult.data || [];

            const favoriteCarIds = new Set(
              favoritesData.map((item) =>
                typeof item === "object" ? (item.car_id ?? item.id) : item,
              ),
            );

            fetchedCars = fetchedCars.map((car) => ({
              ...car,
              isFavorite: favoriteCarIds.has(car.id),
            }));
          } catch (favErr) {
            console.error("Ошибка загрузки избранного:", favErr);
          }
        }

        setCars(fetchedCars);
        setTotalCars(result.data.total);
        setTotalPages(result.data.totalPages);
      } catch (err) {
        if (
          err.name !== "CanceledError" &&
          err.name !== "AbortError" &&
          !axios?.isCancel?.(err)
        ) {
          console.error("Ошибка загрузки авто:", err);
          addToast(err, "error");
        }
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchCars();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    page,
    searchQuery,
    selectedCondition,
    selectedCountry,
    selectedBrand,
    priceMax,
    sortBy,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    selectedCondition,
    selectedCountry,
    selectedBrand,
    priceMax,
    sortBy,
  ]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 1) return [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const toggleFavorite = async (id) => {
    try {
      const isAuthenticated = Boolean(localStorage.getItem("token"));
      if (!isAuthenticated) {
        addToast(
          "Для добавления в избранное войдите сначала в аккаунт",
          "warning",
        );
        return navigate("/auth/login");
      }

      setLoading(true);

      const result = await api.post("/favorite", { car_id: id });

      setCars((prev) =>
        prev.map((car) =>
          car.id === id ? { ...car, isFavorite: !car.isFavorite } : car,
        ),
      );

      addToast(result.data?.message || "Автомобиль добавлен");
    } catch (error) {
      addToast(error.response?.data?.message || "Ошибка", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars;

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCondition("all");
    setSelectedCountry("all");
    setSelectedBrand("all");
    setPriceMax("");
    setSortBy("default");
  };

  if (isLoading && cars.length === 0) {
    return <Loader text="Подбираем машины для вас, ожидайте..." />;
  }

  return (
    <div className="min-h-screen py-6">
      <Container className="flex flex-col gap-6">

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 md:text-3xl">
              Каталог автомобилей под заказ
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Цены указаны «под ключ» с учетом доставки, таможни и оформления в
              РФ
            </p>
          </div>

          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setSelectedCondition("all")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                selectedCondition === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Все авто
            </button>
            <button
              onClick={() => setSelectedCondition("new")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                selectedCondition === "new"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Новые
            </button>
            <button
              onClick={() => setSelectedCondition("used")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                selectedCondition === "used"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              С пробегом
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

            <div className="lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Поиск
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Марка или модель..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-10 pl-9 text-sm text-gray-800 transition-all outline-none focus:border-[#F50E30] focus:bg-white"
                />
                <svg
                  className="absolute top-3 left-3 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {isLoading && (
                  <div className="absolute top-3 right-3 flex items-center justify-center">
                    <svg
                      className="h-4 w-4 animate-spin text-[#F50E30]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Рынок привоза
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 transition-all outline-none focus:border-[#F50E30] focus:bg-white"
              >
                <option value="all">Все страны</option>
                <option value="KR">🇰🇷 Южная Корея</option>
                <option value="CN">🇨🇳 Китай</option>
                <option value="DE">🇩🇪 Германия</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Марка
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 transition-all outline-none focus:border-[#F50E30] focus:bg-white"
              >
                <option value="all">Все марки</option>
                <option value="Audi">Audi</option>
                <option value="BMW">BMW</option>
                <option value="Geely">Geely</option>
                <option value="Genesis">Genesis</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Li Auto">Li Auto</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Бюджет до, ₽
              </label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Например: 4000000"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 transition-all outline-none focus:border-[#F50E30] focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-gray-500 transition-colors hover:text-[#F50E30]"
            >
              ✕ Сбросить все фильтры
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 outline-none focus:border-[#F50E30]"
              >
                <option value="default">По умолчанию</option>
                <option value="price_asc">Сначала дешевле</option>
                <option value="price_desc">Сначала дороже</option>
                <option value="year_asc">Сначала свежие по году</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className={`transition-opacity duration-200 ${
            isLoading ? "pointer-events-none opacity-60" : "opacity-100"
          }`}
        >
          {filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-lg font-bold text-gray-800">
                Машины по вашему запросу не найдены
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Попробуйте изменить параметры поиска или сбросить фильтры.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 rounded-xl bg-[#F50E30] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                    <img
                      src={backendApiUrl + car.main_image}
                      alt={car.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <button
                      onClick={() => toggleFavorite(car.id)}
                      title={
                        car.isFavorite ? "Убрать из избранного" : "В избранное"
                      }
                      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
                    >
                      <svg
                        className={`h-5 w-5 ${
                          car.isFavorite
                            ? "fill-current text-[#F50E30]"
                            : "text-gray-400"
                        }`}
                        fill={car.isFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>

                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      <span className="rounded-md bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {car.country}
                      </span>
                      <span className="rounded-md bg-[#F50E30]/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {car.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-1 text-base font-bold text-gray-900">
                      {car.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {car.year} г. • {car.mileage_km} • {car.drive_type} привод
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {car.engine_info}
                    </p>

                    <div className="my-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                      <span>Срок доставки:</span>
                      <span className="font-semibold text-gray-800">
                        {car.delivery_time_text}
                      </span>
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-gray-400">
                          Цена «Под ключ»:
                        </span>
                        <span className="text-xs text-gray-400">
                          {car.price_original_currency.toLocaleString("ru-RU")}
                        </span>
                      </div>
                      <p className="text-xl font-black text-[#F50E30]">
                        {Number(car.price_rub).toLocaleString("ru-RU")} ₽
                      </p>
                    </div>

                    <Link
                      to={`/cars/${car.id}`}
                      className="mt-4 flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                    >
                      Подробнее об авто
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row">
            <div className="text-xs font-medium text-gray-500">
              Показано {totalCars > 0 ? (page - 1) * limit + 1 : 0} -{" "}
              {Math.min(page * limit, totalCars)} из {totalCars} авто
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">

              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Назад</span>
              </button>

              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-2 py-1 text-xs font-medium text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`h-9 min-w-9 rounded-xl text-xs font-bold transition-all ${
                      page === p
                        ? "bg-[#F50E30] text-white shadow-sm shadow-[#F50E30]/30"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white"
              >
                <span>Вперед</span>
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
