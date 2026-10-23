import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../services/ToastService";
import api from "../../services/api";

export default function UserInfo() {
  const uploadUrl = import.meta.env.VITE_AVATARS_URL;
  const { addToast } = useToast();
  const [userData, setUserData] = useState();
  const [formData, setFormData] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const roleName = {
    ADMIN: "Администратор",
    MANAGER: "Менеджер",
    USER: "Пользователь",
  };

  const avatarSrc = userData.avatar_url
    ? `${uploadUrl}/${userData.avatar_url.replace(/^\//, "")}`
    : "/defaultavatar.jpg";

  const formattedDate = userData.created_at
    ? new Date(userData.created_at).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",

      })
    : "неизвестно";

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await api.get("/profile/me");

        setUserData(result.data);
        setFormData(result.data);
      } catch (error) {
        console.log("OSHIBOCHKA => " + error);
      }
    }

    fetchData();
  }, []);

  const [passwordData, setPasswordData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await api.patch("/profile/me", formData);

      addToast(result.data.message || "Данные успешно обновлены");
      setUserData({ ...formData });
      setIsSaving(false);
    } catch (error) {
      addToast(
        error.response.data.message || "Произошла ошибка, попробуйте позже",
        "error",
      );
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    if (passwordData.newpassword !== passwordData.confirmPassword) {
      addToast("Новый пароль и подтверждение не совпадают!", "error");
      setIsSaving(false);
      return;
    }

    if (passwordData.newpassword.length < 6) {
      addToast("Пароль должен содержать минимум 6 символов.", "error");
      setIsSaving(false);
      return;
    }

    try {
      const result = await api.patch("/profile/password", passwordData);

      addToast(result.data.message || "Данные успешно обновлены");
      setPasswordData({
        oldpassword: "",
        newpassword: "",
        confirmPassword: "",
      });
      setIsSaving(false);
    } catch (error) {
      addToast(
        error.response.data.message || "Произошла ошибка, попробуйте позже",
        "error",
      );
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return addToast("Вы не выбрали файл", "error");

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return addToast("Разрешены только форматы JPEG, PNG и JPG", "error");
    }

    if (file.size > 5 * 1024 * 1024) {
      return addToast("Размер файла не должен превышать 5 МБ", "error");
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const result = await api.patch("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUserData((prev) => ({ ...prev, avatar_url: result.data.filename }));

      addToast(result.data.message || "Аватар успешно обновлен");
    } catch (error) {
      addToast(
        error.response?.data?.message || "Ошибка обновления аватарки.",
        "error",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col flex-wrap items-center justify-between gap-6 rounded-2xl bg-white p-6 shadow-sm md:flex-row">
        <div className="flex flex-col items-center gap-5 md:flex-row">
          <div className="group relative h-20 w-20 overflow-hidden rounded-full border-2 border-blue-100 bg-gray-100 shadow-inner hover:cursor-pointer">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              className="hidden"
            />

            <div
              onClick={handleAvatarClick}
              className={`absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isUploading ? "pointer-events-none opacity-50" : ""}`}
            >
              <svg
                viewBox="0 0 50 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
              >
                <path
                  d="M25 13.2353C31.5789 13.2353 36.8421 18.5294 36.8421 25.1471C36.8421 31.7647 31.5789 37.0588 25 37.0588C18.4211 37.0588 13.1579 31.7647 13.1579 25.1471C13.1579 18.5294 18.4211 13.2353 25 13.2353ZM25 15.8824C22.5572 15.8824 20.2145 16.8585 18.4872 18.5959C16.7599 20.3334 15.7895 22.6899 15.7895 25.1471C15.7895 27.6042 16.7599 29.9607 18.4872 31.6982C20.2145 33.4357 22.5572 34.4118 25 34.4118C27.4428 34.4118 29.7855 33.4357 31.5128 31.6982C33.2401 29.9607 34.2105 27.6042 34.2105 25.1471C34.2105 22.6899 33.2401 20.3334 31.5128 18.5959C29.7855 16.8585 27.4428 15.8824 25 15.8824ZM7.89474 5.29412H13.1579L18.4211 0H31.5789L36.8421 5.29412H42.1053C44.1991 5.29412 46.2071 6.13077 47.6877 7.62003C49.1682 9.10929 50 11.1292 50 13.2353V37.0588C50 39.165 49.1682 41.1848 47.6877 42.6741C46.2071 44.1633 44.1991 45 42.1053 45H7.89474C5.80092 45 3.79287 44.1633 2.31232 42.6741C0.831765 41.1848 0 39.165 0 37.0588V13.2353C0 11.1292 0.831765 9.10929 2.31232 7.62003C3.79287 6.13077 5.80092 5.29412 7.89474 5.29412ZM19.5 2.64706L14.2368 7.94118H7.89474C6.49886 7.94118 5.16016 8.49895 4.17312 9.49179C3.18609 10.4846 2.63158 11.8312 2.63158 13.2353V37.0588C2.63158 38.4629 3.18609 39.8095 4.17312 40.8023C5.16016 41.7952 6.49886 42.3529 7.89474 42.3529H42.1053C43.5011 42.3529 44.8398 41.7952 45.8269 40.8023C46.8139 39.8095 47.3684 38.4629 47.3684 37.0588V13.2353C47.3684 11.8312 46.8139 10.4846 45.8269 9.49179C44.8398 8.49895 43.5011 7.94118 42.1053 7.94118H35.7632L30.5 2.64706H19.5Z"
                  fill="white"
                />
              </svg>
            </div>
            <img
              src={avatarSrc}
              alt="avatarka"
              className="h-full w-full object-cover group-hover:opacity-50"
            />
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-col items-center gap-2 md:flex-row">
              <h2 className="text-xl font-bold text-gray-900">
                {userData.full_name ? userData.full_name : "Аноним"}
              </h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  userData.role === "ADMIN"
                    ? "bg-red-50 text-red-600"
                    : userData.role === "MANAGER"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-green-50 text-green-600"
                }`}
              >
                {roleName[userData.role]}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{userData.email}</p>
            <p className="mt-0.5 text-xs text-gray-400">
              На сайте с {formattedDate}
            </p>
          </div>
        </div>

        {(userData.role === "ADMIN" || userData.role === "MANAGER") && (
          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-95"
          >
            🛡️ Панель управления (Admin)
          </Link>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-center gap-2 border-b border-gray-100 pb-4 md:justify-start">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-lg font-bold text-gray-900">Личные данные</h3>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              ФИО / Имя
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ""}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Электронная почта
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Номер телефона
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="+7 (___) ___-__-__"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Город проживания
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div className="col-span-1 flex justify-end pt-2 md:col-span-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 md:w-fit"
            >
              {isSaving ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center justify-between border-b border-gray-100 pb-4 md:flex-row">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="text-center text-lg font-bold text-gray-900">
              Безопасность
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {showPassword ? "Скрыть пароль" : "Показать пароль"}
          </button>
        </div>

        <form
          onSubmit={handleSavePassword}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Текущий пароль
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="oldpassword"
              value={passwordData.oldpassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Новый пароль
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="newpassword"
              value={passwordData.newpassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Подтвердите пароль
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div className="col-span-1 flex justify-end pt-2 md:col-span-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 md:w-fit"
            >
              Обновить пароль
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
