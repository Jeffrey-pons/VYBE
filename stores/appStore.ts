import { create } from "zustand";

interface AppState {
  appReady: boolean;
  setAppReady: (ready: boolean) => void;
  resetApp: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  appReady: false,
  setAppReady: (ready) => set({ appReady: ready }),
  resetApp: () => set({ appReady: false }),
}));