import { create } from 'zustand';

interface NotificationStore {
  isPushEnabled: boolean;
  isEmailEnabled: boolean;
  isLastTicketsEnabled: boolean;

  setIsPushEnabled: (value: boolean) => void;
  setIsEmailEnabled: (value: boolean) => void;
  setIsLastTicketsEnabled: (value: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  isPushEnabled: true,
  isEmailEnabled: true,
  isLastTicketsEnabled: true,

  setIsPushEnabled: (value) => set({ isPushEnabled: value }),
  setIsEmailEnabled: (value) => set({ isEmailEnabled: value }),
  setIsLastTicketsEnabled: (value) => set({ isLastTicketsEnabled: value }),
}));