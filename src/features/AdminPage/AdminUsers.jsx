import { useState } from "react";

const INITIAL_USERS = [
  {
    id: 1,
    name: "Алексей В.",
    email: "alexey@carshop.ru",
    role: "MANAGER",
    phone: "+7 (927) 000-00-00",
  },
  {
    id: 2,
    name: "Иван К.",
    email: "admin@carshop.ru",
    role: "ADMIN",
    phone: "+7 (999) 111-11-11",
  },
  {
    id: 3,
    name: "Михаил С.",
    email: "client@gmail.com",
    role: "USER",
    phone: "+7 (917) 222-22-22",
  },
];

export const AdminUsers = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER",
  });

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", phone: "", role: "USER" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...formData, id: u.id } : u,
        ),
      );
    } else {
      setUsers([...users, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Вы точно хотите удалить этого пользователя?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Управление пользователями
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Создание аккаунтов сотрудников, назначение ролей и удаление
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="rounded-xl bg-[#F50E30] px-4 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90"
        >
          + Создать пользователя
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-50 text-[10px] font-semibold text-gray-400 uppercase">
            <tr>
              <th className="p-4">Имя</th>
              <th className="p-4">Email / Телефон</th>
              <th className="p-4">Роль</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900">{u.name}</td>
                <td className="p-4">
                  <p>{u.email}</p>
                  <p className="text-[10px] text-gray-400">{u.phone}</p>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-bold ${
                      u.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : u.role === "MANAGER"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="flex justify-end gap-2 p-4 text-right">
                  <button
                    onClick={() => handleOpenModal(u)}
                    className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100"
                  >
                    ✏️ Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
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
              {editingUser
                ? "Редактировать пользователя"
                : "Новый пользователь"}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">ФИО / Имя</label>
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

              <div>
                <label className="font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">
                  Роль в системе
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#F50E30]"
                >
                  <option value="USER">USER (Покупатель)</option>
                  <option value="MANAGER">
                    MANAGER (Менеджер по продажам)
                  </option>
                  <option value="ADMIN">ADMIN (Администратор)</option>
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
