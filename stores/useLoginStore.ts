import { create } from 'zustand';

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setIsLoading: (loading: boolean) => void;
  resetLogin: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  email: '',
  password: '',
  isLoading: false,

  setEmail: (email: string): void => set({ email }),
  setPassword: (password) => set({ password }),
  setIsLoading: (loading) => set({ isLoading: loading }),

  resetLogin: () =>
    set({
      email: '',
      password: '',
      isLoading: false,
    }),
}));
