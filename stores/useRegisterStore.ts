import { create } from 'zustand';

interface RegisterState {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  isLoading: boolean;
  isMounted?: boolean;

  setName: (name: string) => void;
  setLastname: (lastname: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setPassword: (password: string) => void;

  setIsLoading: (loading: boolean) => void;
  setIsMounted: (mounted: boolean) => void;

  resetRegister: () => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  isLoading: false,
  isMounted: true,

  setName: (name) => set({ name }),
  setLastname: (lastname) => set({ lastname }),
  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
  setPassword: (password) => set({ password }),

  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsMounted: (mounted) => set({ isMounted: mounted }),

  resetRegister: () =>
    set({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      password: '',
      isLoading: false,
    }),
}));
