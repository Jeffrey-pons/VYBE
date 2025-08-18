import React, { useEffect } from 'react';
import { Dimensions, TextInput, View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { router } from 'expo-router';
import globalStyles from '@/styles/globalStyle';
import { ThemedText } from '@/components/ThemedText';
import { registerIcon } from '@/utils/imagesUtils';
import { useRegister } from '@/hooks/useRegister';
import { useRegisterStore } from '@/stores/useRegisterStore';

const RegisterScreen: React.FC = () => {
  const {
    name,
    setName,
    lastname,
    setLastname,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    isLoading,
    isMounted,
    setIsMounted,
    resetRegister,
  } = useRegisterStore();

  const { handleSignUp } = useRegister();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, [setIsMounted]);

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
      resetRegister();
      router.replace('/login');
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={globalStyles.container}>
        <Image style={globalStyles.logoAuthStyle} source={registerIcon} alt="Icône d'inscription" accessibilityLabel='Icône d"inscription' />
        <ThemedText type="authTitle">Inscris-toi !</ThemedText>

        <View style={styles.rowContainer}>
          <TextInput
            style={[globalStyles.input, styles.halfInput]}
            placeholder="Prénom"
            placeholderTextColor="#bbb"
            value={name}
            onChangeText={setName}
            accessibilityLabel='Champ pour entrer le prénom'
          />
          <TextInput
            style={[globalStyles.input, styles.halfInput]}
            placeholder="Nom"
            placeholderTextColor="#bbb"
            value={lastname}
            onChangeText={setLastname}
            accessibilityLabel='Champ pour entrer le nom'
          />
        </View>
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          accessibilityLabel='Champ pour entrer l"email'
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Téléphone"
          placeholderTextColor="#bbb"
          value={phone}
          onChangeText={setPhone}
          accessibilityLabel='Champ pour entrer le téléphone'
        />
        {/* <Button
          title="Envoyer le code"
          onPress={async () => {
            await sendVerificationCode(phone);
            setIsCodeSent(true);
          }}
        />

        {isCodeSent && !isVerified && (
  <>
    <TextInput
      style={globalStyles.input}
      placeholder="Code reçu par SMS"
      keyboardType="numeric"
      value={code}
      onChangeText={setCode}
    />
    <Button
      title="Vérifier le code"
      onPress={async () => {
        const verifiedPhone = await confirmCode(code);
        if (verifiedPhone) {
          setPhone(verifiedPhone); // on garde le numéro vérifié
          setIsVerified(true);
        }
      }}
    />
  </>
)} */}

        <TextInput
          style={globalStyles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          accessibilityLabel='Champ pour entrer le mot de passe'
        />
        <Button
          buttonStyle={globalStyles.buttonStyle}
          title="S'inscrire"
          titleStyle={globalStyles.titleStyle}
          onPress={handleRegister}
          loading={isLoading}
          accessibilityLabel="Bouton pour s'inscrire"
        />
        <Text style={globalStyles.footerAuthTextStyle}>Vous avez déjà un compte ?</Text>
        <Text style={globalStyles.footerAuthLinkStyle} onPress={() => router.replace('/login')}>
          Connectez-vous ici
        </Text>
      </View>
      {/* <FirebaseRecaptchaVerifierModal
      ref={recaptchaVerifier}
      firebaseConfig={auth.app.options}
    /> */}
    </ScrollView>
  );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width > 500 ? '50%' : '100%',
  },
  halfInput: {
    width: '48%',
  },
});

export default RegisterScreen;
