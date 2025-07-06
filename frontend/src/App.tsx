import { useEffect } from "react";
import Home from "./pages/Home";
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
    <main className="min-h-screen bg-gray-50 font-sans relative">
      <Home />
    </main>
  );
}

export default App;
