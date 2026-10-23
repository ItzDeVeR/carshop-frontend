# carshop-frontend

Клиентская часть сервиса автосалона: витрина автомобилей с фильтрами, личный кабинет пользователя, оформление заявок и панель управления менеджера / администратора.

Бэкенд проекта: [carshop-backend](https://github.com/ItzDeVeR/carshop-backend)

## Стек
- React 19, Vite
- Tailwind CSS 4
- React Router Dom
- Axios

## Установка и запуск

1. Установка зависимостей:
```bash
npm install
```

2. Настройка окружения:
Создайте файл `.env` в корне (на основе `.env.example`):
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_BACKEND_API_URL=http://localhost:5000/api
VITE_AVATARS_URL=http://localhost:5000/uploads/avatars
```

3. Запуск dev-сервера:
```bash
npm run dev
```

Для сборки продакшн-версии:
```bash
npm run build
```
