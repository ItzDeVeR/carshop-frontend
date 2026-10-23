import { useEffect, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../services/ToastService";

const STATUS_MAP = {
  SEARCH: "Поиск авто",
  PURCHASED: "Выкуплен",
  CUSTOMS: "Таможня РФ",
  IN_TRANSIT: "В пути по РФ",
  PREPARED: "Готов к выдаче",
  DELIVERED: "Выдан клиенту",
  CANCELLED: "Отменен",
};

export const AdminOrders = ({
  userRole = "MANAGER",
  currentManagerName = "Не определен",
}) => {
  const isAdmin = userRole?.toUpperCase() === "ADMIN";
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [activeFilterTab, setActiveFilterTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [counts, setCounts] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [managers, setManagers] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    client_name: "",
    phone: "",
    car_name: "",
    car_year: "",
    total_price: "",
    status: "SEARCH",
  });

  const fetchManagers = async () => {
    try {
      const result = await api.get("/profile/roles?role=MANAGER");
      const list = result.data || [];
      setManagers(list);
      return list;
    } catch (error) {
      addToast(error.message || "Не удалось получить менеджеров", "error");
      return [];
    }
  };

  const fetchOrders = async () => {
    try {
      const result = await api.get(
        `/orders/all?limit=${itemsPerPage}&page=${currentPage}&tab=${activeFilterTab}`,
      );
      const data = result.data || ;
      setOrders(data.orders || []);
      setCounts(data.counts || );
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, itemsPerPage, activeFilterTab]);

  const handleTabChange = (tab) => {
    setActiveFilterTab(tab);
    setCurrentPage(1);
  };

  const handleOpenModal = async (order = null) => {
    if (isAdmin) {
      await fetchManagers();
    }

    if (order) {
      setEditingOrder(order);
      setFormData(order);
    } else {
      setEditingOrder(null);
      setFormData({
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: "",
        phone: "",
        carName: "",
        price: "",
        status: "Поиск авто",
        manager_name: currentManagerName || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (editingOrder) {
      try {
        const result = await api.patch("/orders/edit", {
          order_id: editingOrder.id,
          order: formData,
        });
        await fetchOrders();

        setIsModalOpen(false);
        addToast(result.data?.message || "Вы изменили заказ");
      } catch (err) {
        addToast(err.response?.data?.message, "error");
      } finally {
        setIsModalOpen(false);
      }
    } else
  };

  const handleDelete = async (id) => {
    if (window.confirm("Удалить данный заказ?")) {
      try {
        const result = await api.delete(`/orders/${id}`);
        await fetchOrders();

        addToast(result.data?.message || "Вы успешно удалили заказ");
      } catch (err) {
        addToast(err.message, "error");
      }
    }
  };

  const handleOpenAssignModal = async (order) => {
    setSelectedOrderForAssign(order);
    const currentManagers = await fetchManagers();
    const foundManager = currentManagers.find(
      (m) => m.full_name === order.manager_name || m.id === order.manager_id,
    );
    setSelectedManagerId(foundManager ? String(foundManager.id) : "");
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignManager = async (e) => {
    e.preventDefault();
    if (!selectedOrderForAssign) return;

    try {
      let result;
      try {
        result = await api.patch("/orders/reclaim", {
          id: selectedOrderForAssign.id,
          manager_id: selectedManagerId ? Number(selectedManagerId) : null,
        });
      } catch (err) {
        console.error({ err });
      }

      addToast(result.data?.message || "Назначение заказа обновлено");
      setIsAssignModalOpen(false);
      setSelectedOrderForAssign(null);
      setSelectedManagerId("");
      await fetchOrders();
    } catch (err) {
      addToast(err.message || "Ошибка при назначении менеджера", "error");
    }
  };

  const handleTakeOrder = async (id) => {
    try {
      const result = await api.patch("/orders/claim", {
        order_id: id,
      });

      await fetchOrders();

      addToast(result.data?.message || "Вы успешно взяли заказ");
    } catch (err) {
      addToast(err.response?.data?.message, "error");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const managerName = order.manager_name || order.managerName;
    if (activeFilterTab === "my") {
      return managerName === currentManagerName;
    }
    if (activeFilterTab === "unassigned") {
      return !managerName;
    }
    return true;
  });

  const paginatedOrders = filteredOrders;

  const startIndex =
    counts.all === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, counts.all);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 1) return [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
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
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Управление заказами клиентов
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Назначение ответственных менеджеров, смен статуса и распределение
            заказов
            {isAdmin && <span> (Вы можете переназначать менеджеров)</span>}
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="self-start rounded-xl bg-[#F50E30] px-4 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90 sm:self-auto"
        >
          + Создать заказ вручную
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => handleTabChange("all")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeFilterTab === "all"
              ? "bg-gray-900 text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Все заказы
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeFilterTab === "all"
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {counts.all}
          </span>
        </button>

        {!isAdmin && (
          <button
            onClick={() => handleTabChange("my")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeFilterTab === "my"
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Мои заказы
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                activeFilterTab === "my"
                  ? "bg-blue-700 text-white"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {counts.my}
            </span>
          </button>
        )}

        <button
          onClick={() => handleTabChange("unassigned")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeFilterTab === "unassigned"
              ? "bg-amber-500 text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          ⚡ Свободные в очереди
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeFilterTab === "unassigned"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {counts.unassigned}
          </span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-50 text-[10px] font-semibold text-gray-400 uppercase">
            <tr>
              <th className="p-4">№ Заказа</th>
              <th className="p-4">Клиент</th>
              <th className="p-4">Автомобиль</th>
              <th className="p-4">Цена</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Ответственный</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-xs font-normal text-gray-400"
                >
                  В этой категории пока нет заказов
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const managerName = order.manager_name
                  ? order.manager_name
                  : order.manager_username
                    ? `Аноним (${order.manager_username})`
                    : null;
                const clientName = order.client_name || "Не указан";
                const phone = order.phone || "";
                const carName = order.car_name
                  ? `${order.car_name}${order.car_year ? ` (${order.car_year})` : ""}`
                  : "Автомобиль";
                const price = Number(order.total_price || 0);

                const displayStatus = STATUS_MAP[order.status] || order.status;

                return (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-900">{order.id}</td>
                    <td className="p-4 font-bold">
                      {clientName}
                      {phone && (
                        <p className="text-[10px] font-normal text-gray-400">
                          {phone}
                        </p>
                      )}
                    </td>
                    <td className="p-4">{carName}</td>
                    <td className="p-4 font-black">
                      {price.toLocaleString("ru-RU")} ₽
                    </td>
                    <td className="p-4">
                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                        {displayStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      {managerName ? (
                        <div className="flex items-center gap-1.5">
                          <span>👤 {managerName}</span>
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenAssignModal(order)}
                              className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600 transition-all hover:bg-gray-200"
                              title="Сменить менеджера"
                            >
                              ✏️ Сменить
                            </button>
                          )}
                        </div>
                      ) : isAdmin ? (
                        <button
                          onClick={() => handleOpenAssignModal(order)}
                          className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700 transition-all hover:bg-blue-600 hover:text-white"
                        >
                          👤 Назначить менеджера
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTakeOrder(order.id)}
                          className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 transition-all hover:bg-amber-500 hover:text-white"
                        >
                          ⚡ Взять в работу
                        </button>
                      )}
                    </td>
                    <td className="flex justify-end gap-2 p-4 text-right">
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100"
                      >
                        ✏️ Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                      >
                        🗑️ Отменить
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>
            Показано{" "}
            <strong className="font-bold text-gray-900">
              {startIndex}–{endIndex}
            </strong>{" "}
            из <strong className="font-bold text-gray-900">{counts.all}</strong>{" "}
            заказов
          </span>
          <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
            <span>Элементов на странице:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-bold text-gray-700 outline-none focus:border-gray-400"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 self-center sm:self-auto">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Назад
          </button>

          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span
                key={`dots-${idx}`}
                className="px-2 py-1 text-xs font-medium text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`h-8 min-w-8 rounded-xl px-2 text-xs font-bold transition-all ${
                  currentPage === page
                    ? "bg-gray-900 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Вперед →
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              {editingOrder ? "Редактировать заказ" : "Создать новый заказ"}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">
                  ФИО Клиента
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) =>
                    setFormData({ ...formData, client_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Телефон клиента
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Автомобиль
                </label>
                <input
                  type="text"
                  required
                  value={formData.car_name}
                  onChange={(e) =>
                    setFormData({ ...formData, car_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Год автомобиля
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                  value={formData.car_year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      car_year: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Цена «Под ключ», ₽
                </label>
                <input
                  type="number"
                  required
                  value={formData.total_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_price: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Этап / Статус заказа
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                >
                  {Object.entries(STATUS_MAP).map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 rounded-xl bg-gray-100 py-2.5 font-bold text-gray-600 hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-[#F50E30] py-2.5 font-bold text-white hover:opacity-90"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-1 text-lg font-bold text-gray-900">
              Назначить менеджера
            </h3>
            {selectedOrderForAssign && (
              <p className="mb-4 text-xs text-gray-500">
                Заказ{" "}
                <strong className="font-bold text-gray-800">
                  #{selectedOrderForAssign.id}
                </strong>
                {selectedOrderForAssign.client_name
                  ? ` — ${selectedOrderForAssign.client_name}`
                  : ""}
              </p>
            )}

            <form
              onSubmit={handleSaveAssignManager}
              className="flex flex-col gap-4 text-xs"
            >
              <div>
                <label className="mb-1.5 block font-semibold text-gray-700">
                  Выберите ответственного менеджера:
                </label>
                <select
                  value={selectedManagerId}
                  onChange={(e) => setSelectedManagerId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                >
                  <option value="">— Не назначен (в общую очередь) —</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name
                        ? m.full_name
                        : `Аноним (${m.username || m.id})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    setSelectedOrderForAssign(null);
                  }}
                  className="w-1/2 rounded-xl bg-gray-100 py-2.5 font-bold text-gray-600 hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-[#F50E30] py-2.5 font-bold text-white hover:opacity-90"
                >
                  Назначить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
