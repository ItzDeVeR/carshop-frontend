import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { useToast } from "../services/ToastService";
import api from "../services/api";

export default function LoginPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const isAuthenticated = Boolean(localStorage.getItem("token"));

    if (isAuthenticated) navigate("/profile");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);

      setIsLoading(false);
      navigate("/profile");
      addToast("Вы успешно вошли");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Не удалось войти. Проверьте подключение к сети.";

      addToast(errorMessage, "error");
      setIsLoading(false);
    }
  };

  return (
    <Container className="flex grow flex-col items-center justify-center py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-8 rounded-xl border border-transparent bg-white p-6 shadow-xl/10"
      >
        <p className="text-center text-2xl font-bold text-[#F50E30]">
          Авторизация
        </p>

        <div className="grid grid-cols-[100px_1fr] items-center gap-y-3">
          <label htmlFor="username">Логин:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="имя пользователя"
            className="w-full rounded border px-2 py-1 outline-black/30 transition-all duration-300 focus:outline-gray-500"
            required
          />

          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded border px-2 py-1 outline-black/30 transition-all duration-300 focus:outline-gray-500"
            required
          />
        </div>

        <button
          type="submit"
          className={`${isLoading ? "cursor-auto bg-red-300 opacity-30" : "cursor-pointer hover:opacity-90"} flex w-full items-center justify-center rounded-xl bg-[#F50E30] px-10 py-2 text-2xl font-medium text-white transition-opacity`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="-ml-1 size-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Авторизация...
            </span>
          ) : (
            "Войти"
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Ещё нет аккаунта?{" "}
          <Link
            to="/auth/register"
            className="font-semibold text-[#F50E30] hover:underline"
          >
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </Container>
  );
}
