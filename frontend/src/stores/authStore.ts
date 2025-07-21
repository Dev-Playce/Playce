import { create } from "zustand";

export type TAuthModal = "login" | "signup" | null;

interface AuthState {
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  isLoggedIn: boolean;
  setIsLoginModalOpen: (modal: boolean) => void;
  setIsSignupModalOpen: (modal: boolean) => void;
  storeLogin: (token: string) => void;
  storeLogout: () => void;
  isPasswordResetModalOpen: boolean;
  setIsPasswordResetModalOpen: (modal: boolean) => void;
}

export const getToken = () => {
  const token = localStorage.getItem("accessToken");
  return token;
};

const setToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

const useAuthStore = create<AuthState>((set) => ({
  isLoginModalOpen: false,
  isSignupModalOpen: false,
  isAuthModalOpen: false,
  isLoggedIn: getToken() ? true : false,
  authModal: null,
  isPasswordResetModalOpen: false,
  setIsPasswordResetModalOpen: (modal) =>
    set({ isPasswordResetModalOpen: modal }),
  setIsLoginModalOpen: (modal) => {
    set({ isLoginModalOpen: modal });
  },
  setIsSignupModalOpen: (modal) => {
    set({ isSignupModalOpen: modal });
  },
  storeLogin: (token: string) => {
    set({ isLoggedIn: true });
    setToken(token);
  },
  storeLogout: () => {
    set({ isLoggedIn: false });
    removeToken();
  },
}));

export default useAuthStore;
