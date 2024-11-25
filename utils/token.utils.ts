import AsyncStorage from "@react-native-async-storage/async-storage";

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du token :", error);
  }
};
