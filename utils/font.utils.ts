import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    "Fugaz-One": require("../assets/fonts/FugazOne-Regular.ttf"),
    "FunnelSans-Bold": require("../assets/fonts/FunnelSans-Bold.ttf"),
    "FunnelSans-BoldItalic": require("../assets/fonts/FunnelSans-BoldItalic.ttf"),
    "FunnelSans-ExtraBold": require("../assets/fonts/FunnelSans-ExtraBold.ttf"),
    "FunnelSans-ExtraBoldItalic": require("../assets/fonts/FunnelSans-ExtraBoldItalic.ttf"),
    "FunnelSans-Light": require("../assets/fonts/FunnelSans-Light.ttf"),
    "FunnelSans-LightItalic": require("../assets/fonts/FunnelSans-LightItalic.ttf"),
    "FunnelSans-Medium": require("../assets/fonts/FunnelSans-Medium.ttf"),
    "FunnelSans-MediumItalic": require("../assets/fonts/FunnelSans-MediumItalic.ttf"),
    "FunnelSans-Regular": require("../assets/fonts/FunnelSans-Regular.ttf"),
    "FunnelSans-SemiBold": require("../assets/fonts/FunnelSans-SemiBold.ttf"),
    "FunnelSans-SemiBoldItalic": require("../assets/fonts/FunnelSans-SemiBoldItalic.ttf"),
    "FunnelSans-VariableFont": require("../assets/fonts/FunnelSans-VariableFont_wght.ttf"),
  });
};
