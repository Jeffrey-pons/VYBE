import React, { useState, useEffect } from "react";
import { ScrollView, TextInput, View, Text, StyleSheet, Alert, Image, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "expo-router";
import globalStyles from "@/styles/globalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from "@/services/backEnd.api"; 

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigation = useNavigation();

  // Vérification si un utilisateur est déjà connecté en vérifiant le token
  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setIsLoggedIn(true); 
        navigation.navigate("(tabs)");
      } else {
        setIsLoggedIn(false); 
      }
      setLoading(false);
    };

    checkUserToken();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Fonction pour la connexion
  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      if (response.token && response.user) {
        await AsyncStorage.setItem('userToken', response.token); 
        await AsyncStorage.setItem('userId', response.user.id); 
        Alert.alert("Succès", response.message);
        setIsLoggedIn(true); 
        navigation.navigate("(tabs)");
      }
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  
  return (
    <ScrollView>
    <View style={styles.container}>
      <Image
        style={globalStyles.tinyLogoTwo}
        source={require('../assets/images/logos/VYBE_logo4.png')}
      />
      <Text style={globalStyles.headerText}>{isLoggedIn ? 'Bienvenue!' : 'Connecte toi !'}</Text>


          {/* Email Input */}
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            placeholderTextColor="#bbb" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password Input */}
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
            title="Se connecter"
            titleStyle={globalStyles.titleStyle} 
            onPress={handleLogin}
          />


      <Text style={globalStyles.footerText}>Vous n'avez pas de compte ?</Text>
      <Text style={globalStyles.footerLink} onPress={() => navigation.navigate("register")}>
        Inscrivez-vous ici
      </Text>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default LoginScreen;
