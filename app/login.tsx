import React from 'react';
import { TextInput, View, Text, Image, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { router } from 'expo-router';
import { loginIcon } from '../utils/imagesUtils';
import globalStyles from '@/styles/globalStyle';
import { ThemedText } from '@/components/ThemedText';
import { useLogin } from '@/hooks/useLogin';
import { useLoginStore } from '@/stores/useLoginStore';

const LoginScreen: React.FC = () => {
  const { email, password, isLoading, setEmail, setPassword } = useLoginStore();

  const { handleLogin } = useLogin();

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <Image style={globalStyles.logoAuthStyle} source={loginIcon} alt="Icône de connexion" />
        <ThemedText type="authTitle">Connecte toi !</ThemedText>
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
          onPress={() => handleLogin(email, password)}
          loading={isLoading}
        />
        <Text style={globalStyles.footerAuthTextStyle}>Vous n'avez pas de compte ?</Text>
        <Text style={globalStyles.footerAuthLinkStyle} onPress={() => router.replace('/register')}>
          Inscrivez-vous ici
        </Text>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
