import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";

const STEPS = [
  { id: "SEARCH", label: "Подбор" },
  { id: "PURCHASED", label: "Выкуплен" },
  { id: "CUSTOMS", label: "Таможня РФ" },
  { id: "IN_TRANSIT", label: "В пути по РФ" },
  { id: "PREPARED", label: "Готов к выдаче" },
];

export default function UserOrders() {
  const backendApiUrl = import.meta.env.VITE_BACKEND_URL;
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getOrders() {
      try {
        setIsLoading(true);
        const result = await api.get("/orders");
        setOrders(result.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    getOrders();
  }, []);

  function formatData(customDate) {
    return customDate
      ? new Date(customDate).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "неизвестно";
  }

  if (isLoading) {
    return <Loader text="Загружаем ваши заказы..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          У вас пока нет активных заказов
        </h3>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          Выберите подходящий автомобиль в каталоге и оформите заявку, чтобы
          отслеживать статус доставки.
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
      <h2 className="text-2xl font-bold text-gray-800">Мои заказы</h2>

      {orders.map((order) => {
        const currentStepIndex = STEPS.findIndex(
          (step) => step.id === order.status,
        );

        return (
          <div
            key={order.id}
            className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
          >

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Заказ
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  #{order.id}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    от {formatData(order.created_at)}
                  </span>
                  {order.status === "CANCELLED" && (
                    <span className="ml-2 inline-block rounded-md bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
                      Отменен
                    </span>
                  )}
                  {order.status === "DELIVERED" && (
                    <span className="ml-2 inline-block rounded-md bg-lime-100 px-2.5 py-0.5 text-xs font-bold text-lime-600">
                      Выдан
                    </span>
                  )}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                  Итого к оплате
                </span>
                <p className="text-xl font-extrabold text-blue-600">
                  {order.total_price?.toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-4 md:flex-row">
              <img
                src={backendApiUrl + order.main_image}
                alt={order.car_name}
                className="h-24 w-full rounded-lg bg-gray-100 object-cover md:w-32"
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">
                  {order.car_name} ({order.car_year})
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Рынок: {order.country}
                </p>
                <p className="text-sm text-gray-500">
                  Доставка в:{" "}
                  <span className="font-medium text-gray-700">
                    {order.city_destination}
                  </span>
                </p>
              </div>
            </div>

            {order.status === "CANCELLED" ? (
              <div className="my-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
                  ✕
                </div>
                <div>
                  <h5 className="text-sm font-bold text-red-800">
                    Заказ отменен
                  </h5>
                  <p className="text-xs text-red-600">
                    Обработка данного заказа прекращена. Для уточнения деталей
                    свяжитесь с менеджером или создайте новый заказ.
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-6 rounded-xl bg-gray-50 p-4">
                <p className="mb-4 text-sm font-semibold text-gray-700">
                  Статус доставки:
                </p>
                <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  {STEPS.map((step, index) => {
                    const isDelivered = order.status === "DELIVERED";
                    const isPassed = isDelivered || index < currentStepIndex;
                    const isCurrent =
                      !isDelivered && index === currentStepIndex;

                    return (
                      <div
                        key={step.id}
                        className="z-10 flex items-center gap-2 md:flex-col"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                            isPassed
                              ? "bg-green-500 text-white"
                              : isCurrent
                                ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isPassed ? "✓" : index + 1}
                        </div>
                        <span
                          className={`text-center text-xs ${isCurrent ? "font-bold text-blue-600" : isPassed ? "font-medium text-green-600" : "text-gray-500"}`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Ваш менеджер:{" "}
                  <strong>{order.manager?.name || "Назначается"}</strong>
                </span>
                {order.manager?.phone && (
                  <a
                    href={`tel:${order.manager.phone}`}
                    className="ml-2 flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    📞 Связаться
                  </a>
                )}
              </div>

              {order.contract_pdf_url && (
                <a
                  href={backendApiUrl + order.contract_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  📄 Скачать договор (PDF)
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
