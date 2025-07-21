import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PasswordResetModal from "./components/Auth/PasswordResetModal";
import useAuthStore from "./stores/authStore";
import useFavoriteStore from "./stores/favoriteStore";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const resetFavorites = useFavoriteStore((state) => state.resetFavorites);

  useEffect(() => {
    if (!isLoggedIn) {
      resetFavorites();
    }
    // 로그인 시 fetchFavorites() 등도 가능
  }, [isLoggedIn, resetFavorites]);

  return (
    <BrowserRouter>
      <main className="min-h-screen bg-gray-50 font-sans relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/reset-password/:token"
            element={<PasswordResetModal />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
