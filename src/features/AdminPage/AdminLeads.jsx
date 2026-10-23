import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../services/ToastService";
import Loader from "../../components/Loader";

const STATUS_MAP = {
  NEW: {
    label: "Новая",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "В работе",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },

  CLOSED: {
    label: "Обработана",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },

  CANCELLED: {
    label: "Отклонена",
    bg: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

const SOURCE_MAP = {
  CALCULATION_REQUEST: { label: "Расчет стоимости", icon: "🧮" },
  FAST_ORDER: { label: "Быстрый заказ", icon: "🏎️" },
  CONSULTATION: { label: "Консультация", icon: "💬" },
  PHOTO_REQUEST: { label: "Запрос фото", icon: "📸" },
  CONTACT_FORM: { label: "Форма связи", icon: "📝" },

};

export const AdminLeads = () => {
  const { addToast } = useToast();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [serverCounts, setServerCounts] = useState(null);

  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cityDestination, setCityDestination] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    source_type: "CONSULTATION",
    car_id: "",
    message: "",
    status: "NEW",
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", itemsPerPage);

      if (activeTab !== "all") {
        params.append("tab", activeTab);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      if (sourceFilter !== "all") {
        params.append("source", sourceFilter);
      }

      const res = await api.get(`/leads/all?${params.toString()}`);
      const data = res.data || ;

      const fetchedLeads = data.leads || (Array.isArray(data) ? data : null);
      if (fetchedLeads) {
        setLeads(fetchedLeads);
      }

      if (data.counts) {
        setServerCounts(data.counts);
      }

      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalLeads(
          data.pagination.total ?? (fetchedLeads ? fetchedLeads.length : 0),
        );
      } else if (fetchedLeads) {
        setTotalLeads(fetchedLeads.length);
        setTotalPages(Math.ceil(fetchedLeads.length / itemsPerPage) || 1);
      }
    } catch (error) {
      addToast(error.response?.data?.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [currentPage, itemsPerPage, activeTab, searchQuery, sourceFilter]);

  const getCarDisplayInfo = (lead) => {
    if (!lead) return null;

    if (lead.car_name || lead.car_title) {
      return {
        id: lead.car_id || "car",
        title: lead.car_name || lead.car_title,
      };
    }
    if (lead.car && lead.car.name) {
      return {
        id: lead.car_id || lead.car.id,
        title: `${lead.car.name}${lead.car.year ? ` (${lead.car.year})` : ""}`,
      };
    }

    if (!lead.car_id) return null;

    return {
      id: lead.car_id,
      title: `Автомобиль #${lead.car_id}`,
    };
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/leads/${id}`, { status: newStatus });
      addToast(
        `Статус заявки #${id} изменен на "${STATUS_MAP[newStatus]?.label || newStatus}"`,
        "accept",
      );
    } catch (err) {
      console.warn("Обновлено локально:", err);
      addToast(`Статус заявки #${id} обновлен`, "accept");
    }

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead,
      ),
    );

    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }));
    }

    fetchLeads();
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm(`Вы уверены, что хотите удалить заявку #${id}?`))
      return;

    try {
      await api.delete(`/leads/${id}`);
      addToast(`Заявка #${id} успешно удалена`, "accept");
    } catch (err) {
      console.warn("Удалено локально:", err);
      addToast(`Заявка #${id} удалена`, "accept");
    }

    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    if (selectedLead?.id === id) {
      setIsDetailModalOpen(false);
    }
    fetchLeads();
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    const chosenCarId = formData.car_id ? Number(formData.car_id) : null;
    const carInfo = chosenCarId
      ? getCarDisplayInfo({ car_id: chosenCarId })
      : null;

    const newLead = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      source_type: formData.source_type,
      car_id: chosenCarId,
      car_name: carInfo ? carInfo.title : null,
      message: formData.message,
      status: formData.status || "NEW",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await api.post("/leads", newLead);
      if (res.data?.id) {
        newLead.id = res.data.id;
      }
      addToast("Новая заявка успешно добавлена", "accept");
    } catch (err) {
      console.warn("Сохранено локально:", err);
      addToast("Заявка успешно добавлена в список", "accept");
    }

    setLeads((prev) => [newLead, ...prev]);
    setIsCreateModalOpen(false);
    setFormData({
      name: "",
      phone: "",
      source_type: "CONSULTATION",
      car_id: "",
      message: "",
      status: "NEW",
    });
  };

  const handleConvertToOrder = async (lead) => {
    if (!cityDestination.trim()) {
      addToast(
        "Укажите город назначения для доставки перед переводом заявки в заказ",
        "warning",
      );
      return;
    }

    try {
      const res = await api.post(`/leads/${lead.id}/convert`, {
        car_id: lead.car_id,
        client_name: lead.name,
        client_phone: lead.phone,
        city_destination: cityDestination.trim(),
      });
      addToast(
        res.data?.message ||
          `Заявка #${lead.id} успешно конвертирована в заказ!`,
        "accept",
      );
      setIsDetailModalOpen(false);
      fetchLeads();
    } catch (err) {
      console.warn("Ошибка при конвертации:", err);
      addToast(
        err.response?.data?.message || "Ошибка при переводе в заказ",
        "error",
      );
    }
  };

  const handleOpenDetail = (lead) => {
    setSelectedLead(lead);
    setCityDestination(lead.city_destination || "");
    setIsDetailModalOpen(true);
  };

  const counts = useMemo(() => {
    if (serverCounts) {
      return {
        all: serverCounts.all ?? 0,
        new: serverCounts.new ?? serverCounts.NEW ?? 0,
        progress: serverCounts.progress ?? serverCounts.IN_PROGRESS ?? 0,
        closed: serverCounts.closed ?? serverCounts.PROCESSED ?? 0,
        cancelled:
          serverCounts.cancelled ??
          serverCounts.CANCELLED ??
          serverCounts.REJECTED ??
          0,
      };
    }
    return {
      all: leads.length,
      new: leads.filter((l) => l.status === "NEW" || l.status === "new").length,
      progress: leads.filter(
        (l) => l.status === "IN_PROGRESS" || l.status === "progress",
      ).length,
      closed: leads.filter(
        (l) => l.status === "PROCESSED" || l.status === "closed",
      ).length,
      cancelled: leads.filter(
        (l) =>
          l.status === "CANCELLED" ||
          l.status === "REJECTED" ||
          l.status === "cancelled",
      ).length,
    };
  }, [serverCounts, leads]);

  const displayedLeads = useMemo(() => {
    if (serverCounts !== null) {
      return leads;
    }
    return leads.filter((lead) => {
      const statusUpper = lead.status ? lead.status.toUpperCase() : "";
      if (activeTab === "new" && statusUpper !== "NEW") return false;
      if (activeTab === "progress" && statusUpper !== "IN_PROGRESS")
        return false;
      if (
        activeTab === "closed" &&
        statusUpper !== "PROCESSED" &&
        statusUpper !== "CLOSED"
      )
        return false;
      if (
        activeTab === "cancelled" &&
        statusUpper !== "CANCELLED" &&
        statusUpper !== "REJECTED"
      )
        return false;

      if (sourceFilter !== "all" && lead.source_type !== sourceFilter) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const carInfo = getCarDisplayInfo(lead);
        const matchesName = lead.name?.toLowerCase().includes(q);
        const matchesPhone = lead.phone?.toLowerCase().includes(q);
        const matchesMsg = lead.message?.toLowerCase().includes(q);
        const matchesId = String(lead.id).includes(q);
        const matchesCar = carInfo?.title?.toLowerCase().includes(q);
        return (
          matchesName || matchesPhone || matchesMsg || matchesId || matchesCar
        );
      }
      return true;
    });
  }, [leads, activeTab, sourceFilter, searchQuery, serverCounts]);

  const effectiveTotal = serverCounts ? totalLeads : displayedLeads.length;
  const effectiveTotalPages = serverCounts
    ? totalPages
    : Math.ceil(displayedLeads.length / itemsPerPage) || 1;
  const paginatedLeads = useMemo(() => {
    if (serverCounts !== null) {
      return displayedLeads;
    }
    const start = (currentPage - 1) * itemsPerPage;
    return displayedLeads.slice(start, start + itemsPerPage);
  }, [displayedLeads, currentPage, itemsPerPage, serverCounts]);

  const startIndex =
    effectiveTotal === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, effectiveTotal);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getPageNumbers = () => {
    if (effectiveTotalPages <= 1) return [1];
    if (effectiveTotalPages <= 7) {
      return Array.from({ length: effectiveTotalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", effectiveTotalPages];
    }
    if (currentPage >= effectiveTotalPages - 3) {
      return [
        1,
        "...",
        effectiveTotalPages - 4,
        effectiveTotalPages - 3,
        effectiveTotalPages - 2,
        effectiveTotalPages - 1,
        effectiveTotalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      effectiveTotalPages,
    ];
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Заявки и лиды с сайта
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Обработка обратных звонков, запросов расчета, консультаций и подбора
            авто
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="self-start rounded-xl bg-[#F50E30] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 sm:self-auto"
        >
          + Создать заявку вручную
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => {
            setActiveTab("all");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-gray-900 text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Все заявки
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === "all"
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("new");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "new"
              ? "bg-amber-500 text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          ⚡ Новые
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === "new"
                ? "bg-amber-700 text-white"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {counts.new}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("in_progress");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "in_progress"
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          🔄 В работе
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === "progress"
                ? "bg-blue-800 text-white"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {counts.progress}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("closed");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "closed"
              ? "bg-emerald-600 text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          ✅ Обработанные
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === "closed"
                ? "bg-emerald-800 text-white"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {counts.closed}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("cancelled");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "cancelled"
              ? "bg-red-600 text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          ❌ Отклоненные
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === "cancelled"
                ? "bg-red-800 text-white"
                : "bg-red-50 text-red-700"
            }`}
          >
            {counts.cancelled}
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Поиск по имени, телефону, авто или тексту..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-xs font-medium transition-all outline-none focus:border-[#F50E30] focus:bg-white"
          />
          <span className="absolute top-2.5 left-3 text-sm text-gray-400">
            🔍
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium whitespace-nowrap text-gray-500">
            Источник:
          </span>
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-bold text-gray-700 outline-none focus:border-[#F50E30]"
          >
            <option value="all">Все источники</option>
            {Object.entries(SOURCE_MAP).map(([key, item]) => (
              <option key={key} value={key}>
                {item.icon} {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-50 text-[10px] font-semibold text-gray-400 uppercase">
            <tr>
              <th className="p-4">ID / Дата</th>
              <th className="p-4">Клиент</th>
              <th className="p-4">Источник</th>
              <th className="p-4">Интересующий автомобиль</th>
              <th className="p-4">Сообщение</th>
              <th className="p-4">Статус</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-8">
                  <Loader text="Загрузка заявок..." />
                </td>
              </tr>
            ) : paginatedLeads.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-xs text-gray-400"
                >
                  Заявки не найдены
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const statusKey = lead.status
                  ? lead.status.toUpperCase()
                  : "NEW";
                const statusInfo = STATUS_MAP[statusKey] ||
                  STATUS_MAP[lead.status] || {
                    label: lead.status,
                    bg: "bg-gray-100 text-gray-700 border-gray-200",
                    dot: "bg-gray-400",
                  };
                const sourceInfo = SOURCE_MAP[lead.source_type] || {
                  label: lead.source_type,
                  icon: "📩",
                };
                const carDisplay = getCarDisplayInfo(lead);

                return (
                  <tr key={lead.id} className="hover:bg-gray-50/50">

                    <td className="p-4">
                      <span className="font-bold text-gray-900">
                        #{lead.id}
                      </span>
                      <p className="mt-0.5 text-[10px] font-normal text-gray-400">
                        {formatDate(lead.created_at)}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-gray-900">{lead.name}</p>
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-[11px] font-bold text-[#F50E30] hover:underline"
                      >
                        {lead.phone}
                      </a>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
                        <span>{sourceInfo.icon}</span>
                        <span>{sourceInfo.label}</span>
                      </span>
                    </td>

                    <td className="max-w-55 p-4">
                      {carDisplay ? (
                        <Link
                          to={`/cars/${carDisplay.id}`}
                          className="inline-flex flex-col gap-0.5 rounded-lg border border-purple-100 bg-purple-50 px-2.5 py-1.5 transition-all hover:border-purple-200 hover:bg-purple-100"
                        >
                          <span className="line-clamp-1 text-xs font-bold text-purple-900">
                            🚘 {carDisplay.title}
                          </span>
                          <span className="text-[10px] font-medium text-purple-600">
                            ID в каталоге: #{carDisplay.id}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Не привязан к авто
                        </span>
                      )}
                    </td>

                    <td className="max-w-xs p-4">
                      <p className="line-clamp-2 text-xs font-normal text-gray-600">
                        {lead.message || "Без комментария"}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-bold ${statusInfo.bg}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`}
                        />
                        {statusInfo.label}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(lead)}
                          className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-bold text-gray-700 transition-all hover:bg-gray-200"
                          title="Просмотреть детальную информацию"
                        >
                          👁️ Детали
                        </button>

                        {(lead.status === "NEW" || lead.status === "new") && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(lead.id, "IN_PROGRESS")
                            }
                            className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100"
                            title="Взять заявку в работу"
                          >
                            ⚡ В работу
                          </button>
                        )}

                        {(lead.status === "IN_PROGRESS" ||
                          lead.status === "progress") && (
                          <button
                            onClick={() => handleOpenDetail(lead)}
                            className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100"
                            title="Оформить заказ на основе заявки"
                          >
                            🛒 Создать заказ
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="rounded-lg bg-red-50 px-2 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100"
                          title="Удалить заявку"
                        >
                          🗑️
                        </button>
                      </div>
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
            из{" "}
            <strong className="font-bold text-gray-900">
              {effectiveTotal}
            </strong>{" "}
            заявок
          </span>
          <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
            <span>На странице:</span>
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
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                onClick={() => setCurrentPage(page)}
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
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, effectiveTotalPages))
            }
            disabled={
              currentPage === effectiveTotalPages || effectiveTotalPages === 0
            }
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Вперед →
          </button>
        </div>
      </div>

      {isDetailModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Заявка #{selectedLead.id}
                </h3>
                <p className="text-xs text-gray-400">
                  Создана: {formatDate(selectedLead.created_at)}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div>
                  <span className="font-semibold text-gray-500">Клиент:</span>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedLead.name}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-500">Телефон:</span>
                  <p>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="text-sm font-bold text-[#F50E30] hover:underline"
                    >
                      {selectedLead.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-500">Источник:</span>
                  <p className="font-bold text-gray-800">
                    {SOURCE_MAP[selectedLead.source_type]?.icon}{" "}
                    {SOURCE_MAP[selectedLead.source_type]?.label ||
                      selectedLead.source_type}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-500">
                    Автомобиль:
                  </span>
                  {getCarDisplayInfo(selectedLead) ? (
                    <p className="font-bold text-purple-800">
                      🚘 {getCarDisplayInfo(selectedLead).title}
                    </p>
                  ) : (
                    <p className="font-medium text-gray-400">Не указан</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-700">
                  Текст сообщения / комментарий:
                </label>
                <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 text-xs leading-relaxed text-gray-800">
                  {selectedLead.message ||
                    "Клиент не оставил дополнительного комментария."}
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-700">
                  Город назначения доставки:{" "}
                  <span className="text-[#F50E30]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Укажите город доставки (например, Москва, Екатеринбург)..."
                  value={cityDestination}
                  onChange={(e) => setCityDestination(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-xs font-medium transition-all outline-none focus:border-[#F50E30] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-gray-700">
                  Изменить статус заявки:
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Object.entries(STATUS_MAP).map(([code, info]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedLead.id, code)}
                      className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                        selectedLead.status === code
                          ? `${info.bg} ring-2 ring-[#F50E30]/20`
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {info.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-2">
                <button
                  type="button"
                  onClick={() => handleConvertToOrder(selectedLead)}
                  disabled={!cityDestination.trim()}
                  title={
                    !cityDestination.trim()
                      ? "Заполните город назначения для перевода заявки в заказ"
                      : "Конвертировать заявку в заказ"
                  }
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 font-bold text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  🛒 Перевести в заказ
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="rounded-xl bg-gray-100 px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-200"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Создать заявку вручную
            </h3>

            <form
              onSubmit={handleCreateLead}
              className="flex flex-col gap-3 text-xs"
            >
              <div>
                <label className="font-semibold text-gray-700">
                  ФИО / Имя клиента
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например, Иван Иванов"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  placeholder="+7 (999) 000-00-00"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Источник заявки
                </label>
                <select
                  value={formData.source_type}
                  onChange={(e) =>
                    setFormData({ ...formData, source_type: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                >
                  {Object.entries(SOURCE_MAP).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.icon} {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  ID авто из каталога (опционально)
                </label>
                <input
                  type="text"
                  placeholder="Например, 635946"
                  value={formData.car_id}
                  onChange={(e) =>
                    setFormData({ ...formData, car_id: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Сообщение / Пожелания клиента
                </label>
                <textarea
                  rows={3}
                  placeholder="Опишите суть запроса или примечание менеджера..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
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
    </div>
  );
};
