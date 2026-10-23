import { useState } from "react";

const INITIAL_CARS = [
  {
    id: 1,
    name: "Hyundai Santa Fe 2.2d 4WD",
    brand: "Hyundai",
    price: 3200000,
    country: "🇰🇷 Южная Корея",
    status: "Под заказ",
    year: 2022,
  },
  {
    id: 2,
    name: "Geely Monjaro 2.0T 4WD",
    brand: "Geely",
    price: 3650000,
    country: "🇨🇳 Китай",
    status: "В наличии в КНР",
    year: 2024,
  },
];

export const AdminCars = () => {
  const [cars, setCars] = useState(INITIAL_CARS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "Hyundai",
    price: "",
    country: "🇰🇷 Южная Корея",
    status: "Под заказ",
    year: 2024,
  });

  const handleOpenModal = (car = null) => {
    if (car) {
      setEditingCar(car);
      setFormData(car);
    } else {
      setEditingCar(null);
      setFormData({
        name: "",
        brand: "Hyundai",
        price: "",
        country: "🇰🇷 Южная Корея",
        status: "Под заказ",
        year: 2024,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingCar) {

      setCars(
        cars.map((c) =>
          c.id === editingCar.id
            ? { ...formData, id: c.id, price: Number(formData.price) }
            : c,
        ),
      );
    } else {

      setCars([
        ...cars,
        { ...formData, id: Date.now(), price: Number(formData.price) },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить этот автомобиль из каталога?",
      )
    ) {
      setCars(cars.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Управление товарами (Каталог)
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Полный доступ: добавление, изменение и удаление авто
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="rounded-xl bg-[#F50E30] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90"
        >
          + Добавить автомобиль
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-50 text-[10px] font-semibold text-gray-400 uppercase">
            <tr>
              <th className="p-4">Название / Марка</th>
              <th className="p-4">Год</th>
              <th className="p-4">Страна</th>
              <th className="p-4">Цена</th>
              <th className="p-4">Статус</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900">{car.name}</td>
                <td className="p-4">{car.year}</td>
                <td className="p-4">{car.country}</td>
                <td className="p-4 font-black text-[#F50E30]">
                  {car.price.toLocaleString("ru-RU")} ₽
                </td>
                <td className="p-4">
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs">
                    {car.status}
                  </span>
                </td>
                <td className="flex justify-end gap-2 p-4 text-right">
                  <button
                    onClick={() => handleOpenModal(car)}
                    className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100"
                  >
                    ✏️ Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    🗑️ Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              {editingCar
                ? "Редактирование товара"
                : "Добавление товара в каталог"}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">
                  Название авто
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700">Марка</label>
                  <select
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                  >
                    <option value="Hyundai">Hyundai</option>
                    <option value="Kia">Kia</option>
                    <option value="Geely">Geely</option>
                    <option value="BMW">BMW</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">
                    Год выпуска
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Цена «Под ключ», ₽
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Страна</label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                >
                  <option value="🇰🇷 Южная Корея">🇰🇷 Южная Корея</option>
                  <option value="🇨🇳 Китай">🇨🇳 Китай</option>
                  <option value="🇩🇪 Германия">🇩🇪 Германия</option>
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
    </div>
  );
};
