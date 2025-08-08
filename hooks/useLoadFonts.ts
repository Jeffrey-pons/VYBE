import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {  useEffect } from "react";
import { fontMap } from "../utils/fontsUtils";
import { useAppStore } from "@/stores/appStore";

export const useLoadFonts = () => {
  const [fontsLoaded] = useFonts(fontMap);
    const { appReady, setAppReady } = useAppStore();

  useEffect(() => {
    const prepareApp = async () => {
      try {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
          setAppReady(true);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
        console.warn("Erreur de chargement des fonts", error);
      }
    }
    };

    prepareApp();
  }, [fontsLoaded, setAppReady]);

  return appReady;
};
