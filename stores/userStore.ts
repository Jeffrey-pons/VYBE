import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserStore = {
  name: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  isModalUpdatedAccountVisible: boolean;
  isModalDeletedAccountVisible: boolean;

  setName: (value: string) => void;
  setLastname: (value: string) => void;
  setEmail: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setPassword: (value: string) => void;

  setIsModalUpdatedAccountVisible: (value: boolean) => void;
  setIsModalDeletedAccountVisible: (value: boolean) => void;

  resetUserFields: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: '',
      lastname: '',
      email: '',
      phoneNumber: '',
      password: '',
      isModalUpdatedAccountVisible: false,
      isModalDeletedAccountVisible: false,

      setName: (value) => set({ name: value }),
      setLastname: (value) => set({ lastname: value }),
      setEmail: (value) => set({ email: value }),
      setPhoneNumber: (value) => set({ phoneNumber: value }),
      setPassword: (value) => set({ password: value }),

      setIsModalUpdatedAccountVisible: (value) => set({ isModalUpdatedAccountVisible: value }),
      setIsModalDeletedAccountVisible: (value) => set({ isModalDeletedAccountVisible: value }),

      resetUserFields: () =>
        set({
          name: '',
          lastname: '',
          email: '',
          phoneNumber: '',
          password: '',
          isModalUpdatedAccountVisible: false,
          isModalDeletedAccountVisible: false,
        }),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        name: state.name,
        lastname: state.lastname,
        email: state.email,
        phoneNumber: state.phoneNumber,
      }),
    },
  ),
);
