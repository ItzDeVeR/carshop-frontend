import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastService = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "accept") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, isExiting: false }]);

    setTimeout(() => {
      dismissToast(id);
    }, 3000);
  };

  const dismissToast = (id) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isExiting: true } : toast,
      ),
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="pointer-events-none fixed top-2 left-[50%] z-50 flex w-full max-w-sm translate-x-[-50%] flex-col gap-2 text-base md:top-auto md:right-4 md:bottom-4 md:left-auto md:translate-x-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => dismissToast(toast.id)}
            className={`pointer-events-auto cursor-pointer rounded-lg p-4 text-white shadow-lg ${
              toast.isExiting ? "animate-toast-out" : "animate-toast-in"
            } ${
              toast.type === "warning"
                ? "bg-yellow-600"
                : toast.type === "info"
                  ? "bg-sky-600"
                  : toast.type === "error"
                    ? "bg-red-600"
                    : "bg-emerald-600"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast должен использоваться внутри ToastService");
  }
  return context;
};
