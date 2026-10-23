import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { useToast } from "../services/ToastService";
import api from "../services/api";
import Loader from "../components/Loader";
import NotFound from "./NotFound";

export default function CarDetails() {
  const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();

  const [car, setCar] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [isGettingUser, setGettingUser] = useState(false);

  const [isOrderVisible, setOrderVisibility] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderForm, setOrderForm] = useState({
    client_name: "",
    client_phone: "",
    city_destination: "",
    agreeToTerms: false,
  });

  const handleMakeOrder = async () => {
    setGettingUser(true);
    try {
      const result = await api.get("/profile/me");
      setOrderForm((prev) => ({
        ...prev,
        client_name: result.data.full_name,
        client_phone: result.data.phone,
        city_destination: result.data.city,
      }));
    } catch (err) {
      addToast("Произошла ошибка, попробуйте позже", "error");
    } finally {
      setGettingUser(false);
      setOrderVisibility(true);
    }
  };

  const handleOrderChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.agreeToTerms) {
      setOrderVisibility(false);

      addToast(
        "Необходимо согласие на обработку персональных данных",
        "warning",
      );
      return;
    }

    setIsSubmittingOrder(true);
    try {
      await api.post("/orders/new", {
        car_id: car.id,
        ...orderForm,
      });
      addToast(
        `Заявка на ${car.name} успешно оформлена! Менеджер свяжется с вами по номеру ${orderForm.client_phone}.`,
        "success",
      );
      setOrderVisibility(false);
      setOrderForm({
        client_name: "",
        client_phone: "",
        city_destination: "",
        agreeToTerms: false,
      });
    } catch (err) {
      addToast("Произошла ошибка, попробуйте позже", "error");
      setOrderVisibility(false);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    async function getCar() {
      try {
        setIsLoading(true);
        const response = await api.get(`/cars/${id}`);

        const isAuthenticated = Boolean(localStorage.getItem("token"));
        if (isAuthenticated) {
          try {
            const favResult = await api.get("/favorite", {
              signal: controller.signal,
            });
            const favoritesData = favResult.data || [];

            let isFav = false;
            favoritesData.map((item) => {
              if (item.id === response.data.id) {
                isFav = true;
              }
            });

            setIsFavorite(isFav);
          } catch (favErr) {
            console.error("Ошибка загрузки избранного:", favErr);
          }
        }

        setCar(response.data);
      } catch (err) {
        console.error("Ошибка загрузки автомобиля:", err);
      } finally {
        setIsLoading(false);
      }
    }

    getCar();
  }, [id]);

  if (isLoading) {
    return <Loader text="Получение данных об автомобиле..." />;
  }

  if (!car) {
    return <NotFound />;
  }

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

      setIsLoading(true);

      const result = await api.post("/favorite", { car_id: id });

      setIsFavorite(!isFavorite);

      addToast(result.data?.message || "Автомобиль добавлен");
    } catch (error) {
      addToast(error.response?.data?.message || "Ошибка", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">

      {isOrderVisible && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm transition-all duration-300"
          onClick={() => setOrderVisibility(false)}
        >
          <div
            className="relative my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl transition-all sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              onClick={() => setOrderVisibility(false)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
              aria-label="Закрыть"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="mb-6">
              <span className="inline-block rounded-md bg-[#F50E30]/10 px-2.5 py-1 text-xs font-bold text-[#F50E30]">
                Оформление заказа
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
                Заявка на покупку
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Оставьте свои контактные данные, и персональный менеджер
                подготовит договор и свяжется с вами.
              </p>
            </div>

            <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3.5">
              <img
                src={
                  car.main_image
                    ? car.main_image.startsWith("http")
                      ? car.main_image
                      : BACKEND_API_URL + car.main_image
                    : car.images?.[0]?.image_url
                      ? car.images[0].image_url.startsWith("http")
                        ? car.images[0].image_url
                        : BACKEND_API_URL + car.images[0].image_url
                      : "/coolPolo.png"
                }
                alt={car.name}
                className="h-16 w-20 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-bold text-gray-900">{car.name}</h4>
                <p className="text-xs text-gray-500">
                  {car.year} г. • {car.mileage_km} • {car.engine_info}
                </p>
                <p className="mt-1 text-sm font-extrabold text-[#F50E30]">
                  {car.price_rub.toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="order-name"
                    className="mb-1 block text-xs font-semibold text-gray-700"
                  >
                    Ваше имя <span className="text-[#F50E30]">*</span>
                  </label>
                  <input
                    type="text"
                    id="order-name"
                    name="client_name"
                    value={orderForm.client_name}
                    onChange={handleOrderChange}
                    placeholder="Иван Иванов"
                    required
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 transition-all outline-none focus:border-[#F50E30] focus:ring-2 focus:ring-[#F50E30]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="order-phone"
                    className="mb-1 block text-xs font-semibold text-gray-700"
                  >
                    Телефон <span className="text-[#F50E30]">*</span>
                  </label>
                  <input
                    type="tel"
                    id="order-phone"
                    name="client_phone"
                    value={orderForm.client_phone}
                    onChange={handleOrderChange}
                    placeholder="+7 (999) 000-00-00"
                    required
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 transition-all outline-none focus:border-[#F50E30] focus:ring-2 focus:ring-[#F50E30]/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="order-city"
                  className="mb-1 block text-xs font-semibold text-gray-700"
                >
                  Город доставки <span className="text-[#F50E30]">*</span>
                </label>
                <input
                  type="text"
                  id="order-city"
                  name="city_destination"
                  value={orderForm.city_destination}
                  onChange={handleOrderChange}
                  placeholder="Москва"
                  required
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 transition-all outline-none focus:border-[#F50E30] focus:ring-2 focus:ring-[#F50E30]/20"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 text-xs text-gray-600">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={orderForm.agreeToTerms}
                  onChange={handleOrderChange}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#F50E30] focus:ring-[#F50E30]"
                />
                <span>
                  Я согласен на обработку персональных данных и подтверждаю
                  намерение оформить заказ
                </span>
              </label>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOrderVisibility(false)}
                  className="w-1/3 cursor-pointer rounded-xl border border-gray-200 bg-white py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="w-2/3 cursor-pointer rounded-xl bg-[#F50E30] py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmittingOrder ? "Отправка..." : "Отправить заявку"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div
        className={`bg-[#F4F6F8] py-6 ${isOrderVisible ? "h-screen overflow-hidden blur-sm" : "min-h-screen blur-none"}`}
      >
        <Container className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link to="/" className="hover:text-gray-900">
              Главная
            </Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-gray-900">
              Каталог
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-800">{car.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            <div className="flex flex-col gap-3 lg:col-span-7">

              {(() => {
                const allImages = [];

                if (
                  typeof car.main_image === "string" &&
                  car.main_image.trim()
                ) {
                  allImages.push(car.main_image.trim());
                } else if (car.main_image?.image_url) {
                  allImages.push(car.main_image.image_url);
                }

                if (typeof car.image_url === "string" && car.image_url.trim()) {
                  if (!allImages.includes(car.image_url.trim())) {
                    allImages.push(car.image_url.trim());
                  }
                } else if (Array.isArray(car.image_url)) {
                  car.image_url.forEach((img) => {
                    const url = typeof img === "string" ? img : img?.image_url;
                    if (
                      url &&
                      typeof url === "string" &&
                      url.trim() &&
                      !allImages.includes(url.trim())
                    ) {
                      allImages.push(url.trim());
                    }
                  });
                }

                if (Array.isArray(car.images)) {
                  car.images.forEach((img) => {
                    const url = typeof img === "string" ? img : img?.image_url;
                    if (
                      url &&
                      typeof url === "string" &&
                      url.trim() &&
                      !allImages.includes(url.trim())
                    ) {
                      allImages.push(url.trim());
                    }
                  });
                }

                const activeImgUrl = allImages[activeImage] || allImages[0];
                const fullImageUrl = activeImgUrl
                  ? activeImgUrl.startsWith("http")
                    ? activeImgUrl
                    : BACKEND_API_URL + activeImgUrl
                  : "/coolPolo.png";

                return (
                  <>
                    <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gray-200 shadow-sm sm:h-96">
                      <img
                        src={fullImageUrl}
                        alt={car.name}
                        className="h-full w-full object-cover transition-all duration-300"
                      />
                      <span className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {car.country_code} {car.country}
                      </span>
                      <button
                        onClick={() => toggleFavorite(car.id)}
                        className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform active:scale-95"
                      >
                        <svg
                          className={`h-6 w-6 ${isFavorite ? "fill-current text-[#F50E30]" : "text-gray-400"}`}
                          fill={isFavorite ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>

                    {allImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-3">
                        {allImages.map((imgUrl, index) => {
                          const src = imgUrl.startsWith("http")
                            ? imgUrl
                            : BACKEND_API_URL + imgUrl;
                          return (
                            <button
                              key={index}
                              onClick={() => setActiveImage(index)}
                              className={`relative h-20 overflow-hidden rounded-xl bg-gray-100 transition-all ${
                                activeImage === index
                                  ? "ring-2 ring-[#F50E30] ring-offset-2"
                                  : "opacity-70 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={src}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
                <div>
                  <span className="inline-block rounded-md bg-[#F50E30]/10 px-2.5 py-1 text-xs font-semibold text-[#F50E30]">
                    {car.status.replaceAll("_", " ")}
                  </span>
                  <h1 className="mt-2 text-2xl font-black text-gray-900">
                    {car.name}
                  </h1>
                  <p className="mt-1 text-xs text-gray-400">VIN: {car.vin}</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">
                    Итоговая цена «Под ключ» в РФ:
                  </p>
                  <div className="mt-1 flex items-baseline justify-between">
                    <p className="text-3xl font-black text-[#F50E30]">
                      {car.price_rub.toLocaleString("ru-RU")} ₽
                    </p>
                    <span className="text-sm font-medium text-gray-500">
                      {car.price_original_currency}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                    ✓ Включает растаможку, ЭПТС, СБКТС и доставку
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleMakeOrder}
                    disabled={isGettingUser}
                    className={`w-full rounded-xl bg-[#F50E30] py-3.5 text-center text-base font-bold text-white ${isGettingUser ? "opacity-50" : "transition-opacity hover:opacity-90 active:scale-[0.99]"}`}
                  >
                    {isGettingUser
                      ? "Получение данных пользователя..."
                      : "Заказать этот автомобиль"}
                  </button>
                  <button
                    type="button"
                    onClick={() => addToast("Запрос на консультацию отправлен")}
                    className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Запросить доп. фото и видео
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            <div className="flex flex-col gap-6 lg:col-span-8">

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 border-b border-gray-100 pb-3 text-lg font-bold text-gray-900">
                  Технические характеристики
                </h3>
                <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <div className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-400">Год выпуска:</span>
                    <span className="font-semibold text-gray-800">
                      {car.year}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-400">Пробег:</span>
                    <span className="font-semibold text-gray-800">
                      {car.mileage_km}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-400">Двигатель:</span>
                    <span className="font-semibold text-gray-800">
                      {car.engine_info}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-400">Коробка передач:</span>
                    <span className="font-semibold text-gray-800">
                      {car.transmission}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-400">Привод:</span>
                    <span className="font-semibold text-gray-800">
                      {car.drive_type}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-400">Цвет:</span>
                    <span className="font-semibold text-gray-800">
                      {car.color}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-400">Локация авто:</span>
                    <span className="font-semibold text-gray-800">
                      {car.location}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-400">Срок доставки:</span>
                    <span className="font-semibold text-gray-800">
                      {car.delivery_time_text}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 border-b border-gray-100 pb-3 text-lg font-bold text-gray-900">
                  Прозрачный расчет стоимости
                </h3>
                <div className="flex flex-col gap-2.5">
                  {car.price_breakdown.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span className="text-gray-600">{item.title}</span>
                      <span className="font-bold text-gray-900">
                        {item.amount_rub.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between px-3 pt-2 text-base font-extrabold text-[#F50E30]">
                    <span>Итого к оплате:</span>
                    <span>{car.price_rub.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 border-b border-gray-100 pb-3 text-lg font-bold text-gray-900">
                  Описание автомобиля
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {car.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-4">
              <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
                <h4 className="border-b border-gray-100 pb-2 font-bold text-gray-900">
                  Почему выгодно заказать у нас
                </h4>

                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F50E30]/10 text-sm font-bold text-[#F50E30]">
                    1
                  </span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Фиксация цены в договоре
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Цена не изменится во время доставки
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F50E30]/10 text-sm font-bold text-[#F50E30]">
                    2
                  </span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Полный видеоотчет
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Осмотр толщиномером перед выкупом
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F50E30]/10 text-sm font-bold text-[#F50E30]">
                    3
                  </span>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Страхование груза
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Автомобиль застрахован на всех этапах
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
