import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Layout from "./components/Layout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { ToastService } from "./services/ToastService";
import UserProfile from "./pages/UserProfile";
import UserOrders from "./features/UserProfile/UserOrders";
import FavoriteCars from "./features/UserProfile/FavoriteCars";
import UserInfo from "./features/UserProfile/UserInfo";
import CarDetails from "./pages/CarDetails";
import About from "./pages/About";
import Services from "./pages/Services";
import HowToBuy from "./pages/HowToBuy";
import Reviews from "./pages/Reviews";
import Contacts from "./pages/Contacts";
import AdminPage from "./pages/AdminPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ToastService>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-to-buy" element={<HowToBuy />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/cars/:id" element={<CarDetails />} />
          </Route>

          <Route path="*" element={<NotFound />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />}>
              <Route index element={<Navigate to="orders" replace />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="favorites" element={<FavoriteCars />} />
              <Route path="settings" element={<UserInfo />} />
            </Route>

            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastService>
  );
}

export default App;
