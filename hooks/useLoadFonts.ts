import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useState, useEffect } from "react";
import { fontMap } from "../utils/fontsUtils";

export const useLoadFonts = () => {
  const [fontsLoaded] = useFonts(fontMap);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
          setAppReady(true);
        }
      } catch (error: any) {
        console.warn("Erreur de chargement des fonts", error);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  return appReady;
};
