import { create } from "zustand";

interface NotificationState {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  toggleNotifications: () => void;
  resetNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notificationsEnabled: false,
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
  toggleNotifications: () =>
    set({ notificationsEnabled: !get().notificationsEnabled }),
  resetNotifications: () => set({ notificationsEnabled: false }),
}));