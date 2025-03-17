import React , { useState, useEffect } from "react";
import { Dimensions, TextInput, View, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { router } from "expo-router";
import globalStyles from "@/styles/globalStyle";
import { ThemedText } from "@/components/ThemedText";
import { registerIcon } from "@/utils/imagesUtils";
import { useRegister } from "@/hooks/useRegister"; 

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(true);

  const { handleSignUp, isLoading } = useRegister();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleRegister = async () => {
    const userData = {
      name,
      lastname,
      email,
      phoneNumber: phone,
      password,
    };

    const response = await handleSignUp(userData); 
    if (isMounted && response) {
      router.replace("/login"); 
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <Image
          style={globalStyles.logoAuthStyle}
          source={registerIcon}
          alt="Icône d'inscription"
        />
        <ThemedText type="authTitle">Inscris-toi !</ThemedText>

        <View style={styles.rowContainer}>
          <TextInput
            style={[globalStyles.input, styles.halfInput]}
            placeholder="Prénom"
            placeholderTextColor="#bbb"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[globalStyles.input, styles.halfInput]}
            placeholder="Nom"
            placeholderTextColor="#bbb"
            value={lastname}
            onChangeText={setLastname}
          />
        </View>
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Téléphone"
          placeholderTextColor="#bbb"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button 
          buttonStyle={globalStyles.buttonStyle} 
          title="S'inscrire"
          titleStyle={globalStyles.titleStyle} 
          onPress={handleRegister} 
          loading={isLoading} 
        />
        <Text style={globalStyles.footerAuthTextStyle}>Vous avez déjà un compte ?</Text>
        <Text style={globalStyles.footerAuthLinkStyle} onPress={() => router.replace("/login")}>
          Connectez-vous ici
        </Text>
      </View>
    </ScrollView>
  );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width > 500 ? "50%" : "100%", 
  },
  halfInput: {
    width: "48%",
  },
});

export default RegisterScreen;